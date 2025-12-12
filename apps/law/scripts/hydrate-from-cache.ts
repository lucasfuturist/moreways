import * as fs from 'fs/promises';
import * as path from 'path';
import { IngestWorker, IDocumentIntelligence } from '../src/ingest/api/ingest.api.worker';
import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { GraphNodeRepo } from '../src/graph/repo/graph.repo.nodeRepo';
import { EnrichmentService } from '../src/ingest/svc/ingest.svc.enrichNode';
import { OpenAiClient } from '../src/infra/openai/infra.openai.client';
import { env } from '../src/infra/config/infra.config.env';
import { IngestJob, RawPdfLine } from '../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

// CONFIG
const CACHE_DIR = './debug_output';
const RAW_SUFFIX = '_1_RAW_AZURE.json';
const TARGET_TABLE = 'legal_nodes_staging'; 

// --- HELPER CLASSES ---
class CachedOcrClient implements IDocumentIntelligence {
    constructor(private lines: RawPdfLine[]) {}
    async extractLines(fileBuffer: Buffer): Promise<RawPdfLine[]> { return this.lines; }
}

function detectMetadata(fileName: string) {
    const upperName = fileName.toUpperCase();
    const isFed = upperName.includes('CFR') || upperName.includes('U.S.C') || upperName.includes('FEDERAL') || upperName.includes('FTC') || upperName.includes('ACT') || upperName.includes('TILA') || upperName.includes('ROSCA') || upperName.includes('FDCPA');
    const rawName = fileName.replace(RAW_SUFFIX, '').replace(/\.pdf/g, '');
    const corpusId = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return { jurisdiction: isFed ? 'FED' : 'MA', corpus: corpusId };
}

// --- SMART RESUME LOGIC ---
async function shouldProcessFile(db: SupabaseDbClient, jurisdiction: string, corpus: string, expectedNodes: number): Promise<boolean> {
    const urnPrefix = `urn:lex:${jurisdiction.toLowerCase()}:${corpus.toLowerCase()}`;
    
    // Ask DB how many nodes exist for this corpus
    const { count, error } = await db['client']
        .from(TARGET_TABLE)
        .select('*', { count: 'exact', head: true })
        .ilike('urn', `${urnPrefix}%`);

    if (error) {
        console.error(`   ⚠️ DB Check Failed: ${error.message}. Defaulting to Reprocess.`);
        return true;
    }

    if (count === null || count === 0) return true; // Empty -> Process

    // Heuristic: If DB count is close to what we have in JSON, assume it's done.
    // We allow a small margin (e.g. maybe pruning happened)
    const diff = Math.abs(count - expectedNodes);
    
    if (diff < 5) {
        console.log(`   ⏭️  Skipping: Already exists (${count} nodes).`);
        return false;
    }

    console.log(`   ⚠️ Partial/Corrupt data found (${count} nodes, expected ~${expectedNodes}). Cleaning up...`);
    
    // CLEANUP: Delete partial data to ensure graph integrity
    await db['client']
        .from(TARGET_TABLE)
        .delete()
        .ilike('urn', `${urnPrefix}%`);
        
    console.log(`   🧹 Cleanup complete. Restarting file.`);
    return true;
}

async function main() {
    console.log(`🚀 Starting SMART Graph Hydration into: ${TARGET_TABLE}...`);

    const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, TARGET_TABLE);
    const repo = new GraphNodeRepo(db);
    const ai = new OpenAiClient(env.OPENAI_API_KEY);
    const enricher = new EnrichmentService(ai);

    let files = [];
    try {
        const allFiles = await fs.readdir(CACHE_DIR);
        files = allFiles.filter(f => f.endsWith(RAW_SUFFIX));
    } catch (e) {
        console.error(`❌ Could not read directory: ${CACHE_DIR}`);
        process.exit(1);
    }

    console.log(`📂 Found ${files.length} cached documents.`);

    for (const fileName of files) {
        console.log(`\n---------------------------------------------------------`);
        const meta = detectMetadata(fileName);
        
        try {
            const filePath = path.join(CACHE_DIR, fileName);
            const content = await fs.readFile(filePath, 'utf-8');
            const rawLines: RawPdfLine[] = JSON.parse(content);
            
            // [SMART CHECK] Estimate node count (Roughly lines / 2 + overhead)
            // Ideally we'd parse first to get exact count, but this heuristic saves CPU.
            // Or better: Just check if > 0.
            const shouldRun = await shouldProcessFile(db, meta.jurisdiction, meta.corpus, rawLines.length / 3);
            
            if (!shouldRun) continue;

            const cachedOcr = new CachedOcrClient(rawLines);
            const worker = new IngestWorker(cachedOcr, repo, enricher);

            const job: IngestJob = {
                jobId: uuidv4(),
                sourceUrl: `cache://${fileName}`,
                jurisdiction: meta.jurisdiction as 'MA' | 'FED',
                corpus: meta.corpus, 
                documentType: 'CONSOLIDATED_REGULATION'
            };

            console.log(`📄 Corpus: ${job.corpus} (${job.jurisdiction})`);
            const result = await worker.processJob(job, Buffer.from(''));
            console.log(`   ✅ Success! ${result.nodeMap.size} nodes uploaded.`);

        } catch (error: any) {
            console.error(`   ❌ Failed: ${error.message}`);
        }
    }
    
    console.log(`\n🎉 Hydration Complete.`);
}

main().catch(e => console.error(e));