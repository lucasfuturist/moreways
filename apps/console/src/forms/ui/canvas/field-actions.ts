import type { FormFieldDefinition, FieldOption } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

// --- UTILS ---

/**
 * Generates a clean variable key from a human label
 * e.g. "Date of Birth" -> "dateOfBirth"
 */
export function generateKeyFromLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+(\w)/g, (_, c) => c.toUpperCase()) || "field";
}

/**
 * Generates a stable ID for UI lists
 */
export function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// --- OPTION ACTIONS ---

/**
 * Adds a new option to a field
 */
export function addOptionToField(field: FormFieldDefinition): FormFieldDefinition {
  const count = (field.options?.length || 0) + 1;
  const newOption: FieldOption = {
    id: generateId(),
    label: `Option ${count}`,
    value: `option_${count}`
  };
  
  return {
    ...field,
    options: [...(field.options || []), newOption]
  };
}

/**
 * Updates a specific option
 */
export function updateOptionInField(
  field: FormFieldDefinition, 
  optionId: string, 
  updates: Partial<FieldOption>
): FormFieldDefinition {
  if (!field.options) return field;
  
  return {
    ...field,
    options: field.options.map(opt => 
      opt.id === optionId ? { ...opt, ...updates } : opt
    )
  };
}

/**
 * Removes an option
 */
export function removeOptionFromField(
  field: FormFieldDefinition, 
  optionId: string
): FormFieldDefinition {
  if (!field.options) return field;
  
  return {
    ...field,
    options: field.options.filter(opt => opt.id !== optionId)
  };
}