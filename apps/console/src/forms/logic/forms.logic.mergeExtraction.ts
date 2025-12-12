// src/forms/logic/forms.logic.mergeExtraction.ts

/**
 * forms.logic.mergeExtraction
 *
 * Merge an ExtractionResult JSON patch into the current form data.
 *
 * Guardrails:
 * - Drop updates for unknown field keys (not in schema.properties).
 * - For already-answered fields:
 *   - Only overwrite if isCorrection === true.
 *   - Otherwise ignore.
 * - Coerce values by FormFieldDefinition.kind when possible.
 */

import { logger } from "@/infra/logging/infra.svc.logger";
import type {
  FormSchemaJsonShape,
  FormFieldDefinition,
} from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import type {
  ExtractionResult,
  FieldUpdate,
} from "@/llm/schema/llm.schema.ExtractionResult";

export interface MergeExtractionResult {
  nextFormData: Record<string, unknown>;
  /**
   * Keys that were successfully applied to nextFormData.
   */
  appliedFieldKeys: string[];
  /**
   * Keys that were rejected (unknown in schema, invalid type, or blocked overwrite).
   */
  droppedFieldKeys: string[];
  /**
   * Trait values extracted during this merge (raw).
   */
  traitValues: Record<string, unknown>;
}

/**
 * Coerce the raw value coming from the LLM into something that makes sense for
 * the given FormFieldDefinition.kind.
 *
 * NOTE: This is intentionally conservative. If coercion fails, we return undefined,
 * and the caller treats it as a dropped update.
 */
function coerceFieldValue(def: FormFieldDefinition, raw: unknown): unknown {
  if (raw === null || raw === undefined) return undefined;

  switch (def.kind) {
    case "date": {
      if (typeof raw === "string") return raw;
      if (raw instanceof Date) return raw.toISOString();
      return String(raw);
    }

    case "number":
    case "currency": {
      const n = typeof raw === "number" ? raw : Number(raw);
      return Number.isFinite(n) ? n : undefined;
    }

    case "checkbox":
    case "switch": {
      if (typeof raw === "boolean") return raw;
      if (typeof raw === "string") {
        const lower = raw.toLowerCase().trim();
        if (["yes", "true", "y", "1"].includes(lower)) return true;
        if (["no", "false", "n", "0"].includes(lower)) return false;
      }
      return undefined;
    }

    case "select":
    case "radio": {
      return typeof raw === "string" ? raw : String(raw);
    }

    default: {
      // Fallback for:
      // - text, textarea, phone, email, etc.
      // - multiSelect-like arrays (if your schema eventually supports them)
      // - file-like objects (if your schema includes those later)
      if (Array.isArray(raw)) {
        return raw.map((v) => String(v));
      }

      if (typeof raw === "object") {
        return raw; // tolerate file descriptors or object uploads
      }

      return String(raw);
    }
  }
}


/**
 * Merge an ExtractionResult into an existing flat formData object.
 *
 * - formData: current values keyed by field key.
 * - extraction: JSON patch from the LLM.
 * - schema: canonical schema for the form.
 */
export function mergeExtractionIntoFormData(
  formData: Record<string, unknown>,
  extraction: ExtractionResult,
  schema: FormSchemaJsonShape
): MergeExtractionResult {
  const nextFormData: Record<string, unknown> = { ...formData };
  const appliedFieldKeys: string[] = [];
  const droppedFieldKeys: string[] = [];
  const traitValues: Record<string, unknown> = {};

  // --- FIELD UPDATES ---

  const updates = extraction.updates ?? {};

  for (const [key, update] of Object.entries<FieldUpdate>(updates as any)) {
    const fieldDef = schema.properties[key];

    if (!fieldDef) {
      // Unknown field -> drop.
      droppedFieldKeys.push(key);
      continue;
    }

    const existingValue = formData[key];

    // Overwrite guard: only allow overwrite if isCorrection === true.
    if (
      existingValue !== undefined &&
      (update.isCorrection === undefined || update.isCorrection === false)
    ) {
      droppedFieldKeys.push(key);
      continue;
    }

    const coerced = coerceFieldValue(fieldDef as FormFieldDefinition, update.value);

    if (coerced === undefined) {
      droppedFieldKeys.push(key);
      continue;
    }

    nextFormData[key] = coerced;
    appliedFieldKeys.push(key);
  }

  // --- TRAITS ---

  const traits = extraction.traits ?? {};
  for (const [key, t] of Object.entries(traits)) {
    traitValues[key] = (t as any).value;
  }

  logger.debug("[mergeExtractionIntoFormData] Applied extraction patch", {
    appliedFieldKeys,
    droppedFieldKeys,
    traitCount: Object.keys(traitValues).length,
  });

  return {
    nextFormData,
    appliedFieldKeys,
    droppedFieldKeys,
    traitValues,
  };
}
