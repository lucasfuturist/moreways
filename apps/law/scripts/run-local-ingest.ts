import * as fs from 'fs/promises';
import * as path from 'path';
import { IngestWorker } from '../src/ingest/api/ingest.api.worker';
import { AzureDocIntelClient } from '../src/infra/azure/infra.azure.docIntel';
import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { GraphNodeRepo } from '../src/graph/repo/graph.repo.nodeRepo';
import { EnrichmentService } from '../src/ingest/svc/ingest.svc.enrichNode';
import { OpenAiClient } from '../src/infra/openai/infra.openai.client';
import { env } from '../src/infra/config/infra.config.env';
import { IngestJob } from '../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

// CONFIG
const LOCAL_FOLDER = './sample_docs'; 
const DEBUG_FOLDER = './debug_output'; // For local backup of what was sent

// [UPDATED] Omnivorous Filter
const ALLOWED_EXTS = ['.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.tiff', '.bmp'];

async function main() {
    console.log('🚀 Starting Local Ingestion (Azure Production)...');

    // 0. Force Production Mode (Enable OpenAI Embeddings)
    process.env.DRY_RUN = 'false';

    // 1. Setup Infrastructure
    const ocr = new AzureDocIntelClient(env.AZURE_DOC_INTEL_ENDPOINT, env.AZURE_DOC_INTEL_KEY);
    const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY);
    const repo = new GraphNodeRepo(db);
    const ai = new OpenAiClient(env.OPENAI_API_KEY);
    const enricher = new EnrichmentService(ai);
    const worker = new IngestWorker(ocr, repo, enricher);

    // 2. Read Local Files
    let files = [];
    try {
        const allFiles = await fs.readdir(LOCAL_FOLDER);
        files = allFiles.filter(f => {
            const ext = path.extname(f).toLowerCase();
            return ALLOWED_EXTS.includes(ext);
        });
    } catch (e) {
        console.error(`❌ Could not read folder: ${LOCAL_FOLDER}`);
        process.exit(1);
    }

    console.log(`📂 Found ${files.length} documents in ${LOCAL_FOLDER}`);

    // Ensure debug folder exists
    await fs.mkdir(DEBUG_FOLDER, { recursive: true });

    // 3. Process Loop
    for (const fileName of files) {
        console.log(`\n---------------------------------------------------------`);
        console.log(`📄 Processing: ${fileName}`);

        const filePath = path.join(LOCAL_FOLDER, fileName);
        const buffer = await fs.readFile(filePath);

        // Heuristic: Federal vs State based on filename
        const jurisdiction = (fileName.includes('CFR') || fileName.includes('U.S.C') || fileName.includes('Federal')) 
            ? 'FED' 
            : 'MA';

        const job: IngestJob = {
            jobId: uuidv4(),
            sourceUrl: `file://${fileName}`,
            jurisdiction: jurisdiction,
            corpus: fileName.replace(path.extname(fileName), ''),
            documentType: 'CONSOLIDATED_REGULATION'
        };

        try {
            // Full Pipeline: Azure -> Parse -> Embed -> Supabase
            const result = await worker.processJob(job, buffer);
            
            // --- OPTIONAL: SAVE JSON BACKUP ---
            const debugPath = path.join(DEBUG_FOLDER, `PROD_${fileName}.json`);
            const debugJson = {
                rootId: result.rootId,
                nodes: Array.from(result.nodeMap.values())
            };
            await fs.writeFile(debugPath, JSON.stringify(debugJson, null, 2));
            // ----------------------------------

            console.log(`   ✅ Success! ${result.nodeMap.size} nodes committed to Supabase.`);
        } catch (error: any) {
            console.error(`   ❌ Failed: ${error.message}`);
        }
    }
}

main();