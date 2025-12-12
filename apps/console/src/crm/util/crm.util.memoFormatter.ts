/**
 * crm.util.memoFormatter
 *
 * Pure utility to transform a structured FormSubmission into a readable
 * Markdown/Text "Legal Memo" format for clipboard export.
 *
 * Improvements:
 * - Handles undefined booleans correctly (doesn't default to "No").
 * - Includes Client Name and Form Name in header.
 * - Groups array values (multiselect) cleanly.
 *
 * Related docs:
 * - 01-product-spec-v1.md (Turn data into work product)
 */

import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export function formatSubmissionAsMemo(
  schema: FormSchemaJsonShape, 
  data: Record<string, any>,
  meta: { clientName?: string; formName?: string; submissionDate?: string } = {}
): string {
  const lines: string[] = [];
  
  // 1. Memo Header
  lines.push(`# INTAKE SUMMARY`);
  if (meta.formName) lines.push(`**Form:** ${meta.formName}`);
  if (meta.clientName) lines.push(`**Client:** ${meta.clientName}`);
  lines.push(`**Exported:** ${new Date().toLocaleString()}`);
  if (meta.submissionDate) lines.push(`**Submitted:** ${new Date(meta.submissionDate).toLocaleString()}`);
  lines.push(`---`);
  lines.push(``);

  // 2. Determine Order
  const keys = schema.order || Object.keys(schema.properties);

  // 3. Iterate Fields
  keys.forEach((key) => {
    const field = schema.properties[key];
    if (!field) return;

    const value = data[key];
    // Check strictly for undefined/null/empty-string, but allow 0 or false
    const hasValue = value !== undefined && value !== null && value !== "";

    switch (field.kind) {
      // Structural Elements
      case "header":
        lines.push(``);
        lines.push(`## ${field.title.toUpperCase()}`);
        lines.push(``);
        break;
      
      case "info":
      case "divider":
        // Skip static elements in output
        break;

      // Booleans
      case "checkbox":
      case "switch":
        if (!hasValue) {
            lines.push(`- **${field.title}:** (No answer)`);
        } else {
            lines.push(`- **${field.title}:** ${value ? "Yes" : "No"}`);
        }
        break;

      // Arrays (Multi-select / Checkbox Groups)
      case "checkbox_group":
      case "multiselect":
        lines.push(`- **${field.title}:**`);
        if (Array.isArray(value) && value.length > 0) {
           value.forEach((v: string) => lines.push(`  * ${v}`));
        } else if (!hasValue || (Array.isArray(value) && value.length === 0)) {
           lines.push(`  (None selected)`);
        }
        break;

      // Standard Values
      default:
        lines.push(`- **${field.title}:** ${hasValue ? value : "(No answer)"}`);
        break;
    }
  });

  // 4. Footer
  lines.push(``);
  lines.push(`---`);
  lines.push(`*End of Intake Record*`);

  return lines.join("\n");
}