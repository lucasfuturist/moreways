import { describe, it, expect } from 'vitest';
import { GraphNodeRepo } from '../../src/graph/repo/graph.repo.nodeRepo';
import { MockDbClient } from '../mocks/db.mock'; // [FIX] New Import
import { ParseResult, ProcessingNode } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

function createMockParse(urnSuffix: string, text: string): ParseResult {
    const rootId = uuidv4();
    const childId = uuidv4();
    
    const map = new Map<string, ProcessingNode>();
    
    // Root
    map.set(rootId, {
        tempId: rootId, type: 'ROOT', content: [], depth: 0,
        children: [childId], parentId: null,
        location: { pageStart: 1, pageEnd: 1, startBbox: [0,0,0,0] }
    });

    // Child
    map.set(childId, {
        tempId: childId, type: 'SECTION', content: [text], depth: 1,
        children: [], parentId: rootId,
        location: { pageStart: 1, pageEnd: 1, startBbox: [0,0,0,0] }
    });

    return { rootId, nodeMap: map };
}

describe('Graph Repo - SCD Type 2 (Time Travel)', () => {
    
    it('should expire old nodes and insert new ones when content changes', async () => {
        const db = new MockDbClient();
        const repo = new GraphNodeRepo(db);

        // 1. Ingest Version 1
        const v1 = createMockParse('sec1', '3.00: Original Text');
        // [FIX] Pass corpus 'scd' and mock job id
        await repo.commitParseResult(v1, 'MA', 'scd', new Map(), 'job-v1');

        expect(db.storedRecords.length).toBe(2); 
        const originalNode = db.storedRecords.find(n => n.content_text.includes('Original'))!;
        expect(originalNode.validity_range).toContain(',)'); 

        // 2. Ingest Version 2 (Changed Content)
        const v2 = createMockParse('sec1', '3.00: Amended Text');
        await repo.commitParseResult(v2, 'MA', 'scd', new Map(), 'job-v2');

        // Assertions
        // [FIX] Update URN lookup
        const activeNodes = await db.fetchActiveNodes(['urn:lex:ma:scd:3_00']);
        
        expect(activeNodes.length).toBe(1);
        expect(activeNodes[0].content_text).toContain('Amended');

        const allVersions = db.storedRecords.filter(n => n.urn === 'urn:lex:ma:scd:3_00');
        expect(allVersions.length).toBe(2);
        
        const oldVersion = allVersions.find(n => n.content_text.includes('Original'))!;
        expect(oldVersion.validity_range).not.toContain(',)'); 
    });

    it('should be idempotent (do nothing) if content is identical', async () => {
        const db = new MockDbClient();
        const repo = new GraphNodeRepo(db);

        // 1. Ingest
        const v1 = createMockParse('sec1', '3.00: Same Text');
        await repo.commitParseResult(v1, 'MA', 'scd', new Map(), 'job-v1');
        const countAfterFirst = db.storedRecords.length;

        // 2. Re-Ingest Same Data
        // Use different job ID to simulate new run, but same content
        await repo.commitParseResult(v1, 'MA', 'scd', new Map(), 'job-v2');
        const countAfterSecond = db.storedRecords.length;

        expect(countAfterSecond).toBe(countAfterFirst); 
    });
});