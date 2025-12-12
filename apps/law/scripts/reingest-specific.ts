import * as fs from 'fs/promises';
import * as path from 'path';
import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { IngestWorker } from '../src/ingest/api/ingest.api.worker';
import { AzureDocIntelClient } from '../src/infra/azure/infra.azure.docIntel';
import { GraphNodeRepo } from '../src/graph/repo/graph.repo.nodeRepo';
import { EnrichmentService } from '../src/ingest/svc/ingest.svc.enrichNode';
import { OpenAiClient } from '../src/infra/openai/infra.openai.client';
import { env } from '../src/infra/config/infra.config.env';
import { IngestJob } from '../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

const TARGET_FILES = [
    '940 CMR 10.00 — Home Improvement Contractor Practices.pdf'
];

const LOCAL_FOLDER = './sample_docs/parsed';

async function main() {
    console.log('🔧 Starting Surgical Re-Ingest into STAGING...');

    // 1. Init Dependencies
    // [FIX] Target 'legal_nodes_staging' specifically
    const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, 'legal_nodes_staging');
    
    const repo = new GraphNodeRepo(db);
    const ocr = new AzureDocIntelClient(env.AZURE_DOC_INTEL_ENDPOINT, env.AZURE_DOC_INTEL_KEY);
    const ai = new OpenAiClient(env.OPENAI_API_KEY);
    const enricher = new EnrichmentService(ai);
    const worker = new IngestWorker(ocr, repo, enricher);

    // 2. Clean old data from STAGING
    console.log('🧹 Cleaning old records from Staging...');
    const sb = db['client']; 
    
    // [FIX] Delete from staging table
    await sb.from('legal_nodes_staging').delete().ilike('urn', '%940_cmr_7_00%');
    
    console.log('✅ Clean complete. Starting Ingestion...');

    // 3. Re-Ingest
    for (const fileName of TARGET_FILES) {
        const filePath = path.join(LOCAL_FOLDER, fileName);
        
        try {
            await fs.access(filePath);
            const buffer = await fs.readFile(filePath);

            console.log(`\n📄 Re-Processing: ${fileName}`);
            
            const job: IngestJob = {
                jobId: uuidv4(),
                sourceUrl: `repair://${fileName}`,
                jurisdiction: 'MA',
                corpus: fileName.replace('.pdf', '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
                documentType: 'CONSOLIDATED_REGULATION'
            };

            const result = await worker.processJob(job, buffer);
            console.log(`   ✅ Restored ${result.nodeMap.size} nodes to Staging.`);

        } catch (e: any) {
            console.error(`   ❌ Failed: ${e.message}`);
        }
    }

    console.log('\n✨ Repair Complete.');
}

main().catch(console.error);