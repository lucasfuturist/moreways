import { z } from 'zod';
import { NodeTypeSchema } from '../../ingest/schema/ingest.schema.pdfInput';

// [SPEC 02] Data Schema Update
export const LegalNodeRecordSchema = z.object({
  id: z.string().uuid(),
  urn: z.string(),
  jurisdiction: z.enum(['MA', 'FED']),
  citation_path: z.string(),
  parentId: z.string().uuid().nullable(),
  
  content_text: z.string(),
  structure_type: NodeTypeSchema,
  
  // [NEW] SEMANTIC FIELDS
  // 1536 dimensions is standard for OpenAI text-embedding-3-small
  embedding: z.array(z.number()).optional(), 
  
  // [NEW] LOGIC SUMMARY
  // Extracted by LLM: { "actor": "Landlord", "action": "Must pay interest", "exceptions": [...] }
  logic_summary: z.record(z.any()).optional(), 
  
  validity_range: z.string().default('[2000-01-01,)'),
  source_job_id: z.string().uuid(),
  page_number: z.number().int(),
  bbox: z.array(z.number()),
});

export type LegalNodeRecord = z.infer<typeof LegalNodeRecordSchema>;