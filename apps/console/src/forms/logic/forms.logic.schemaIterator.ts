/**
 * forms.logic.schemaIterator
 *
 * Determines the linear flow of a form session.
 * Handles:
 * - Field ordering
 * - Skipping hidden fields (logic)
 * - Skipping ALREADY FILLED fields (auto-advance)
 */

import type { FormSchemaJsonShape, FormFieldDefinition, LogicCondition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

function checkCondition(data: Record<string, any>, condition: LogicCondition): boolean {
  const { fieldKey, operator, value } = condition;
  const actualValue = data[fieldKey];

  if (actualValue === undefined || actualValue === null || actualValue === "") {
    return operator === "is_empty";
  }

  switch (operator) {
    case "equals": return actualValue == value;
    case "not_equals": return actualValue != value;
    case "contains": return String(actualValue).toLowerCase().includes(String(value).toLowerCase());
    case "is_empty": return false;
    case "is_not_empty": return true;
    case "greater_than": return Number(actualValue) > Number(value);
    case "less_than": return Number(actualValue) < Number(value);
    default: return false;
  }
}

function evaluateShowHide(data: Record<string, any>, field: FormFieldDefinition): boolean {
  if (!field.logic) return true; 
  let isVisible = true; 
  const hasShowLogic = field.logic.some(r => r.action === "show");
  if (hasShowLogic) isVisible = false;

  for (const rule of field.logic) {
    let match = false;
    const when = rule.when;

    if (when.allOf) match = when.allOf.every(c => checkCondition(data, c));
    else if (when.anyOf) match = when.anyOf.some(c => checkCondition(data, c));
    else if (when.fieldKey && when.operator) match = checkCondition(data, { fieldKey: when.fieldKey, operator: when.operator, value: when.value } as any);

    if (match) {
      if (rule.action === "show") isVisible = true;
      if (rule.action === "hide") isVisible = false;
    }
  }
  return isVisible;
}

// [NEW] Helper to check if field has data
function isFieldFilled(val: any): boolean {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'number') return true; // 0 is a value
  if (typeof val === 'boolean') return true;
  return false;
}

export function getNextFieldKey(
  schema: FormSchemaJsonShape,
  currentData: Record<string, any>,
  lastFieldKey?: string
): string | null {
  const allKeys = schema.order || Object.keys(schema.properties);
  let startIndex = 0;

  if (lastFieldKey) {
    const idx = allKeys.indexOf(lastFieldKey);
    if (idx !== -1) startIndex = idx + 1;
  }

  for (let i = startIndex; i < allKeys.length; i++) {
    const key = allKeys[i];
    const def = schema.properties[key];
    
    if (!def) continue;
    if (def.kind === 'divider') continue;

    // 1. Logic Check (Is it visible?)
    if (!evaluateShowHide(currentData, def)) continue;

    // 2. [NEW] Data Check (Is it already filled?)
    // We skip non-structural fields that already have data.
    // Headers/Info are "structural" and usually don't have data, so we don't skip them 
    // based on value (they are always "empty"). The ChatRunner handles auto-skipping headers.
    if (def.kind !== 'header' && def.kind !== 'info') {
       if (isFieldFilled(currentData[key])) {
         continue; // Skip this field, it's done.
       }
    }

    return key;
  }

  return null; // End of form
}