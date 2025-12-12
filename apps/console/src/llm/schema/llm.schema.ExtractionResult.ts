// src/llm/schema/llm.schema.ExtractionResult.ts

/**
 * llm.schema.ExtractionResult
 *
 * Canonical JSON patch contract for the intake extraction model.
 *
 * The LLM:
 * - NEVER sends full form JSON or SessionState.
 * - ONLY sends patches, in this shape.
 *
 * Used by:
 * - llm.svc.DialogModelCaller (callExtractionModel)
 * - forms.logic.mergeExtraction (mergeExtractionIntoFormData)
 */

import { z } from "zod";

// --- FIELD UPDATE ---

export const FieldUpdateSchema = z.object({
  value: z.unknown(),
  reason: z.string().optional(),
  isCorrection: z.boolean().optional(), // true iff user clearly corrected a previous answer
});

export type FieldUpdate = z.infer<typeof FieldUpdateSchema>;

// --- TRAIT UPDATE ---

export const TraitUpdateSchema = z.object({
  value: z.union([z.boolean(), z.string(), z.number()]),
  reason: z.string().optional(),
});

export type TraitUpdate = z.infer<typeof TraitUpdateSchema>;

// --- CLARIFICATION REQUEST ---

export const ClarificationRequestSchema = z.object({
  fieldKey: z.string(),
  question: z.string(),
  priority: z.enum(["low", "normal", "high"]).optional(),
});

export type ClarificationRequest = z.infer<typeof ClarificationRequestSchema>;

// --- EXTRACTION RESULT ---

export const ExtractionResultSchema = z.object({
  updates: z.record(FieldUpdateSchema).default({}),
  traits: z.record(TraitUpdateSchema).default({}),
  clarifications: z.array(ClarificationRequestSchema).default([]),
});

export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;
