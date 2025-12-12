import { describe, it, expect } from 'vitest';
import { IngestWorker, IDocumentIntelligence } from '../../src/ingest/api/ingest.api.worker';
import { RawPdfLine, IngestJob } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { GraphNodeRepo } from '../../src/graph/repo/graph.repo.nodeRepo';
import { EnrichmentService, MockAiProvider } from '../../src/ingest/svc/ingest.svc.enrichNode';
import { v4 as uuidv4 } from 'uuid';

class MockOcrProvider implements IDocumentIntelligence {
  constructor(private linesToReturn: RawPdfLine[]) {}

  async extractLines(fileBuffer: Buffer): Promise<RawPdfLine[]> {
    return this.linesToReturn;
  }
}

class MockGraphRepo extends GraphNodeRepo {
  constructor() { super({} as any); }
  async commitParseResult(result: any, jurisdiction: any, corpus: any, enrichmentMap: any, sourceJobId: any): Promise<void> {
    // console.log('[MockRepo] Commit called successfully.');
    return Promise.resolve();
  }
}

describe('Ingest Worker - Integration Flow', () => {

  it('should process a job from raw bytes to graph commit', async () => {
    // 1. Setup Mock Data
    const mockLines: RawPdfLine[] = [
      { text: "940 CMR 1.00: TEST", pageNumber: 1, bbox: [1, 1, 5, 1], confidence: 0.9 },
      { text: "(1) Section One", pageNumber: 1, bbox: [1.5, 2, 5, 1], confidence: 0.9 }
    ];

    const mockJob: IngestJob = {
      jobId: uuidv4(),
      sourceUrl: 'mock://file',
      jurisdiction: 'MA',
      corpus: 'test',
      documentType: 'CONSOLIDATED_REGULATION'
    };

    // 2. Instantiate Worker with Mock Dependencies
    const ocr = new MockOcrProvider(mockLines);
    const repo = new MockGraphRepo();
    const enricher = new EnrichmentService(new MockAiProvider());
    
    const worker = new IngestWorker(ocr, repo, enricher);

    // 3. Run the Job
    const fakeBuffer = Buffer.from("fake-pdf-content");
    const result = await worker.processJob(mockJob, fakeBuffer);

    // 4. Assertions
    expect(result.rootId).toBeDefined();
    
    // Root + Section + Subsection = 3 Nodes
    // The parser logic creates Root automatically.
    // Line 1: "940 CMR..." -> SECTION
    // Line 2: "(1) Section..." -> SUBSECTION
    // Total: Root (1) + Section (1) + Subsection (1) = 3
    expect(result.nodeMap.size).toBe(3);
  });

});