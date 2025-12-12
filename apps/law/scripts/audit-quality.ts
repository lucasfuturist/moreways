import fs from 'fs';
import path from 'path';
import { LocalPdfClient } from '../src/infra/local/infra.local.pdf';
import { IngestParsePdfAsync } from '../src/ingest/svc/ingest.svc.parsePdf';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_EXTS = ['.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg'];

async function audit() {
  const targetDir = process.argv[2];
  if (!targetDir) {
    console.error("Usage: npx ts-node scripts/audit-quality.ts <path_to_pdf_folder>");
    process.exit(1);
  }

  console.log(`🔍 Auditing Documents in: ${targetDir}`);
  
  // 1. Filter for all supported extensions
  const files = fs.readdirSync(targetDir).filter(f => 
    ALLOWED_EXTS.includes(path.extname(f).toLowerCase())
  );
  
  const pdfClient = new LocalPdfClient();

  console.log(`Found ${files.length} files. Starting Audit...\n`);
  // Adjusted column widths for readability
  console.log(`| ${'File Name'.padEnd(35)} | ${'Pages'.padEnd(6)} | ${'Nodes'.padEnd(6)} | ${'Roots'.padEnd(6)} | ${'Status'.padEnd(16)} |`);
  console.log(`|${'-'.repeat(37)}|${'-'.repeat(8)}|${'-'.repeat(8)}|${'-'.repeat(8)}|${'-'.repeat(18)}|`);

  for (const file of files) {
    const fullPath = path.join(targetDir, file);
    const fileNameUpper = file.toUpperCase();
    const ext = path.extname(file).toLowerCase();

    // 2. SKIP NON-PDFs (Local Parser limitation)
    if (ext !== '.pdf') {
       // We list them so you know they exist, but flag that we can't parse locally
       console.log(`| ${file.substring(0, 35).padEnd(35)} | ${'-'.padEnd(6)} | ${'-'.padEnd(6)} | ${'-'.padEnd(6)} | ⚠️  NEEDS AZURE    |`);
       continue;
    }

    const buffer = fs.readFileSync(fullPath);

    // 3. JURISDICTION DETECTION
    let jurisdiction: 'MA' | 'FED' = 'MA';
    if (
        fileNameUpper.includes('CFR') || 
        fileNameUpper.includes('USC') || 
        fileNameUpper.includes('ACT') || 
        fileNameUpper.includes('FDCPA') ||
        fileNameUpper.includes('ROSCA') ||
        fileNameUpper.includes('TILA')
    ) {
        jurisdiction = 'FED';
    }

    try {
      const lines = await pdfClient.extractLines(buffer);
      
      // 4. CHECK FOR EMPTY EXTRACTION (Image PDF)
      if (lines.length === 0) {
        console.log(`| ${file.substring(0, 35).padEnd(35)} | ${'0'.padEnd(6)} | ${'0'.padEnd(6)} | ${'0'.padEnd(6)} | ⚠️  IMAGE/SCAN     |`);
        continue;
      }

      const result = await IngestParsePdfAsync(lines, {
        jobId: uuidv4(),
        sourceUrl: 'audit',
        jurisdiction: jurisdiction,
        corpus: 'audit',
        documentType: 'CONSOLIDATED_REGULATION'
      });

      const nodeCount = result.nodeMap.size;
      const root = result.nodeMap.get(result.rootId);
      const topLevelChildren = root?.children.length || 0;
      
      let status = '✅ OK';
      // Lowered threshold to 2 because ROSCA/FDCPA are short 1-page laws
      if (nodeCount < 2) status = '⚠️ LOW DATA';
      
      // FAILURE DETECTION
      if (topLevelChildren === 0) {
        status = `❌ FLAT (${jurisdiction})`;
      }

      console.log(`| ${file.substring(0, 35).padEnd(35)} | ${String(lines[lines.length-1]?.pageNumber || 0).padEnd(6)} | ${String(nodeCount).padEnd(6)} | ${String(topLevelChildren).padEnd(6)} | ${status.padEnd(16)} |`);

    } catch (e: any) {
      console.log(`| ${file.substring(0, 35).padEnd(35)} | ${'ERR'.padEnd(6)} | ${'-'.padEnd(6)} | ${'-'.padEnd(6)} | 💥 CRASH           |`);
    }
  }
}

audit();