import { z } from 'zod';

// [RED FLAG 1] Visual-Logical Dissonance Mitigation
// We strictly type the Bounding Box to allow coordinate-based logic later.
// Format: [x, y, width, height]
export const BoundingBoxSchema = z.tuple([
  z.number(), 
  z.number(), 
  z.number(), 
  z.number()
]);

export type BoundingBox = z.infer<typeof BoundingBoxSchema>;

// The Raw Line as it comes from the OCR provider (e.g., Azure Doc Intel)
export const RawPdfLineSchema = z.object({
  text: z.string(),
  pageNumber: z.number().int().min(1),
  bbox: BoundingBoxSchema,
  confidence: z.number().min(0).max(1).optional(),
  isHandwritten: z.boolean().optional(), 
});

export type RawPdfLine = z.infer<typeof RawPdfLineSchema>;

// The core Enum for our Graph Hierarchy
// [FIX] Added 'ITEM' and 'DEFINITION'
export const NodeTypeSchema = z.enum([
  'ROOT',
  'PART',       
  'SECTION',    
  'SUBSECTION', 
  'PARAGRAPH',  
  'SUBPARAGRAPH',
  'CLAUSE',     
  'NOTE',       
  'APPENDIX',
  'ITEM',
  'DEFINITION' 
]);

export type NodeType = z.infer<typeof NodeTypeSchema>;

// The "Intermediate Node"
export const ProcessingNodeSchema = z.object({
  tempId: z.string().uuid(),
  content: z.array(z.string()), // Accumulates lines of text
  type: NodeTypeSchema,
  depth: z.number().int(),    
  
  // [RED FLAG 1] Spatial Provenance
  location: z.object({
    pageStart: z.number(),
    pageEnd: z.number(),
    startBbox: BoundingBoxSchema,
  }),

  children: z.array(z.string().uuid()), // Array of IDs
  parentId: z.string().uuid().nullable(),
  urn: z.string().optional(),
});

export type ProcessingNode = z.infer<typeof ProcessingNodeSchema>;

// [NEW] Robust Return Type
export interface ParseResult {
  rootId: string;
  // O(1) Lookup Map for all nodes in the tree
  nodeMap: Map<string, ProcessingNode>;
}

// Job Metadata
export const IngestJobSchema = z.object({
  jobId: z.string().uuid(),
  sourceUrl: z.string().url(),
  jurisdiction: z.enum(['MA', 'FED']),
  corpus: z.string(), 
  documentType: z.literal('CONSOLIDATED_REGULATION'),
});

export type IngestJob = z.infer<typeof IngestJobSchema>;