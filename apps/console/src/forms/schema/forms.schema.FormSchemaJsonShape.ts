/**
 * forms.schema.FormSchemaJsonShape
 *
 * ARGUEOS V1.6 GRAND UNIFIED SCHEMA
 * Defines the shape for Fields, Layout, Metadata, and the V2 Logic System.
 *
 * Related docs:
 * - 04-data-and-api-spec.md
 * - 05-llm-prompt-spec.md
 *
 * Updates (v1.6):
 * - Added V2 Logic types (`LogicComparator`, `LogicWhenClause`) for complex rules.
 * - Added `action: "flag"` and `SubmissionFlag` type for Risk Guardrails.
 * - Added root `metadata` for persisting editor state (chat history).
 */

export type FormFieldKind = 
  | "text" | "textarea" | "email" | "phone" | "number" | "currency"
  | "date" | "time" | "date_range"
  | "select" | "multiselect" | "radio" | "checkbox_group"
  | "checkbox" | "switch"
  | "header" | "info" | "group" | "divider"
  | "slider" | "consent" | "signature"; 

// --- V2 LOGIC SYSTEM ---

export type LogicComparator = 
  | "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
  | "is_empty" | "is_not_empty"
  | "older_than_days" | "older_than_years" // New for Date logic
  | "matches_regex";                       // New for Pattern matching

export type LogicAction = "show" | "hide" | "require" | "disable" | "flag";

export interface LogicCondition {
  fieldKey: string;
  operator: LogicComparator;
  value: any; // string | number | boolean | string[]
}

export interface LogicWhenClause {
  // V2 Grouping
  allOf?: LogicCondition[];
  anyOf?: LogicCondition[];
  
  // V1 Legacy Support (Implicit "AND" if mixed, but mostly for back-compat)
  fieldKey?: string;
  operator?: LogicComparator;
  value?: any;
}

export interface FieldLogicRule {
  id: string;
  when: LogicWhenClause;
  action: LogicAction;
  
  // For 'flag' action only
  flagCode?: string;      // e.g. "STATUTE_RISK"
  flagMessage?: string;   // e.g. "Incident is older than 2 years"
  targetScope?: "field" | "form";
}

// --- RUNTIME TYPES ---
export interface SubmissionFlag {
  code: string;
  message: string;
  fieldKey?: string;
}

// --- STANDARD DEFINITIONS ---

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FieldMetadata {
  isPII?: boolean;              // e.g. Social Security, DOB
  complianceNote?: string;      // e.g. "HIPAA Protected"
  externalMapping?: string;     // e.g. "salesforce.contact.email"
  isLocked?: boolean;           // Prevent editing in Builder
  isHiddenInput?: boolean;      // For passing hidden url params
}

export interface FieldLayout {
  width?: "full" | "half" | "third" | "two-thirds";
  newLine?: boolean;            // Force new line even if half width
  hidden?: boolean;             // Default visibility (Design-time)
}

export interface FormFieldDefinition {
  id: string;           // UI UUID (Stable for React keys)
  key: string;          // DB Variable Name (camelCase)
  title: string;        // Human Label
  kind: FormFieldKind;
  
  description?: string;
  placeholder?: string;
  
  // Validation
  isRequired?: boolean;
  min?: number;
  max?: number;
  pattern?: string;     // Regex

  // Selection
  options?: FieldOption[];
  allowOther?: boolean;

  // Advanced Features
  logic?: FieldLogicRule[];
  metadata?: FieldMetadata;
  layout?: FieldLayout;
}

export interface FormSchemaJsonShape {
  type: "object";
  properties: Record<string, FormFieldDefinition>;
  order?: string[]; 
  required?: string[]; // Legacy compatibility

  // [NEW] Root metadata for persistence
  metadata?: {
    chatHistory?: any[];
    [key: string]: any;
  };
}