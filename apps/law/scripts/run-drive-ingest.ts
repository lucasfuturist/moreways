import { IngestWorker } from '../src/ingest/api/ingest.api.worker';
import { GoogleDriveSource } from '../src/infra/google/infra.google.drive';
import { AzureDocIntelClient } from '../src/infra/azure/infra.azure.docIntel'; 
import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { GraphNodeRepo } from '../src/graph/repo/graph.repo.nodeRepo';
import { EnrichmentService } from '../src/ingest/svc/ingest.svc.enrichNode';
import { OpenAiClient } from '../src/infra/openai/infra.openai.client';
import { JobTracker } from '../src/ingest/svc/ingest.svc.jobTracker';
import { env } from '../src/infra/config/infra.config.env';
import { IngestJob } from '../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../src/infra/supabase/infra.supabase.client'; // Raw client for tracker

// CONFIGURATION
// In production, these come from DB or Queue payload
const TARGET_FOLDER_ID = '1FjX9...'; // Replace with your actual Drive Folder ID
const JURISDICTION = 'MA';
const CORPUS_NAME = '940 CMR';

async function main() {
    console.log('🚀 Starting Ingestion Pipeline (Azure Edition)...');

    // --- 1. INITIALIZE INFRASTRUCTURE ---
    
    // Source: Google Drive
    // Supports either file path or raw JSON string from env
    const driveSource = new GoogleDriveSource(
        process.env.GOOGLE_DRIVE_KEY_FILE || './credentials.json'
    );

    // OCR: Azure Document Intelligence (The Heavy Lifter)
    const ocr = new AzureDocIntelClient(
        env.AZURE_DOC_INTEL_ENDPOINT, 
        env.AZURE_DOC_INTEL_KEY
    );

    // Database & Repos
    const dbClient = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY);
    const repo = new GraphNodeRepo(dbClient);
    
    // AI Services (Embeddings + LLM)
    const aiClient = new OpenAiClient(env.OPENAI_API_KEY);
    const enricher = new EnrichmentService(aiClient);

    // State Management
    const jobTracker = new JobTracker(supabase);

    // --- 2. INITIALIZE WORKER ---
    const worker = new IngestWorker(ocr, repo, enricher);

    // --- 3. FETCH FILES ---
    console.log(`\n📂 Scanning Drive Folder: ${TARGET_FOLDER_ID}...`);
    let files = [];
    try {
        files = await driveSource.listFiles(TARGET_FOLDER_ID);
        console.log(`   -> Found ${files.length} candidates.`);
    } catch (err) {
        console.error("❌ Failed to list files. Check credentials and folder permissions.");
        process.exit(1);
    }

    // --- 4. PROCESSING LOOP ---
    for (const file of files) {
        console.log(`\n---------------------------------------------------------`);
        console.log(`📄 Processing: ${file.name} (${file.id})`);

        // A. Idempotency Check
        const shouldRun = await jobTracker.shouldProcess(file.id);
        if (!shouldRun) {
            console.log(`   ⏭️  Skipping (Already Completed or In Progress)`);
            continue;
        }

        // B. Mark Started
        await jobTracker.markStarted(file.id, file.name);

        try {
            // C. Download
            console.log(`   ⬇️  Downloading bytes...`);
            const buffer = await driveSource.downloadFile(file.id);

            // D. Construct Job Context
            const job: IngestJob = {
                jobId: uuidv4(),
                sourceUrl: `gdrive://${file.id}`,
                jurisdiction: JURISDICTION as 'MA' | 'FED',
                corpus: CORPUS_NAME,
                documentType: 'CONSOLIDATED_REGULATION'
            };

            // E. Execute Worker
            // This runs: OCR -> Parse -> Enrich -> Commit
            const result = await worker.processJob(job, buffer);

            // F. Mark Complete
            console.log(`   ✅ Job Succeeded! Created ${result.nodeMap.size} graph nodes.`);
            await jobTracker.markComplete(file.id);

        } catch (error: any) {
            console.error(`   ❌ Job Failed: ${error.message}`);
            // G. Mark Failed (for retry later)
            await jobTracker.markFailed(file.id, error);
        }
    }

    console.log(`\n🎉 Pipeline Execution Finished.`);
}

// Run
main().catch(err => console.error("Fatal Error:", err));