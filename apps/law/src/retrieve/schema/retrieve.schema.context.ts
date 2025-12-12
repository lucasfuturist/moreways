import { z } from 'zod';
import { LegalNodeRecordSchema } from '../../graph/schema/graph.schema.nodes';

// [SPEC 04] The Context Object
// This is the payload we hand to the LLM to answer a user question.
export const ScopedContextSchema = z.object({
  // The specific node the user asked about (or that Vector Search found)
  targetNode: LegalNodeRecordSchema,
  
  // The Chain of Command (Root -> Part -> Section)
  ancestry: z.array(LegalNodeRecordSchema),
  
  // The Dictionary: specific definitions valid for this scope
  definitions: z.array(LegalNodeRecordSchema),
  
  // [SAFETY]
  // If the law is suspended or preempted
  alerts: z.array(z.object({
    type: z.enum(['OVERRIDE', 'PREEMPTION', 'EXPIRY']),
    message: z.string(),
    severity: z.enum(['WARNING', 'CRITICAL'])
  }))
});

export type ScopedContext = z.infer<typeof ScopedContextSchema>;