import { z } from 'zod';

export const VerdictSchema = z.object({
  status: z.enum(['LIKELY_VIOLATION', 'POSSIBLE_VIOLATION', 'UNLIKELY_VIOLATION', 'INELIGIBLE']),
  
  confidence_score: z.number(),
  
  analysis: z.object({
    summary: z.string(),
    missing_elements: z.array(z.string()),
    strength_factors: z.array(z.string()).optional(),
    weakness_factors: z.array(z.string()).optional()
  }),

  // [FIX] Robust citation handling
  // We accept undefined, null, or array, and coerce it to string array
  relevant_citations: z.union([
      z.array(z.string()),
      z.null(),
      z.undefined()
  ]).transform(val => val || []) 
});

export type Verdict = z.infer<typeof VerdictSchema>;

export const ValidationRequestSchema = z.object({
  intent: z.string(),
  jurisdiction: z.enum(['MA', 'FED']).default('MA'),
  formData: z.record(z.any())
});