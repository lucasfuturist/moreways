import { describe, it, expect } from 'vitest';
import { IngestParsePdfAsync } from '../../src/ingest/svc/ingest.svc.parsePdf';
import { RawPdfLine, IngestJob } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper: Mock Document Builder (Simplified for this test)
 */
class MockDocBuilder {
  private lines: RawPdfLine[] = [];
  private currentPage = 1;

  add(text: string, indent: number = 0): this {
    this.lines.push({
      text,
      pageNumber: this.currentPage,
      // Map indent 0->1.0, 1->1.5, etc.
      bbox: [1.0 + (indent * 0.5), 2.0, 5.0, 0.2], 
      confidence: 0.99
    });
    return this;
  }

  build(): RawPdfLine[] {
    return this.lines;
  }
}

// Standard Job Config for FED
const job: IngestJob = {
    jobId: uuidv4(),
    sourceUrl: 'test://fed',
    jurisdiction: 'FED',
    corpus: 'cfr-test',
    documentType: 'CONSOLIDATED_REGULATION'
};

describe('Federal Law Parsing (CFR/USC)', () => {

    it('should parse standard CFR hierarchy (Part -> Section -> a -> 1)', async () => {
        // Federal hierarchy is often: Section -> Paragraph (a) -> Subparagraph (1)
        // This is the REVERSE of many state laws (like MA).
        const lines = new MockDocBuilder()
            .add("PART 310—TELEMARKETING SALES RULE")     // Level 1: PART
            .add("§ 310.4 Abusive telemarketing acts.")   // Level 2: SECTION
            .add("(a) Abusive conduct generally.")        // Level 3: PARAGRAPH
            .add("(1) Threats, intimidation, or profanity.") // Level 4: SUBPARAGRAPH
            .build();

        const result = await IngestParsePdfAsync(lines, job);
        const root = result.nodeMap.get(result.rootId)!;

        // Verify Part
        const partId = root.children[0];
        const part = result.nodeMap.get(partId)!;
        expect(part.type).toBe('PART');

        // Verify Section
        const secId = part.children[0];
        const sec = result.nodeMap.get(secId)!;
        expect(sec.type).toBe('SECTION');

        // Verify Paragraph (a)
        const paraId = sec.children[0];
        const para = result.nodeMap.get(paraId)!;
        expect(para.type).toBe('PARAGRAPH'); // (a) should be Paragraph in FED
        expect(para.content[0]).toContain("(a)");

        // Verify Subparagraph (1)
        const subId = para.children[0];
        const sub = result.nodeMap.get(subId)!;
        expect(sub.type).toBe('SUBPARAGRAPH'); // (1) should be Subparagraph
        expect(sub.content[0]).toContain("(1)");
    });

    it('should parse U.S. Code citations as Sections', async () => {
        // Files like FDCPA use "15 U.S.C. 1692" as headers
        const lines = new MockDocBuilder()
            .add("15 U.S.C. 1692 Congressional findings") // Should be SECTION
            .add("(a) Abusive practices")                 // Should be PARAGRAPH
            .build();

        const result = await IngestParsePdfAsync(lines, job);
        const root = result.nodeMap.get(result.rootId)!;

        const sec = result.nodeMap.get(root.children[0])!;
        expect(sec.type).toBe('SECTION');
        expect(sec.content[0]).toContain("15 U.S.C.");

        const para = result.nodeMap.get(sec.children[0])!;
        expect(para.type).toBe('PARAGRAPH');
    });

    it('should handle Roman Numerals correctly', async () => {
        // Hierarchy: (a) -> (1) -> (i)
        const lines = new MockDocBuilder()
            .add("§ 100.1 Definitions")
            .add("(a) General")
            .add("(1) Specifics")
            .add("(i) Deep Detail")    // Level 5: ITEM
            .add("(ii) More Detail")   // Level 5: ITEM
            .build();

        const result = await IngestParsePdfAsync(lines, job);
        const root = result.nodeMap.get(result.rootId)!;
        
        // Traverse down to (1)
        const sec = result.nodeMap.get(root.children[0])!;
        const para = result.nodeMap.get(sec.children[0])!; // (a)
        const sub = result.nodeMap.get(para.children[0])!; // (1)

        expect(sub.children.length).toBe(2);
        
        const item1 = result.nodeMap.get(sub.children[0])!;
        expect(item1.type).toBe('ITEM'); // Should be 'ITEM', not 'PARAGRAPH'
        expect(item1.content[0]).toContain("(i)");
    });

    it('should handle "Sec." abbreviation common in Acts', async () => {
        const lines = new MockDocBuilder()
            .add("Sec. 101. Short Title")
            .add("This Act may be cited as...")
            .build();

        const result = await IngestParsePdfAsync(lines, job);
        const root = result.nodeMap.get(result.rootId)!;
        
        const sec = result.nodeMap.get(root.children[0])!;
        expect(sec.type).toBe('SECTION');
    });

});