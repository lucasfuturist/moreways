import { ProcessingNode } from '../schema/ingest.schema.pdfInput';

export interface LintError {
    nodeId: string;
    urn: string | undefined;
    message: string;
    severity: 'WARNING' | 'CRITICAL';
}

export interface LintResult {
    valid: boolean;
    errors: LintError[];
}

/**
 * LINTER SERVICE
 * Verifies graph topology and internal reference integrity.
 */
export function lintGraph(nodeMap: Map<string, ProcessingNode>, jurisdiction: 'MA' | 'FED'): LintResult {
    const errors: LintError[] = [];
    
    // 1. Build Lookup Table (URN -> NodeID)
    const urnSet = new Set<string>();
    const nodes = Array.from(nodeMap.values());
    
    nodes.forEach(n => {
        if (n.urn) urnSet.add(n.urn);
    });

    // 2. Iterate all nodes
    for (const node of nodes) {
        
        // CHECK A: Topology & Orphans
        if (node.type !== 'ROOT') {
            if (!node.parentId) {
                // Case 1: Parent is explicitly null
                errors.push({
                    nodeId: node.tempId,
                    urn: node.urn,
                    message: "Node is an orphan (no parentId)",
                    severity: 'CRITICAL'
                });
            } else if (!nodeMap.has(node.parentId)) {
                // [FIX] Case 2: Parent ID exists but points to nothing (Dangling Pointer)
                errors.push({
                    nodeId: node.tempId,
                    urn: node.urn,
                    message: `Node references missing parentId: ${node.parentId}`,
                    severity: 'CRITICAL'
                });
            }
        }

        // CHECK B: Broken Internal References (Semantic)
        // We scan the content for things that look like citations in this jurisdiction
        const references = extractReferences(node.content.join(' '), jurisdiction);
        
        for (const refUrn of references) {
            if (!urnSet.has(refUrn)) {
                errors.push({
                    nodeId: node.tempId,
                    urn: node.urn,
                    message: `Broken Reference: Text cites '${refUrn}', but it does not exist in this graph.`,
                    severity: 'WARNING' // Warning because it might exist in a different file/job
                });
            }
        }
    }

    // 3. Root Count Check
    const roots = nodes.filter(n => n.type === 'ROOT');
    if (roots.length === 0) {
        errors.push({ nodeId: 'Global', urn: 'N/A', message: "Graph has no Root node", severity: 'CRITICAL' });
    } else if (roots.length > 1) {
        errors.push({ nodeId: 'Global', urn: 'N/A', message: "Graph has multiple Roots", severity: 'CRITICAL' });
    }

    return {
        valid: errors.filter(e => e.severity === 'CRITICAL').length === 0,
        errors
    };
}

/**
 * Heuristic extraction of citations from raw text.
 * e.g. "See 940 CMR 3.05" -> "urn:lex:ma:940cmr:3.05"
 * 
 * NOTE: This requires the URN construction logic to match the GraphRepo exactly.
 * For now, we simulate a basic extraction to prove the architecture.
 */
function extractReferences(text: string, jurisdiction: 'MA' | 'FED'): string[] {
    const found: string[] = [];
    
    if (jurisdiction === 'MA') {
        // Match "3.05" or "940 CMR 3.05"
        // Heuristic: look for digits.digits
        const matches = text.matchAll(/(?:see|refer to)\s+(?:940\s+CMR\s+)?(\d{1,3}\.\d{2})/gi);
        for (const m of matches) {
            const sectionNum = m[1].replace('.', '_'); // 3.05 -> 3_05
            // Construct the theoretical URN. 
            // In production, this needs access to the current corpus (940cmr).
            // Assuming current corpus for this "Robustness" demo:
            found.push(`urn:lex:ma:3_${sectionNum.split('_')[1]}`); // Approximate for demo
        }
    }
    
    return found;
}