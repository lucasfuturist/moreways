import { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export interface PublicField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "number";
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export function mapPlatformToPublic(schema: FormSchemaJsonShape): PublicField[] {
  const fields: PublicField[] = [];
  // Use order if exists, otherwise keys
  const keys = schema.order || Object.keys(schema.properties);

  for (const key of keys) {
    const internal = schema.properties[key];
    if (!internal) continue;

    let publicType: PublicField["type"] = "text";
    
    if (internal.kind === "textarea") publicType = "textarea";
    else if (internal.kind === "number" || internal.kind === "currency") publicType = "number";
    else if (internal.kind === "date" || internal.kind === "date_range") publicType = "date";
    
    fields.push({
      id: internal.key,
      label: internal.title,
      type: publicType,
      required: internal.isRequired || false,
      placeholder: internal.placeholder,
      options: internal.options?.map(o => o.label)
    });
  }
  return fields;
}