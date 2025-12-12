import { describe, it, expect } from 'vitest';
import { IngestWorker, IDocumentIntelligence } from '../../src/ingest/api/ingest.api.worker';
import { GraphNodeRepo } from '../../src/graph/repo/graph.repo.nodeRepo';
import { MockDbClient } from '../mocks/db.mock'; // [FIX] New Import
import { ContextAssembler, MockGraphReader } from '../../src/retrieve/svc/retrieve.svc.contextAssembler';
import { EnrichmentService, MockAiProvider } from '../../src/ingest/svc/ingest.svc.enrichNode';
import { MockOverrideRepo } from '../../src/graph/repo/graph.repo.overrideRepo'; 
import { IngestJob } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

describe('The Grand Loop: Full Pipeline Integration', () => {
    
    it('should ingest a PDF and successfully retrieve a context', async () => {
        
        // --- 1. INFRASTRUCTURE SETUP ---
        const dbClient = new MockDbClient();
        const repo = new GraphNodeRepo(dbClient);
        const aiProvider = new MockAiProvider();
        const enricher = new EnrichmentService(aiProvider);
        
        // Mock OCR to match strict MA hierarchy
        const mockOcr: IDocumentIntelligence = {
            extractLines: async () => [
            { text: "940 CMR 5.00: MOTOR VEHICLE REGS", pageNumber: 1, bbox: [1.0, 2.0, 5, 0.2] }, 
            { text: "(1) Definition", pageNumber: 1, bbox: [1.5, 2.2, 5, 0.2] },
            { text: "(a) Lemon Law", pageNumber: 1, bbox: [2.0, 2.4, 5, 0.2] },
            { text: "means a statute protecting consumers...", pageNumber: 1, bbox: [2.0, 2.5, 5, 0.2] }
            ]
        };
        
        const worker = new IngestWorker(mockOcr, repo, enricher);

        // --- 2. EXECUTION ---
        const jobId = uuidv4();
        const job: IngestJob = {
            jobId,
            sourceUrl: 'test-pipeline',
            jurisdiction: 'MA',
            corpus: '940cmr',
            documentType: 'CONSOLIDATED_REGULATION'
        };

        await worker.processJob(job, Buffer.from(''));

        // --- 3. RETRIEVAL SETUP ---
        const graphReader = new MockGraphReader(dbClient.storedRecords); 
        const overrideRepo = new MockOverrideRepo();
        const retriever = new ContextAssembler(graphReader, overrideRepo);

        // --- 4. VERIFICATION ---
        // Target: (a) Lemon Law
        // Old URN: urn:lex:ma:5_00:1:a
        // New URN: urn:lex:ma:940cmr:5_00:1:a (Scoped by corpus)
        const targetUrn = 'urn:lex:ma:940cmr:5_00:1:a';
        
        const context = await retriever.assembleContext(targetUrn);
        
        expect(context.targetNode.content_text).toContain("Lemon Law");
        expect(context.ancestry.length).toBe(3); // Root, Section, Subsection
    });
});