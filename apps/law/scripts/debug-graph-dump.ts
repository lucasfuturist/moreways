import * as fs from 'fs';
import * as path from 'path';
import { LocalPdfClient } from '../src/infra/local/infra.local.pdf';
import { IngestParsePdfAsync } from '../src/ingest/svc/ingest.svc.parsePdf';
import { IngestJob, ProcessingNode } from '../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

const INPUT_DIR = './sample_docs';
const OUTPUT_DIR = './debug_output';

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// Helper: Reconstruct the flat map into a nested JSON tree for human readability
function reconstructTree(rootId: string, nodeMap: Map<string, ProcessingNode>): any {
    const node = nodeMap.get(rootId);
    if (!node) return { error: "Node not found" };

    return {
        type: node.type,
        // Join content array into a readable block of text
        text: node.content.join('\n'), 
        // Recursively build children
        children: node.children.map(childId => reconstructTree(childId, nodeMap))
    };
}

async function run() {
    console.log(`🔍 dumping Graph JSON to: ${OUTPUT_DIR}\n`);

    const files = fs.readdirSync(INPUT_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
    const pdfClient = new LocalPdfClient();

    for (const file of files) {
        console.log(`Processing: ${file}...`);
        
        // 1. Determine Jurisdiction (Heuristic)
        const isFed = file.includes("CFR");
        const jurisdiction = isFed ? 'FED' : 'MA';
        const corpus = isFed ? 'US_CFR' : 'MA_CMR';

        // 2. Setup Job
        const job: IngestJob = {
            jobId: uuidv4(),
            sourceUrl: file,
            jurisdiction,
            corpus,
            documentType: 'CONSOLIDATED_REGULATION'
        };

        // 3. Read & Parse
        const buffer = fs.readFileSync(path.join(INPUT_DIR, file));
        const rawLines = await pdfClient.extractLines(buffer);
        const result = await IngestParsePdfAsync(rawLines, job);

        // 4. Transform to Tree
        const tree = reconstructTree(result.rootId, result.nodeMap);

        // 5. Write to Disk
        const outFileName = file.replace('.pdf', '.json');
        const outPath = path.join(OUTPUT_DIR, outFileName);
        
        fs.writeFileSync(outPath, JSON.stringify(tree, null, 2));
        console.log(`   -> 💾 Saved: ${outPath}`);
    }
    
    console.log('\n✨ Done. Open the .json files to verify hierarchy.');
}

run().catch(console.error);