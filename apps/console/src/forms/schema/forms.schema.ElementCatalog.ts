/**
 * forms.schema.ElementCatalog
 *
 * Defines the static inventory of form elements available to the user.
 * Includes both atomic fields and "Smart Blocks" (multi-field patterns).
 *
 * Related docs:
 * - 02-technical-vision-and-conventions.md
 * - 12-ui-implementation-steps.md
 */

import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export type ElementCategory =
  | "basic_input"
  | "selection"
  | "temporal"
  | "structural"
  | "smart_block"
  | "legal";

export interface ElementCatalogItem {
  id: string;                // Internal ID (e.g. "short_text", "contact_block")
  label: string;             // Display Label
  description?: string;      // Tooltip / Help text
  category: ElementCategory;
  tags: string[];            // Search keywords
  icon?: string;             // (Future) Icon key
  
  /**
   * For atomic elements: The partial definition to clone.
   */
  defaultField?: Partial<FormFieldDefinition>;

  /**
   * For Smart Blocks: A list of fields to inject in sequence.
   */
  defaultFields?: Partial<FormFieldDefinition>[];
}

/**
 * THE MASTER CATALOG
 * 
 * This is the "Parts Bin" for the editor.
 */
export const ELEMENT_CATALOG: ElementCatalogItem[] = [
  // --- BASIC INPUTS ---
  {
    id: "short_text",
    label: "Short Text",
    category: "basic_input",
    tags: ["text", "input", "string"],
    description: "Single-line text input.",
    defaultField: { kind: "text", title: "Untitled Input", layout: { width: "full" } },
  },
  {
    id: "long_text",
    label: "Long Text",
    category: "basic_input",
    tags: ["textarea", "paragraph", "essay"],
    description: "Multi-line text area.",
    defaultField: { kind: "textarea", title: "Untitled Description", layout: { width: "full" } },
  },
  {
    id: "number",
    label: "Number",
    category: "basic_input",
    tags: ["count", "integer", "float"],
    description: "Numeric input.",
    defaultField: { kind: "number", title: "Untitled Number", layout: { width: "half" } },
  },
  {
    id: "currency",
    label: "Currency",
    category: "basic_input",
    tags: ["money", "dollar", "price"],
    description: "Monetary value input.",
    defaultField: { kind: "currency", title: "Amount", layout: { width: "half" } },
  },
  {
    id: "email",
    label: "Email",
    category: "basic_input",
    tags: ["contact", "mail"],
    description: "Email address with validation.",
    defaultField: { kind: "email", title: "Email Address", layout: { width: "full" } },
  },
  {
    id: "phone",
    label: "Phone",
    category: "basic_input",
    tags: ["contact", "mobile", "cell"],
    description: "Phone number input.",
    defaultField: { kind: "phone", title: "Phone Number", layout: { width: "full" } },
  },

  // --- SELECTION ---
  {
    id: "select",
    label: "Dropdown",
    category: "selection",
    tags: ["choose", "list", "option"],
    description: "Single selection from a list.",
    defaultField: { 
      kind: "select", 
      title: "Select an Option", 
      options: [{ id: "opt1", label: "Option 1", value: "opt1" }, { id: "opt2", label: "Option 2", value: "opt2" }],
      layout: { width: "full" } 
    },
  },
  {
    id: "checkbox",
    label: "Checkbox",
    category: "selection",
    tags: ["boolean", "confirm", "agree"],
    description: "Single true/false toggle.",
    defaultField: { kind: "checkbox", title: "I agree / Confirm", layout: { width: "full" } },
  },
  {
    id: "radio",
    label: "Radio Group",
    category: "selection",
    tags: ["choice", "single"],
    description: "Visible single choice.",
    defaultField: { 
      kind: "radio", 
      title: "Choose one", 
      options: [{ id: "y", label: "Yes", value: "yes" }, { id: "n", label: "No", value: "no" }],
      layout: { width: "full" }
    },
  },

  // --- TEMPORAL ---
  {
    id: "date",
    label: "Date",
    category: "temporal",
    tags: ["calendar", "when", "day"],
    description: "Date picker.",
    defaultField: { kind: "date", title: "Date", layout: { width: "half" } },
  },
  {
    id: "time",
    label: "Time",
    category: "temporal",
    tags: ["clock", "when", "hour"],
    description: "Time picker.",
    defaultField: { kind: "time", title: "Time", layout: { width: "half" } },
  },

  // --- STRUCTURAL ---
  {
    id: "header",
    label: "Section Header",
    category: "structural",
    tags: ["title", "h1", "h2", "separator"],
    description: "Large text to separate sections.",
    defaultField: { kind: "header", title: "New Section", layout: { width: "full" } },
  },
  {
    id: "info",
    label: "Info Block",
    category: "structural",
    tags: ["help", "text", "static"],
    description: "Static instructional text.",
    defaultField: { kind: "info", title: "Instructions", description: "Please fill out the details below.", layout: { width: "full" } },
  },
  {
    id: "divider",
    label: "Divider",
    category: "structural",
    tags: ["line", "separator", "hr"],
    description: "Visual separator line.",
    defaultField: { kind: "divider", title: "Divider", layout: { width: "full" } },
  },

  // --- SMART BLOCKS ---
  {
    id: "contact_block",
    label: "Contact Details",
    category: "smart_block",
    tags: ["name", "email", "phone", "person"],
    description: "Standard Name, Email, and Phone fields.",
    defaultFields: [
      { kind: "header", title: "Contact Information", layout: { width: "full" } },
      { kind: "text", title: "First Name", layout: { width: "half" } },
      { kind: "text", title: "Last Name", layout: { width: "half" } },
      { kind: "email", title: "Email Address", layout: { width: "half" } },
      { kind: "phone", title: "Phone Number", layout: { width: "half" } },
    ],
  },
   {
    id: "signature",
    label: "Signature",
    category: "legal",
    tags: ["sign", "draw", "legal", "verify"],
    description: "Capture a digital signature.",
    defaultField: { 
      kind: "signature", 
      title: "Client Signature", 
      layout: { width: "full" },
      isRequired: true
    },
  },
  {
    id: "consent",
    label: "Legal Consent",
    category: "legal",
    tags: ["terms", "agree", "disclaimer"],
    description: "Mandatory checkbox with scrolling text.",
    defaultField: { 
      kind: "consent", 
      title: "Terms of Engagement", 
      description: "I have read and agree to the terms below.",
      metadata: { 
        complianceNote: "Standard Retainer Agreement" 
        // We will store the long text in 'placeholder' or specific metadata
      },
      layout: { width: "full" },
      isRequired: true
    },
  },
  {
    id: "slider",
    label: "Range Slider",
    category: "legal", // Fits nicely for "Pain Level"
    tags: ["range", "scale", "pain", "1-10"],
    description: "Visual slider for gradients/ratings.",
    defaultField: { 
      kind: "slider", 
      title: "Pain Level (1-10)", 
      min: 1, 
      max: 10, 
      layout: { width: "full" } 
    },
  },
  {
    id: "address_block",
    label: "Address Block",
    category: "smart_block",
    tags: ["location", "street", "city", "zip"],
    description: "Full address capture fields.",
    defaultFields: [
      { kind: "header", title: "Address", layout: { width: "full" } },
      { kind: "text", title: "Street Address", layout: { width: "full" } },
      { kind: "text", title: "City", layout: { width: "half" } },
      { kind: "text", title: "State / Province", layout: { width: "half" } },
      { kind: "text", title: "Postal Code", layout: { width: "half" } },
      { kind: "text", title: "Country", layout: { width: "half" } },
    ],
  },
];