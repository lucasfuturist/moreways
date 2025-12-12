import { ParseResult, ProcessingNode } from '../../ingest/schema/ingest.schema.pdfInput';
import { LegalNodeRecord } from '../schema/graph.schema.nodes';

export interface IDatabaseClient {
  bulkInsertNodes(records: LegalNodeRecord[]): Promise<void>;
  fetchActiveNodes(urns: string[]): Promise<LegalNodeRecord[]>;
  expireNodes(ids: string[], expiryDate: string): Promise<void>;
}

export class GraphNodeRepo {
  constructor(private readonly db: IDatabaseClient) {}

  public async commitParseResult(
    result: ParseResult, 
    jurisdiction: 'MA' | 'FED',
    corpus: string, 
    enrichmentData: Map<string, { embedding?: number[], summary?: any }>,
    sourceJobId: string
  ): Promise<void> {
    
    const root = result.nodeMap.get(result.rootId);
    if (!root) throw new Error("Root node not found in map");

    // 1. Transform
    const newRecords: LegalNodeRecord[] = [];
    this.transformNodeRecursive(root, result.nodeMap, newRecords, jurisdiction, corpus, '', '', enrichmentData, sourceJobId);

    console.log(`[GraphRepo] Processing ${newRecords.length} nodes for SCD...`);

    // 2. [SCD] Fetch existing active state
    const urns = newRecords.map(r => r.urn);
    const existingNodes = await this.db.fetchActiveNodes(urns);
    const existingMap = new Map(existingNodes.map(n => [n.urn, n]));

    const nodesToInsert: LegalNodeRecord[] = [];
    const idsToExpire: string[] = [];

    // 3. [SCD] Calculate Deltas
    for (const newRec of newRecords) {
      const oldRec = existingMap.get(newRec.urn);

      if (!oldRec) {
        nodesToInsert.push(newRec);
      } else if (oldRec.content_text !== newRec.content_text) {
        idsToExpire.push(oldRec.id);
        nodesToInsert.push(newRec);
      }
    }

    // 4. Execute Transactions
    if (idsToExpire.length > 0) {
      console.log(`[GraphRepo] Expiring ${idsToExpire.length} stale nodes...`);
      await this.db.expireNodes(idsToExpire, new Date().toISOString());
    }

    if (nodesToInsert.length > 0) {
      console.log(`[GraphRepo] Inserting ${nodesToInsert.length} new/updated nodes...`);
      await this.db.bulkInsertNodes(nodesToInsert);
    }

    console.log(`[GraphRepo] Commit complete.`);
  }

  private transformNodeRecursive(
    node: ProcessingNode,
    map: Map<string, ProcessingNode>,
    accumulator: LegalNodeRecord[],
    jurisdiction: string,
    corpus: string,
    parentPath: string, 
    parentUrn: string, 
    enrichmentData: Map<string, { embedding?: number[], summary?: any }>,
    sourceJobId: string
  ): void {
    
    const segment = this.generatePathSegment(node);
    
    // Path logic: "root.part_1.section_5" (Ltree uses dots)
    const currentPath = parentPath ? `${parentPath}.${segment}` : segment;

    let currentUrn = '';
    
    if (node.type === 'ROOT') {
        currentUrn = `urn:lex:${jurisdiction.toLowerCase()}:${corpus.toLowerCase()}`;
    } else {
        // [CRITICAL FIX] Strict Hierarchical Construction
        // We append to the FULL parent URN, not a base
        currentUrn = `${parentUrn}:${segment}`;
    }

    // [SAFETY] Internal Collision Check
    const collision = accumulator.find(r => r.urn === currentUrn);
    if (collision) {
        console.warn(`[GraphRepo] ⚠️ Duplicate URN detected: ${currentUrn}. Appending unique hash.`);
        currentUrn = `${currentUrn}_${node.tempId.substring(0, 4)}`;
    }

    const enriched = enrichmentData.get(node.tempId) || {};

    const record: LegalNodeRecord = {
      // [FIX] Use the parser's tempId so that parentId references remain valid
      id: node.tempId, 
      urn: currentUrn,
      jurisdiction: jurisdiction as 'MA' | 'FED',
      citation_path: currentPath,
      parentId: node.parentId,
      content_text: node.content.join('\n'),
      structure_type: node.type,
      embedding: enriched.embedding,
      logic_summary: enriched.summary,
      validity_range: `[${new Date().toISOString().split('T')[0]},)`, 
      source_job_id: sourceJobId,
      page_number: node.location.pageStart,
      bbox: node.location.startBbox
    };

    accumulator.push(record);

    for (const childId of node.children) {
      const childNode = map.get(childId);
      if (childNode) {
        // Pass 'currentUrn' as the parent for the next level
        this.transformNodeRecursive(childNode, map, accumulator, jurisdiction, corpus, currentPath, currentUrn, enrichmentData, sourceJobId);
      }
    }
  }

  private generatePathSegment(node: ProcessingNode): string {
    if (node.type === 'ROOT') return 'root';
    
    const text = node.content[0] || '';
    let rawSegment = '';
    
    // [NEW] 0. Handle Definitions (Explicit Term Extraction)
    // Input: "Contractor: means a person..." -> Output: "contractor"
    if (node.type === 'DEFINITION') {
        const match = text.match(/^\s*([A-Z][a-zA-Z0-9\s\-\/]{1,50}):/);
        if (match) {
            return this.sanitizeSegment(match[1]);
        }
    }

    // 1. Precise Match (3.00, 310.4)
    const decimalMatch = text.match(/(?:CMR\s+|CFR\s+|§\s*)?(\d+\.\d+)/i);
    if (decimalMatch) {
       rawSegment = decimalMatch[1];
    }
    // 2. Named Sections (Section 5, Article 2, Public Law 111)
    else if (text.match(/^(Section|Part|Article|Chapter|Public Law|Pub\.? L\.?)\s*(\d+[\w-]*)/i)) {
        const integerMatch = text.match(/^(Section|Part|Article|Chapter|Public Law|Pub\.? L\.?)\s*(\d+[\w-]*)/i)!;
        const label = integerMatch[1].toLowerCase();
        rawSegment = `${label}_${integerMatch[2]}`;
    }
    // 3. List Items ((a), (1))
    else if (text.match(/^(\(?\w+\)?|\d+\.)/)) {
        const listMatch = text.match(/^(\(?\w+\)?|\d+\.)/)!;
        rawSegment = listMatch[1].replace(/[\(\)\.]/g, '').toLowerCase();
    }
    // 4. Fallback
    else {
        rawSegment = `${node.type.toLowerCase()}_${node.tempId.substring(0, 4)}`;
    }

    return this.sanitizeSegment(rawSegment);
  }

  private sanitizeSegment(input: string): string {
      return input.trim()
        .toLowerCase()
        .replace(/[\.\s-]/g, '_')      // Spaces/dots to underscores
        .replace(/[^a-z0-9_]/g, '')    // Remove special chars
        .replace(/_+/g, '_')           // Dedupe underscores
        .replace(/^_|_$/g, '');        // Trim underscores
  }
}