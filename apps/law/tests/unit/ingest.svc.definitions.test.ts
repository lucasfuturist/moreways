import { describe, it, expect } from 'vitest';
import { IngestParsePdfAsync } from '../../src/ingest/svc/ingest.svc.parsePdf';
import { RawPdfLine, IngestJob } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';
import { GraphNodeRepo } from '../../src/graph/repo/graph.repo.nodeRepo';
import { MockDbClient } from '../mocks/db.mock';

// Mock Dependencies
const job: IngestJob = {
    jobId: uuidv4(),
    sourceUrl: 'test',
    jurisdiction: 'MA',
    corpus: 'test_corpus',
    documentType: 'CONSOLIDATED_REGULATION'
};

const mockLines: RawPdfLine[] = [
    { text: "940 CMR 10.00: HOME IMPROVEMENT", pageNumber: 1, bbox: [1,1,5,1] },
    { text: "10.01: Definitions", pageNumber: 1, bbox: [1,1.5,5,1] },
    // These should become DEFINITION nodes
    { text: "Contractor: means any person who owns or operates a contracting business.", pageNumber: 1, bbox: [1,2,5,1] },
    { text: "Owner: means any person who owns the property.", pageNumber: 1, bbox: [1,2.5,5,1] },
    // This is a standard subsection, should NOT be a definition
    { text: "(1) General Rules.", pageNumber: 1, bbox: [1,3,5,1] }
];

describe('Ingest - Definition Parsing', () => {

    it('should split definition lists into distinct nodes', async () => {
        // 1. Run Parser
        const result = await IngestParsePdfAsync(mockLines, job);
        
        // Find the "Definitions" section
        const root = result.nodeMap.get(result.rootId)!;
        const sectionId = root.children[1]; // 10.01
        const section = result.nodeMap.get(sectionId)!;

        // Expect 3 children: Contractor, Owner, (1)
        expect(section.children.length).toBe(3);

        const child1 = result.nodeMap.get(section.children[0])!;
        const child2 = result.nodeMap.get(section.children[1])!;
        const child3 = result.nodeMap.get(section.children[2])!;

        // 2. Verify Types
        expect(child1.type).toBe('DEFINITION');
        expect(child1.content[0]).toContain("Contractor:");

        expect(child2.type).toBe('DEFINITION');
        expect(child2.content[0]).toContain("Owner:");

        expect(child3.type).toBe('SUBSECTION'); // Standard (1)
    });

    it('should generate semantic URNs for definitions', async () => {
        // 1. Run Parser
        const result = await IngestParsePdfAsync(mockLines, job);
        
        // 2. Run GraphRepo Transformation (which generates URNs)
        const db = new MockDbClient();
        const repo = new GraphNodeRepo(db);
        
        await repo.commitParseResult(result, 'MA', 'test_corpus', new Map(), 'job-1');

        const records = db.storedRecords;

        // 3. Verify URNs
        const contractorNode = records.find(r => r.content_text.includes("Contractor:"));
        const ownerNode = records.find(r => r.content_text.includes("Owner:"));

        // Expected: urn:lex:ma:test_corpus:10_01:contractor
        expect(contractorNode?.urn).toContain(':contractor');
        expect(contractorNode?.urn).not.toContain('_a1b2'); // Should not be a hash

        // Expected: urn:lex:ma:test_corpus:10_01:owner
        expect(ownerNode?.urn).toContain(':owner');
    });
});