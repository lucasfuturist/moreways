import { describe, it, expect } from 'vitest';
import { IngestParsePdfAsync } from '../../src/ingest/svc/ingest.svc.parsePdf';
import { RawPdfLine, IngestJob } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper: Mock Document Builder
 * Constructs raw OCR lines programmatically.
 */
class MockDocBuilder {
  private lines: RawPdfLine[] = [];
  private currentPage = 1;

  add(text: string, xIdx: number, y: number): this {
    this.lines.push({
      text,
      pageNumber: this.currentPage,
      // xIdx maps to indentation: 0->1.0, 1->1.5, etc.
      bbox: [1.0 + (xIdx * 0.5), y, 5.0, 0.2], 
      confidence: 0.99
    });
    return this;
  }

  build(): RawPdfLine[] {
    return this.lines;
  }
}

describe('The Frankenstein Fuzzer', () => {

  it('should survive a chaotic document structure', async () => {
    // 1. Setup Context
    const job: IngestJob = {
        jobId: uuidv4(),
        sourceUrl: 'fuzz://test',
        jurisdiction: 'MA',
        corpus: 'fuzz-corpus',
        documentType: 'CONSOLIDATED_REGULATION'
    };

    // 2. Create a "Chaos Generator"
    const chaosLines = new MockDocBuilder()
      .add("SECTION 1.00: NORMAL START", 0, 1.0)
      .add("(1) So far so good", 1, 1.2)
      // CHAOS 1: Sudden massive indentation jump
      .add("(a) I am way too indented", 10, 1.4) 
      // CHAOS 2: Negative Coordinate (OCR glitch)
      .add("Ghost text", 1, -5.0) 
      // CHAOS 3: Recursive depth limit test
      .add("1. Deep", 2, 1.5)
      .add("i. Deeper", 3, 1.6)
      .add("A. Deeper", 4, 1.7)
      .add("1. Way too deep...", 20, 1.8) 
      // CHAOS 4: Duplicate Headers
      .add("SECTION 1.00: DUPLICATE HEADER", 0, 2.0) 
      .build();

    // 3. Run the parser
    // We expect it NOT to throw an exception. 
    // We expect it to log warnings but produce a valid partial tree.
    const result = await IngestParsePdfAsync(chaosLines, job);

    expect(result.nodeMap.size).toBeGreaterThan(0);
    
    // Optional: Check specific node count if deterministic
    // console.log(`[Fuzzer] Survived with ${result.nodeMap.size} nodes.`);
  });
});