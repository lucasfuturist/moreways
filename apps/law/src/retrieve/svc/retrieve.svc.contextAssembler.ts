import { LegalNodeRecord } from '../../graph/schema/graph.schema.nodes';
import { ScopedContext } from '../schema/retrieve.schema.context';
import { IOverrideRepo } from '../../graph/repo/graph.repo.overrideRepo';

export interface IGraphReader {
  getNodeByUrn(urn: string): Promise<LegalNodeRecord | null>;
  getAncestors(path: string, targetUrn?: string): Promise<LegalNodeRecord[]>;
  getChildren(path: string): Promise<LegalNodeRecord[]>; 
  getSiblings(citationPath: string, targetUrn: string): Promise<LegalNodeRecord[]>;
  getScopedDefinitions(ancestorIds: string[]): Promise<LegalNodeRecord[]>;
}

export class ContextAssembler {
  constructor(
    private readonly reader: IGraphReader,
    private readonly overrideRepo: IOverrideRepo
  ) {}

  public async assembleContext(targetUrn: string): Promise<ScopedContext> {
    // 1. Fetch Target
    const target = await this.reader.getNodeByUrn(targetUrn);
    if (!target) throw new Error(`Node not found: ${targetUrn}`);

    // 2. Fetch Ancestry (The Chain of Command)
    const ancestry = await this.reader.getAncestors(target.citation_path, target.urn);

    // 3. [STRATEGY SHIFT] Aggressive Expansion (The "Generous" Approach)
    // Instead of checking types, we grab everything around the node.
    // If the parser messed up and put text in a sibling or child, we capture it here.
    
    // A. Grab all Children (Deep Context)
    const children = await this.reader.getChildren(target.citation_path);

    // B. Grab all Siblings (Lateral Context)
    // This fixes cases where "Section 7.04" was parsed as a sibling text block of "7.03"
    let siblings: LegalNodeRecord[] = [];
    
    // Guard: Don't fetch siblings for ROOT nodes (would fetch entire corpus)
    if (target.citation_path.split('.').length > 2) {
        siblings = await this.reader.getSiblings(target.citation_path, target.urn);
    }

    // 4. Resolve Definitions
    const ancestorIds = ancestry.map(n => n.id);
    const rawDefinitions = await this.reader.getScopedDefinitions(ancestorIds);
    
    // 5. Safety Checks
    const alerts: ScopedContext['alerts'] = [];
    const directOverrides = await this.overrideRepo.getOverrides(targetUrn);
    const ancestorOverrides = await Promise.all(
        ancestry.map(a => this.overrideRepo.getOverrides(a.urn))
    );

    const allOverrides = [...directOverrides, ...ancestorOverrides.flat()];

    allOverrides.forEach(o => {
        alerts.push({
            type: o.type === 'PREEMPTED' ? 'PREEMPTION' : 'OVERRIDE',
            message: `${o.type}: ${o.message} (Cite: ${o.court_citation})`,
            severity: o.severity
        });
    });

    // 6. De-Duplication
    // Since siblings/children/ancestry might overlap or contain the target
    const nodeMap = new Map<string, LegalNodeRecord>();
    
    // Priority order: Target -> Children -> Siblings -> Ancestry
    [target, ...children, ...siblings, ...ancestry].forEach(n => {
        if (!nodeMap.has(n.id)) nodeMap.set(n.id, n);
    });

    // Remove self from the 'ancestry' list for the return object
    nodeMap.delete(target.id);

    return {
      targetNode: target,
      ancestry: Array.from(nodeMap.values()), // We return the whole blob as "ancestry/context"
      definitions: rawDefinitions,
      alerts
    };
  }
}