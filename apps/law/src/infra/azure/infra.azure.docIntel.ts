import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import { IDocumentIntelligence } from "../../ingest/api/ingest.api.worker";
import { RawPdfLine } from "../../ingest/schema/ingest.schema.pdfInput";

export class AzureDocIntelClient implements IDocumentIntelligence {
  private client: DocumentAnalysisClient;

  constructor(endpoint: string, key: string) {
    if (!endpoint || !key) {
      throw new Error("Azure Doc Intel credentials missing.");
    }
    // Reverted to standard initialization
    this.client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
  }

  // Removed fileNameHint - we assume PDF content
  async extractLines(fileBuffer: Buffer): Promise<RawPdfLine[]> {
    console.log(`[Azure] 🚀 Sending ${fileBuffer.length} bytes to Layout Model...`);

    try {
      // Standard call. No hacks.
      const poller = await this.client.beginAnalyzeDocument("prebuilt-layout", fileBuffer);
      const result = await poller.pollUntilDone();

      if (!result.pages || result.pages.length === 0) {
        console.warn("[Azure] ⚠️ Document analysis returned zero pages.");
        return [];
      }

      console.log(`[Azure] ✅ Success. Processed ${result.pages.length} pages.`);

      const output: RawPdfLine[] = [];

      for (const page of result.pages) {
        if (page.lines) {
          for (const line of page.lines) {
            
            const polygon = line.polygon || [];
            
            // Handle different unit types (Azure defaults to inches for PDF)
            const x = polygon[0]?.x || 0;
            const y = polygon[0]?.y || 0;
            const w = (polygon[2]?.x || x) - x; 
            const h = (polygon[2]?.y || y) - y;

            output.push({
              text: line.content,
              pageNumber: page.pageNumber,
              bbox: [x, y, w, h], 
              confidence: 1.0 
            });
          }
        }
      }

      // Strict Sorting: Page -> Y -> X
      return output.sort((a, b) => {
        if (a.pageNumber !== b.pageNumber) return a.pageNumber - b.pageNumber;
        if (Math.abs(a.bbox[1] - b.bbox[1]) > 0.1) return a.bbox[1] - b.bbox[1];
        return a.bbox[0] - b.bbox[0];
      });

    } catch (error: any) {
      console.error("❌ [Azure] Analysis Failed:", error.message);
      throw error; 
    }
  }
}