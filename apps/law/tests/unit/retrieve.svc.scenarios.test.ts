import { describe, it, expect } from 'vitest';
import { ContextAssembler, IGraphReader } from '../../src/retrieve/svc/retrieve.svc.contextAssembler';
import { MockOverrideRepo } from '../../src/graph/repo/graph.repo.overrideRepo'; // [NEW]
import { LegalNodeRecord } from '../../src/graph/schema/graph.schema.nodes';
import { v4 as uuidv4 } from 'uuid';

// ... (GraphBuilder and SmartMockReader classes remain unchanged) ...
class GraphBuilder {
  private nodes: LegalNodeRecord[] = [];
  private rootId: string = '';

  addRoot(): this {
    const id = uuidv4();
    this.rootId = id;
    this.nodes.push(this.makeNode(id, 'ROOT', 'urn:root', 'root', null));
    return this;
  }

  addSection(alias: string, parentAlias: string | 'ROOT'): this {
    const parent = this.find(parentAlias === 'ROOT' ? this.rootId : parentAlias);
    const id = uuidv4();
    const path = `${parent.citation_path}.${alias}`; 
    this.nodes.push(this.makeNode(id, 'SECTION', `urn:sec:${alias}`, path, parent.id, alias));
    return this;
  }

  addDef(alias: string, parentAlias: string, text: string): this {
    const parent = this.find(parentAlias);
    const id = uuidv4();
    const path = `${parent.citation_path}.${alias}`;
    const node = this.makeNode(id, 'SUBSECTION', `urn:def:${alias}`, path, parent.id);
    node.content_text = `(1) Definition: ${text}`;
    this.nodes.push(node);
    return this;
  }

  addNode(alias: string, type: 'PARAGRAPH' | 'SUBSECTION', parentAlias: string, text: string = ''): this {
    const parent = this.find(parentAlias);
    const id = uuidv4();
    const path = `${parent.citation_path}.${alias}`;
    const node = this.makeNode(id, type, `urn:node:${alias}`, path, parent.id);
    node.content_text = text;
    this.nodes.push(node);
    return this;
  }

  build(): LegalNodeRecord[] {
    return this.nodes;
  }

  private find(idOrAlias: string): LegalNodeRecord {
    const n = this.nodes.find(n => n.id === idOrAlias || n.urn.endsWith(`:${idOrAlias}`));
    if (!n) throw new Error(`Builder Error: Parent '${idOrAlias}' not found.`);
    return n;
  }

  private makeNode(id: string, type: any, urn: string, path: string, parentId: string | null, alias?: string): LegalNodeRecord {
    return {
      id,
      urn,
      citation_path: path,
      parentId,
      content_text: alias || type,
      structure_type: type,
      jurisdiction: 'MA',
      validity_range: '[2020-01-01,)',
      source_job_id: uuidv4(),
      page_number: 1,
      bbox: [0,0,0,0]
    };
  }
}

class SmartMockReader implements IGraphReader {
  constructor(private db: LegalNodeRecord[]) {}

  async getNodeByUrn(urn: string): Promise<LegalNodeRecord | null> {
    return this.db.find(n => n.urn === urn) || null;
  }

  async getAncestors(targetPath: string): Promise<LegalNodeRecord[]> {
    return this.db.filter(n => {
      if (n.citation_path === targetPath) return false;
      return targetPath.startsWith(n.citation_path + '.') || targetPath.startsWith(n.citation_path); 
    }).sort((a, b) => a.citation_path.length - b.citation_path.length);
  }

  async getScopedDefinitions(ancestorIds: string[]): Promise<LegalNodeRecord[]> {
    return this.db.filter(n => 
      n.parentId && ancestorIds.includes(n.parentId) && 
      n.content_text.includes("Definition")
    );
  }
}
// ...

describe('Retrieval Engine: Robustness Suite', () => {

  // ... (Previous Scenarios 1-3 remain same, assume they pass) ...
  it('SCENARIO 1: Scope Isolation (preventing definition leaks)', async () => {
    // ...
    const db = new GraphBuilder()
      .addRoot()
      .addSection('SecA', 'ROOT')
      .addDef('DefA', 'SecA', '"Interest" means 5%')
      .addSection('SecB', 'ROOT')
      .addNode('Target', 'PARAGRAPH', 'SecB', 'User Query Target')
      .build();
    const assembler = new ContextAssembler(new SmartMockReader(db), new MockOverrideRepo());
    const context = await assembler.assembleContext('urn:node:Target');
    const leakedDef = context.definitions.find(d => d.content_text.includes("Interest"));
    expect(leakedDef).toBeUndefined();
  });

  it('SCENARIO 2: Deep Hierarchy Resolution', async () => {
     // ...
     const db = new GraphBuilder()
      .addRoot()
      .addSection('Part1', 'ROOT')
      .addSection('Sec1', 'Part1')
      .addNode('Sub1', 'SUBSECTION', 'Sec1')
      .addNode('Para1', 'PARAGRAPH', 'Sub1')
      .addNode('Target', 'PARAGRAPH', 'Para1', 'Deep Target')
      .build();
    const assembler = new ContextAssembler(new SmartMockReader(db), new MockOverrideRepo());
    const context = await assembler.assembleContext('urn:node:Target');
    expect(context.ancestry.length).toBe(5);
  });

  it('SCENARIO 3: Broken Chain (Missing Parent Record)', async () => {
     // ...
     const db = new GraphBuilder()
      .addRoot()
      .addSection('Sec1', 'ROOT')
      .addNode('Target', 'PARAGRAPH', 'Sec1')
      .build();
    const brokenDb = db.filter(n => n.urn !== 'urn:sec:Sec1');
    const assembler = new ContextAssembler(new SmartMockReader(brokenDb), new MockOverrideRepo());
    const context = await assembler.assembleContext('urn:node:Target');
    expect(context.ancestry.length).toBe(1);
  });

  // [UPDATED SCENARIO 4]
  it('SCENARIO 4: Safety Override (Judicial Review - Pattern Matching)', async () => {
    const db = new GraphBuilder()
      .addRoot()
      .addSection('Sec1', 'ROOT')
      .addNode('Target', 'PARAGRAPH', 'Sec1', 'Standard text.')
      .build();

    const overrideRepo = new MockOverrideRepo();
    
    // Safety Rule: Enjoin the entire section 1 (urn:sec:Sec1)
    // The target (urn:node:Target) is a child, so checking ancestry should trigger the alert?
    // Wait, getOverrides logic in repo uses URN matching.
    // If we define override for "urn:sec:Sec1", direct lookup on "urn:node:Target" won't match.
    // BUT ContextAssembler checks ancestry! 
    // Ancestry of Target is [Root, Sec1]. Sec1 matches.
    
    overrideRepo.addOverride({
        urn_pattern: 'urn:sec:Sec1',
        type: 'ENJOINED',
        court_citation: 'Supreme Court v. Bad Law',
        message: 'This section is unconstitutional.',
        severity: 'CRITICAL'
    });

    const assembler = new ContextAssembler(new SmartMockReader(db), overrideRepo);
    const context = await assembler.assembleContext('urn:node:Target');

    expect(context.alerts.length).toBeGreaterThan(0);
    expect(context.alerts[0].type).toBe('OVERRIDE');
    expect(context.alerts[0].message).toContain('unconstitutional');
  });

  // [NEW SCENARIO]
  it('SCENARIO 5: Preemption via Wildcard', async () => {
      const db = new GraphBuilder()
        .addRoot()
        .addSection('Sec1', 'ROOT')
        .addNode('Target', 'PARAGRAPH', 'Sec1', 'Robocall limit 5.')
        .build();

      const overrideRepo = new MockOverrideRepo();
      // Wildcard: Enjoin everything in the section
      overrideRepo.addOverride({
          urn_pattern: 'urn:node:*', 
          type: 'PREEMPTED',
          court_citation: 'FCC Ruling',
          message: 'Federal Preemption',
          severity: 'WARNING'
      });

      const assembler = new ContextAssembler(new SmartMockReader(db), overrideRepo);
      const context = await assembler.assembleContext('urn:node:Target');

      expect(context.alerts[0].type).toBe('PREEMPTION');
  });

});