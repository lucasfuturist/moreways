import { IDocumentIntelligence } from '../../ingest/api/ingest.api.worker';
import { RawPdfLine } from '../../ingest/schema/ingest.schema.pdfInput';

export class LocalPdfClient implements IDocumentIntelligence {
  async extractLines(fileBuffer: Buffer): Promise<RawPdfLine[]> {
    console.log(`[LocalPDF] Parsing ${fileBuffer.length} bytes with pdf2json...`);

    return new Promise((resolve) => {
      // --- 1. PREPARE THE SILENCER ---
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;
      const originalInfo = console.info;

      // Filter logic: Block pdf2json specific noise
      const isNoise = (args: any[]) => {
        if (args.length === 0) return false;
        const msg = String(args[0]);
        return (
          msg.includes("Warning:") ||
          msg.includes("Setting up fake worker") ||
          msg.includes("TT: complementing") ||
          msg.includes("field.type of Link") ||
          msg.includes("valid form element") ||
          msg.includes("sRGB") ||
          msg.includes("Invalid Font Weight")
        );
      };

      // Monkey-patch Console
      const proxyLog = (original: Function) => (...args: any[]) => {
        if (!isNoise(args)) original.apply(console, args);
      };

      console.log = proxyLog(originalLog);
      console.warn = proxyLog(originalWarn);
      console.error = proxyLog(originalError);
      console.info = proxyLog(originalInfo);

      // --- 2. LAZY LOAD LIBRARY (After Patching) ---
      // We require inside the function so it initializes using our patched console
      // regardless of when the class was instantiated.
      const PDFParser = require("pdf2json");

      const restoreConsole = () => {
        console.log = originalLog;
        console.warn = originalWarn;
        console.error = originalError;
        console.info = originalInfo;
      };

      const pdfParser = new PDFParser(null, 1); // 1 = Text content only

      pdfParser.on("pdfParser_dataError", (errData: any) => {
        restoreConsole();
        // Use originalError to ensure this one gets through
        originalError("❌ PDF Parse Error:", errData.parserError);
        resolve([]); 
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        restoreConsole();
        try {
          const output: RawPdfLine[] = [];
          
          if (pdfData && pdfData.Pages) {
            pdfData.Pages.forEach((page: any, pageIndex: number) => {
              const pageNum = pageIndex + 1;
              
              if (page.Texts) {
                page.Texts.forEach((textItem: any) => {
                  let rawText = textItem.R[0].T;
                  try { rawText = decodeURIComponent(rawText); } catch (e) { /* ignore */ }
                  
                  if (rawText.trim().length > 0) {
                     output.push({
                       text: rawText.trim(),
                       pageNumber: pageNum,
                       // Map x/y/w (pdf2json units are relative)
                       bbox: [textItem.x, textItem.y, textItem.w || 0, 0.2], 
                       confidence: 1.0
                     });
                  }
                });
              }
            });
          }

          // Sort: Page -> Y -> X
          output.sort((a, b) => {
             if (a.pageNumber !== b.pageNumber) return a.pageNumber - b.pageNumber;
             if (Math.abs(a.bbox[1] - b.bbox[1]) > 0.5) return a.bbox[1] - b.bbox[1];
             return a.bbox[0] - b.bbox[0];
          });

          // Smart Merge
          const merged = this.mergeFragments(output);
          
          originalLog(`[LocalPDF] Extracted ${merged.length} lines.`);
          resolve(merged);

        } catch (e) {
          originalError("❌ PDF Data Processing Error:", e);
          resolve([]);
        }
      });

      try {
        pdfParser.parseBuffer(fileBuffer);
      } catch (e) {
        restoreConsole();
        originalError("❌ PDF Execution Error:", e);
        resolve([]);
      }
    });
  }

  // Smart Merge that respects kerning vs spacing
  private mergeFragments(lines: RawPdfLine[]): RawPdfLine[] {
    if (lines.length === 0) return [];
    
    const result: RawPdfLine[] = [];
    let current = lines[0];
    const MERGE_THRESHOLD = 0.4; 

    for (let i = 1; i < lines.length; i++) {
      const next = lines[i];
      const isSamePage = next.pageNumber === current.pageNumber;
      const isSameLine = Math.abs(next.bbox[1] - current.bbox[1]) < 0.5; 

      if (isSamePage && isSameLine) {
        const currentEnd = current.bbox[0] + current.bbox[2];
        const gap = next.bbox[0] - currentEnd;

        if (gap < MERGE_THRESHOLD) {
            // Fragmented Word (P + art) -> Join directly
            current.text += next.text;
            current.bbox[2] += gap + next.bbox[2]; 
        } else {
            // Distinct Words (Section + 1) -> Join with space
            current.text += " " + next.text;
            // Extend bbox to encompass both
            current.bbox[2] = (next.bbox[0] + next.bbox[2]) - current.bbox[0];
        }
      } else {
        result.push(current);
        current = next;
      }
    }
    result.push(current);
    return result;
  }
}