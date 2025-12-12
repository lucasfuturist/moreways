import type { 
  FormSchemaJsonShape, 
  FormFieldDefinition,
  FormFieldKind
} from "@/forms/schema/forms.schema.FormSchemaJsonShape";

// Helper to map standard JSON Schema types to ArgueOS kinds
function mapTypeToKind(rawType?: string, rawKind?: string): FormFieldKind {
  if (rawKind) return rawKind as FormFieldKind;
  
  switch (rawType?.toLowerCase()) {
    case 'string': return 'text';
    case 'integer': 
    case 'number': return 'number';
    case 'boolean': return 'checkbox';
    case 'array': return 'multiselect';
    default: return 'text';
  }
}

export function normalizeFormSchemaJsonShape(raw: any): FormSchemaJsonShape {
  if (!raw || typeof raw !== "object") {
    return { type: "object", properties: {}, order: [], required: [] };
  }

  // [FUZZ FIX] Fallback for 'fields' alias if 'properties' is missing
  const rawProps = raw.properties || raw.fields || {};
  const rawRequired = new Set(Array.isArray(raw.required) ? raw.required : []);
  
  const normalizedProps: Record<string, FormFieldDefinition> = {};
  const order: string[] = [];

  for (const [key, val] of Object.entries(rawProps)) {
    const fieldRaw = val as any;
    const id = fieldRaw.id || `field_${Math.random().toString(36).substr(2, 9)}`;
    
    let kind = mapTypeToKind(fieldRaw.type, fieldRaw.kind);
    
    // Heuristic: If it has options but kind is text, force select
    if (kind === 'text' && Array.isArray(fieldRaw.options) && fieldRaw.options.length > 0) {
        kind = 'select';
    }

    // [FUZZ FIX] Robust Option Normalization
    let options = fieldRaw.options;
    if (Array.isArray(options) && options.length > 0) {
      if (typeof options[0] === 'string') {
        options = options.map((str: string) => ({
          id: `opt_${Math.random().toString(36).substr(2, 9)}`,
          label: str,
          value: str.toLowerCase().replace(/\s+/g, '_')
        }));
      }
    }

    // [FUZZ FIX] Strict Logic Array Validation
    // If logic is not an array, discard it to prevent crashes
    const safeLogic = Array.isArray(fieldRaw.logic) ? fieldRaw.logic : undefined;

    const def: FormFieldDefinition = {
      id,
      key: key,
      title: fieldRaw.title || key,
      kind,
      description: fieldRaw.description,
      placeholder: fieldRaw.placeholder,
      isRequired: fieldRaw.isRequired ?? rawRequired.has(key),
      options,
      logic: safeLogic, // Using the sanitized value
      metadata: fieldRaw.metadata,
      layout: fieldRaw.layout,
    };

    normalizedProps[key] = def;
    order.push(key);
  }

  // Ensure order references exist
  const finalOrder = Array.isArray(raw.order) && raw.order.length > 0 
    ? raw.order.filter((k: string) => normalizedProps[k]) 
    : order;

  const finalRequired = Object.values(normalizedProps)
    .filter(f => f.isRequired)
    .map(f => f.key);

  return {
    type: "object",
    properties: normalizedProps,
    order: finalOrder,
    required: finalRequired,
    metadata: raw.metadata || {}
  };
}