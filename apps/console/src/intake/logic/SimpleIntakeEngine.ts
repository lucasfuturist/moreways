// src/intake/logic/SimpleIntakeEngine.ts

import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export interface SimpleIntakeSnapshot {
  schema: FormSchemaJsonShape;
  allFields: string[];
  filled: Record<string, any>;
  unfilled: string[];
}

/**
 * Build the complete "what do we have so far" snapshot.
 * This is all your chatbot needs as context.
 */
export function buildSimpleIntakeSnapshot(
  schema: FormSchemaJsonShape,
  formData: Record<string, any>
): SimpleIntakeSnapshot {

  const keys = schema.order ?? Object.keys(schema.properties);
  const filled: Record<string, any> = {};
  const unfilled: string[] = [];

  for (const key of keys) {
    const val = formData[key];

    const isEmpty =
      val === undefined ||
      val === null ||
      (typeof val === "string" && val.trim() === "") ||
      (Array.isArray(val) && val.length === 0);

    if (isEmpty) {
      unfilled.push(key);
    } else {
      filled[key] = val;
    }
  }

  return {
    schema,
    allFields: keys,
    filled,
    unfilled,
  };
}
