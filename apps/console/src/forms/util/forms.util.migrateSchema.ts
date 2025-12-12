/**
 * forms.util.migrateSchema
 *
 * runtime migration utility to upgrade legacy v1 schemas to the
 * v1.5 "Grand Unified Schema" format.
 *
 * Guarantees:
 * - Always returns a valid FormSchemaJsonShape with 'order' and 'properties'.
 * - Converts legacy 'required' array into 'field.isRequired' boolean.
 * - Safe to run on already-migrated schemas (idempotent).
 */

import type {
  FormSchemaJsonShape,
  FormFieldDefinition,
} from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export function migrateSchemaToV15(raw: any): FormSchemaJsonShape {
  if (!raw || typeof raw !== "object") {
    return { type: "object", order: [], properties: {}, required: [] };
  }

  const properties: Record<string, FormFieldDefinition> = raw.properties || {};
  
  // 1. Derive Order (Legacy schemas relied on object insertion order)
  let order: string[] = Array.isArray(raw.order)
    ? raw.order
    : Object.keys(properties);

  // 2. Handle Legacy Required Array
  const legacyRequired = new Set(Array.isArray(raw.required) ? raw.required : []);

  // 3. Normalize Fields
  const normalizedProperties: Record<string, FormFieldDefinition> = {};

  for (const key of order) {
    const originalField = properties[key];
    if (!originalField) continue;

    const field: FormFieldDefinition = {
      ...originalField,
      id: originalField.id || `field_${key}_${Math.random().toString(36).substr(2, 5)}`,
      key: key,
      kind: originalField.kind || "text",
      title: originalField.title || key,
      // [MIGRATION] Merge legacy array into boolean
      isRequired: originalField.isRequired ?? legacyRequired.has(key),
      // [v1.5] Ensure containers exist
      logic: Array.isArray(originalField.logic) ? originalField.logic : undefined,
      metadata: originalField.metadata || undefined,
      layout: originalField.layout || undefined,
    };

    normalizedProperties[key] = field;
  }

  // 4. Re-verify order matches valid keys only
  const finalOrder = order.filter((key) => !!normalizedProperties[key]);

  return {
    type: "object",
    order: finalOrder,
    properties: normalizedProperties,
    // We keep the legacy array for backward compat with older parsers if needed
    required: Array.from(legacyRequired) as string[],
  };
}