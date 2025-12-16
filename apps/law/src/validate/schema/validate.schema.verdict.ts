// apps/law/src/validate/schema/validate.schema.verdict.ts

import { z } from "zod";

export const VerdictStatusSchema = z.enum([
  "LIKELY_VIOLATION",
  "POSSIBLE_VIOLATION",
  "UNLIKELY_VIOLATION",
  "INELIGIBLE",
]);

export const EvidenceQuoteSchema = z.object({
  urn: z.string().min(1),
  quote: z.string().min(1),
});

export const FindingSchema = z.object({
  /**
   * A single concrete conclusion the model is asserting.
   * Example: "The collector exceeded two communications in a seven-day period."
   */
  text: z.string().min(1),

  /**
   * URNs that directly support this finding.
   * IMPORTANT: your JudgeService should later enforce these are a subset of provided URNs.
   */
  citations: z.array(z.string().min(1)).default([]),

  /**
   * Verbatim support. This is the "zero hallucination" anchor:
   * you will verify each quote is a literal substring of the DB node content_text for that URN.
   */
  evidence_quotes: z.array(EvidenceQuoteSchema).min(1),
});

export const VerdictSchema = z.object({
  status: VerdictStatusSchema,

  confidence_score: z.number(),

  analysis: z.object({
    summary: z.string(),

    missing_elements: z.array(z.string()),

    /**
     * Optional narrative lists (fine to keep)
     */
    strength_factors: z.array(z.string()).optional(),
    weakness_factors: z.array(z.string()).optional(),

    /**
     * New: machine-checkable claims
     */
    findings: z.array(FindingSchema).default([]),
  }),

  /**
   * Keep this for compatibility, but treat it as *derived* data:
   * your JudgeService should overwrite it based on valid findings.
   */
  relevant_citations: z
    .union([z.array(z.string()), z.null(), z.undefined()])
    .transform((val) => val || []),
});

export type Verdict = z.infer<typeof VerdictSchema>;

export const ValidationRequestSchema = z.object({
  intent: z.string(),
  jurisdiction: z.enum(["MA", "FED"]).default("MA"),
  formData: z.record(z.any()),
});
