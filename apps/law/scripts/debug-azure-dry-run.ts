import * as fs from 'fs/promises';
import * as path from 'path';
import { AzureDocIntelClient } from '../src/infra/azure/infra.azure.docIntel';
import { IngestParsePdfAsync } from '../src/ingest/svc/ingest.svc.parsePdf';
import { lintGraph } from '../src/ingest/svc/ingest.svc.linter';
import { env } from '../src/infra/config/infra.config.env';
import { IngestJob, RawPdfLine } from '../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

// CONFIG
const SAMPLE_DIR = './sample_docs';
const OUT_DIR = './debug_output';

// Strict PDF Only
const ALLOWED_EXTS = ['.pdf'];

/**
 * 🧠 THE BRAIN: Detect Jurisdiction based on CONTENT, not filename.
 */
function detectJurisdiction(lines: RawPdfLine[], fileName: string): 'MA' | 'FED' {
    // 1. Join the first 50 lines of text to get a fingerprint
    const headerText = lines
        .slice(0, 50) // Only look at the beginning
        .map(l => l.text.toUpperCase())
        .join(' ');

    // 2. Define Strong Signals
    const fedSignals = [
        'UNITED STATES CODE', 'U.S.C.', 'USC', 
        'CODE OF FEDERAL REGULATIONS', 'CFR', 
        'CONGRESS', 'FEDERAL TRADE COMMISSION', 
        'FEDERAL COMMUNICATIONS COMMISSION',
        'PUBLIC LAW'
    ];

    const maSignals = [
        'COMMONWEALTH OF MASSACHUSETTS', 
        'MASSACHUSETTS GENERAL LAWS', 'M.G.L.', 
        'CODE OF MASSACHUSETTS REGULATIONS', 'CMR',
        '940 CMR', '201 CMR'
    ];

    // 3. Score it
    let fedScore = 0;
    let maScore = 0;

    fedSignals.forEach(sig => { if (headerText.includes(sig)) fedScore++; });
    maSignals.forEach(sig => { if (headerText.includes(sig)) maScore++; });

    console.log(`      🧠 Classification Scores -> FED: ${fedScore}, MA: ${maScore}`);

    if (fedScore > maScore) return 'FED';
    if (maScore > fedScore) return 'MA';

    // 4. Fallback to Filename if content is ambiguous
    const upperName = fileName.toUpperCase();
    if (upperName.includes('U.S.C') || upperName.includes('CFR') || upperName.includes('FEDERAL')) return 'FED';
    
    // Default to MA (Safe default for this project)
    return 'MA';
}

async function main() {
    console.log('🕵️  STARTING AZURE DRY RUN (No DB, No AI)...');
    
    // 1. Initialize Azure Only
    const ocr = new AzureDocIntelClient(env.AZURE_DOC_INTEL_ENDPOINT, env.AZURE_DOC_INTEL_KEY);

    // 2. Prep Output
    await fs.mkdir(OUT_DIR, { recursive: true });

    // 3. Get Files
    let files = [];
    try {
        const allFiles = await fs.readdir(SAMPLE_DIR);
        files = allFiles.filter(f => {
            const ext = path.extname(f).toLowerCase();
            return ALLOWED_EXTS.includes(ext);
        });
    } catch (e) {
        console.error(`❌ Can't read ${SAMPLE_DIR}`);
        return;
    }

    console.log(`📂 Found ${files.length} documents to diagnose.\n`);

    for (const fileName of files) {
        console.log(`=============================================================`);
        console.log(`📄 INSPECTING: ${fileName}`);
        
        const filePath = path.join(SAMPLE_DIR, fileName);
        const buffer = await fs.readFile(filePath);
        
        // --- STEP 1: RAW OCR (Azure) ---
        console.log(`   1️⃣  Calling Azure Document Intelligence...`);
        
        // Azure handles the binary, we don't need to tell it the filename anymore
        const rawLines = await ocr.extractLines(buffer);
        
        // Save Raw Output
        const rawPath = path.join(OUT_DIR, `${fileName}_1_RAW_AZURE.json`);
        await fs.writeFile(rawPath, JSON.stringify(rawLines, null, 2));
        console.log(`      💾 Saved Raw OCR to: ${rawPath}`);


        // --- STEP 2: PARSER (Stack Machine) ---
        console.log(`   2️⃣  Running Stack Machine Parser...`);
        
        // [UPDATED] Use Content-Aware Detection
        const jurisdiction = detectJurisdiction(rawLines, fileName);
        console.log(`      🏛️  Jurisdiction: ${jurisdiction}`);

        const job: IngestJob = {
            jobId: uuidv4(),
            sourceUrl: 'dry-run',
            jurisdiction,
            corpus: 'debug',
            documentType: 'CONSOLIDATED_REGULATION'
        };

        const result = await IngestParsePdfAsync(rawLines, job);

        // Save Tree Output (Re-assembled for readability)
        const treePath = path.join(OUT_DIR, `${fileName}_2_PARSED_TREE.json`);
        
        const reconstructTree = (nodeId: string): any => {
            const node = result.nodeMap.get(nodeId)!;
            return {
                type: node.type,
                text: node.content.join('\n'), 
                urn: node.urn || 'N/A',
                children: node.children.map(reconstructTree)
            };
        };

        const readableTree = reconstructTree(result.rootId);
        await fs.writeFile(treePath, JSON.stringify(readableTree, null, 2));
        console.log(`      💾 Saved Parsed Tree to: ${treePath}`);


        // --- STEP 3: LINTER (Integrity Check) ---
        console.log(`   3️⃣  Running Linter...`);
        const lintResult = lintGraph(result.nodeMap, jurisdiction);
        
        if (lintResult.valid) {
            console.log(`      ✅ Graph Structure Valid (0 Critical Errors)`);
        } else {
            console.error(`      ❌ Graph Structure INVALID`);
            lintResult.errors.forEach(e => {
                console.error(`         - [${e.severity}] ${e.message} (Node: ${e.nodeId})`);
            });
        }
    }
    
    console.log(`\n🕵️  Dry Run Complete. Check ${OUT_DIR} for artifacts.`);
}

main().catch(e => console.error(e));