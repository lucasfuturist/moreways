import { z } from 'zod';

export const VerdictSchema = z.object({
  // The bottom line
  status: z.enum(['LIKELY_VIOLATION', 'POSSIBLE_VIOLATION', 'UNLIKELY_VIOLATION', 'INELIGIBLE']),
  
  // 0.0 to 1.0 (How well do the facts map to the elements of the law?)
  confidence_score: z.number(),
  
  // The reasoning block
  analysis: z.object({
    summary: z.string(), // "The user claims X, which aligns with 93A..."
    missing_elements: z.array(z.string()), // "Need proof of written demand letter"
    strength_factors: z.array(z.string()), // "Purchase was < 7 days ago"
    weakness_factors: z.array(z.string())  // "Mileage over 125k"
  }),

  // The specific laws applied
  relevant_citations: z.array(z.string()) // URNs
});

export type Verdict = z.infer<typeof VerdictSchema>;

export const ValidationRequestSchema = z.object({
  intent: z.string(), // e.g. "Auto – Dealership"
  jurisdiction: z.enum(['MA', 'FED']).default('MA'),
  formData: z.record(z.any()) // The raw intake dump
});