import { describe, it, expect } from 'vitest';
import { IngestWorker, IDocumentIntelligence } from '../../src/ingest/api/ingest.api.worker';
import { GraphNodeRepo, IDatabaseClient } from '../../src/graph/repo/graph.repo.nodeRepo';
import { EnrichmentService, MockAiProvider } from '../../src/ingest/svc/ingest.svc.enrichNode';
import { LegalNodeRecord } from '../../src/graph/schema/graph.schema.nodes';
import { IngestJob, RawPdfLine } from '../../src/ingest/schema/ingest.schema.pdfInput';

/**
 * Smart Mock DB that enforces "Exclusion Constraints" 
 * This simulates Postgres rejecting a second write to the same URN+Range.
 */
class SmartMockDbClient implements IDatabaseClient {
    public storedRecords: LegalNodeRecord[] = [];

    async fetchActiveNodes(urns: string[]): Promise<LegalNodeRecord[]> {
        return this.storedRecords.filter(r => 
            urns.includes(r.urn) && r.validity_range.endsWith(',)')
        );
    }

    async expireNodes(ids: string[], date: string): Promise<void> {
        this.storedRecords.forEach(r => {
            if (ids.includes(r.id)) r.validity_range = r.validity_range.replace(',)', `,${date})`);
        });
    }

    async bulkInsertNodes(records: LegalNodeRecord[]): Promise<void> {
        // 1. Simulate Network Latency FIRST
        await new Promise(r => setTimeout(r, 10 + Math.random() * 10));

        // 2. ATOMIC Check-and-Insert
        for (const newRec of records) {
            const conflict = this.storedRecords.find(existing => 
                existing.urn === newRec.urn && 
                existing.validity_range.endsWith(',)')
            );

            if (conflict) {
                throw new Error(`DB Constraint Violation: Active record already exists for ${newRec.urn}`);
            }
        }

        this.storedRecords.push(...records);
    }
}

class MockConcurrencyOcr implements IDocumentIntelligence {
    async extractLines(buf: Buffer): Promise<RawPdfLine[]> {
        return [
            { text: "940 CMR 3.00: RACE", pageNumber: 1, bbox: [1, 1, 5, 1] }
        ];
    }
}

describe('Stress Testing - Concurrency', () => {

    it('should reject duplicate active records via DB Constraints', async () => {
        // 1. Setup
        const db = new SmartMockDbClient(); 
        const repo = new GraphNodeRepo(db);
        const worker = new IngestWorker(new MockConcurrencyOcr(), repo, new EnrichmentService(new MockAiProvider()));

        // Both jobs target the same Corpus + Jurisdiction
        const jobA: IngestJob = { jobId: 'A', sourceUrl: 'u', jurisdiction: 'MA', corpus: 'race', documentType: 'CONSOLIDATED_REGULATION' };
        const jobB: IngestJob = { jobId: 'B', sourceUrl: 'u', jurisdiction: 'MA', corpus: 'race', documentType: 'CONSOLIDATED_REGULATION' };

        // 2. Race!
        console.log('[Stress] Firing two conflicting jobs simultaneously...');
        const results = await Promise.allSettled([
            worker.processJob(jobA, Buffer.from('A')),
            worker.processJob(jobB, Buffer.from('B'))
        ]);

        // 3. Assertions
        const rejected = results.filter(r => r.status === 'rejected');
        const fulfilled = results.filter(r => r.status === 'fulfilled');

        expect(fulfilled.length).toBe(1);
        expect(rejected.length).toBe(1);

        // Verify DB State: Only 1 record should exist
        // [FIX] Updated URN to include corpus 'race'
        const active = await db.fetchActiveNodes(['urn:lex:ma:race:3_00']);
        expect(active.length).toBe(1);
        
        console.log('[Stress] Concurrency Constraints Verified ✅');
    });
});