import * as fs from 'fs/promises';
import * as path from 'path';
import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { IngestWorker, IDocumentIntelligence } from '../src/ingest/api/ingest.api.worker';
import { AzureDocIntelClient } from '../src/infra/azure/infra.azure.docIntel';
import { GraphNodeRepo } from '../src/graph/repo/graph.repo.nodeRepo';
import { EnrichmentService } from '../src/ingest/svc/ingest.svc.enrichNode';
import { OpenAiClient } from '../src/infra/openai/infra.openai.client';
import { env } from '../src/infra/config/infra.config.env';
import { IngestJob, RawPdfLine } from '../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_FOLDER = './sample_docs/parsed';

// --- MOCK OCR CLIENT (For Text Files) ---
class TextBypassClient implements IDocumentIntelligence {
    async extractLines(fileBuffer: Buffer): Promise<RawPdfLine[]> {
        const text = fileBuffer.toString('utf-8');
        // Split by lines, filter empty
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, i) => ({
                text: line,
                pageNumber: 1,
                bbox: [1.0, 1.0 + (i * 0.1), 5.0, 0.1], // Fake coordinates
                confidence: 1.0
            }));
    }
}

async function main() {
    console.log('🔥 STARTING GRAND RESET (ALL FILES) 🔥');

    // 1. Init Dependencies (Targeting STAGING first for safety)
    const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, 'legal_nodes_staging');
    const repo = new GraphNodeRepo(db);
    
    // Real Azure Client
    const azureOcr = new AzureDocIntelClient(env.AZURE_DOC_INTEL_ENDPOINT, env.AZURE_DOC_INTEL_KEY);
    // Fake Client for text files
    const textOcr = new TextBypassClient();

    const ai = new OpenAiClient(env.OPENAI_API_KEY);
    const enricher = new EnrichmentService(ai);
    const worker = new IngestWorker(azureOcr, repo, enricher); // Default to Azure, swap later

    // 2. Wipe Staging
    console.log('🧹 TRUNCATING Staging Table...');
    const sb = db['client']; 
    // Delete everything except the "zero" UUID if it exists, effectively truncate
    await sb.from('legal_nodes_staging').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Staging is empty.');

    // 3. Get Files
    let files = [];
    try {
        files = await fs.readdir(LOCAL_FOLDER);
    } catch (e) {
        console.error(`❌ Could not find folder: ${LOCAL_FOLDER}`);
        process.exit(1);
    }
    
    const pdfs = files.filter(f => f.toLowerCase().endsWith('.pdf'));

    console.log(`📂 Found ${pdfs.length} documents to process.`);

    // 4. Process Loop
    for (const [index, fileName] of pdfs.entries()) {
        console.log(`\n[${index + 1}/${pdfs.length}] Processing: ${fileName}`);
        const filePath = path.join(LOCAL_FOLDER, fileName);
        const buffer = await fs.readFile(filePath);

        // CHECK: Is this a real PDF or our Fake Text PDF?
        // Real PDFs start with %PDF header
        const isRealPdf = buffer.toString('ascii', 0, 4).startsWith('%PDF');
        
        // Swap the OCR engine for this specific run
        const currentWorker = new IngestWorker(
            isRealPdf ? azureOcr : textOcr, 
            repo, 
            enricher
        );

        if (!isRealPdf) console.log("   Info: Detected Text File. Bypassing Azure.");

        // Heuristic for Jurisdiction
        const upper = fileName.toUpperCase();
        const isFed = upper.includes('CFR') || upper.includes('U.S.C') || upper.includes('ACT') || upper.includes('FEDERAL');
        const jurisdiction = isFed ? 'FED' : 'MA';

        const job: IngestJob = {
            jobId: uuidv4(),
            sourceUrl: `reset://${fileName}`,
            jurisdiction,
            // Clean Corpus Name
            corpus: fileName.replace('.pdf', '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
            documentType: 'CONSOLIDATED_REGULATION'
        };

        try {
            const result = await currentWorker.processJob(job, buffer);
            console.log(`   ✅ Success! Generated ${result.nodeMap.size} nodes.`);
        } catch (e: any) {
            console.error(`   ❌ FAIL: ${e.message}`);
        }
    }

    console.log('\n✨ GRAND RESET COMPLETE. Check Staging.');
}

main().catch(console.error);