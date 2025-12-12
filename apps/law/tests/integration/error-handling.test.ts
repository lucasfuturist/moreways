import { describe, it, expect } from 'vitest';
import { IngestWorker, IDocumentIntelligence } from '../../src/ingest/api/ingest.api.worker';
import { GraphNodeRepo } from '../../src/graph/repo/graph.repo.nodeRepo';
import { MockDbClient } from '../mocks/db.mock'; // [FIX] New Import
import { EnrichmentService, MockAiProvider } from '../../src/ingest/svc/ingest.svc.enrichNode';
import { IngestJob, RawPdfLine } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

// Mock that simulates a crash in the Layout Analysis phase
class CrashingOcr implements IDocumentIntelligence {
    async extractLines(fileBuffer: Buffer): Promise<RawPdfLine[]> {
        if (fileBuffer.length === 0) {
            throw new Error("Azure Doc Intel Error: InvalidFileSize");
        }
        return [];
    }
}

describe('Integration - Error Handling (Poison Pills)', () => {
    
    it('should propagate errors cleanly without hanging the process', async () => {
        const worker = new IngestWorker(
            new CrashingOcr(), 
            new GraphNodeRepo(new MockDbClient()), 
            new EnrichmentService(new MockAiProvider())
        );

        const job: IngestJob = {
            jobId: uuidv4(),
            sourceUrl: 'poison://file',
            jurisdiction: 'MA',
            corpus: 'poison',
            documentType: 'CONSOLIDATED_REGULATION'
        };

        // Simulate a 0-byte file (Poison Pill)
        const poisonPill = Buffer.from('');

        // We expect the worker's promise to REJECT (fail), not hang.
        await expect(worker.processJob(job, poisonPill))
            .rejects
            .toThrow("Azure Doc Intel Error: InvalidFileSize");
    });
});