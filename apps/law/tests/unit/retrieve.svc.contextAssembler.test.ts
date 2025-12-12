import { describe, it, expect } from 'vitest';
import { ContextAssembler, MockGraphReader } from '../../src/retrieve/svc/retrieve.svc.contextAssembler';
import { MockOverrideRepo } from '../../src/graph/repo/graph.repo.overrideRepo';
import { LegalNodeRecord } from '../../src/graph/schema/graph.schema.nodes';
import { v4 as uuidv4 } from 'uuid';

const mockRecord = (urn: string, path: string, type: any, text: string, parentId: string | null = null): LegalNodeRecord => ({
    id: uuidv4(),
    urn,
    citation_path: path,
    structure_type: type,
    content_text: text,
    parentId,
    jurisdiction: 'MA',
    source_job_id: uuidv4(),
    page_number: 1,
    bbox: [0,0,0,0],
    validity_range: '[2024-01-01,)'
});

describe('Retrieval Service - Context Assembler', () => {
    
    it('should assemble vertical ancestry and scoped definitions', async () => {
        const root = mockRecord('urn:root', 'root', 'ROOT', 'Root');
        // [FIX] Changed "Definitions" to "General" to prevent the Section node 
        // from being flagged as a definition itself by the simple mock logic.
        const section = mockRecord('urn:sec', 'root.sec', 'SECTION', 'Section 1. General', root.id);
        const defNode = mockRecord('urn:def', 'root.sec.def', 'SUBSECTION', 'Definition: "Owner" means...', section.id);
        const ruleNode = mockRecord('urn:rule', 'root.sec.rule', 'PARAGRAPH', 'The Owner must pay...', section.id);

        const db = [root, section, defNode, ruleNode];
        const reader = new MockGraphReader(db);
        const overrideRepo = new MockOverrideRepo();
        
        const assembler = new ContextAssembler(reader, overrideRepo);

        const context = await assembler.assembleContext('urn:rule');

        expect(context.targetNode.urn).toBe('urn:rule');
        expect(context.ancestry.length).toBe(2);
        
        // Should only return the Subsection (defNode), not the Section itself
        expect(context.definitions.length).toBe(1);
        expect(context.definitions[0].content_text).toContain('"Owner" means');
    });
});