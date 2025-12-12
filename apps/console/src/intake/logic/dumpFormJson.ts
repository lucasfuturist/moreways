// src/intake/logic/dumpFormJson.ts
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { buildSimpleIntakeSnapshot } from "@/intake/logic/SimpleIntakeEngine";

export function dumpFormJson(schema: FormSchemaJsonShape, formData?: Record<string, any>): string {
  const snapshot = buildSimpleIntakeSnapshot(schema, formData ?? {});
  return JSON.stringify(snapshot, null, 2);
}
