import { describe, it, expect, vi } from 'vitest';
import { IngestParsePdfAsync } from '../../src/ingest/svc/ingest.svc.parsePdf';
import { RawPdfLine, IngestJob, ParseResult } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

/**
 * --- TEST INFRASTRUCTURE ---
 */
class MockDocBuilder {
  private lines: RawPdfLine[] = [];
  private currentPage = 1;

  add(text: string, xIdx: number, y: number, isHeader = false): this {
    this.lines.push({
      text,
      pageNumber: this.currentPage,
      // Indentation logic: 0 -> 1.0, 1 -> 1.5
      bbox: [1.0 + (xIdx * 0.5), y, 5.0, 0.2], 
      confidence: 0.99
    });
    return this;
  }

  addBadIndent(text: string, xIdx: number, y: number): this {
    this.lines.push({
      text,
      pageNumber: this.currentPage,
      // Explicit X coordinate for bad indent tests
      bbox: [xIdx, y, 5.0, 0.2], 
      confidence: 0.90
    });
    return this;
  }

  build(): RawPdfLine[] {
    return this.lines;
  }
}

async function parse(lines: RawPdfLine[], jurisdiction: 'MA' | 'FED'): Promise<ParseResult> {
  const job: IngestJob = {
    jobId: uuidv4(),
    sourceUrl: 'test',
    jurisdiction,
    corpus: 'test-corpus',
    documentType: 'CONSOLIDATED_REGULATION'
  };
  return await IngestParsePdfAsync(lines, job);
}

describe('Law Parsing Engine: Scenario Suite', () => {

  it('SCENARIO 1: MA Regulation (Standard Hierarchy)', async () => {
    const lines = new MockDocBuilder()
      .add("940 CMR 3.00: GENERAL", 0, 1.0)       // Section
      .add("(1) Definitions", 1, 1.2)            // Subsection
      .add("(a) Advertisement", 2, 1.4)          // Paragraph
      .add("means something...", 2, 1.5)
      .add("1. Clear and Conspicuous", 3, 1.6)   // Subparagraph
      .build();

    const result = await parse(lines, 'MA');
    const root = result.nodeMap.get(result.rootId)!;
    
    expect(root.children.length).toBe(1); // Root should have 1 Section
    const section = result.nodeMap.get(root.children[0])!;
    expect(section.type).toBe('SECTION');
    
    const sub = result.nodeMap.get(section.children[0])!;
    expect(sub.type).toBe('SUBSECTION');
    
    const para = result.nodeMap.get(sub.children[0])!;
    expect(para.type).toBe('PARAGRAPH');
  });

  it('SCENARIO 2: Federal Regulation (Profile Switching)', async () => {
    const lines = new MockDocBuilder()
      .add("§ 310.4 Abusive practices", 0, 1.0)   
      .add("(a) Abusive conduct", 1, 1.2)        
      .add("(1) Threats", 2, 1.4)                
      .add("(i) Violence", 3, 1.6)               
      .build();

    const result = await parse(lines, 'FED');
    const root = result.nodeMap.get(result.rootId)!;

    const section = result.nodeMap.get(root.children[0])!;
    const para = result.nodeMap.get(section.children[0])!;
    
    expect(para.type).toBe('PARAGRAPH');
    expect(para.content[0]).toContain("(a)");
    
    const sub = result.nodeMap.get(para.children[0])!;
    expect(sub.type).toBe('SUBPARAGRAPH');
  });

  it('SCENARIO 3: Broken Ladder (Missing Parents)', async () => {
    const lines = new MockDocBuilder()
      .add("940 CMR 5.00: SECTION", 0, 1.0)
      .add("1. Some stray list item", 3, 1.2) // Depth 4 (Subparagraph)
      .build();

    const result = await parse(lines, 'MA');
    const root = result.nodeMap.get(result.rootId)!;
    const section = result.nodeMap.get(root.children[0])!;
    
    // The parser should attach the stray node to the Section, even though it skipped levels
    const strayNode = result.nodeMap.get(section.children[0])!;

    expect(strayNode.type).toBe('SUBPARAGRAPH');
    expect(strayNode.parentId).toBe(section.tempId);
  });

  it('SCENARIO 4: Visual Dissonance (Safety Check)', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const lines = new MockDocBuilder()
      .add("940 CMR 3.00: GEN", 0, 1.0)
      .add("(1) Good Indent", 1, 1.2) // x = 1.5
      // Bad Indent: x=0.4 is left of Parent (1.5) - Tolerance (0.5) = 1.0
      // 0.4 < 1.0 -> Should Warn
      .addBadIndent("(a) Bad Indent", 0.4, 1.4) 
      .build();

    await parse(lines, 'MA');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[VISUAL_DISSONANCE]'));
    spy.mockRestore();
  });

  it('SCENARIO 5: Garbage Injection (Noise Filtering)', async () => {
    const lines = new MockDocBuilder()
      .add("Page 1 of 50", 0, 0.2, true) 
      .add("940 CMR 3.00: START", 0, 1.5)
      .add("Some legal text...", 0, 1.6)
      // [FIX] Ensure footer is below the 10.5 threshold
      .add("FINAL DRAFT DO NOT CITE", 0, 11.0, true) 
      .add("(1) Real Content", 1, 2.0)
      .build();

    const result = await parse(lines, 'MA');
    const root = result.nodeMap.get(result.rootId)!;
    const section = result.nodeMap.get(root.children[0])!;

    const allContent = section.content.join(' ');
    
    expect(allContent).not.toContain("Page 1");
    expect(allContent).not.toContain("FINAL DRAFT");
    
    // [FIX] The section might contain the loose text "Some legal text..." 
    // AND the child subsection "(1)".
    expect(section.children.length).toBe(1);
  });

});