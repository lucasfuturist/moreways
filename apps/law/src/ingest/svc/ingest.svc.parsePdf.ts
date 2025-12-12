import { v4 as uuidv4 } from 'uuid';
import { 
  RawPdfLine, 
  ProcessingNode, 
  NodeType, 
  IngestJob, 
  ParseResult 
} from '../schema/ingest.schema.pdfInput';
import { getProfileForJurisdiction, RegexProfile } from '../util/ingest.util.regexProfiles';
import { isHeaderFooter, sanitizeText } from '../util/ingest.util.sanitizer';

function createRootNode(jobId: string): ProcessingNode {
  return {
    tempId: uuidv4(),
    content: [],
    type: 'ROOT',
    depth: 0,
    location: {
      pageStart: 1,
      pageEnd: 1,
      startBbox: [0, 0, 0, 0]
    },
    children: [],
    parentId: null,
    urn: `urn:lex:temp:${jobId}:root`
  };
}

export async function IngestParsePdfAsync(
  lines: RawPdfLine[], 
  job: IngestJob
): Promise<ParseResult> {
  
  const root = createRootNode(job.jobId);
  const stack: ProcessingNode[] = [root];
  
  const nodeMap = new Map<string, ProcessingNode>();
  nodeMap.set(root.tempId, root);

  const profile = getProfileForJurisdiction(job.jurisdiction);

  for (const line of lines) {
    if (isHeaderFooter(line)) continue;

    const cleanText = sanitizeText(line.text);
    if (!cleanText) continue;

    const detectedLevel = detectLevel(cleanText, profile);

    if (detectedLevel) {
      // --- NEW NODE ---
      // Pop stack until we find a parent with strictly lower depth (higher up in hierarchy)
      while (stack.length > 1 && stack[stack.length - 1].depth >= detectedLevel.depth) {
        stack.pop();
      }

      let parent = stack[stack.length - 1];

      // [FIX] ORPHAN GUARD
      // If we are about to attach a deep node (e.g. PARAGRAPH) directly to ROOT,
      // it means we missed the Header. We must create a "Phantom Section" to hold it.
      if (parent.type === 'ROOT' && detectedLevel.depth > 1) {
          // console.warn(`[Parser] Orphan detected: "${cleanText}". Creating Phantom Parent.`);
          
          const phantom: ProcessingNode = {
              tempId: uuidv4(),
              content: ["(General Provisions / Preamble)"],
              type: 'SECTION', // Force it to be a Section
              depth: 1,        // Depth 1
              location: parent.location, // Inherit location
              children: [],
              parentId: parent.tempId
          };
          
          parent.children.push(phantom.tempId);
          nodeMap.set(phantom.tempId, phantom);
          stack.push(phantom); // Push phantom so the new node attaches to IT
          parent = phantom;    // Update reference
      }

      validateIndentation(parent, line);

      const newNode: ProcessingNode = {
        tempId: uuidv4(),
        content: [cleanText],
        type: detectedLevel.type,
        depth: detectedLevel.depth,
        location: {
          pageStart: line.pageNumber,
          pageEnd: line.pageNumber,
          startBbox: line.bbox
        },
        children: [],
        parentId: parent.tempId
      };

      parent.children.push(newNode.tempId);
      nodeMap.set(newNode.tempId, newNode);
      stack.push(newNode);

    } else {
      // --- CONTINUATION ---
      const activeNode = stack[stack.length - 1];
      activeNode.content.push(cleanText);
      if (line.pageNumber > activeNode.location.pageEnd) {
        activeNode.location.pageEnd = line.pageNumber;
      }
    }
  }

  // --- THE GHOST BUSTER (Deduplication & Garbage Collection) ---
  pruneGhostNodes(root, nodeMap);

  return {
    rootId: root.tempId,
    nodeMap: nodeMap
  };
}

/**
 * Removes "Ghost Nodes" created by Table of Contents.
 * Logic: If multiple siblings have the same Citation Number (e.g. "3.17"),
 * keep the one with children or more content. Delete the others AND their descendants.
 */
function pruneGhostNodes(root: ProcessingNode, map: Map<string, ProcessingNode>) {
  
  // 1. Group children by their "Citation Key"
  const citationMap = new Map<string, string[]>(); // Key -> [NodeIds]
  
  for (const childId of root.children) {
    const node = map.get(childId);
    if (!node) continue;

    const text = node.content[0] || "";
    let key = `ID_${childId}`; // Default to unique

    // A. Try matching Section Number (e.g. "3.17", "310.4", "64.1200")
    const sectionMatch = text.match(/(?:§\s*|Section\s*|CMR\s+)?(\d+\.\d+)/i);
    
    // B. Try matching Federal Part (e.g. "Part 310")
    const partMatch = text.match(/^Part\s+(\d+)/i);

    if (sectionMatch) {
        key = `SEC_${sectionMatch[1]}`;
    } else if (partMatch) {
        key = `PART_${partMatch[1]}`;
    }

    if (!citationMap.has(key)) citationMap.set(key, []);
    citationMap.get(key)!.push(childId);
  }

  // 2. Resolve Duplicates
  const newChildrenList: string[] = [];

  for (const [key, nodeIds] of citationMap) {
    if (nodeIds.length === 1) {
      newChildrenList.push(nodeIds[0]);
      continue;
    }

    // DUPLICATE DETECTED
    // Winner = Node with most children, tie-break by content length
    let winnerId = nodeIds[0];
    let maxScore = -1;

    for (const id of nodeIds) {
      const n = map.get(id)!;
      // Heuristic: Children are worth 1000 pts, characters worth 1 pt
      const score = (n.children.length * 1000) + n.content.join('').length;
      
      if (score > maxScore) {
        maxScore = score;
        winnerId = id;
      }
    }

    // Keep Winner
    newChildrenList.push(winnerId);

    // Delete Losers AND THEIR CHILDREN (Fixes Linter Orphans)
    for (const id of nodeIds) {
      if (id !== winnerId) {
        recursiveDelete(id, map);
      }
    }
  }

  // 3. Update Root
  root.children = newChildrenList;
}

/**
 * Recursively removes a node and all its children from the map.
 */
function recursiveDelete(nodeId: string, map: Map<string, ProcessingNode>) {
    const node = map.get(nodeId);
    if (!node) return;

    // 1. Recurse first (Depth-first deletion)
    for (const childId of node.children) {
        recursiveDelete(childId, map);
    }

    // 2. Delete self
    map.delete(nodeId);
}

function detectLevel(
  text: string, 
  profile: RegexProfile
): { type: NodeType, depth: number } | null {
  for (const rule of profile) {
    if (rule.regex.test(text)) {
      return { type: rule.name as NodeType, depth: rule.depth };
    }
  }
  return null;
}

function validateIndentation(parent: ProcessingNode, childLine: RawPdfLine): void {
  if (parent.type === 'ROOT') return;
  if (['PART', 'SUBPARAGRAPH'].includes(parent.type)) return;

  const parentX = parent.location.startBbox[0];
  const childX = childLine.bbox[0];
  const TOLERANCE = 0.5; 

  if (childX < (parentX - TOLERANCE)) {
    // console.warn(`[VISUAL_DISSONANCE] Node "${childLine.text.substring(0, 20)}..." (x=${childX}) is significantly left of parent "${parent.content[0]?.substring(0, 20)}..." (x=${parentX})`);
  }
}