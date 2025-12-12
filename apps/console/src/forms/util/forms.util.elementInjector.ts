/**
 * forms.util.elementInjector
 *
 * Helper logic to instantiate elements from the Catalog into the Canvas state.
 * Handles unique ID generation, key normalization, and smart block expansion.
 */

import type { ElementCatalogItem } from "@/forms/schema/forms.schema.ElementCatalog";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { generateId } from "@/forms/ui/canvas/field-actions";

/**
 * Represents the internal state shape of the canvas (FieldEntry[]).
 */
interface FieldEntry {
  key: string;
  def: FormFieldDefinition;
  isRequired: boolean;
}

/**
 * Generates a unique key based on title and existing keys.
 * e.g. "First Name" -> "firstName", then "firstName_1"
 */
function generateUniqueKey(baseTitle: string, existingKeys: Set<string>): string {
  const cleanBase = baseTitle
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // remove non-alphanumeric
    .trim();
  
  let candidate = cleanBase || "field";
  let counter = 1;

  while (existingKeys.has(candidate)) {
    candidate = `${cleanBase}_${counter}`;
    counter++;
  }

  return candidate;
}

/**
 * Creates a full FieldEntry from a partial definition.
 */
function instantiateField(
  partial: Partial<FormFieldDefinition>,
  existingKeys: Set<string>
): FieldEntry {
  const title = partial.title || "Untitled";
  const key = generateUniqueKey(title, existingKeys);
  
  // Mark key as taken immediately so next field in loop sees it
  existingKeys.add(key);

  // [FIX] Removed 'type' assignment. In v1.5, FormFieldDefinition relies on 'kind'.
  const def: FormFieldDefinition = {
    id: generateId(),
    key: key,
    title: title,
    kind: partial.kind || "text",
    ...partial, // Spread defaults (layout, options, etc.)
  };

  return {
    key: def.key,
    def,
    isRequired: !!def.isRequired,
  };
}

/**
 * Main Action: Adds an item (single or block) to the field list.
 */
export function injectCatalogItem(
  currentFields: FieldEntry[],
  item: ElementCatalogItem
): FieldEntry[] {
  const existingKeys = new Set(currentFields.map((f) => f.key));
  const newEntries: FieldEntry[] = [];

  // 1. Handle Smart Block (Multi-field)
  if (item.defaultFields && item.defaultFields.length > 0) {
    item.defaultFields.forEach((partial) => {
      newEntries.push(instantiateField(partial, existingKeys));
    });
  } 
  // 2. Handle Atomic Field
  else if (item.defaultField) {
    newEntries.push(instantiateField(item.defaultField, existingKeys));
  }

  // 3. Append to end (Future: Insert at active index)
  return [...currentFields, ...newEntries];
}