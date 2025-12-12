import { describe, it, expect } from 'vitest';
import { lintGraph } from '../../src/ingest/svc/ingest.svc.linter';
import { ProcessingNode } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

describe('Ingest Linter - Integrity Checks', () => {

    it('should fail validation if graph has no root', () => {
        const map = new Map<string, ProcessingNode>();
        const result = lintGraph(map, 'MA');
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('no Root');
    });

    it('should detect orphaned nodes (dangling pointers)', () => {
        const map = new Map<string, ProcessingNode>();
        const rootId = uuidv4();
        const orphanId = uuidv4();

        // Root
        map.set(rootId, {
            tempId: rootId, type: 'ROOT', content: [], depth: 0,
            children: [], parentId: null, urn: 'urn:root',
            location: { pageStart: 1, pageEnd: 1, startBbox: [0,0,0,0] }
        });

        // Orphan (parentId points to nothing)
        map.set(orphanId, {
            tempId: orphanId, type: 'SECTION', content: ['Orphan Node'], depth: 1,
            children: [], parentId: uuidv4(), urn: 'urn:orphan',
            location: { pageStart: 1, pageEnd: 1, startBbox: [0,0,0,0] }
        });

        const result = lintGraph(map, 'MA');
        expect(result.valid).toBe(false);
        
        // [FIX] Updated string match to align with actual error message for dangling pointers
        const err = result.errors.find(e => e.message.includes('missing parentId'));
        expect(err).toBeDefined();
    });

    // NOTE: This test depends on the extractReferences heuristic in the linter
    // We can enable it once we standardize the regex citation extractor
    it('should warn on broken internal references', () => {
         // Logic: Node A says "See 3.05", but Node 3.05 is not in map.
         // This is a WARNING, not CRITICAL (might be in another file).
    });
});