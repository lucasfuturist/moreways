import type { FormSchemaJson, FormFieldDefinition, LogicCondition } from "@/lib/types/argueos-types";

// Helper type for compatibility
type SchemaShape = FormSchemaJson;

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
  // @ts-ignore - logic property might be missing in strict subset types
  if (!field.logic) return true; 
  
  let isVisible = true; 
  // @ts-ignore
  const hasShowLogic = field.logic.some((r: any) => r.action === "show");
  if (hasShowLogic) isVisible = false;

  // @ts-ignore
  for (const rule of field.logic) {
    let match = false;
    const when = rule.when;

    if (when.allOf) match = when.allOf.every((c: any) => checkCondition(data, c));
    else if (when.anyOf) match = when.anyOf.some((c: any) => checkCondition(data, c));
    else if (when.fieldKey && when.operator) match = checkCondition(data, { fieldKey: when.fieldKey, operator: when.operator, value: when.value } as any);

    if (match) {
      if (rule.action === "show") isVisible = true;
      if (rule.action === "hide") isVisible = false;
    }
  }
  return isVisible;
}

function isFieldFilled(val: any): boolean {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'number') return true;
  if (typeof val === 'boolean') return true;
  return false;
}

export function getNextFieldKey(
  schema: SchemaShape,
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
    
    // @ts-ignore
    if (def.kind === 'divider') continue;

    // 1. Logic Check (Is it visible?)
    if (!evaluateShowHide(currentData, def)) continue;

    // 2. Data Check (Is it already filled?)
    if (def.kind !== 'header' && def.kind !== 'info') {
       if (isFieldFilled(currentData[key])) {
         continue; 
       }
    }

    return key;
  }

  return null;
}