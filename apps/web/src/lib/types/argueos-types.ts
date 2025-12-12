export type FormFieldKind = 
  | "text" | "textarea" | "email" | "phone" | "number" | "currency"
  | "date" | "time" | "date_range"
  | "select" | "multiselect" | "radio" | "checkbox_group"
  | "checkbox" | "switch"
  | "header" | "info" | "group" | "divider"
  | "slider" | "consent" | "signature"; 

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export type LogicComparator = 
  | "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
  | "is_empty" | "is_not_empty"
  | "older_than_days" | "older_than_years"
  | "matches_regex";

export interface LogicCondition {
  fieldKey: string;
  operator: LogicComparator;
  value: any;
}

export interface FormFieldDefinition {
  id: string;
  key: string;
  title: string;
  kind: FormFieldKind;
  description?: string;
  placeholder?: string;
  isRequired?: boolean;
  options?: FieldOption[];
  allowOther?: boolean;
  logic?: {
    action: "show" | "hide" | "require" | "disable" | "flag";
    when: {
        allOf?: LogicCondition[];
        anyOf?: LogicCondition[];
        fieldKey?: string;
        operator?: LogicComparator;
        value?: any;
    };
  }[];
  layout?: {
    width?: "full" | "half" | "third";
    hidden?: boolean;
  };
}

export interface FormSchemaJson {
  type: "object";
  properties: Record<string, FormFieldDefinition>;
  order?: string[]; 
}

export interface PublicFormResponse {
  id: string;
  title: string;
  organizationId: string;
  schema: FormSchemaJson;
}