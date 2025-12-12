/**
 * forms.logic.evaluateSubmissionFlags
 *
 * Deterministic guardrail evaluator: schema + submission → SubmissionFlag[].
 *
 * Related docs:
 * - 01-product-spec-v1.md (Risk Guardrails)
 * - 03-security-and-data-handling.md
 *
 * Guarantees:
 * - [SECURITY] Pure function, no LLM usage at runtime.
 * - [SECURITY] No network calls, safe for high-throughput ingestion.
 */

import type { 
  FormSchemaJsonShape, 
  LogicCondition, 
  LogicWhenClause, 
  SubmissionFlag 
} from "@/forms/schema/forms.schema.FormSchemaJsonShape";

// [INTERNAL] Evaluate a single atomic condition
function checkCondition(data: Record<string, any>, condition: LogicCondition): boolean {
  const { fieldKey, operator, value } = condition;
  const actualValue = data[fieldKey];

  // Null safety
  if (actualValue === undefined || actualValue === null || actualValue === "") {
    return operator === "is_empty";
  }

  switch (operator) {
    case "equals": return actualValue == value; // Loose eq for "1" vs 1 form inputs
    case "not_equals": return actualValue != value;
    case "contains": return String(actualValue).toLowerCase().includes(String(value).toLowerCase());
    case "is_empty": return false; // Already checked above
    case "is_not_empty": return true;
    case "greater_than": return Number(actualValue) > Number(value);
    case "less_than": return Number(actualValue) < Number(value);
    
    // Date Logic
    case "older_than_years": {
      const date = new Date(actualValue);
      if (isNaN(date.getTime())) return false;
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - Number(value));
      return date < cutoff; // If date is before cutoff, it's older
    }
    case "older_than_days": {
      const date = new Date(actualValue);
      if (isNaN(date.getTime())) return false;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - Number(value));
      return date < cutoff;
    }

    // Regex Logic
    case "matches_regex": {
      try {
        const re = new RegExp(String(value), "i");
        return re.test(String(actualValue));
      } catch (e) {
        console.warn(`[Logic] Invalid Regex pattern: ${value}`);
        return false;
      }
    }
    
    default: return false;
  }
}

// [INTERNAL] Evaluate a "when" clause (supports Legacy V1 + V2 Groups)
function evaluateWhen(data: Record<string, any>, when: LogicWhenClause): boolean {
  // V2: Group Logic
  if (when.allOf && when.allOf.length > 0) {
    return when.allOf.every(c => checkCondition(data, c));
  }
  if (when.anyOf && when.anyOf.length > 0) {
    return when.anyOf.some(c => checkCondition(data, c));
  }

  // V1 Legacy Fallback (Flattened structure)
  if (when.fieldKey && when.operator) {
    return checkCondition(data, { 
      fieldKey: when.fieldKey, 
      operator: when.operator, 
      value: when.value 
    });
  }

  return false;
}

/**
 * Main Evaluator Function
 */
export function evaluateSubmissionFlags(
  schema: FormSchemaJsonShape,
  submissionData: Record<string, any>
): SubmissionFlag[] {
  const flags: SubmissionFlag[] = [];
  const keys = schema.order || Object.keys(schema.properties);

  for (const key of keys) {
    const field = schema.properties[key];
    if (!field.logic) continue;

    for (const rule of field.logic) {
      if (rule.action !== "flag") continue;

      const isTriggered = evaluateWhen(submissionData, rule.when);
      
      if (isTriggered) {
        flags.push({
          code: rule.flagCode || "RISK_DETECTED",
          message: rule.flagMessage || `Risk detected in field '${field.title}'`,
          fieldKey: rule.targetScope === "form" ? undefined : key
        });
      }
    }
  }

  return flags;
}