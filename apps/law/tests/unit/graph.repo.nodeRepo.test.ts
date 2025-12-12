import { describe, it, expect } from 'vitest';
import { GraphNodeRepo } from '../../src/graph/repo/graph.repo.nodeRepo';
import { MockDbClient } from '../mocks/db.mock';
import { ParseResult, ProcessingNode } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

describe('Graph Repo - Transformer Logic', () => {
    
    it('should generate deterministic Ltree paths and URNs', async () => {
        const mockDb = new MockDbClient();
        const repo = new GraphNodeRepo(mockDb);

        const rootId = uuidv4();
        const secId = uuidv4();
        const subId = uuidv4();

        const nodeMap = new Map<string, ProcessingNode>();
        
        nodeMap.set(rootId, {
            tempId: rootId, type: 'ROOT', content: [], depth: 0,
            children: [secId], parentId: null,
            location: { pageStart: 1, pageEnd: 1, startBbox: [0,0,0,0] }
        });

        nodeMap.set(secId, {
            tempId: secId, type: 'SECTION', content: ["3.17: Landlord Tenant"], depth: 1,
            children: [subId], parentId: rootId,
            location: { pageStart: 1, pageEnd: 1, startBbox: [0,0,0,0] }
        });

        nodeMap.set(subId, {
            tempId: subId, type: 'SUBSECTION', content: ["(1) Conditions."], depth: 2,
            children: [], parentId: secId,
            location: { pageStart: 1, pageEnd: 1, startBbox: [0,0,0,0] }
        });

        const parseResult: ParseResult = { rootId, nodeMap };

        await repo.commitParseResult(parseResult, 'MA', 'test_corpus', new Map(), 'job-123');

        const records = mockDb.storedRecords;
        
        // 1. Verify Section Path
        // URN: urn:lex:ma:test_corpus:3_17
        const secRecord = records.find(r => r.urn === 'urn:lex:ma:test_corpus:3_17');
        expect(secRecord).toBeDefined();
        expect(secRecord?.citation_path).toBe('root.3_17'); 
        
        // 2. Verify Subsection Path
        // URN: urn:lex:ma:test_corpus:3_17:1
        const subRecord = records.find(r => r.urn === 'urn:lex:ma:test_corpus:3_17:1');
        expect(subRecord).toBeDefined();
        expect(subRecord?.citation_path).toBe('root.3_17.1'); 
    });

    it('should prevent URN collisions for identical siblings', async () => {
        const mockDb = new MockDbClient();
        const repo = new GraphNodeRepo(mockDb);

        // Scenario: Two paragraphs labeled "(a)" inside the same Section
        const rootId = uuidv4();
        const secId = uuidv4();
        const para1 = uuidv4();
        const para2 = uuidv4(); // Identical label

        const nodeMap = new Map<string, ProcessingNode>();
        
        nodeMap.set(rootId, {
            tempId: rootId, type: 'ROOT', content: [], depth: 0,
            children: [secId], parentId: null, location: { pageStart: 1, pageEnd: 1, startBbox: [0,0,0,0] }
        });

        nodeMap.set(secId, {
            tempId: secId, type: 'SECTION', content: ["Section 1"], depth: 1,
            children: [para1, para2], parentId: rootId, location: { pageStart: 1, pageEnd: 1, startBbox: [0,0,0,0] }
        });

        nodeMap.set(para1, {
            tempId: para1, type: 'PARAGRAPH', content: ["(a) First"], depth: 2,
            children: [], parentId: secId, location: { pageStart: 1, pageEnd: 1, startBbox: [0,0,0,0] }
        });

        nodeMap.set(para2, {
            tempId: para2, type: 'PARAGRAPH', content: ["(a) Second (Duplicate)"], depth: 2,
            children: [], parentId: secId, location: { pageStart: 1, pageEnd: 1, startBbox: [0,0,0,0] }
        });

        await repo.commitParseResult({ rootId, nodeMap }, 'MA', 'collision_test', new Map(), 'job-123');

        const records = mockDb.storedRecords;
        const paraNodes = records.filter(r => r.structure_type === 'PARAGRAPH');

        expect(paraNodes.length).toBe(2);
        
        // They should have different URNs
        expect(paraNodes[0].urn).not.toBe(paraNodes[1].urn);
        
        // One should have the fallback hash appended
        // Expected format: urn:lex:ma:collision_test:section_1:a_abcd
        const hasSuffix = paraNodes.some(p => p.urn.match(/_[a-f0-9-]{4}$/));
        expect(hasSuffix).toBe(true);
    });
});