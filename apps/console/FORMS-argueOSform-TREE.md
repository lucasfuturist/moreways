# File Scan

**Roots:**

- `C:\projects\moreways\argueOS-v1-form\src\forms`


## Tree: C:\projects\moreways\argueOS-v1-form\src\forms

```
forms/

├── [id]/
│   ├── editor/
│   │   ├── page.tsx
├── data/
│   ├── starterTemplates.ts
├── logic/
│   ├── forms.logic.evaluateSubmissionFlags.ts
│   ├── forms.logic.mergeExtraction.ts
│   ├── forms.logic.naturalizer.ts
│   ├── forms.logic.schemaIterator.ts
├── repo/
│   ├── forms.repo.FormSchemaRepo.ts
├── runner/
│   ├── useChatRunnerController.ts
├── schema/
│   ├── forms.schema.ElementCatalog.ts
│   ├── forms.schema.FormFieldValues.ts
│   ├── forms.schema.FormSchemaJsonShape.ts
│   ├── forms.schema.FormSchemaModel.ts
├── ui/
│   ├── CrmDashboard.tsx
│   ├── ai/
│   │   ├── AssistantPanel.tsx
│   │   ├── FieldAiPromptBubble.tsx
│   ├── canvas/
│   │   ├── DraggableFieldList.tsx
│   │   ├── FieldMicroEditor.tsx
│   │   ├── FieldToolbar.tsx
│   │   ├── FloatingFieldEditor.tsx
│   │   ├── ReactiveCanvas.tsx
│   │   ├── field-actions.ts
│   │   ├── forms.ui.canvas.FieldRenderer.tsx
│   ├── dashboard/
│   │   ├── DashboardComponents.tsx
│   │   ├── FormCard.tsx
│   ├── editor/
│   │   ├── HistoryControl.tsx
│   │   ├── VersionHistorySlider.tsx
│   ├── forms.ui.FormEditor.tsx
│   ├── guardrails/
│   │   ├── PiiWarning.tsx
│   ├── hooks/
│   │   ├── forms.ui.hooks.useHistory.ts
│   ├── inspector/
│   │   ├── forms.ui.inspector.DataSettings.tsx
│   │   ├── forms.ui.inspector.LogicEditor.tsx
│   ├── inventory/
│   │   ├── ElementInventory.tsx
│   ├── overlays/
│   │   ├── CommandPalette.tsx
│   │   ├── SaveFormDialog.tsx
│   │   ├── ShareDialog.tsx
│   ├── runner/
│   │   ├── ChatRunner.tsx
│   │   ├── FormRunner.tsx
│   │   ├── LiveFormView.tsx
│   │   ├── UnifiedRunner.tsx
│   │   ├── buildChatContext.ts
│   │   ├── components/
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── ChatInputBar.tsx
│   │   │   ├── FieldAssistantBubble.tsx
│   │   │   ├── IntakeChatMessage.tsx
│   │   │   ├── ReviewOverlay.tsx
│   │   │   ├── SectionSidebar.tsx
│   │   │   ├── ThinkingBubble.tsx
│   ├── simulator/
│   │   ├── AutoFillEngine.ts
│   │   ├── SimulatorOverlay.tsx
├── util/
│   ├── forms.util.elementInjector.ts
│   ├── forms.util.formSchemaNormalizer.ts
│   ├── forms.util.migrateSchema.ts
│   ├── forms.util.publicMapper.ts

```

## Files

### `C:/projects/moreways/argueOS-v1-form/src/forms/data/starterTemplates.ts`

```ts
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export interface StarterTemplate {
  id: string;
  name: string;
  category: "Torts" | "Family" | "Corporate" | "Labor";
  description: string;
  schema: FormSchemaJsonShape;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "t1",
    name: "Personal Injury Intake",
    category: "Torts",
    description: "Standard slip & fall data collection with incident details.",
    schema: {
      type: "object",
      properties: {
        clientInfo: { id: "f_1", key: "clientInfo", kind: "header", title: "Client Information" },
        fullName: { id: "f_2", key: "fullName", kind: "text", title: "Full Name", isRequired: true },
        phone: { id: "f_3", key: "phone", kind: "phone", title: "Phone Number", isRequired: true },
        incidentDetails: { id: "f_4", key: "incidentDetails", kind: "header", title: "Incident Details" },
        dateOfIncident: { id: "f_5", key: "dateOfIncident", kind: "date", title: "Date of Incident", isRequired: true },
        description: { id: "f_6", key: "description", kind: "textarea", title: "Description of Events", layout: { width: "full" } },
        injuries: { id: "f_7", key: "injuries", kind: "textarea", title: "Injuries Sustained" }
      },
      order: ["clientInfo", "fullName", "phone", "incidentDetails", "dateOfIncident", "description", "injuries"],
      required: ["fullName", "phone", "dateOfIncident"]
    }
  },
  {
    id: "t2",
    name: "Simple NDA Generator",
    category: "Corporate",
    description: "Confidentiality agreement inputs for two parties.",
    schema: {
      type: "object",
      properties: {
        partyA: { id: "f_1", key: "partyA", kind: "header", title: "Disclosing Party" },
        nameA: { id: "f_2", key: "nameA", kind: "text", title: "Entity Name", isRequired: true },
        repA: { id: "f_3", key: "repA", kind: "text", title: "Representative Name" },
        partyB: { id: "f_4", key: "partyB", kind: "header", title: "Receiving Party" },
        nameB: { id: "f_5", key: "nameB", kind: "text", title: "Entity Name", isRequired: true },
        terms: { id: "f_6", key: "terms", kind: "header", title: "Terms" },
        duration: { id: "f_7", key: "duration", kind: "number", title: "Duration (Years)", isRequired: true },
        jurisdiction: { 
            id: "f_8", key: "jurisdiction", kind: "select", title: "Jurisdiction", 
            options: [
                { id: "o_1", label: "Delaware", value: "DE" }, 
                { id: "o_2", label: "California", value: "CA" }, 
                { id: "o_3", label: "New York", value: "NY" }
            ] 
        }
      },
      order: ["partyA", "nameA", "repA", "partyB", "nameB", "terms", "duration", "jurisdiction"],
      required: ["nameA", "nameB", "duration"]
    }
  },
  {
    id: "t3",
    name: "Divorce Consultation",
    category: "Family",
    description: "Initial intake for marital dissolution inquiries.",
    schema: {
      type: "object",
      properties: {
        basics: { id: "f_1", key: "basics", kind: "header", title: "Basics" },
        marriageDate: { id: "f_2", key: "marriageDate", kind: "date", title: "Date of Marriage" },
        separationDate: { id: "f_3", key: "separationDate", kind: "date", title: "Date of Separation" },
        children: { id: "f_4", key: "children", kind: "checkbox", title: "Are there minor children?" },
        assets: { id: "f_5", key: "assets", kind: "header", title: "Assets" },
        realEstate: { id: "f_6", key: "realEstate", kind: "checkbox", title: "Do you own real estate?" },
        notes: { id: "f_7", key: "notes", kind: "textarea", title: "Additional Notes" }
      },
      order: ["basics", "marriageDate", "separationDate", "children", "assets", "realEstate", "notes"],
      required: []
    }
  }
];
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/logic/forms.logic.evaluateSubmissionFlags.ts`

```ts
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
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/logic/forms.logic.mergeExtraction.ts`

```ts
// src/forms/logic/forms.logic.mergeExtraction.ts

/**
 * forms.logic.mergeExtraction
 *
 * Merge an ExtractionResult JSON patch into the current form data.
 *
 * Guardrails:
 * - Drop updates for unknown field keys (not in schema.properties).
 * - For already-answered fields:
 *   - Only overwrite if isCorrection === true.
 *   - Otherwise ignore.
 * - Coerce values by FormFieldDefinition.kind when possible.
 */

import { logger } from "@/infra/logging/infra.svc.logger";
import type {
  FormSchemaJsonShape,
  FormFieldDefinition,
} from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import type {
  ExtractionResult,
  FieldUpdate,
} from "@/llm/schema/llm.schema.ExtractionResult";

export interface MergeExtractionResult {
  nextFormData: Record<string, unknown>;
  /**
   * Keys that were successfully applied to nextFormData.
   */
  appliedFieldKeys: string[];
  /**
   * Keys that were rejected (unknown in schema, invalid type, or blocked overwrite).
   */
  droppedFieldKeys: string[];
  /**
   * Trait values extracted during this merge (raw).
   */
  traitValues: Record<string, unknown>;
}

/**
 * Coerce the raw value coming from the LLM into something that makes sense for
 * the given FormFieldDefinition.kind.
 *
 * NOTE: This is intentionally conservative. If coercion fails, we return undefined,
 * and the caller treats it as a dropped update.
 */
function coerceFieldValue(def: FormFieldDefinition, raw: unknown): unknown {
  if (raw === null || raw === undefined) return undefined;

  switch (def.kind) {
    case "date": {
      if (typeof raw === "string") return raw;
      if (raw instanceof Date) return raw.toISOString();
      return String(raw);
    }

    case "number":
    case "currency": {
      const n = typeof raw === "number" ? raw : Number(raw);
      return Number.isFinite(n) ? n : undefined;
    }

    case "checkbox":
    case "switch": {
      if (typeof raw === "boolean") return raw;
      if (typeof raw === "string") {
        const lower = raw.toLowerCase().trim();
        if (["yes", "true", "y", "1"].includes(lower)) return true;
        if (["no", "false", "n", "0"].includes(lower)) return false;
      }
      return undefined;
    }

    case "select":
    case "radio": {
      return typeof raw === "string" ? raw : String(raw);
    }

    default: {
      // Fallback for:
      // - text, textarea, phone, email, etc.
      // - multiSelect-like arrays (if your schema eventually supports them)
      // - file-like objects (if your schema includes those later)
      if (Array.isArray(raw)) {
        return raw.map((v) => String(v));
      }

      if (typeof raw === "object") {
        return raw; // tolerate file descriptors or object uploads
      }

      return String(raw);
    }
  }
}


/**
 * Merge an ExtractionResult into an existing flat formData object.
 *
 * - formData: current values keyed by field key.
 * - extraction: JSON patch from the LLM.
 * - schema: canonical schema for the form.
 */
export function mergeExtractionIntoFormData(
  formData: Record<string, unknown>,
  extraction: ExtractionResult,
  schema: FormSchemaJsonShape
): MergeExtractionResult {
  const nextFormData: Record<string, unknown> = { ...formData };
  const appliedFieldKeys: string[] = [];
  const droppedFieldKeys: string[] = [];
  const traitValues: Record<string, unknown> = {};

  // --- FIELD UPDATES ---

  const updates = extraction.updates ?? {};

  for (const [key, update] of Object.entries<FieldUpdate>(updates as any)) {
    const fieldDef = schema.properties[key];

    if (!fieldDef) {
      // Unknown field -> drop.
      droppedFieldKeys.push(key);
      continue;
    }

    const existingValue = formData[key];

    // Overwrite guard: only allow overwrite if isCorrection === true.
    if (
      existingValue !== undefined &&
      (update.isCorrection === undefined || update.isCorrection === false)
    ) {
      droppedFieldKeys.push(key);
      continue;
    }

    const coerced = coerceFieldValue(fieldDef as FormFieldDefinition, update.value);

    if (coerced === undefined) {
      droppedFieldKeys.push(key);
      continue;
    }

    nextFormData[key] = coerced;
    appliedFieldKeys.push(key);
  }

  // --- TRAITS ---

  const traits = extraction.traits ?? {};
  for (const [key, t] of Object.entries(traits)) {
    traitValues[key] = (t as any).value;
  }

  logger.debug("[mergeExtractionIntoFormData] Applied extraction patch", {
    appliedFieldKeys,
    droppedFieldKeys,
    traitCount: Object.keys(traitValues).length,
  });

  return {
    nextFormData,
    appliedFieldKeys,
    droppedFieldKeys,
    traitValues,
  };
}

```

### `C:/projects/moreways/argueOS-v1-form/src/forms/logic/forms.logic.naturalizer.ts`

```ts
// src/forms/logic/forms.logic.naturalizer.ts

import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

const GREETINGS = [
  "Let's start with the basics.",
  "First things first.",
  "To get started,",
  "Let's begin."
];

const TRANSITIONS = [
  "Got it.",
  "Understood.",
  "Okay.",
  "Thanks.",
  "Noted.",
  "Alright.",
  "Moving on,"
];

/**
 * Cleans a field title for insertion into a sentence.
 * "Date of Incident" -> "date of incident"
 * "First Name" -> "first name"
 */
function cleanTitle(title: string): string {
  return title.trim().replace(/\?$/, ""); // Remove trailing question mark
}

/**
 * Returns a random phrasing from an array.
 */
function pick(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)];
}

export function generateNaturalQuestion(
  def: FormFieldDefinition, 
  isFirstField: boolean = false
): string {
  // 1. If the title is already a question, just use it.
  if (def.title.trim().endsWith("?")) {
    return def.title;
  }

  const label = cleanTitle(def.title);
  const lowerLabel = label.toLowerCase();

  // 2. Handle specific "Known Concepts" (The "Smart" part)
  
  // Names
  if (lowerLabel.includes("name")) {
    if (lowerLabel.includes("full")) return pick(["Could you provide your full name?", "What is your full name?", "Please enter your full name."]);
    if (lowerLabel.includes("first")) return pick(["What is your first name?", "Could I get your first name?"]);
    if (lowerLabel.includes("last")) return pick(["And your last name?", "What is your last name?"]);
  }

  // Contact
  if (def.kind === "email" || lowerLabel.includes("email")) {
    return pick(["What is the best email address to reach you?", "Please provide your email address.", "What's your email?"]);
  }
  if (def.kind === "phone" || lowerLabel.includes("phone") || lowerLabel.includes("number")) {
    return pick(["What is a good phone number for you?", "Please enter your phone number.", "How can we reach you by phone?"]);
  }

  // Dates
  if (def.kind === "date" || lowerLabel.includes("date") || lowerLabel.includes("when")) {
    return pick([`When is the ${label}?`, `What is the ${label}?`, `Could you select the ${label}?`]);
  }

  // Descriptions / Long Text
  if (def.kind === "textarea" || lowerLabel.includes("describe") || lowerLabel.includes("tell us")) {
    return pick([
      `Please describe the ${label}.`, 
      `Can you tell me about the ${label}?`, 
      `In your own words, what is the ${label}?`
    ]);
  }

  // 3. Generic Fallbacks (Varied phrasing)
  const prefix = isFirstField ? pick(GREETINGS) + " " : "";
  
  const templates = [
    `What is the ${label}?`,
    `Please enter the ${label}.`,
    `Could you provide the ${label}?`,
    `Next, looking for the ${label}.`
  ];

  return prefix + pick(templates);
}

export function generateNaturalTransition(): string {
  return pick(TRANSITIONS);
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/logic/forms.logic.schemaIterator.ts`

```ts
/**
 * forms.logic.schemaIterator
 *
 * Determines the linear flow of a form session.
 * Handles:
 * - Field ordering
 * - Skipping hidden fields (logic)
 * - Skipping ALREADY FILLED fields (auto-advance)
 */

import type { FormSchemaJsonShape, FormFieldDefinition, LogicCondition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

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
  if (!field.logic) return true; 
  let isVisible = true; 
  const hasShowLogic = field.logic.some(r => r.action === "show");
  if (hasShowLogic) isVisible = false;

  for (const rule of field.logic) {
    let match = false;
    const when = rule.when;

    if (when.allOf) match = when.allOf.every(c => checkCondition(data, c));
    else if (when.anyOf) match = when.anyOf.some(c => checkCondition(data, c));
    else if (when.fieldKey && when.operator) match = checkCondition(data, { fieldKey: when.fieldKey, operator: when.operator, value: when.value } as any);

    if (match) {
      if (rule.action === "show") isVisible = true;
      if (rule.action === "hide") isVisible = false;
    }
  }
  return isVisible;
}

// [NEW] Helper to check if field has data
function isFieldFilled(val: any): boolean {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'number') return true; // 0 is a value
  if (typeof val === 'boolean') return true;
  return false;
}

export function getNextFieldKey(
  schema: FormSchemaJsonShape,
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
    if (def.kind === 'divider') continue;

    // 1. Logic Check (Is it visible?)
    if (!evaluateShowHide(currentData, def)) continue;

    // 2. [NEW] Data Check (Is it already filled?)
    // We skip non-structural fields that already have data.
    // Headers/Info are "structural" and usually don't have data, so we don't skip them 
    // based on value (they are always "empty"). The ChatRunner handles auto-skipping headers.
    if (def.kind !== 'header' && def.kind !== 'info') {
       if (isFieldFilled(currentData[key])) {
         continue; // Skip this field, it's done.
       }
    }

    return key;
  }

  return null; // End of form
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/repo/forms.repo.FormSchemaRepo.ts`

```ts
/**
 * Module: FormSchemaRepo
 *
 * - Mirrors the `form_schemas` table.
 * - Handles persistence of form schemas.
 * - Auto-migrates legacy schemas to v1.5/v1.6 on read.
 */

import type { Prisma } from "@prisma/client";
import { db } from "@/infra/db/infra.repo.dbClient";
import { logger } from "@/infra/logging/infra.svc.logger";
import {
  FormSchema,
  FormSchemaCreateInput,
  mapDbFormSchemaRowToDomain,
} from "../schema/forms.schema.FormSchemaModel";
import { migrateSchemaToV15 } from "@/forms/util/forms.util.migrateSchema";

// Extended Type for Dashboard
export interface FormSchemaWithStats extends FormSchema {
  _count: {
    formSubmissions: number;
  };
}

// Lightweight summary for history sliders
export interface FormVersionSummary {
  id: string;
  version: number;
  createdAt: Date;
}

export interface FormSchemaRepo {
  createVersion(input: FormSchemaCreateInput): Promise<FormSchema>;
  getLatestByName(params: { organizationId: string; name: string }): Promise<FormSchema | null>;
  getById(params: { organizationId: string; id: string }): Promise<FormSchema | null>;
  getPublicById(id: string): Promise<FormSchema | null>;
  // [NEW] Added this method to the Interface
  getBySlug(slug: string): Promise<FormSchema | null>;
  listByOrg(orgId: string): Promise<FormSchemaWithStats[]>;
  listVersionsByName(params: { organizationId: string; name: string }): Promise<FormVersionSummary[]>;
}

class PrismaFormSchemaRepo implements FormSchemaRepo {
  async createVersion(input: FormSchemaCreateInput): Promise<FormSchema> {
    const { organizationId, name, schemaJson } = input;

    const latest = await db.formSchema.findFirst({
      where: { organizationId, name },
      orderBy: { version: "desc" },
    });

    const nextVersion = (latest?.version ?? 0) + 1;

    // Ensure we are persisting a clean schema
    const cleanSchema = migrateSchemaToV15(schemaJson);

    try {
      const created = await db.formSchema.create({
        data: {
          organizationId,
          name,
          version: nextVersion,
          schemaJson: cleanSchema as unknown as Prisma.InputJsonValue,
          isDeprecated: false,
        },
      });

      logger.info("Created new form schema version", { id: created.id, version: nextVersion }, { organizationId });

      const domain = mapDbFormSchemaRowToDomain(created);
      domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
      return domain;

    } catch (e: any) {
      // Auto-heal missing organization in development environment
      const isFkError = e.code === 'P2003' || (typeof e.message === 'string' && e.message.includes('Foreign key constraint failed'));
      const isDev = process.env.NODE_ENV !== 'production';

      if (isFkError && isDev) {
        logger.warn("[FormSchemaRepo] FK Error detected in DEV. Attempting to seed missing organization...", { organizationId });
        
        try {
            await db.organization.upsert({
              where: { id: organizationId },
              update: {},
              create: {
                id: organizationId,
                name: "Local Dev Org",
                slug: "local-dev"
              }
            });

            // Retry the create
            const retry = await db.formSchema.create({
              data: {
                organizationId,
                name,
                version: nextVersion,
                schemaJson: cleanSchema as unknown as Prisma.InputJsonValue,
                isDeprecated: false,
              },
            });
            
            logger.info("[FormSchemaRepo] Auto-heal successful. Schema created.");
            
            const domain = mapDbFormSchemaRowToDomain(retry);
            domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
            return domain;

        } catch (innerErr) {
            logger.error("[FormSchemaRepo] Auto-heal failed.", { error: innerErr });
        }
      }
      
      throw e;
    }
  }

  async getLatestByName(params: { organizationId: string; name: string }): Promise<FormSchema | null> {
    const { organizationId, name } = params;
    const row = await db.formSchema.findFirst({
      where: { organizationId, name },
      orderBy: { version: "desc" },
    });
    if (!row) return null;
    const domain = mapDbFormSchemaRowToDomain(row);
    domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
    return domain;
  }

  async getById(params: { organizationId: string; id: string }): Promise<FormSchema | null> {
    const { organizationId, id } = params;
    const row = await db.formSchema.findFirst({
      where: { id, organizationId },
    });
    if (!row) return null;
    const domain = mapDbFormSchemaRowToDomain(row);
    domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
    return domain;
  }

  // [NEW] Implementation for Fetching by Slug
  async getBySlug(slug: string): Promise<FormSchema | null> {
    const row = await db.formSchema.findFirst({
      where: { 
        slug: slug,
        isPublished: true 
      },
      orderBy: { version: 'desc' }, // Get latest published version
    });

    if (!row) return null;

    const domain = mapDbFormSchemaRowToDomain(row);
    domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
    return domain;
  }

  async listByOrg(orgId: string): Promise<FormSchemaWithStats[]> {
    const rows = await db.formSchema.findMany({
      where: { organizationId: orgId },
      orderBy: { updatedAt: 'desc' },
      distinct: ['name'],
      include: {
        _count: {
          select: { formSubmissions: true }
        }
      }
    });
    
    return rows.map(row => {
      const domain = mapDbFormSchemaRowToDomain(row);
      domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
      return {
        ...domain,
        _count: { formSubmissions: row._count.formSubmissions }
      };
    });
  }

  async listVersionsByName(params: { organizationId: string; name: string }): Promise<FormVersionSummary[]> {
    const rows = await db.formSchema.findMany({
      where: { 
        organizationId: params.organizationId,
        name: params.name 
      },
      orderBy: { version: 'asc' },
      select: {
        id: true,
        version: true,
        createdAt: true
      }
    });
    return rows;
  }

  async getPublicById(id: string): Promise<FormSchema | null> {
    const row = await db.formSchema.findUnique({
      where: { id },
    });
    
    if (!row) return null;

    const domain = mapDbFormSchemaRowToDomain(row);
    domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
    return domain;
  }
}

export const formSchemaRepo: FormSchemaRepo = new PrismaFormSchemaRepo();
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/runner/useChatRunnerController.ts`

```ts
"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export interface ChatMessage {
  id: string;
  variant: "agent" | "user";
  content: string;
}

export function useChatRunnerController({ formName, schema }: { formName: string, schema: FormSchemaJsonShape }) {
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isThinking, setIsThinking] = useState(false);

  // Init
  useEffect(() => {
    const initialData: Record<string, any> = {};
    searchParams.forEach((val, key) => initialData[key] = val);
    setFormData(initialData);
    setHistory([{ id: "init", variant: "agent", content: `Hello! I am ${formName}. Let's begin.` }]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, isThinking]);

  const handleAnswer = async (answer: string) => {
    if (!answer.trim()) return;

    // 1. Add User Message
    setHistory(prev => [...prev, { id: Date.now().toString(), variant: "user", content: answer }]);
    setIsThinking(true);

    try {
      // 2. Call API
      const res = await fetch("/api/intake/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schema, currentData: formData, userMessage: answer }),
      });
      
      const json = await res.json();

      // 3. VISUAL LOGGING (Check F12 Console)
      if (json.debugLog) {
        console.group("%c🧠 Simple Engine Logs", "background: #222; color: #bada55");
        json.debugLog.forEach((l: any) => {
            if (l.label === "📄 FULL JSON STATE") {
                console.log("%c📄 FULL JSON STATE:", "color: orange; font-weight: bold;", l.data);
            } else {
                console.log(l.label, l.data);
            }
        });
        console.groupEnd();
      }

      // 4. Update UI
      setFormData(json.updatedData);
      setHistory(prev => [...prev, { id: Date.now().toString(), variant: "agent", content: json.replyMessage }]);

    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return { history, isThinking, handleAnswer, scrollRef };
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/schema/forms.schema.ElementCatalog.ts`

```ts
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
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/schema/forms.schema.FormFieldValues.ts`

```ts
/**
 * forms.schema.FormFieldValues
 *
 * Defines the shape of the data stored in a form submission.
 * Simple key-value map where values can be primitives or arrays (for multiselect).
 */
export type FormFieldValues = Record<string, unknown>;
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/schema/forms.schema.FormSchemaJsonShape.ts`

```ts
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
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/schema/forms.schema.FormSchemaModel.ts`

```ts
/**
 * Module: FormSchemaModel
 *
 * - Mirrors the `form_schemas` table as defined in 04-data-and-api-spec.md.
 * - Used by FormSchemaRepo and any services that work with form definitions.
 * - JSON column (`schemaJson`) is strongly typed as FormSchemaJsonShape.
 *
 * Critical guarantees:
 * - [MULTI-TENANT] All access must be scoped by organizationId.
 * - [SECURITY] No PII is stored here beyond what belongs in schema metadata.
 */

import type { FormSchema as PrismaFormSchema } from "@prisma/client";
import type { FormSchemaJsonShape } from "./forms.schema.FormSchemaJsonShape";

/**
 * Domain-level representation of a form schema.
 *
 * This is what services and UI-facing mappers should use.
 */
export interface FormSchema {
  id: string;
  organizationId: string;
  name: string;
  version: number;

  /**
   * The normalized, JSON-Schema-like definition for this form.
   * See FormSchemaJsonShape for details.
   */
  schemaJson: FormSchemaJsonShape;

  /**
   * When true, this version should not be used for new intakes,
   * but may still be referenced historically by submissions.
   */
  isDeprecated: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input shape when creating a new versioned form schema.
 *
 * Note:
 * - `version` is assigned by the repo (FormSchemaRepo.createVersion).
 * - `id` is assigned by the DB / Prisma.
 */
export interface FormSchemaCreateInput {
  organizationId: string;
  name: string;
  schemaJson: FormSchemaJsonShape;
}

/**
 * Thin alias for the raw Prisma row type.
 *
 * This keeps infra details (Prisma) separate from domain types while still
 * allowing repos to work with the generated client.
 */
export type DbFormSchemaRow = PrismaFormSchema;

/**
 * Map a raw Prisma row into the domain-level FormSchema type.
 * This keeps casting of JSON confined to one place.
 */
export function mapDbFormSchemaRowToDomain(row: DbFormSchemaRow): FormSchema {
  return {
    id: row.id,
    organizationId: row.organizationId,
    name: row.name,
    version: row.version,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    schemaJson: row.schemaJson as unknown as FormSchemaJsonShape,
    isDeprecated: row.isDeprecated,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/CrmDashboard.tsx`

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { FormSchema } from "@/forms/schema/forms.schema.FormSchemaModel";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

// --- Types ---
interface SubmissionSummary { id: string; createdAt: string; submissionData: Record<string, any>; }
interface SubmissionDetail extends SubmissionSummary { schemaSnapshot: { properties: Record<string, FormFieldDefinition>; order?: string[]; }; }

// --- Custom Form Selector (Dark Theme) ---
function FormSelector({ forms, selectedId, onChange }: { forms: FormSchema[], selectedId: string, onChange: (id: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedForm = forms.find(f => f.id === selectedId);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-[240px] px-3 py-2 text-sm bg-slate-950 border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-400/70 transition-all hover:border-slate-500"
      >
        <span className="truncate">{selectedForm ? selectedForm.name : "Select Form..."}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={clsx("ml-2 text-slate-400 transition-transform", isOpen && "rotate-180")}><path d="M6 9l6 6 6-6"/></svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[240px] bg-slate-950 border border-slate-700 rounded-md shadow-xl shadow-black/60 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-[300px] overflow-y-auto py-1">
            <div className="px-3 py-2 text-xs uppercase tracking-wide text-slate-500 font-semibold select-none">
              Available Forms
            </div>
            {forms.map(f => (
              <button
                key={f.id}
                onClick={() => { onChange(f.id); setIsOpen(false); }}
                className={clsx(
                  "w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between group",
                  f.id === selectedId 
                    ? "bg-emerald-500/10 text-emerald-100" 
                    : "text-slate-200 hover:bg-slate-800 hover:text-white"
                )}
              >
                <span className="truncate">{f.name}</span>
                {f.id === selectedId && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            ))}
            {forms.length === 0 && <div className="px-3 py-2 text-xs text-slate-500 italic">No forms found</div>}
          </div>
          <div className="border-t border-slate-800 p-1 bg-slate-900/50">
             <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                Create New Form
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper: Column Extractor ---
function inferColumns(data: Record<string, any>) {
  const keys = Object.keys(data);
  const nameKey = keys.find(k => /name|full/i.test(k)) || keys[0];
  const emailKey = keys.find(k => /email|mail/i.test(k));
  const phoneKey = keys.find(k => /phone|mobile|cell/i.test(k));
  return {
    name: data[nameKey] || "—",
    email: emailKey ? data[emailKey] : "—",
    phone: phoneKey ? data[phoneKey] : "—",
  };
}

export default function CrmDashboard() {
  const router = useRouter();
  const [forms, setForms] = useState<FormSchema[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>("");
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    fetch("/api/forms").then(res => res.json()).then(data => {
        setForms(data);
        if (data.length > 0) setSelectedFormId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedFormId) return;
    setIsLoadingList(true);
    setSelectedSubmissionId(null);
    fetch(`/api/crm/submissions?formId=${selectedFormId}`)
      .then(res => res.json())
      .then(data => {
        setSubmissions(Array.isArray(data) ? data : []);
        setIsLoadingList(false);
      });
  }, [selectedFormId]);

  useEffect(() => {
    if (!selectedSubmissionId) { setDetail(null); return; }
    setIsLoadingDetail(true);
    fetch(`/api/crm/submissions/${selectedSubmissionId}`)
      .then(res => res.json()).then(data => { setDetail(data); setIsLoadingDetail(false); });
  }, [selectedSubmissionId]);

  const handleCopyLink = () => {
    if (!selectedFormId) return;
    const url = `${window.location.origin}/s/${selectedFormId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  const renderDetailContent = () => {
    if (!selectedSubmissionId) return <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-40"><div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div><p className="text-sm font-medium text-slate-300">Select a submission</p></div>;
    if (isLoadingDetail || !detail) return <div className="h-full flex items-center justify-center text-xs text-slate-500 animate-pulse">Loading details...</div>;

    const { schemaSnapshot, submissionData } = detail;
    const fieldOrder = schemaSnapshot.order || Object.keys(schemaSnapshot.properties || {});
    const cols = inferColumns(submissionData);

    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex-none p-6 border-b border-white/10 bg-slate-900/50">
            <h2 className="text-xl font-bold text-slate-100">{cols.name}</h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">New</span>
                <span>{new Date(detail.createdAt).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6">
                 <a href={`mailto:${cols.email}`} className="flex items-center justify-center gap-2 py-2 bg-white/5 rounded-md text-xs font-medium hover:bg-white/10 hover:text-white transition-colors border border-white/5 text-slate-300">Email Client</a>
                 <button className="flex items-center justify-center gap-2 py-2 bg-white/5 rounded-md text-xs font-medium hover:bg-white/10 hover:text-white transition-colors border border-white/5 text-slate-300">Copy Data</button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {fieldOrder.map(key => {
             const def = schemaSnapshot.properties[key];
             if (!def || def.kind === 'info' || def.kind === 'divider') return null;
             if (def.kind === 'header') return <div key={key} className="pt-4 pb-1 border-b border-white/5"><h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{def.title}</h4></div>;
             return (
               <div key={key} className="space-y-1.5">
                 <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">{def.title}</label>
                 <div className="text-sm text-slate-200 bg-slate-950 p-3 rounded border border-slate-800 min-h-[42px] flex items-center">
                    {submissionData[key] ? String(submissionData[key]) : <span className="text-slate-700 italic text-xs">Empty</span>}
                 </div>
               </div>
             )
           })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-950 text-slate-200">
      {/* Compact Header */}
      <div className="flex-none px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950 z-20">
        <div className="flex items-center gap-4">
            <h1 className="text-base font-semibold text-slate-100">Inbox</h1>
            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/50">Beta</span>
        </div>
        <div className="flex items-center gap-3">
             <FormSelector forms={forms} selectedId={selectedFormId} onChange={setSelectedFormId} />
             <div className="h-5 w-px bg-slate-800" />
             <Button size="sm" variant="ghost" disabled={submissions.length === 0} className={clsx("h-9 text-xs", submissions.length === 0 && "opacity-40")}>Export CSV</Button>
             <button onClick={() => router.push('/forms/new-from-prompt')} className="h-9 text-xs font-medium text-slate-400 hover:text-white px-3 rounded hover:bg-white/5 transition-colors">+ New Form</button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="h-8 border-b border-slate-800 bg-slate-900/50 flex items-center px-6 gap-4 text-[11px] font-medium text-slate-500 flex-none">
          <span>{submissions.length} submissions</span>
          <span className="text-slate-700">|</span>
          <span>Last updated: {submissions.length > 0 ? "Just now" : "—"}</span>
      </div>

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: List */}
        <div className="w-[55%] border-r border-slate-800 flex flex-col bg-slate-900/20">
           <div className="flex items-center h-9 border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase font-bold text-slate-500 px-4 flex-none">
               <div className="w-[30%] pl-2">Client</div><div className="w-[30%]">Email</div><div className="w-[20%]">Phone</div><div className="w-[20%] text-right pr-2">Date</div>
           </div>
           <div className="flex-1 overflow-y-auto">
               {isLoadingList ? <div className="p-4 space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-slate-800/50 rounded animate-pulse" />)}</div> : 
               submissions.length === 0 ? (
                   <div className="h-full flex items-center justify-center p-8">
                       <GlassCard className="max-w-sm w-full text-center p-8 flex flex-col items-center border-dashed border-slate-700 bg-slate-900/50">
                           <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                           <h3 className="text-sm font-bold text-slate-200 mb-1">No submissions yet</h3>
                           <p className="text-xs text-slate-500 mb-4">Share your form to collect data.</p>
                           <Button onClick={handleCopyLink} className="h-8 text-xs w-full justify-center">Copy Link</Button>
                       </GlassCard>
                   </div>
               ) : (
                   <div className="divide-y divide-slate-800/50">
                       {submissions.map(sub => {
                           const cols = inferColumns(sub.submissionData);
                           const isSelected = selectedSubmissionId === sub.id;
                           return (
                               <div key={sub.id} onClick={() => setSelectedSubmissionId(sub.id)} className={clsx("flex items-center h-12 px-4 cursor-pointer transition-colors text-sm group", isSelected ? "bg-slate-800 border-l-2 border-emerald-500" : "hover:bg-slate-800/50 border-l-2 border-transparent")}>
                                   <div className={clsx("w-[30%] pl-2 truncate font-medium", isSelected ? "text-white" : "text-slate-300 group-hover:text-white")}>{cols.name}</div>
                                   <div className="w-[30%] truncate text-slate-500 text-xs">{cols.email}</div>
                                   <div className="w-[20%] truncate text-slate-600 text-xs">{cols.phone}</div>
                                   <div className="w-[20%] text-right pr-2 text-slate-600 text-[10px]">{new Date(sub.createdAt).toLocaleDateString()}</div>
                               </div>
                           )
                       })}
                   </div>
               )}
           </div>
        </div>
        {/* RIGHT: Detail */}
        <div className="flex-1 bg-black/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
            {renderDetailContent()}
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/forms.ui.FormEditor.tsx`

```tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormSchema } from "@/forms/schema/forms.schema.FormSchemaModel";
import type { FormSchemaJsonShape, FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import type { FormVersionSummary } from "@/forms/repo/forms.repo.FormSchemaRepo";
import { ReactiveCanvas } from "./canvas/ReactiveCanvas";
import { Button } from "@/components/ui/Button";
import { VersionHistorySlider } from "./editor/VersionHistorySlider";
import { useDebounce } from "@/infra/ui/hooks/useDebounce";
import { ShieldAlert, ArrowLeft, Settings, Save } from "lucide-react"; 

// Internal state representation
interface FieldEntry {
  key: string;
  def: FormFieldDefinition;
  isRequired: boolean;
}

interface FormEditorProps {
  formId: string;
}

export default function FormEditor({ formId }: FormEditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  // [INTEGRATION] Context Awareness
  const context = searchParams.get("context");
  const isAdmin = context === "admin";
  
  // [UX] Default to "saved" so it's visible immediately
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "error">("saved");
  
  const [formMeta, setFormMeta] = useState<FormSchema | null>(null);
  const [fields, setFields] = useState<FieldEntry[]>([]);
  
  // [AUTOSAVE] Track changes to trigger save
  const debouncedFields = useDebounce(fields, 1000); 
  
  const lastSavedState = useRef<string>(""); 

  // History State
  const [versions, setVersions] = useState<FormVersionSummary[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState(formId);

  // 1. Fetch Form + Versions
  useEffect(() => {
    loadFormAndVersions(formId);
  }, [formId]);

  async function loadFormAndVersions(id: string) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/forms/${id}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as FormSchema;
        setFormMeta(data);
        setCurrentVersionId(data.id);

        const schema = data.schemaJson;
        const requiredSet = new Set(schema.required || []);
        const entries: FieldEntry[] = (schema.order || Object.keys(schema.properties)).map((key) => {
            const def = schema.properties[key];
            if (!def) return null;
            return {
                key,
                def,
                isRequired: requiredSet.has(key),
            };
        }).filter((x): x is FieldEntry => x !== null);
        
        setFields(entries);
        
        lastSavedState.current = JSON.stringify(entries);

        const vRes = await fetch(`/api/forms/${id}/versions`);
        if (vRes.ok) {
            const vData = await vRes.json();
            setVersions(vData);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
  }

  // [AUTOSAVE] Effect
  useEffect(() => {
    if (isLoading) return;
    handleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFields]);

  const handleSave = async () => {
    const currentJson = JSON.stringify(fields);
    if (currentJson === lastSavedState.current) {
        return; 
    }

    setSaveStatus("saving");
    try {
      const properties: Record<string, FormFieldDefinition> = {};
      const required: string[] = [];
      const order: string[] = [];

      fields.forEach((f) => {
        properties[f.key] = f.def;
        order.push(f.key);
        if (f.isRequired) required.push(f.key);
      });

      const newSchema: FormSchemaJsonShape = { type: "object", properties, required, order };
      
      await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schema: newSchema }),
      });
      
      const vRes = await fetch(`/api/forms/${formId}/versions`);
      if (vRes.ok) {
          const vData = await vRes.json();
          setVersions(vData);
          if (formMeta) setFormMeta({ ...formMeta, version: (formMeta.version || 0) + 1 });
      }
      
      lastSavedState.current = currentJson;
      setSaveStatus("saved");
      
    } catch (error) {
      console.error("Autosave failed", error);
      setSaveStatus("error");
    }
  };

  const handleVersionChange = async (targetId: string) => {
      if (targetId === currentVersionId) return;
      await loadFormAndVersions(targetId);
  };

  const addField = () => {
    const newKey = `field_${Date.now()}`;
    const newEntry: FieldEntry = {
      key: newKey,
      isRequired: false,
      def: { id: newKey, key: newKey, kind: "text", title: "New Field" },
    };
    setFields([...fields, newEntry]);
  };

  // [INTEGRATION] Dynamic Close
  const handleClose = () => {
      if (isAdmin) router.push("/admin");
      else router.push("/forms");
  };

  if (isLoading) return <div className="p-8 text-slate-400 bg-slate-950 h-screen flex items-center justify-center font-mono">Loading editor context...</div>;

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200">
      
      {/* --- HEADER (Matched to Admin Dashboard) --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6 px-8 pt-8 bg-slate-950/50 backdrop-blur-md z-10">
        
        {/* Left: Branding & Breadcrumb */}
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <button 
                    onClick={handleClose}
                    className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    title={isAdmin ? "Back to Ops Center" : "Back to Dashboard"}
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                
                {/* [INTEGRATION] Dynamic Badge */}
                {isAdmin ? (
                    <div className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Ops Center
                    </div>
                ) : (
                    <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        Form Builder
                    </div>
                )}
                
                <span className="text-slate-500 text-xs font-mono">
                    {isAdmin ? "/ Form Factory / Builder" : "/ My Forms / Editor"}
                </span>
            </div>
            
            <div className="flex items-baseline gap-4 ml-1">
                <h1 className="text-2xl font-bold tracking-tight text-white">{formMeta?.name}</h1>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono font-bold uppercase">
                        v{formMeta?.version}
                    </span>
                    {versions.length > 0 && formMeta?.version !== versions[versions.length - 1].version && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 rounded border border-amber-500/30">
                            Viewing History
                        </span>
                    )}
                </div>
            </div>
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-6">
           
           {/* Autosave Status */}
           <div className="text-[10px] font-bold uppercase tracking-wider transition-all duration-300 min-w-[120px] text-right flex justify-end">
              {saveStatus === "saving" && (
                  <span className="text-amber-400 animate-pulse flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Saving...
                  </span>
              )}
              {saveStatus === "saved" && (
                  <span className="text-emerald-400 flex items-center gap-2 opacity-60">
                    <Save className="w-3 h-3" /> Saved
                  </span>
              )}
              {saveStatus === "error" && (
                  <span className="text-red-400 flex items-center gap-2">
                    Save Failed
                  </span>
              )}
           </div>

           <div className="h-6 w-px bg-white/10" />

           <button className="p-2.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5">
                <Settings className="w-5 h-5" />
           </button>
           
           <Button variant="secondary" onClick={handleClose}>
                {isAdmin ? "Close Template" : "Done"}
           </Button>
        </div>
      </div>

      {/* --- CANVAS --- */}
      <div className="flex-1 relative overflow-hidden bg-slate-900/30">
        <ReactiveCanvas fields={fields} setFields={setFields} />
      </div>

      {/* --- TIME TRAVEL SLIDER --- */}
      <div className="flex-none z-20 bg-slate-950 border-t border-white/5 pb-2">
         <VersionHistorySlider 
            versions={versions} 
            currentVersionId={currentVersionId} 
            onSelectVersion={handleVersionChange}
         />
      </div>

      {/* --- FLOATING FAB --- */}
      <div className="fixed bottom-24 right-8 z-30">
        <Button size="lg" onClick={addField} className="rounded-full shadow-2xl shadow-rose-500/20 bg-rose-600 hover:bg-rose-500 text-white border-none">
           + Add Field
        </Button>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/ai/AssistantPanel.tsx`

```tsx
// src/forms/ui/ai/AssistantPanel.tsx

"use client";

import React, { useState, useEffect } from "react";
import { ChatPanel } from "@/intake/ui/chat/ChatPanel";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface Message { 
    id: string; 
    role: "user" | "assistant"; 
    text: string; 
}

interface AssistantPanelProps {
  formId: string;
  currentSchema: FormSchemaJsonShape;
  onSchemaUpdate: (newSchema: FormSchemaJsonShape, message: string) => void;
  onMinimize: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const DEFAULT_SUGGESTIONS = [
    "Create a Personal Injury Intake",
    "Add contact information block",
    "Include a signature field",
    "Add date of incident"
];

export function AssistantPanel({ 
    formId, 
    currentSchema, 
    onSchemaUpdate, 
    onMinimize,
    messages,
    setMessages
}: AssistantPanelProps) {
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [suggestions, setSuggestions] = useState<string[]>(() => 
    formId === "new" ? DEFAULT_SUGGESTIONS : []
  );
  
  const [hasLoadedContext, setHasLoadedContext] = useState(false);

  useEffect(() => {
    setHasLoadedContext(false);
    if (formId === "new") {
        setSuggestions(DEFAULT_SUGGESTIONS);
    }
  }, [formId]);

  useEffect(() => {
    if (hasLoadedContext) return;

    const hasFields = currentSchema && currentSchema.properties && Object.keys(currentSchema.properties).length > 0;
    
    if (hasFields) {
        refreshSuggestions(currentSchema, messages);
        setHasLoadedContext(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSchema, hasLoadedContext, messages]); 

  const refreshSuggestions = async (schema: FormSchemaJsonShape, history: Message[]) => {
    try {
        const res = await fetch("/api/ai/generate-suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                schema, 
                history: history.map(m => ({ role: m.role, content: m.text })) 
            })
        });
        if (res.ok) {
            const data = await res.json();
            if (data.suggestions && data.suggestions.length > 0) {
                setSuggestions(data.suggestions);
            }
        }
    } catch (e) {
        console.error("Silent suggestion fail", e);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    const userMsgText = input;
    setInput("");
    
    setSuggestions([]);
    
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: userMsgText }]);
    setIsLoading(true);

    try {
        const res = await fetch("/api/intake/forms/from-prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                prompt: userMsgText, 
                organizationId: "org_default_local", 
                currentSchema: currentSchema,
                history: messages.map(m => ({ role: m.role, content: m.text }))
            })
        });

        if (!res.ok) throw new Error("AI Request Failed");
        const data = await res.json();
        
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: "assistant", 
            text: data.message 
        }]);

        if (data.schema) {
            onSchemaUpdate(data.schema, data.message);
            const newHistory = [...messages, 
                { role: "user" as const, text: userMsgText, id: "" }, 
                { role: "assistant" as const, text: data.message, id: "" }
            ];
            refreshSuggestions(data.schema, newHistory);
        } else {
            const newHistory = [...messages, { role: "user" as const, text: userMsgText, id: "" }];
            refreshSuggestions(currentSchema, newHistory);
        }

    } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: "assistant", 
            text: "Sorry, I encountered an error. Please try again." 
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    // [FIX] Changed bg-slate-900/50 to bg-transparent to fix muddy look in Light Mode.
    // Also made border theme-aware.
    <div className="h-full w-full flex flex-col bg-transparent border-r border-slate-200/50 dark:border-white/10">
       <ChatPanel 
          messages={messages}
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onMinimize={onMinimize}
          suggestions={suggestions}
       />
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/ai/FieldAiPromptBubble.tsx`

```tsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface FieldAiPromptBubbleProps {
  fieldKey: string;
  onClose: () => void;
  onSubmit: (prompt: string) => Promise<void>;
}

export function FieldAiPromptBubble({ fieldKey, onClose, onSubmit }: FieldAiPromptBubbleProps) {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(input);
      onClose();
    } catch (err) {
      setError("AI request failed. Try again.");
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div 
      className="absolute top-full right-0 mt-2 z-50 w-72 animate-in fade-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl p-3 space-y-3 bg-white/95 dark:bg-violet-950/90 backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-teal-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            <span className="text-[10px] font-bold tracking-wide uppercase">Ask AI</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Input */}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`How should I change this field?`}
            rows={2}
            disabled={isSubmitting}
            className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-teal-500/50 resize-none"
          />
        </div>

        {/* Error State */}
        {error && (
          <p className="text-[10px] text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded border border-red-100 dark:border-red-500/20">
            {error}
          </p>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono hidden sm:inline-block">⌘ + Enter</span>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2 py-1 transition-colors"
            >
              Cancel
            </button>
            <Button 
              size="sm" 
              className="h-7 text-xs"
              onClick={handleSubmit} 
              isLoading={isSubmitting}
              disabled={!input.trim()}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* Pointer Triangle */}
      <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white dark:bg-violet-950/90 border-l border-t border-slate-200 dark:border-white/10 transform rotate-45 pointer-events-none" />
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/canvas/DraggableFieldList.tsx`

```tsx
// src/forms/ui/canvas/DraggableFieldList.tsx

import React, { useState, useRef, useEffect } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { clsx } from "clsx";
import { FieldRenderer } from "./forms.ui.canvas.FieldRenderer";
import { FieldToolbar } from "./FieldToolbar";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface DraggableListProps {
  fields: any[];
  setFields: (fields: any[]) => void;
  activeFieldIdx: number | null;
  onSelectField: (idx: number | null, e?: React.MouseEvent<HTMLDivElement>) => void; 
  onUpdateField: (idx: number, updates: any) => void;
  onDuplicateField: (idx: number) => void;
  onDeleteField: (idx: number) => void;
  isBlueprintMode?: boolean;
}

export function DraggableFieldList({ 
  fields, 
  setFields, 
  activeFieldIdx, 
  onSelectField, 
  onUpdateField,
  onDuplicateField,
  onDeleteField,
  isBlueprintMode 
}: DraggableListProps) {
  return (
    <Reorder.Group axis="y" values={fields} onReorder={setFields} className="space-y-4 relative p-4 pb-32">
      {fields.map((field, index) => (
        <DraggableItem
          key={field.key}
          item={field}
          index={index}
          isActive={activeFieldIdx === index}
          onClick={(e) => onSelectField(index, e)}
          onUpdate={(u) => onUpdateField(index, u)}
          onDuplicate={() => onDuplicateField(index)}
          onDelete={() => onDeleteField(index)}
          isBlueprintMode={isBlueprintMode}
        />
      ))}
    </Reorder.Group>
  );
}

interface DraggableItemProps {
  item: any;
  index: number;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onUpdate: (u: any) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isBlueprintMode?: boolean;
}

function DraggableItem({ item, isActive, onClick, onUpdate, onDuplicate, onDelete, isBlueprintMode }: DraggableItemProps) {
  const controls = useDragControls();
  const def = item.def as FormFieldDefinition;
  const ref = useRef<any>(null);
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    if (isBlueprintMode && ref.current) {
        setWidth(ref.current.offsetWidth);
    }
  }, [isBlueprintMode]);

  return (
    <Reorder.Item
      ref={ref}
      value={item}
      dragListener={false}
      dragControls={controls}
      className="relative"
      style={{ zIndex: isActive ? 50 : 1 }}
    >
      {isBlueprintMode && (
        <div className="absolute -top-3 left-0 right-0 flex justify-between px-2 pointer-events-none z-10">
           <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 bg-white/80 dark:bg-black/60 px-1 rounded shadow-sm border border-cyan-100 dark:border-cyan-900">key: {def.key}</span>
           <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 bg-white/80 dark:bg-black/60 px-1 rounded shadow-sm border border-cyan-100 dark:border-cyan-900">
             w: {def.layout?.width || "full"} <span className="opacity-50">({width}px)</span>
           </span>
        </div>
      )}

      {isActive && (
          <FieldToolbar 
            field={item} 
            onUpdate={onUpdate}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
      )}

      <div
        onClick={(e) => { e.stopPropagation(); onClick(e); }}
        className={clsx(
          "relative group p-6 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-md",
          // [FIX] Reinforced borders and background opacity for better "weight"
          isBlueprintMode 
            ? "border-dashed border-cyan-500/30 bg-cyan-50/50 dark:bg-cyan-900/10" 
            : "bg-white/95 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/10 shadow-sm",
          
          isActive 
            ? "bg-indigo-50/90 dark:bg-violet-900/40 border-indigo-500/50 dark:border-verdigris-500/50 shadow-xl ring-1 ring-indigo-500/20 dark:ring-verdigris-500/30 translate-x-1 z-10" 
            : "hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-lg hover:border-slate-300 dark:hover:border-white/20"
        )}
      >
        <div className="flex items-start gap-4">
          <div 
            onPointerDown={(e) => controls.start(e)} 
            className={clsx(
                "cursor-grab active:cursor-grabbing p-1.5 rounded-md transition-colors mt-1 flex-shrink-0", 
                isActive ? "text-indigo-600 dark:text-verdigris-400 bg-indigo-100 dark:bg-verdigris-400/10" : "text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400"
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="9" cy="19" r="2" /><circle cx="15" cy="5" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="15" cy="19" r="2" /></svg>
          </div>

          <div className="flex-1 pointer-events-none select-none min-w-0">
              <FieldRenderer def={def} />
          </div>

          <div className={clsx("absolute top-4 right-4 transition-opacity pointer-events-none", isBlueprintMode || isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50")}>
             <span className="text-[9px] font-mono font-medium text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-black/40 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10">{def.kind}</span>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/canvas/FieldMicroEditor.tsx`

```tsx
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";

interface MicroEditorProps {
  field: any;
  onChange: (updates: any) => void;
  onDelete: () => void;
}

export function FieldMicroEditor({ field, onChange, onDelete }: MicroEditorProps) {
  return (
    <GlassCard noPadding className="absolute -right-4 top-0 translate-x-full w-64 z-20 animate-fade-in">
      <div className="p-3 space-y-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Field Settings</span>
          <button onClick={onDelete} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xs">
            Delete
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400">Label</label>
          <input
            type="text"
            value={field.def.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-0"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400">Type</label>
          <select
            value={field.def.kind}
            onChange={(e) => onChange({ kind: e.target.value })}
            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-0"
          >
            <option value="text">Short Text</option>
            <option value="textarea">Long Text</option>
            <option value="date">Date Picker</option>
            <option value="select">Dropdown</option>
            <option value="checkbox">Checkbox</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            checked={field.isRequired}
            onChange={(e) => onChange({ isRequired: e.target.checked })}
            className="rounded border-slate-300 dark:border-white/20 bg-transparent text-indigo-600 dark:text-teal-500 focus:ring-0"
          />
          <span className="text-xs text-slate-600 dark:text-slate-300">Required Field</span>
        </div>
      </div>
    </GlassCard>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/canvas/FieldToolbar.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Languages, Trash2, Copy } from "lucide-react";
import { clsx } from "clsx";

interface FieldToolbarProps {
  field: any;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function FieldToolbar({ field, onUpdate, onDelete, onDuplicate }: FieldToolbarProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleMagic = async (operation: "polish" | "translate") => {
    setIsLoading(true);
    try {
        // Simulation for Night Ops Demo
        await new Promise(r => setTimeout(r, 600)); 
        
        if (operation === "polish") {
            onUpdate({ 
                title: "Please describe the incident details", 
                placeholder: "e.g., I was driving north on Main St..." 
            });
        } else if (operation === "translate") {
            onUpdate({ 
                description: `(Español: ${field.def.title}...)` 
            });
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      className="absolute -top-12 left-0 z-50 flex items-center gap-1 p-1 bg-white/90 dark:bg-violet-950/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-lg shadow-xl ring-1 ring-black/5 dark:ring-black/50"
      onClick={(e) => e.stopPropagation()} // Prevent selecting parent
    >
      <div className="flex items-center gap-1">
        <ToolbarButton 
            icon={<Wand2 className={clsx("w-3.5 h-3.5", isLoading && "animate-spin")} />} 
            label="Polish" 
            onClick={() => handleMagic("polish")} 
            active={isLoading}
        />
        <ToolbarButton 
            icon={<Languages className="w-3.5 h-3.5" />} 
            label="Translate" 
            onClick={() => handleMagic("translate")} 
        />
      </div>
      
      <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
      
      <div className="flex items-center gap-1">
        <ToolbarButton icon={<Copy className="w-3.5 h-3.5" />} onClick={onDuplicate} tooltip="Duplicate" />
        <ToolbarButton icon={<Trash2 className="w-3.5 h-3.5" />} onClick={onDelete} variant="danger" tooltip="Delete" />
      </div>
    </motion.div>
  );
}

function ToolbarButton({ icon, label, onClick, variant = "default", active, tooltip }: any) {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            title={tooltip}
            className={clsx(
                "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all",
                variant === "danger" 
                    ? "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" 
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10",
                active && "text-indigo-600 dark:text-teal-400 bg-indigo-50 dark:bg-teal-500/10"
            )}
        >
            {icon}
            {label && <span>{label}</span>}
        </button>
    )
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/canvas/FloatingFieldEditor.tsx`

```tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, useDragControls, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import type { FormFieldDefinition, FieldOption, FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { addOptionToField, updateOptionInField, removeOptionFromField } from "./field-actions";
import { DataSettings } from "@/forms/ui/inspector/forms.ui.inspector.DataSettings";
import { LogicEditor } from "@/forms/ui/inspector/forms.ui.inspector.LogicEditor";

interface FloatingEditorProps {
  field: { def: FormFieldDefinition; isRequired: boolean };
  allFields?: any[];
  onChange: (updates: any) => void;
  onDelete: () => void;
  onClose: () => void;
  onAiRequest: (prompt: string) => Promise<void>;
  containerRef: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
}

function OptionsEditor({ fieldDef, onChange }: { fieldDef: FormFieldDefinition; onChange: (newDef: FormFieldDefinition) => void; }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const selectionTypes = ["select", "multiselect", "radio", "checkbox_group"];
  
  if (!selectionTypes.includes(fieldDef.kind)) return null;

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    try {
        const res = await fetch("/api/ai/generate-options", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: fieldDef.title })
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.options && Array.isArray(data.options)) {
            const newOptions = data.options.map((o: any) => ({ ...o, id: crypto.randomUUID() }));
            onChange({ ...fieldDef, options: newOptions });
        }
    } catch (err) {
        alert("Could not auto-generate options.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="mt-4 border-t border-slate-200 dark:border-white/10 pt-4">
      <div className="flex justify-between items-center mb-3">
        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Options List</label>
        <div className="flex gap-2">
            <button 
                onClick={handleAutoGenerate} 
                disabled={isGenerating}
                className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-2 py-1 rounded transition-colors font-medium disabled:opacity-50 flex items-center gap-1"
            >
                {isGenerating ? "..." : "✨ Auto-Fill"}
            </button>
            <button onClick={() => onChange(addOptionToField(fieldDef))} className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 px-2 py-1 rounded transition-colors font-medium">+ Add</button>
        </div>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
        {(fieldDef.options || []).map((opt: FieldOption) => (
            <div key={opt.id} className="flex items-center gap-2 group animate-fade-in">
                <div className="text-slate-400 cursor-grab active:cursor-grabbing p-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="9" cy="19" r="2" /><circle cx="15" cy="5" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="15" cy="19" r="2" /></svg></div>
                <input type="text" value={opt.label} onChange={(e) => onChange(updateOptionInField(fieldDef, opt.id, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s/g, '_') }))} className="flex-1 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded h-8 text-xs px-2 text-slate-900 dark:text-slate-100 focus:ring-0 transition-colors" placeholder="Option Label" />
                <button onClick={() => onChange(removeOptionFromField(fieldDef, opt.id))} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1" title="Remove Option"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>
        ))}
        {(!fieldDef.options || fieldDef.options.length === 0) && (
            <div className="text-center py-4 border border-dashed border-slate-200 dark:border-white/10 rounded-lg">
                <p className="text-[10px] text-slate-400">No options yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}

type Tab = "settings" | "logic" | "data";

export function FloatingFieldEditor({ field, allFields = [], onChange, onDelete, onClose, onAiRequest, containerRef, style }: FloatingEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("settings");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const dragControls = useDragControls();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const fullSchemaContext = useMemo((): FormSchemaJsonShape => {
    return {
      type: "object",
      properties: allFields.reduce((acc: any, f: any) => {
        acc[f.key] = f.def;
        return acc;
      }, {}),
      order: allFields.map((f: any) => f.key),
      required: allFields.filter((f: any) => f.isRequired).map((f: any) => f.key)
    };
  }, [allFields]);

  if (!field) return null;

  const handleAiSubmit = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try { await onAiRequest(aiPrompt); setAiPrompt(""); setIsAiOpen(false); } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <AnimatePresence>
        <motion.div
        drag dragListener={false} dragControls={dragControls} dragMomentum={false} dragConstraints={containerRef}
        initial={{ opacity: 0, scale: 0.95, x: 10 }} 
        animate={{ opacity: 1, scale: 1, x: 0 }} 
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        style={style}
        className="absolute right-4 z-50 w-80 max-w-[calc(100%-2rem)] glass-panel rounded-xl flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5"
        >
        {/* Header */}
        <div onPointerDown={(e) => dragControls.start(e)} className="bg-slate-100 dark:bg-slate-900 p-3 border-b border-slate-200 dark:border-white/10 flex justify-between items-center cursor-grab active:cursor-grabbing touch-none select-none">
            <div className="flex items-center gap-2">
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 border border-white/10 transition-colors flex items-center justify-center group"><svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-0 group-hover:opacity-100 text-white"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">Field Inspector</span>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20">
            {(['settings', 'logic', 'data'] as Tab[]).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={clsx("flex-1 py-2 text-[10px] font-medium uppercase tracking-wider transition-colors border-b-2", activeTab === tab ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-white/5" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5")}>
                    {tab}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="p-4 space-y-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl min-h-[300px]" onPointerDown={(e) => e.stopPropagation()}>
            
            {activeTab === 'settings' && (
              <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-200 dark:border-indigo-500/20 overflow-hidden mb-4">
                  <button onClick={() => setIsAiOpen(!isAiOpen)} className="w-full flex items-center justify-between p-2.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                      <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> Refine with AI</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={clsx("transition-transform", isAiOpen ? "rotate-180" : "")}><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {isAiOpen && (
                      <div className="p-2.5 pt-0 space-y-2 animate-slide-down">
                      <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g. Make this optional and change label..." className="w-full bg-white dark:bg-black/30 border border-indigo-200 dark:border-white/10 rounded-md p-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 resize-none" rows={2} />
                      <Button size="sm" className="w-full h-7 text-xs bg-indigo-600 hover:bg-indigo-500 text-white" onClick={handleAiSubmit} isLoading={isAiLoading} disabled={!aiPrompt.trim()}>Apply</Button>
                      </div>
                  )}
              </div>
            )}

            {activeTab === 'settings' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-200 space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Field Label</label>
                        <input type="text" value={field.def.title} onChange={(e) => onChange({ title: e.target.value })} className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Input Type</label>
                        <div className="relative">
                            <select value={field.def.kind} onChange={(e) => onChange({ kind: e.target.value })} className="w-full appearance-none bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                                <option value="text">Short Text</option>
                                <option value="textarea">Long Text</option>
                                <option value="date">Date Picker</option>
                                <option value="select">Dropdown</option>
                                <option value="radio">Radio Group</option>
                                <option value="checkbox">Checkbox (Yes/No)</option>
                                <option value="checkbox_group">Checkbox Group</option>
                                <option value="header">Header</option>
                                <option value="info">Info Block</option>
                                <option value="slider">Range Slider</option>
                                <option value="consent">Legal Consent</option>
                                <option value="signature">Signature Pad</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                        </div>
                     </div>

                     {/* SLIDER SETTINGS */}
                     {field.def.kind === "slider" && (
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Min</label>
                                <input 
                                    type="number" 
                                    value={field.def.min ?? 0} 
                                    onChange={(e) => onChange({ min: Number(e.target.value) })}
                                    className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1.5 text-xs text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Max</label>
                                <input 
                                    type="number" 
                                    value={field.def.max ?? 10} 
                                    onChange={(e) => onChange({ max: Number(e.target.value) })}
                                    className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1.5 text-xs text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                     )}

                     {/* CONSENT SETTINGS */}
                     {field.def.kind === "consent" && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/10">
                            <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Legal Text</label>
                            <textarea 
                                value={field.def.placeholder || ""} 
                                onChange={(e) => onChange({ placeholder: e.target.value })}
                                className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-2 text-xs text-slate-900 dark:text-white min-h-[80px]"
                                placeholder="Paste full terms here..."
                            />
                        </div>
                     )}

                     <OptionsEditor fieldDef={field.def} onChange={(newDef) => onChange(newDef)} />
                     
                     <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
                        <label className="flex items-center gap-2 cursor-pointer group select-none">
                            <div className={clsx("w-4 h-4 rounded border flex items-center justify-center transition-all duration-200", field.isRequired ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent group-hover:border-indigo-400")}>
                            {field.isRequired && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>}
                            </div>
                            <input type="checkbox" className="hidden" checked={field.isRequired} onChange={(e) => onChange({ isRequired: e.target.checked })} />
                            <span className={clsx("text-xs font-medium transition-colors", field.isRequired ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white")}>Required</span>
                        </label>
                        <button onClick={onDelete} className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-md transition-colors">Delete</button>
                    </div>
                </div>
            )}

            {activeTab === 'logic' && (
              <LogicEditor 
                def={field.def} 
                allFields={allFields} 
                fullSchema={fullSchemaContext} 
                onChange={onChange} 
              />
            )}
            {activeTab === 'data' && <DataSettings def={field.def} onChange={onChange} />}
        </div>
        </motion.div>
    </AnimatePresence>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/canvas/ReactiveCanvas.tsx`

```tsx
// src/forms/ui/canvas/ReactiveCanvas.tsx

import React, { useState, useRef } from "react";
import { DraggableFieldList } from "./DraggableFieldList";
import { FloatingFieldEditor } from "./FloatingFieldEditor";
import { clsx } from "clsx";
import { useLocalStorage } from "@/infra/ui/hooks/useLocalStorage";
import { generateId } from "@/forms/ui/canvas/field-actions";
import { Smartphone, Tablet, Monitor, MessageSquare, LayoutTemplate } from "lucide-react";

interface ReactiveCanvasProps {
  fields: any[];
  setFields: (f: any[]) => void;
  onFieldAiRequest?: (key: string, prompt: string) => Promise<void>;
  isBlueprintMode?: boolean;
  onToggleChat?: () => void;
  onToggleElements?: () => void;
}

type ViewMode = "mobile" | "tablet" | "desktop";

export function ReactiveCanvas({ fields, setFields, onFieldAiRequest, isBlueprintMode = false, onToggleChat, onToggleElements }: ReactiveCanvasProps) {
  const [activeFieldIdx, setActiveFieldIdx] = useState<number | null>(null);
  const [activeFieldTop, setActiveFieldTop] = useState<number>(0);
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>("argueos_canvas_view", "desktop");
  const containerRef = useRef<HTMLDivElement>(null);

  // Hover Zone State
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    // [FIX] Use getBoundingClientRect for stable coordinates relative to the viewport/container,
    // avoiding issues where offsetX acts relative to child elements (causing the 'left' trigger to fire on right-side children).
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Threshold: 100px from edges for a slightly easier hit target
    if (x < 100) setHoverSide("left");
    else if (x > width - 100) setHoverSide("right");
    else setHoverSide(null);
  };

  const handleSelectField = (idx: number | null, e?: React.MouseEvent<HTMLDivElement>) => {
    setActiveFieldIdx(idx);
    if (idx !== null && e && containerRef.current) {
      const itemRect = e.currentTarget.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setActiveFieldTop(itemRect.top - containerRect.top + containerRef.current.scrollTop); 
    }
  };

  const updateField = (index: number, updates: any) => {
    const newFields = [...fields];
    if (updates.isRequired !== undefined) {
        newFields[index] = { ...newFields[index], isRequired: updates.isRequired, def: { ...newFields[index].def, isRequired: updates.isRequired } };
    } else {
        newFields[index].def = { ...newFields[index].def, ...updates };
    }
    setFields(newFields);
  };

  const deleteField = (index: number) => { setFields(fields.filter((_, i) => i !== index)); setActiveFieldIdx(null); };

  const duplicateField = (index: number) => {
    const original = fields[index];
    const newKey = `${original.key}_copy_${Date.now().toString().slice(-4)}`;
    const newItem = { ...original, key: newKey, def: { ...original.def, id: generateId(), key: newKey, title: `${original.def.title} (Copy)` } };
    const newFields = [...fields];
    newFields.splice(index + 1, 0, newItem);
    setFields(newFields);
    setActiveFieldIdx(index + 1);
  };

  const activeField = activeFieldIdx !== null ? fields[activeFieldIdx] : null;
  const widthClass = { mobile: "max-w-[375px]", tablet: "max-w-[768px]", desktop: "max-w-3xl" };

  return (
    <div 
        className={clsx(
            "w-full h-full relative transition-colors duration-500",
            isBlueprintMode 
                ? "bg-cyan-50/50 dark:bg-cyan-950/10" 
                : "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px]"
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverSide(null)}
    >
      
      {/* --- EDGE TRIGGERS --- */}
      
      {/* Left Trigger (Chat) */}
      <div className={clsx(
          "absolute left-0 top-0 bottom-0 w-32 z-30 flex items-center justify-start pl-6 pointer-events-none transition-opacity duration-300",
          hoverSide === "left" ? "opacity-100" : "opacity-0"
      )}>
         <button 
            onClick={onToggleChat}
            className="pointer-events-auto p-3.5 rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 transform transition-all duration-300 hover:scale-110 hover:bg-indigo-500 active:scale-95 opacity-65 hover:opacity-100"
         >
            <MessageSquare className="w-5 h-5" />
         </button>
      </div>

      {/* Right Trigger (Elements) */}
      <div className={clsx(
          "absolute right-0 top-0 bottom-0 w-32 z-30 flex items-center justify-end pr-6 pointer-events-none transition-opacity duration-300",
          hoverSide === "right" ? "opacity-100" : "opacity-0"
      )}>
         <button 
            onClick={onToggleElements}
            className="pointer-events-auto p-3.5 rounded-full bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-xl transform transition-all duration-300 hover:scale-110 active:scale-95 opacity-65 hover:opacity-100"
         >
            <LayoutTemplate className="w-5 h-5" />
         </button>
      </div>


      {/* Scrollable Canvas Area */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 overflow-y-auto scroll-smooth custom-scrollbar px-6 pt-24" 
        onClick={() => setActiveFieldIdx(null)}
      >
        {/* Floating Toolbar - Placed inside scroll container so it scrolls away */}
        <div className="absolute top-6 left-6 z-20 pointer-events-none">
           <div className="flex items-center gap-1 bg-white/40 dark:bg-black/20 p-1 rounded-full border border-white/20 dark:border-white/5 backdrop-blur-md transition-all duration-300 opacity-50 hover:opacity-100 hover:bg-white/90 dark:hover:bg-slate-900/90 hover:shadow-lg pointer-events-auto">
              {(['mobile', 'tablet', 'desktop'] as const).map(mode => (
                 <button
                   key={mode}
                   onClick={() => setViewMode(mode)}
                   className={clsx(
                     "p-2 rounded-full transition-all duration-300 group relative",
                     viewMode === mode 
                       ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm" 
                       : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
                   )}
                   title={`${mode} view`}
                 >
                   {mode === 'mobile' && <Smartphone className="w-3.5 h-3.5" />}
                   {mode === 'tablet' && <Tablet className="w-3.5 h-3.5" />}
                   {mode === 'desktop' && <Monitor className="w-3.5 h-3.5" />}
                 </button>
              ))}
           </div>
        </div>

        <div 
           className={clsx(
             "mx-auto pb-40 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top", 
             widthClass[viewMode],
             isBlueprintMode ? "bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:24px_24px] border-x border-cyan-500/20 shadow-[0_0_50px_rgba(8,145,178,0.1)] min-h-full" : ""
           )}
           onClick={(e) => e.stopPropagation()}
        >
          {fields.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 py-20 min-h-[50vh]">
                {/* Animated Empty State Ring */}
                <div 
                    onClick={onToggleChat}
                    className="relative group/button cursor-pointer"
                    title="Toggle AI Architect"
                >
                    <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/20 rounded-full blur-xl group-hover/button:blur-2xl transition-all duration-1000 animate-pulse-slow" />
                    
                    <div className="w-24 h-24 rounded-[2rem] border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-white/50 dark:bg-white/5 backdrop-blur-sm relative z-10 shadow-sm transition-transform duration-300 group-hover/button:scale-110 group-hover/button:border-indigo-400 group-active/button:scale-95">
                        <MessageSquare className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover/button:text-indigo-500 transition-colors" />
                    </div>
                </div>
                
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Start Building</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                        Use the <button onClick={onToggleChat} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">AI Architect</button> on the left or press <span className="font-mono text-xs bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">⌘J</span> to browse elements.
                    </p>
                </div>
            </div>
          ) : (
            <>
                <DraggableFieldList fields={fields} setFields={setFields} activeFieldIdx={activeFieldIdx} onSelectField={handleSelectField} onUpdateField={updateField} onDuplicateField={duplicateField} onDeleteField={deleteField} isBlueprintMode={isBlueprintMode} />
                
                {activeFieldIdx !== null && activeField && (
                    <FloatingFieldEditor
                        containerRef={containerRef}
                        field={activeField}
                        allFields={fields}
                        onChange={(updates) => updateField(activeFieldIdx, updates)}
                        onDelete={() => deleteField(activeFieldIdx)}
                        onClose={() => setActiveFieldIdx(null)}
                        onAiRequest={(prompt) => onFieldAiRequest ? onFieldAiRequest(activeField.key, prompt) : Promise.resolve()}
                        style={{ top: activeFieldTop }}
                    />
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/canvas/field-actions.ts`

```ts
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
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/canvas/forms.ui.canvas.FieldRenderer.tsx`

```tsx
"use client";

import React from "react";
import { clsx } from "clsx";
import { PenTool, Calendar, Hash, DollarSign, Mail, Phone, Type, AlignLeft } from "lucide-react";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { PiiWarning } from "@/forms/ui/guardrails/PiiWarning";

interface FieldRendererProps {
  def: FormFieldDefinition;
}

// --- INTELLIGENT PLACEHOLDER ENGINE ---
function getSmartPlaceholder(kind: string, label: string): string {
  const lower = label.toLowerCase();

  // 1. Precise Matches
  if (lower.includes("zip") || lower.includes("postal")) return "90210";
  if (lower.includes("credit score")) return "720";
  if (lower.includes("ssn") || lower.includes("social")) return "XXX-XX-6789";
  if (lower.includes("docket") || lower.includes("case num")) return "CV-2024-00123";
  
  // 2. Identity
  if (lower.includes("email")) return "alex.smith@example.com";
  if (lower.includes("phone")) return "(555) 019-2834";
  if (lower.includes("age")) return "35";
  if (lower.includes("name")) return "Jane Doe";

  // 3. Financial
  if (kind === "currency") {
    if (lower.includes("income") || lower.includes("salary")) return "75,000.00";
    if (lower.includes("rent")) return "2,500.00";
    return "0.00";
  }

  // 4. Text
  if (kind === "textarea") {
    if (lower.includes("injury") || lower.includes("describe")) return "I was stopped at a red light when...";
    return "Please provide details...";
  }

  // 5. Fallbacks
  switch (kind) {
    case "date": return "MM / DD / YYYY";
    case "time": return "-- : -- --";
    case "number": return "0";
    default: return "Input...";
  }
}

// Visual Type Hint
function getTypeIcon(kind: string) {
  const iconClass = "w-3 h-3 text-slate-400 dark:text-slate-500";
  switch (kind) {
    case "date": return <Calendar className={iconClass} />;
    case "number": return <Hash className={iconClass} />;
    case "currency": return <DollarSign className={iconClass} />;
    case "email": return <Mail className={iconClass} />;
    case "phone": return <Phone className={iconClass} />;
    case "text": return <Type className={iconClass} />;
    case "textarea": return <AlignLeft className={iconClass} />;
    default: return null;
  }
}

export function FieldRenderer({ def }: FieldRendererProps) {
  const { kind, options, placeholder, title, description, metadata, min, max } = def;

  const displayPlaceholder = placeholder || getSmartPlaceholder(kind, title);

  const commonInputStyles = "w-full bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-teal-500/50 transition-colors shadow-sm";
  const labelStyles = "block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5";
  const descStyles = "text-xs text-slate-500 dark:text-slate-400 mb-2 block";

  if (kind === "header") {
    return (
      <div className="mt-2 mb-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
        {description && <p className={descStyles}>{description}</p>}
      </div>
    );
  }

  if (kind === "info") {
    return (
      <div className="bg-indigo-50 dark:bg-violet-900/20 border border-indigo-100 dark:border-verdigris-500/20 rounded p-3 my-2">
        <p className="text-sm text-indigo-900 dark:text-slate-100 font-medium">{title}</p>
        {description && <p className="text-xs text-indigo-700 dark:text-slate-400 mt-1">{description}</p>}
      </div>
    );
  }

  if (kind === "divider") {
    return <hr className="border-t border-slate-200 dark:border-white/10 my-6" />;
  }

  return (
    <PiiWarning label={title} isFlaggedExplicitly={metadata?.isPII}>
      <div className="w-full relative">
        <div className="flex justify-between items-baseline">
            <label className={labelStyles}>
            {title}
            {def.isRequired && <span className="text-red-500 ml-1 font-bold">*</span>}
            </label>
            <div className="opacity-50" title={`Type: ${kind}`}>
                {getTypeIcon(kind)}
            </div>
        </div>
        
        {description && <span className={descStyles}>{description}</span>}

        {(() => {
          switch (kind) {
            case "text": case "email": case "phone": 
              return <input type="text" className={commonInputStyles} placeholder={displayPlaceholder} readOnly />;
            
            case "number": case "currency":
              return (
                <div className="relative">
                    <input type="text" className={commonInputStyles} placeholder={displayPlaceholder} readOnly />
                    {kind === 'currency' && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">$</div>
                    )}
                </div>
              );

            case "date": case "time":
              return (
                <div className="relative">
                    <input type={kind} className={clsx(commonInputStyles, "text-slate-400")} readOnly />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 pointer-events-none text-sm opacity-60">
                        {displayPlaceholder}
                    </div>
                </div>
              );
            
            case "textarea":
              return <textarea className={clsx(commonInputStyles, "resize-none h-24")} placeholder={displayPlaceholder} readOnly />;
            
            case "select": case "multiselect":
              return (
                <div className="relative">
                  <select className={clsx(commonInputStyles, "appearance-none bg-white dark:bg-black/20 text-slate-500 dark:text-slate-400")} disabled>
                    <option>{displayPlaceholder}</option>
                    {options?.map((opt: any, idx: number) => {
                       const label = typeof opt === 'string' ? opt : opt.label;
                       const key = (typeof opt === 'string' ? opt : opt.id) || `opt-${idx}`;
                       return <option key={key}>{label}</option>
                    })}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9L12 15L18 9"/></svg></div>
                </div>
              );
            
            case "radio":
            case "checkbox_group":
              return (
                <div className="space-y-2">
                  {options?.map((opt: any, idx: number) => {
                      const label = typeof opt === 'string' ? opt : opt.label;
                      const key = (typeof opt === 'string' ? opt : opt.id) || `opt-${idx}`;
                      return (
                        <label key={key} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer opacity-80">
                          <div className={clsx("rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-black/20", kind === "radio" ? "w-4 h-4 rounded-full" : "w-4 h-4")} /> {label}
                        </label>
                      )
                  }) || <span className="text-xs text-slate-400 italic">No options defined</span>}
                </div>
              );
            
            case "checkbox":
              return <div className="flex items-center gap-2 mt-1"><div className="w-5 h-5 rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-black/20 flex items-center justify-center" /><span className="text-sm text-slate-700 dark:text-slate-200">Yes / Confirm</span></div>;
            
            case "switch":
               return <div className="w-10 h-5 rounded-full bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 relative"><div className="absolute left-0.5 top-0.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-400 shadow-sm" /></div>;
            
            case "slider":
              return (
                <div className="pt-2 px-1">
                   <input type="range" min={min || 0} max={max || 10} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-teal-500" disabled />
                   <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono uppercase">
                      <span>Min: {min || 0}</span>
                      <span>Max: {max || 10}</span>
                   </div>
                </div>
              );

            case "consent":
              return (
                <div className="space-y-3">
                   <div className="h-24 overflow-y-auto bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-md p-3 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                      {placeholder ? (
                        <span className="text-slate-600 dark:text-slate-300">{placeholder}</span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic">Enter your Terms of Service, Retainer Agreement, or Legal Disclaimer text here...</span>
                      )}
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-black/20" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">I Agree</span>
                   </div>
                </div>
              );

            case "signature":
              return (
                <div className="h-32 w-full border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-black/20 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500 group-hover:border-indigo-400/50 transition-colors">
                   <PenTool className="w-6 h-6 opacity-50" />
                   <span className="text-xs uppercase tracking-widest font-medium">Client Signature Pad</span>
                </div>
              );

            default:
              return <div className="h-9 w-full bg-red-500/10 border border-red-500/30 rounded flex items-center px-3 text-xs text-red-500 dark:text-red-300">Unsupported field kind: {kind}</div>;
          }
        })()}
      </div>
    </PiiWarning>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/dashboard/DashboardComponents.tsx`

```tsx
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowUpRight, FileText, Users, Activity } from "lucide-react";
import Link from "next/link";

// --- CLICKABLE METRICS ---
export function MetricsRow({ 
  activeForms, 
  totalResponses, 
  onResetFilter 
}: { 
  activeForms: number, 
  totalResponses: number,
  onResetFilter: () => void 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* 1. Forms -> Reset Filters */}
      <button onClick={onResetFilter} className="text-left group focus:outline-none w-full">
        <GlassCard className="relative group-hover:border-primary/50 transition-colors h-full" hoverEffect={false}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">Active Forms</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-foreground tracking-tight">{activeForms}</h3>
            <span className="text-xs font-medium text-emerald-500 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">+2 this week</span>
          </div>
        </GlassCard>
      </button>

      {/* 2. Responses -> Go to CRM */}
      <Link href="/crm" className="block group w-full">
        <GlassCard className="relative group-hover:border-indigo-500/50 transition-colors h-full" hoverEffect={false}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-indigo-500 transition-colors">Total Responses</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-foreground tracking-tight">{totalResponses}</h3>
            <span className="text-xs font-medium text-indigo-500 flex items-center gap-1 group-hover:underline">
               View Inbox <ArrowUpRight className="w-3 h-3"/>
            </span>
          </div>
        </GlassCard>
      </Link>

      {/* 3. System -> Static */}
      <GlassCard className="relative h-full" hoverEffect={false}>
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">System Status</span>
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-foreground tracking-tight">Operational</h3>
          <span className="text-xs font-mono text-muted-foreground">v1.5.0</span>
        </div>
      </GlassCard>
    </div>
  );
}

export function RecentActivityFeed({ activities = [] }: { activities?: any[] }) {
    return <div />;
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/dashboard/FormCard.tsx`

```tsx
"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, Trash2, FileEdit, Share2, ShieldCheck, MoreHorizontal } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { GlassMenu, type MenuItem } from "@/components/ui/GlassMenu";

export interface FormCardProps {
  form: any;
  isPinned?: boolean; 
  onTogglePin?: (id: string) => void;
}

const getStatusColor = (submissions: number) => {
  if (submissions > 10) return "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30";
  if (submissions > 0) return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
  return "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10";
};

export function FormCard({ form, isPinned = false, onTogglePin }: FormCardProps) {
  // Spotlight State
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const auditStatus = form.name.toLowerCase().includes("intake") ? "safe" : "risk";
  
  // Mock Conversion Rate for UI demo
  const conversionRate = form._count.formSubmissions > 0 ? Math.floor(Math.random() * 30 + 40) + "%" : "0%";

  const menuItems: MenuItem[] = [
    { label: "Edit Form", icon: <FileEdit className="w-3.5 h-3.5"/>, onClick: () => console.log("Edit", form.id) },
    { label: "Copy Link", icon: <Copy className="w-3.5 h-3.5"/>, onClick: () => { navigator.clipboard.writeText(`${window.location.origin}/s/${form.id}`); alert("Copied!"); } },
    { label: "Share", icon: <Share2 className="w-3.5 h-3.5"/>, onClick: () => console.log("Share", form.id) },
    { label: "Archive", icon: <Trash2 className="w-3.5 h-3.5"/>, onClick: () => console.log("Delete", form.id), variant: "danger" },
  ];

  return (
    <Link href={`/forms/${form.id}/editor`}>
      <motion.div 
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => { setIsHovered(true); setOpacity(1); }}
        onMouseLeave={() => { setIsHovered(false); setOpacity(0); }}
        className="h-full relative rounded-2xl overflow-hidden group bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all duration-500"
      >
        {/* Spotlight Gradient */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
          }}
        />

        <div className="p-6 flex flex-col h-full relative z-10">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <div className={clsx("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-colors", getStatusColor(form._count.formSubmissions))}>
                        {form._count.formSubmissions > 0 && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                        {form._count.formSubmissions > 0 ? (form._count.formSubmissions === 1 ? "1 Res" : `${form._count.formSubmissions} Res`) : "Draft"}
                    </div>

                    {auditStatus === "safe" && (
                        <div className="text-emerald-500/50 group-hover:text-emerald-500 transition-colors p-1" title="AI Audit: Safe">
                            <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                    )}
                </div>
                
                {/* Menu Button - preventing link click */}
                <div onClick={(e) => e.preventDefault()}>
                    <GlassMenu items={menuItems} />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {form.name}
                </h3>
                
                {/* Animated Info / Stats Swap */}
                <div className="h-10 relative mt-2 overflow-hidden">
                    {/* Default: Version Info */}
                    <motion.div 
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: isHovered ? -20 : 0, opacity: isHovered ? 0 : 1 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            v{form.version} • Updated {new Date(form.updatedAt).toLocaleDateString()}
                        </p>
                    </motion.div>

                    {/* Hover: Stats Row */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center gap-6"
                    >
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Total Leads</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                                {form._count.formSubmissions}
                            </span>
                        </div>
                        
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Conv. Rate</span>
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                                {conversionRate}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer Slide-Up */}
            <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[100px] opacity-60">
                    {form.id.substring(0, 8)}...
                </span>
                
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    Open <ArrowUpRight className="w-3 h-3" />
                </div>
            </div>
        </div>
      </motion.div>
    </Link>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/editor/HistoryControl.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { Clock, X } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { VersionHistorySlider } from "./VersionHistorySlider";
import type { FormVersionSummary } from "@/forms/repo/forms.repo.FormSchemaRepo";

interface HistoryControlProps {
  versions: FormVersionSummary[];
  currentVersionId: string;
  onSelectVersion: (id: string) => void;
}

export function HistoryControl({ versions, currentVersionId, onSelectVersion }: HistoryControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!versions || versions.length <= 1) return null;

  return (
    <>
      {/* 1. The Trigger Button */}
      <div className="absolute bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "group flex items-center gap-0 overflow-hidden rounded-full shadow-2xl transition-all duration-300 border h-10",
            isOpen 
              ? "bg-slate-900 text-white border-slate-700 w-10 justify-center px-0" 
              : "bg-white/40 dark:bg-black/20 backdrop-blur-md border-white/20 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-white/90 dark:hover:bg-slate-900/90 hover:text-slate-900 dark:hover:text-white w-10 hover:w-28 pl-0"
          )}
        >
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
             {isOpen ? <X className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </div>
          
          {!isOpen && (
            <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-1">
              History
            </span>
          )}
        </button>
      </div>

      {/* 2. The Slider Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            <div className="w-full flex justify-center pt-2 pb-1 cursor-pointer" onClick={() => setIsOpen(false)}>
                <div className="w-12 h-1 bg-slate-300 dark:bg-white/10 rounded-full" />
            </div>

            <div className="pb-6 px-4 md:px-20">
               <VersionHistorySlider 
                  versions={versions} 
                  currentVersionId={currentVersionId} 
                  onSelectVersion={onSelectVersion} 
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/editor/VersionHistorySlider.tsx`

```tsx
import React from "react";
import { clsx } from "clsx";
import type { FormVersionSummary } from "@/forms/repo/forms.repo.FormSchemaRepo";

interface VersionHistorySliderProps {
  versions: FormVersionSummary[];
  currentVersionId: string;
  onSelectVersion: (id: string) => void;
}

export function VersionHistorySlider({ versions, currentVersionId, onSelectVersion }: VersionHistorySliderProps) {
  if (!versions || versions.length <= 1) return null;

  const currentIndex = versions.findIndex(v => v.id === currentVersionId);
  const progressPercent = currentIndex === -1 ? 0 : (currentIndex / (versions.length - 1)) * 100;

  return (
    <div className="w-full px-4 py-2 bg-slate-100 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 backdrop-blur-sm flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-500 rounded-lg mt-2">
      
      <div className="flex-none flex flex-col">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Time Travel</span>
        <span className="text-xs font-mono text-indigo-500 dark:text-teal-400">v{versions[currentIndex]?.version}</span>
      </div>

      <div className="flex-1 relative h-8 flex items-center">
        {/* Track Line */}
        <div className="absolute left-0 right-0 h-0.5 bg-slate-300 dark:bg-white/10 rounded-full" />
        
        {/* Progress Line */}
        <div 
            className="absolute left-0 h-0.5 bg-indigo-500/50 dark:bg-teal-500/50 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercent}%` }} 
        />

        {/* Ticks */}
        <div className="absolute left-0 right-0 flex justify-between items-center">
          {versions.map((v, idx) => {
            const isActive = v.id === currentVersionId;
            const isPast = idx <= currentIndex;

            return (
              <button
                key={v.id}
                onClick={() => onSelectVersion(v.id)}
                className="group relative w-4 h-8 flex items-center justify-center focus:outline-none"
                title={`v${v.version} - ${new Date(v.createdAt).toLocaleTimeString()}`}
              >
                <div 
                    className={clsx(
                        "w-2 h-2 rounded-full transition-all duration-200 border",
                        isActive 
                            ? "bg-indigo-600 dark:bg-teal-500 border-indigo-500 dark:border-teal-400 scale-125 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                            : isPast 
                                ? "bg-indigo-200 dark:bg-teal-900/50 border-indigo-300 dark:border-teal-700 hover:bg-indigo-500 dark:hover:bg-teal-500"
                                : "bg-slate-300 dark:bg-black/50 border-slate-400 dark:border-white/10 hover:border-slate-500 dark:hover:border-white/30"
                    )} 
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white border border-white/10 px-2 py-1 rounded text-[9px] whitespace-nowrap z-20 shadow-lg">
                    v{v.version}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-none text-[9px] text-slate-500 text-right">
        Latest: v{versions[versions.length - 1].version}
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/guardrails/PiiWarning.tsx`

```tsx
/**
 * forms.ui.guardrails.PiiWarning
 *
 * UI Component: Wrapper that detects potential PII (Personally Identifiable Information)
 * in field labels and highlights them with a warning style.
 *
 * Related docs:
 * - 03-security-and-data-handling.md
 * - 12-ui-implementation-steps.md (Section 5.1)
 *
 * Guarantees:
 * - [SECURITY] Visual feedback only; does not alter data storage logic directly.
 */

import React from "react";

interface PiiWarningProps {
  label: string;
  isFlaggedExplicitly?: boolean;
  children: React.ReactNode;
}

// [SECURITY] Regex heuristics to sniff out sensitive data patterns
const SENSITIVE_REGEX = /ssn|social security|dob|date of birth|credit card|bank|account number|driver'?s? licen[sc]e|passport/i;

export function PiiWarning({ label, isFlaggedExplicitly, children }: PiiWarningProps) {
  // Check if metadata flag is set OR if the label triggers the heuristic
  const isSensitive = isFlaggedExplicitly || SENSITIVE_REGEX.test(label);

  if (!isSensitive) {
    return <>{children}</>;
  }

  return (
    <div className="relative group/pii">
      {/* The Warning Border - Indicates caution */}
      <div className="absolute -inset-2 rounded-lg border border-amber-500/30 bg-amber-500/5 pointer-events-none animate-in fade-in duration-500" />
      
      {/* The Warning Badge - Appears on hover to explain why */}
      <div className="absolute -top-5 right-0 bg-amber-950 border border-amber-500/50 text-amber-500 text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/pii:opacity-100 transition-opacity flex items-center gap-1 z-10 pointer-events-none">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        SENSITIVE DATA
      </div>

      {children}
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/hooks/forms.ui.hooks.useHistory.ts`

```ts
/**
 * forms.ui.hooks.useHistory
 *
 * Provides generic Undo/Redo capability for any state object.
 * Includes built-in keyboard shortcuts (Cmd+Z, Ctrl+Y, etc.).
 *
 * Behavior:
 * - Ignores shortcuts if user is focused on an input/textarea (preserves native text undo).
 */

import { useState, useEffect, useCallback } from "react";

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(initialState: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  // --- Actions ---

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    setState((currentState) => {
      if (currentState.past.length === 0) return currentState;

      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, currentState.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      if (currentState.future.length === 0) return currentState;

      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);

      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const set = useCallback((newPresent: T) => {
    setState((currentState) => {
      if (currentState.present === newPresent) return currentState;
      return {
        past: [...currentState.past, currentState.present],
        present: newPresent,
        future: [], // Clear future on new change
      };
    });
  }, []);

  // --- Keyboard Shortcuts ---

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input/textarea (let browser handle text undo)
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (!modifier) return;

      if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (e.key.toLowerCase() === "y" && !isMac) {
        // Windows Redo (Ctrl+Y)
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return {
    state: state.present,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    historyDebug: { past: state.past.length, future: state.future.length }
  };
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/inspector/forms.ui.inspector.DataSettings.tsx`

```tsx
"use client";

import React from "react";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface DataSettingsProps {
  def: FormFieldDefinition;
  onChange: (updates: Partial<FormFieldDefinition>) => void;
}

export function DataSettings({ def, onChange }: DataSettingsProps) {
  const metadata = def.metadata || {};

  const updateMeta = (key: string, value: any) => {
    onChange({
      metadata: { ...metadata, [key]: value }
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Database Key</label>
        <input 
          type="text" 
          value={def.key} 
          readOnly 
          className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-500 dark:text-slate-400 font-mono cursor-not-allowed" 
        />
        <p className="text-[10px] text-slate-400 dark:text-slate-500">Unique identifier for this field.</p>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={metadata.isPII || false} 
            onChange={(e) => updateMeta("isPII", e.target.checked)}
            className="rounded border-slate-300 dark:border-white/20 bg-transparent text-indigo-600 dark:text-teal-500 focus:ring-0" 
          />
          <span className="text-xs text-slate-700 dark:text-slate-200">Contains PII (Sensitive)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={metadata.isLocked || false} 
            onChange={(e) => updateMeta("isLocked", e.target.checked)}
            className="rounded border-slate-300 dark:border-white/20 bg-transparent text-indigo-600 dark:text-teal-500 focus:ring-0" 
          />
          <span className="text-xs text-slate-700 dark:text-slate-200">Lock Field (Prevent Edits)</span>
        </label>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Compliance Note</label>
        <input 
          type="text" 
          value={metadata.complianceNote || ""}
          onChange={(e) => updateMeta("complianceNote", e.target.value)}
          placeholder="e.g. HIPAA Protected"
          className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/inspector/forms.ui.inspector.LogicEditor.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { Wand2, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { FormFieldDefinition, FieldLogicRule } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { generateId } from "@/forms/ui/canvas/field-actions";

interface LogicEditorProps {
  def: FormFieldDefinition;
  allFields: any[]; 
  fullSchema?: any; 
  onChange: (updates: Partial<FormFieldDefinition>) => void;
}

export function LogicEditor({ def, allFields, fullSchema, onChange }: LogicEditorProps) {
  const rules = def.logic || [];
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const potentialTriggers = allFields.filter(f => f.key !== def.key);

  const addRule = (action: "show" | "flag" = "show") => {
    const newRule: FieldLogicRule = {
      id: generateId(),
      when: { fieldKey: potentialTriggers[0]?.key || "", operator: "equals", value: "" },
      action: action,
      flagCode: action === "flag" ? "RISK" : undefined,
      flagMessage: action === "flag" ? "Risk Detected" : undefined
    };
    onChange({ logic: [...rules, newRule] });
  };

  const updateRule = (id: string, updates: any) => {
    const newRules = rules.map(r => r.id === id ? { ...r, ...updates } : r);
    onChange({ logic: newRules });
  };

  const updateWhen = (id: string, updates: any) => {
    const newRules = rules.map(r => r.id === id ? { ...r, when: { ...r.when, ...updates } } : r);
    onChange({ logic: newRules });
  };

  const removeRule = (id: string) => {
    onChange({ logic: rules.filter(r => r.id !== id) });
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt || !fullSchema) return;
    setIsGenerating(true);
    try {
        const res = await fetch("/api/ai/generate-rules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ schema: fullSchema, prompt: aiPrompt })
        });
        
        if (!res.ok) throw new Error("AI failed");
        
        const data = await res.json();
        const relevantRules = data.rules
            .filter((r: any) => r.targetFieldKey === def.key)
            .map((r: any) => ({ ...r.rule, id: generateId() }));

        if (relevantRules.length > 0) {
            onChange({ logic: [...rules, ...relevantRules] });
            setAiPrompt("");
        } else {
            alert("AI generated rules for other fields, but none for this one.");
        }

    } catch (e) {
        console.error(e);
        alert("Failed to generate rules.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* AI Generator Section */}
      <div className="bg-indigo-50 dark:bg-violet-900/20 border border-indigo-100 dark:border-violet-500/20 rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-violet-300">
            <Wand2 className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Rule Architect</span>
        </div>
        <textarea 
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="e.g., Flag if date is more than 3 years ago..."
            className="w-full bg-white dark:bg-black/30 border border-indigo-200 dark:border-white/10 rounded-md p-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:border-indigo-500 dark:focus:border-violet-500/50 transition-colors"
            rows={2}
        />
        <Button size="sm" className="w-full h-7 text-xs" onClick={handleAiGenerate} isLoading={isGenerating} disabled={!aiPrompt.trim()}>
            Generate Guardrails
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-bold uppercase text-slate-500">Active Rules</h4>
            <div className="flex gap-2">
                <button onClick={() => addRule("show")} className="text-[10px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-2 py-1 rounded text-slate-600 dark:text-slate-300 transition-colors">+ Logic</button>
                <button onClick={() => addRule("flag")} className="text-[10px] bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 px-2 py-1 rounded transition-colors">+ Guardrail</button>
            </div>
        </div>

        {rules.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-white/10 rounded-lg opacity-50">
                <p className="text-xs text-slate-400">No rules defined.</p>
            </div>
        ) : (
            rules.map((rule, idx) => (
                <div key={rule.id} className={clsx("p-3 rounded-lg border space-y-2 group relative", rule.action === "flag" ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30" : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/10")}>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                            {rule.action === "flag" ? <AlertTriangle className="w-3 h-3 text-amber-500" /> : <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                            <select 
                                value={rule.action}
                                onChange={e => updateRule(rule.id, { action: e.target.value })}
                                className={clsx(
                                    "bg-transparent border-none p-0 text-xs font-bold uppercase focus:ring-0 cursor-pointer",
                                    rule.action === "flag" ? "text-amber-700 dark:text-amber-400" : "text-slate-900 dark:text-white"
                                )}
                            >
                                <option value="show">Show Field</option>
                                <option value="hide">Hide Field</option>
                                <option value="require">Require</option>
                                <option value="flag">Red Flag</option>
                            </select>
                        </div>
                        <button onClick={() => removeRule(rule.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Condition */}
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">If</span>
                        <select 
                            value={rule.when.fieldKey}
                            onChange={e => updateWhen(rule.id, { fieldKey: e.target.value })}
                            className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded px-2 py-1 max-w-[100px] truncate text-slate-700 dark:text-slate-200"
                        >
                            <option value="">(Select)</option>
                            <option value={def.key}>[Self]</option>
                            {potentialTriggers.map(t => <option key={t.key} value={t.key}>{t.def.title}</option>)}
                        </select>
                        <select
                            value={rule.when.operator}
                            onChange={e => updateWhen(rule.id, { operator: e.target.value })}
                            className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded px-2 py-1 w-24 text-slate-700 dark:text-slate-200"
                        >
                            <option value="equals">is</option>
                            <option value="not_equals">is not</option>
                            <option value="contains">contains</option>
                            <option value="greater_than">&gt;</option>
                            <option value="less_than">&lt;</option>
                            <option value="older_than_years">older (yrs)</option>
                        </select>
                        <input 
                            type="text" 
                            value={rule.when.value}
                            onChange={e => updateWhen(rule.id, { value: e.target.value })}
                            className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded px-2 py-1 flex-1 w-full text-slate-700 dark:text-slate-200 placeholder-slate-400"
                            placeholder="Value"
                        />
                    </div>

                    {/* Guardrail Details */}
                    {rule.action === "flag" && (
                        <div className="pt-2 mt-2 border-t border-amber-200 dark:border-amber-500/10 space-y-2">
                            <input 
                                value={rule.flagMessage || ""}
                                onChange={e => updateRule(rule.id, { flagMessage: e.target.value })}
                                placeholder="Warning Message (e.g. Statute Risk)"
                                className="w-full bg-white dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded px-2 py-1 text-xs text-amber-700 dark:text-amber-200 placeholder:text-amber-400 focus:border-amber-500"
                            />
                        </div>
                    )}
                </div>
            ))
        )}
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/inventory/ElementInventory.tsx`

```tsx
import React, { useState, useMemo } from "react";
import { clsx } from "clsx";
import { LayoutGrid, Type, ListChecks, Calendar, Box, X, Search } from "lucide-react";
import { ELEMENT_CATALOG, type ElementCatalogItem, type ElementCategory } from "@/forms/schema/forms.schema.ElementCatalog";

interface ElementInventoryProps {
  onAdd: (item: ElementCatalogItem) => void;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<ElementCategory, string> = {
  basic_input: "Inputs", 
  selection: "Selection", 
  temporal: "Date/Time", 
  structural: "Layout", 
  smart_block: "Smart",
};

export function ElementInventory({ onAdd, onClose }: ElementInventoryProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    const lowerSearch = search.toLowerCase().trim();
    return ELEMENT_CATALOG.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) return false;
      if (lowerSearch) {
        return item.label.toLowerCase().includes(lowerSearch) || item.tags.some(t => t.includes(lowerSearch));
      }
      return true;
    });
  }, [search, activeCategory]);

  const groupedItems = useMemo(() => {
    const groups: Partial<Record<ElementCategory, ElementCatalogItem[]>> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category]?.push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <div className="flex flex-col h-full bg-transparent transition-colors duration-300">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-200/50 dark:border-white/5 space-y-4 flex-none bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 tracking-widest uppercase flex items-center gap-2">
                <Box className="w-4 h-4" /> Elements
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full">
                <X className="w-4 h-4" />
            </button>
        </div>
        
        {/* Search */}
        <div className="relative group">
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search elements..." 
            className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none shadow-sm" 
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>

        {/* Categories (Pill Selectors) */}
        {/* [FIX] Added custom-scrollbar, removed no-scrollbar, increased pb-3, added mb-1 for spacing */}
        <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-3 mb-1">
          {["all", "basic_input", "selection", "structural"].map(cat => (
            <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={clsx(
                    "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap transition-all border",
                    activeCategory === cat 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20" 
                        : "bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                )}
            >
              {cat === "all" ? "All" : CATEGORY_LABELS[cat as ElementCategory] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 custom-scrollbar">
        {Object.entries(groupedItems).map(([cat, items]) => (
          <div key={cat} className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 pl-1 flex items-center gap-2">
                {cat === 'basic_input' && <Type className="w-3 h-3" />}
                {cat === 'selection' && <ListChecks className="w-3 h-3" />}
                {cat === 'temporal' && <Calendar className="w-3 h-3" />}
                {cat === 'structural' && <LayoutGrid className="w-3 h-3" />}
                {CATEGORY_LABELS[cat as ElementCategory]}
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {items?.map((item) => (
                <button 
                    key={item.id} 
                    onClick={() => onAdd(item)} 
                    className="flex flex-col items-start p-3.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-indigo-500/30 hover:shadow-lg transition-all group text-left relative overflow-hidden"
                >
                   {/* Hover Gradient */}
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                   
                   <div className="flex justify-between w-full relative z-10">
                       <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.label}</span>
                       <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 -translate-x-2 group-hover:translate-x-0 duration-300">
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                       </span>
                   </div>
                   <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 relative z-10">{item.description}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {filteredItems.length === 0 && (
            <div className="text-center py-12 opacity-50">
                <p className="text-sm text-slate-500 font-medium">No matching elements</p>
            </div>
        )}
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/overlays/CommandPalette.tsx`

```tsx
import React, { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { ELEMENT_CATALOG, type ElementCatalogItem } from "@/forms/schema/forms.schema.ElementCatalog";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, payload?: any) => void;
}

type CommandItem = 
  | { id: string; label: string; type: "action"; shortcut: string; payload?: never }
  | { id: string; label: string; type: "element"; payload: ElementCatalogItem; shortcut: string };

export function CommandPalette({ isOpen, onClose, onAction }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: CommandItem[] = [
    { id: "undo", label: "Undo", type: "action", shortcut: "⌘Z" },
    { id: "redo", label: "Redo", type: "action", shortcut: "⌘⇧Z" },
    { id: "save", label: "Save Version", type: "action", shortcut: "⌘S" },
    ...ELEMENT_CATALOG.map(item => ({
      id: `add:${item.id}`,
      label: `Add ${item.label}`,
      type: "element" as const,
      payload: item,
      shortcut: "⏎"
    }))
  ];

  const filtered = actions.filter(a => 
    a.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIndex]) {
          const item = filtered[activeIndex];
          if (item.type === "element") {
            onAction("addElement", item.payload);
          } else {
            onAction(item.id);
          }
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, activeIndex, onAction, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-white/90 dark:bg-violet-950/90 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 backdrop-blur-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Search */}
        <div className="flex items-center border-b border-slate-200 dark:border-white/10 px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-slate-500 mr-3"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
          <input
            ref={inputRef}
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveIndex(0); }}
            placeholder="What do you need?"
            className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 flex-1 h-6"
          />
          <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/5">ESC</span>
        </div>

        {/* List */}
        <div className="max-h-[300px] overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
          {filtered.map((action, idx) => (
            <button
              key={action.id}
              onClick={() => {
                if (action.type === "element") onAction("addElement", action.payload);
                else onAction(action.id);
                onClose();
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={clsx(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors",
                idx === activeIndex 
                  ? "bg-indigo-50 dark:bg-teal-500/20 text-indigo-700 dark:text-teal-100" 
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
              )}
            >
              <span className="flex items-center gap-2">
                 {action.type === "element" && <div className={clsx("w-1.5 h-1.5 rounded-full", idx === activeIndex ? "bg-indigo-500 dark:bg-teal-400" : "bg-slate-300 dark:bg-slate-600")} />}
                 {action.label}
              </span>
              {action.shortcut && (
                <span className="text-[10px] opacity-50 font-mono">{action.shortcut}</span>
              )}
            </button>
          ))}
          
          {filtered.length === 0 && (
             <div className="p-8 text-center text-xs text-slate-500 italic">
               No commands found.
             </div>
          )}
        </div>
        
        <div className="bg-slate-50 dark:bg-black/20 px-4 py-2 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 flex justify-between">
           <span>Insert Element</span>
           <span>Cmd + J</span>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/overlays/SaveFormDialog.tsx`

```tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface SaveFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  currentName?: string;
}

export function SaveFormDialog({ isOpen, onClose, onSave, currentName = "" }: SaveFormDialogProps) {
  const [name, setName] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setName(currentName || "Untitled Form");
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onSave(name);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-violet-950 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
        
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Save Form</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Give this form a name to access it later in your dashboard.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Form Name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 placeholder:text-slate-400"
            placeholder="e.g. Personal Injury Intake v1"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} isLoading={isSaving} disabled={!name.trim()}>
            Save Form
          </Button>
        </div>

      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/overlays/ShareDialog.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string | null;
}

export function ShareDialog({ isOpen, onClose, formId }: ShareDialogProps) {
  const [activeTab, setActiveTab] = useState<"link" | "embed">("link");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !formId) return null;

  const publicUrl = `${window.location.origin}/s/${formId}`;
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150" onClick={onClose}>
      <div className="w-full max-w-lg bg-white dark:bg-violet-950 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
        
        <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-violet-900/20">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Share Form</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Publish your form to start collecting submissions immediately.</p>
        </div>

        <div className="flex border-b border-slate-200 dark:border-white/10">
            <button onClick={() => setActiveTab("link")} className={clsx("flex-1 py-3 text-xs font-medium transition-colors", activeTab === "link" ? "text-indigo-600 dark:text-emerald-400 border-b-2 border-indigo-600 dark:border-emerald-500 bg-slate-50 dark:bg-white/5" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}>Public Link</button>
            <button onClick={() => setActiveTab("embed")} className={clsx("flex-1 py-3 text-xs font-medium transition-colors", activeTab === "embed" ? "text-indigo-600 dark:text-emerald-400 border-b-2 border-indigo-600 dark:border-emerald-500 bg-slate-50 dark:bg-white/5" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}>Embed Code</button>
        </div>

        <div className="p-6 space-y-4">
            {activeTab === "link" ? (
                <div className="space-y-3">
                    <div className="flex items-center justify-center p-6 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20 rounded-lg mb-4">
                        <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-sm">
                            <div className="w-full h-full bg-slate-900 pattern-grid-lg opacity-90" /> 
                        </div>
                    </div>
                    <label className="text-[10px] uppercase font-bold text-slate-500">Direct Link</label>
                    <div className="flex gap-2">
                        <input readOnly value={publicUrl} className="flex-1 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded px-3 text-sm text-slate-600 dark:text-slate-300 focus:ring-0" />
                        <Button onClick={() => handleCopy(publicUrl)}>{copied ? "Copied!" : "Copy"}</Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-slate-500">HTML Snippet</label>
                    <textarea readOnly value={embedCode} className="w-full h-32 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded p-3 text-xs font-mono text-indigo-600 dark:text-emerald-400/80 focus:ring-0 resize-none" />
                    <Button onClick={() => handleCopy(embedCode)} className="w-full">Copy Snippet</Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/ChatRunner.tsx`

```tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { getNextFieldKey } from "@/forms/logic/forms.logic.schemaIterator";
import { generateNaturalQuestion, generateNaturalTransition } from "@/forms/logic/forms.logic.naturalizer";

// -- SUB COMPONENTS --
import { IntakeChatMessage, type MessageVariant } from "./components/IntakeChatMessage";
import { ReviewOverlay } from "./components/ReviewOverlay";
import { ChatHeader } from "./components/ChatHeader";
import { ChatInputBar } from "./components/ChatInputBar";
import { ThinkingBubble } from "./components/ThinkingBubble";

// --- TYPES & HELPERS ---
export interface ChatMessage {
  id: string;
  variant: MessageVariant;
  content: React.ReactNode;
  label?: string;
  description?: string;
  fieldKey?: string;
  data?: Record<string, any>;
}

export interface SimpleMessage { 
  role: "user" | "assistant"; 
  text: string; 
}

function deriveSchemaSummary(schema: FormSchemaJsonShape) { 
    return Object.keys(schema.properties)
        .slice(0, 10) 
        .map(k => `${schema.properties[k].title} (${schema.properties[k].kind})`)
        .join(", "); 
}

const formatPhoneNumber = (value: string) => {
  const cleaned = ('' + value).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
  }
  return value;
};

// --- COMPONENT ---

interface ChatRunnerProps {
  formId: string;
  formName: string;
  schema: FormSchemaJsonShape;
  formData: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  history: ChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  textHistory: SimpleMessage[];
  setTextHistory: React.Dispatch<React.SetStateAction<SimpleMessage[]>>;
  activeFieldKey: string | null;
  onFieldFocus: (key: string | null) => void;
  onFinished: () => void;
}

export function ChatRunner({ 
    formId, formName, schema, formData, onDataChange, 
    history, setHistory, textHistory, setTextHistory,
    activeFieldKey, onFieldFocus, onFinished 
}: ChatRunnerProps) {
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  
  const schemaSummary = useMemo(() => deriveSchemaSummary(schema), [schema]);
  const totalFields = (schema.order || Object.keys(schema.properties)).length;
  const answeredFields = Object.keys(formData).length;
  const progressPercent = Math.min(100, Math.round((answeredFields / totalFields) * 100));

  const currentDef = activeFieldKey ? schema.properties[activeFieldKey] : null;
  const inputType = currentDef?.kind === "date" ? "date" : currentDef?.kind === "phone" ? "phone" : "text";

  const scrollToBottom = () => {
      setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
  };

  useEffect(() => {
      scrollToBottom();
  }, [history, isThinking]);

  useEffect(() => {
    const init = async () => {
        if (initialized.current || history.length > 0) return;
        initialized.current = true;
        
        let firstKey = activeFieldKey;
        if (!firstKey) {
            firstKey = getNextFieldKey(schema, formData);
            if (firstKey) onFieldFocus(firstKey);
        }

        setIsThinking(true);

        try {
            const res = await fetch("/api/ai/generate-intro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formName, schemaSummary })
            });
            const data = await res.json();
            // Fallback here in case API returns empty, though route is updated now
            const introText = data.intro || "Hi there! I'm here to help you get this done quickly.";

            setIsThinking(false);

            if (firstKey) {
                const def = schema.properties[firstKey];
                const q = generateNaturalQuestion(def, false);
                addMessage({ variant: "agent", content: <>{introText}<br/><br/>{q}</> }, q);
            } else {
                addMessage({ variant: "agent", content: introText });
            }

        } catch (err) {
            setIsThinking(false);
            // Fallback logic if API fails completely
            if (firstKey) askField(firstKey);
        }
    };
    init();
  }, []);

  useEffect(() => {
    if (activeFieldKey && history.length > 0) {
        const lastMsg = history[history.length - 1];
        if (lastMsg?.fieldKey !== activeFieldKey) {
            askField(activeFieldKey);
            setInputValue("");
        }
    } else if (activeFieldKey === null && history.length > 1 && !isReviewOpen) {
        const lastMsg = history[history.length - 1];
        if (lastMsg?.variant !== 'completion_options') {
            showCompletionOptions();
        }
    }
  }, [activeFieldKey]);

  const addMessage = (msg: Partial<ChatMessage>, text?: string) => {
    setHistory(prev => {
        const id = Date.now().toString() + Math.random();
        return [...prev, { id, variant: 'agent', content: '', ...msg } as ChatMessage];
    });
    if (text) setTextHistory(prev => [...prev, { role: msg.variant === 'user' ? 'user' : 'assistant', text }]);
  };

  const askField = (key: string) => {
    const def = schema.properties[key];
    if (!def) return;
    
    if (def.kind === 'header') {
        addMessage({ variant: "section", content: def.title });
        setTimeout(() => next(key, formData), 800);
        return;
    }

    const isFirst = history.length <= 1; 
    const q = generateNaturalQuestion(def, isFirst);
    const transition = !isFirst && history[history.length - 1].variant === 'user' ? `${generateNaturalTransition()} ` : "";

    addMessage({ variant: "agent", content: transition + q, fieldKey: key }, q);
  };

  const next = (currentKey: string, data: any) => {
      const nextKey = getNextFieldKey(schema, data, currentKey);
      onFieldFocus(nextKey); 
  };

  const showCompletionOptions = () => {
      addMessage({ variant: "agent", content: "All set. Please review your details." });
      setTimeout(() => addMessage({ variant: "completion_options", content: null }), 500);
  };

  const handleInputSubmit = async () => {
      if (!activeFieldKey || !inputValue.trim()) return;
      handleAnswer(inputValue);
  };

  const handleInputChange = (val: string) => {
      if (currentDef?.kind === "phone") {
          setInputValue(formatPhoneNumber(val));
      } else {
          setInputValue(val);
      }
  };

  const handleAnswer = async (val: any) => {
    if (!activeFieldKey) return;
    const def = schema.properties[activeFieldKey];
    
    let finalVal = val;
    let updates = {};

    const isDirect = ['select','radio','checkbox','date'].includes(def.kind);

    if (!isDirect && typeof val === 'string') {
        setIsThinking(true);
        addMessage({ variant: 'user', content: val }, val);
        setInputValue("");
        scrollToBottom();

        try {
            const apiHist = [...textHistory, { role: "user" as const, text: val }];
            const res = await fetch("/api/intake/agent", { 
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify({ 
                    fieldKey: def.key,
                    field: { ...def },
                    userMessage: val, 
                    formName, 
                    history: apiHist, 
                    schemaSummary, 
                    formData 
                }) 
            });
            const agentRes = await res.json();

            setIsThinking(false);

            if (agentRes.updates) updates = agentRes.updates;

            if (agentRes.type === 'question' || agentRes.type === 'chitchat') {
                if (Object.keys(updates).length > 0) {
                    const merged = { ...formData, ...updates };
                    onDataChange(merged);
                }
                addMessage({ variant: "agent", content: agentRes.replyMessage }, agentRes.replyMessage);
                return; 
            }
            finalVal = agentRes.extractedValue;
        } catch (e) { 
            setIsThinking(false); 
        }
    } else {
        addMessage({ variant: 'user', content: String(val) }, String(val));
        setInputValue("");
    }

    const nextData = { ...formData, ...updates, [activeFieldKey]: finalVal };
    onDataChange(nextData);
    next(activeFieldKey, nextData);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-950 relative transition-colors duration-500">
        
        {/* 1. Header (Absolute) */}
        <ChatHeader formName={formName} progressPercent={progressPercent} />

        {/* 2. Messages Area (Flex Grow + Min-H-0 for Scroll) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 scroll-smooth custom-scrollbar">
            {/* 
                Top padding (pt-32) ensures the first message starts comfortably 
                below the floating header, visually centered in the upper-mid screen 
                when the chat is empty.
            */}
            <div className="max-w-2xl mx-auto flex flex-col pt-32 pb-32">
                <AnimatePresence mode="popLayout">
                    {history.map(msg => (
                        <IntakeChatMessage 
                            key={msg.id} 
                            {...msg} 
                            isLatest={msg === history[history.length - 1]}
                            onReview={() => setIsReviewOpen(true)} 
                            onSubmit={onFinished} 
                        />
                    ))}
                    
                    {isThinking && <ThinkingBubble />}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>
        </div>

        {/* 3. Sticky Input Area */}
        <ChatInputBar 
            value={inputValue}
            onChange={handleInputChange}
            onSubmit={handleInputSubmit}
            inputType={inputType}
            isVisible={!!activeFieldKey && !isReviewOpen}
        />

        {/* 4. Overlays */}
        {isReviewOpen && (
            <ReviewOverlay 
                schema={schema} 
                data={formData} 
                onClose={() => setIsReviewOpen(false)} 
                onSubmit={(d) => { onDataChange(d); setIsReviewOpen(false); onFinished(); }} 
            />
        )}
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/FormRunner.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { Button } from "@/components/ui/Button";

interface FormRunnerProps {
  formId: string;
  formName: string;
  schema: FormSchemaJsonShape;
}

type FormValues = Record<string, any>;

export function FormRunner({ formId, formName, schema }: FormRunnerProps) {
  const [step, setStep] = useState<"welcome" | "form" | "success">("welcome");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    
    // [SECURITY] Extract the honeypot value separately
    const honeypot = data._hp_trap;
    // Remove it from the actual submission data so it doesn't pollute the CRM
    delete data._hp_trap;

    try {
        const res = await fetch(`/api/submit/${formId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // [SECURITY] Send payload matching API expectation
            body: JSON.stringify({ 
                data, 
                _hp: honeypot // The trap value
            }),
        });
        
        if (!res.ok) throw new Error("Submission failed");
        
        setStep("success");
    } catch (err) {
        alert("Error submitting form. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderField = (key: string, field: any) => {
    // ... existing render logic ...
    // (copy your existing renderField implementation here)
    const inputClass = "block w-full rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition-all text-slate-900 placeholder-slate-400";
    const isRequired = (schema.required || []).includes(key);

    return (
      <div key={key} className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500">
         {field.kind !== 'header' && field.kind !== 'info' && (
             <label htmlFor={key} className="block text-sm font-semibold text-slate-700">
               {field.title} {isRequired && <span className="text-red-500">*</span>}
             </label>
         )}
         
         {field.kind === 'header' && <h2 className="text-xl font-bold text-slate-800 mt-6 mb-2">{field.title}</h2>}
         {field.kind === 'info' && <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-md border border-slate-100">{field.description}</p>}
         
         {/* Simplified renderer for brevity - assume full logic is here */}
         {(field.kind === 'text' || field.kind === 'email' || field.kind === 'phone') && (
             <input {...register(key, { required: isRequired })} className={inputClass} placeholder={field.placeholder || "Your answer..."} />
         )}
         {/* ... other types ... */}
      </div>
    );
  };

  const fieldKeys = schema.order || Object.keys(schema.properties);

  if (step === "welcome") {
    // ... existing welcome ...
    return <div className="p-10 text-center"><Button onClick={() => setStep("form")}>Start</Button></div>;
  }

  if (step === "success") {
    // ... existing success ...
    return <div className="p-10 text-center">Success</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen sm:min-h-0 sm:rounded-2xl sm:shadow-2xl sm:my-10 overflow-hidden flex flex-col">
       <div className="h-2 bg-blue-600 w-full" />
       <div className="p-6 sm:p-10 space-y-8 flex-1">
          <div>
             <h1 className="text-xl font-bold text-slate-900">{formName}</h1>
             <p className="text-sm text-slate-400 uppercase tracking-wider font-medium mt-1">Secure Intake</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
             {fieldKeys.map(key => renderField(key, schema.properties[key]))}
             
             {/* [SECURITY] The Honeypot Trap 
                 - opacity-0 and absolute positioning removes it from visual flow
                 - tabIndex=-1 prevents keyboard users from accidentally focusing it
                 - autoComplete="off" prevents browser autofill
             */}
             <div className="opacity-0 absolute top-0 left-0 h-0 w-0 overflow-hidden -z-10">
                <label htmlFor="_hp_trap">Do not fill this field</label>
                <input 
                    id="_hp_trap"
                    {...register("_hp_trap")} 
                    tabIndex={-1} 
                    autoComplete="off" 
                />
             </div>

             <div className="pt-8 border-t border-slate-100">
                <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 text-base" isLoading={isSubmitting}>
                    Submit Information
                </Button>
             </div>
          </form>
       </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/LiveFormView.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { MessageCircle, Shield } from "lucide-react";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { Button } from "@/components/ui/Button";
import { FieldAssistantBubble } from "./components/FieldAssistantBubble";

interface LiveFormViewProps {
  formName: string;
  schema: FormSchemaJsonShape;
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSubmit: () => void;
}

export function LiveFormView({ formName, schema, formData, onChange, onSubmit }: LiveFormViewProps) {
  const keys = schema.order || Object.keys(schema.properties);
  const [assistantFieldKey, setAssistantFieldKey] = useState<string | null>(null);

  const handleChange = (key: string, val: any) => {
    onChange({ ...formData, [key]: val });
  };

  return (
    // [FIX] Added dark:bg-slate-950 to match the global theme
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 relative transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-8 py-12 space-y-8 min-h-screen">
        
        <div className="border-b border-slate-200 dark:border-white/10 pb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{formName}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 text-sm">
                <Shield className="w-3.5 h-3.5" /> Secure & Confidential
            </p>
        </div>

        <div className="space-y-8">
            {keys.map((key) => {
                const def = schema.properties[key];
                if (!def) return null;

                if (def.kind === "header") {
                    return <h3 key={key} className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-white/10 pb-2 mt-8">{def.title}</h3>;
                }
                if (def.kind === "info") {
                    return <div key={key} className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-lg text-sm leading-relaxed">{def.description}</div>;
                }

                const val = formData[key] || "";

                return (
                    <div key={key} className="group relative">
                        <div className="flex justify-between items-baseline mb-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {def.title} {def.isRequired && <span className="text-red-500">*</span>}
                            </label>
                            
                            <button 
                                onClick={() => setAssistantFieldKey(assistantFieldKey === key ? null : key)}
                                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                            >
                                <MessageCircle className="w-3 h-3" /> Ask AI
                            </button>
                        </div>

                        {/* AI BUBBLE */}
                        {assistantFieldKey === key && (
                            <FieldAssistantBubble 
                                field={def} 
                                formName={formName} 
                                schema={schema} 
                                formData={formData} 
                                onClose={() => setAssistantFieldKey(null)}
                                onUpdateField={(v) => handleChange(key, v)}
                            />
                        )}
                        
                        {def.description && <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{def.description}</p>}

                        {/* INPUT RENDERING - [FIX] Explicit styling for dark mode inputs */}
                        {def.kind === "textarea" ? (
                            <textarea 
                                value={val} 
                                onChange={e => handleChange(key, e.target.value)} 
                                className="w-full rounded-lg border-slate-300 dark:border-white/20 bg-white dark:bg-black/40 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                                rows={4} 
                            />
                        ) : (def.kind === "select" || def.kind === "radio") ? (
                            <select 
                                value={val} 
                                onChange={e => handleChange(key, e.target.value)} 
                                className="w-full rounded-lg border-slate-300 dark:border-white/20 bg-white dark:bg-black/40 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
                            >
                                <option value="" disabled>Select...</option>
                                {def.options?.map((opt: any) => {
                                    const oVal = typeof opt === 'string' ? opt : opt.value;
                                    const oLbl = typeof opt === 'string' ? opt : opt.label;
                                    return <option key={oVal} value={oVal}>{oLbl}</option>
                                })}
                            </select>
                        ) : def.kind === "checkbox" ? (
                            <div className="flex items-center gap-2 h-10">
                                <input 
                                    type="checkbox" 
                                    checked={!!val} 
                                    onChange={e => handleChange(key, e.target.checked)} 
                                    className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-black/40"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-300">Yes / Confirm</span>
                            </div>
                        ) : (
                            <input 
                                type={def.kind === "date" ? "date" : "text"} 
                                value={val} 
                                onChange={e => handleChange(key, e.target.value)} 
                                className="w-full rounded-lg border-slate-300 dark:border-white/20 bg-white dark:bg-black/40 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 h-11"
                            />
                        )}
                    </div>
                );
            })}
        </div>

        <div className="pt-10 border-t border-slate-200 dark:border-white/10">
            <Button onClick={onSubmit} size="lg" className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-xl">
                Submit Form
            </Button>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/UnifiedRunner.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { ChatRunner, type ChatMessage, type SimpleMessage } from "./ChatRunner";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface UnifiedRunnerProps {
  formId: string;
  formName: string;
  schema: FormSchemaJsonShape;
}

export function UnifiedRunner({ formId, formName, schema }: UnifiedRunnerProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [textHistory, setTextHistory] = useState<SimpleMessage[]>([]);

  const handleSubmit = async () => {
    try {
        // Optimistic UI update
        setIsSubmitted(true);
        await fetch(`/api/submit/${formId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: formData })
        });
    } catch (e) {
        alert("Something went wrong. Please try again.");
        setIsSubmitted(false);
    }
  };

  // --- SUCCESS VIEW ---
  if (isSubmitted) {
      return (
          <div className="flex items-center justify-center h-[100dvh] w-full bg-slate-950 p-6 animate-in fade-in duration-500">
              <div className="bg-slate-900 border border-white/10 p-10 rounded-3xl max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 blur-3xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-500/20">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Submission Received</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">Thank you. Your information has been securely recorded.</p>
                    <Button variant="secondary" onClick={() => window.location.reload()} className="w-full h-12 text-sm">
                        Start New Form
                    </Button>
                  </div>
              </div>
          </div>
      );
  }

  // --- RUNNER VIEW ---
  return (
    // FIX: Use 100dvh to respect mobile browser chrome. 
    // overflow-hidden prevents body scroll.
    <div className="h-[100dvh] w-full bg-slate-950 flex flex-col overflow-hidden">
        <ChatRunner 
            formId={formId}
            formName={formName}
            schema={schema}
            formData={formData}
            onDataChange={setFormData}
            activeFieldKey={activeFieldKey}
            onFieldFocus={setActiveFieldKey}
            onFinished={handleSubmit}
            history={history}
            setHistory={setHistory}
            textHistory={textHistory}
            setTextHistory={setTextHistory}
        />
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/buildChatContext.ts`

```ts

```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/components/ChatHeader.tsx`

```tsx
"use client";

import React from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface ChatHeaderProps {
  formName: string;
  progressPercent: number;
}

export function ChatHeader({ formName, progressPercent }: ChatHeaderProps) {
  return (
    // CHANGED: fixed -> absolute. Anchors to ChatRunner container.
    <div className="absolute top-0 left-0 right-0 z-40 px-4 pt-4 pb-2 bg-gradient-to-b from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent pointer-events-none transition-all duration-500">
      <header className="pointer-events-auto mx-auto max-w-3xl h-16 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm flex items-center justify-between px-5 relative overflow-hidden transition-all duration-500">
        
        {/* Progress Bar Background */}
        <div 
            className="absolute bottom-0 left-0 h-[3px] bg-indigo-500/50 transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }} 
        />

        {/* Left: Brand + Context */}
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/20 shadow-inner">
                <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
                <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                    {formName || "Intake"}
                </h1>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                    {progressPercent < 100 ? `${progressPercent}% Complete` : 'Final Review'}
                </span>
            </div>
        </div>

        {/* Right: Security Badge + Theme */}
        <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Secure</span>
            </div>
            <div className="pl-2 border-l border-slate-200 dark:border-white/10">
                <ThemeToggle />
            </div>
        </div>
      </header>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/components/ChatInputBar.tsx`

```tsx
"use client";

import React, { useRef, useEffect } from "react";
import { Send, Calendar, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  inputType?: "text" | "date" | "phone";
  isVisible: boolean;
}

export function ChatInputBar({ value, onChange, onSubmit, inputType = "text", isVisible }: ChatInputBarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  // [FIX] Added 'as const' to ensure type compatibility with Framer Motion
  const slideUp = {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 },
      transition: { type: "spring" as const, stiffness: 300, damping: 30 }
  };

  if (!isVisible) return null;

  if (inputType === "date") {
    return (
        <AnimatePresence>
            <motion.div 
                {...slideUp}
                className="absolute bottom-0 left-0 right-0 p-4 pb-8 z-50 bg-gradient-to-t from-white dark:from-slate-950 via-white/90 dark:via-slate-950/90 to-transparent flex justify-center pointer-events-none"
            >
                <div className="pointer-events-auto relative flex gap-3 items-center w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] px-6 py-4 shadow-2xl shadow-indigo-500/10">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <input 
                        type="date"
                        className="flex-1 bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 text-base h-full font-medium"
                        onChange={(e) => onChange(e.target.value)} 
                        onBlur={onSubmit} 
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
        <motion.div 
            {...slideUp}
            className="absolute bottom-0 left-0 right-0 p-4 pb-8 z-50 bg-gradient-to-t from-white dark:from-slate-950 via-white/90 dark:via-slate-950/90 to-transparent flex justify-center pointer-events-none"
        >
            <div className="pointer-events-auto relative w-full max-w-3xl flex items-end gap-2">
                <div className="relative flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[24px] shadow-lg shadow-indigo-500/5 focus-within:shadow-xl focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all overflow-hidden group">
                    
                    {inputType === 'phone' && (
                        <div className="absolute left-4 top-4 text-slate-400 pointer-events-none">
                            <Phone className="w-5 h-5" />
                        </div>
                    )}

                    <textarea 
                        ref={inputRef}
                        className={`w-full bg-transparent border-none py-4 pr-14 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 outline-none resize-none max-h-32 min-h-[56px] leading-relaxed custom-scrollbar ${inputType === 'phone' ? 'pl-12' : 'pl-5'}`}
                        placeholder={inputType === 'phone' ? "(555) 000-0000" : "Type your answer..."}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        rows={1}
                    />
                    
                    <div className="absolute right-2 bottom-2">
                        <button 
                            onClick={onSubmit}
                            disabled={!value.trim()}
                            className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 transition-all duration-200 shadow-md disabled:shadow-none transform active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/components/FieldAssistantBubble.tsx`

```tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, CornerDownLeft } from "lucide-react";
import type { FormFieldDefinition, FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface FieldAssistantBubbleProps {
  field: FormFieldDefinition;
  formName: string;
  schema: FormSchemaJsonShape;
  formData: Record<string, any>;
  onClose: () => void;
  onUpdateField: (value: any) => void;
}

export function FieldAssistantBubble({ field, formName, schema, formData, onClose, onUpdateField }: FieldAssistantBubbleProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const schemaSummary = Object.keys(schema.properties)
    .map(k => `- ${schema.properties[k].title}`)
    .join("\n");

  const handleAsk = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setIsThinking(true);
    setResponse(null);

    try {
      const res = await fetch("/api/intake/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            field, 
            userMessage: input, 
            formName, 
            history: [], 
            schemaSummary,
            formData 
        }),
      });
      
      const data = await res.json();
      
      if (data.type === "answer" && data.extractedValue !== undefined) {
          onUpdateField(data.extractedValue);
          setResponse(`I've updated the field to: ${data.extractedValue}`);
          setTimeout(onClose, 1500);
      } else {
          setResponse(data.replyMessage);
      }

    } catch (err) {
        setResponse("Sorry, I couldn't connect to the assistant.");
    } finally {
        setIsThinking(false);
    }
  };

  return (
    <div className="absolute right-0 top-8 z-50 w-80 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
      <div className="bg-white dark:bg-violet-950 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-black/50">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-violet-900/50 px-4 py-3 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wide">AI Assistant</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
            {response ? (
                <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-100 dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/5 animate-in slide-in-from-bottom-2">
                    {response}
                </div>
            ) : (
                <div className="text-xs text-slate-500 text-center py-2">
                    Ask about "{field.title}"...
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleAsk} className="relative">
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. Why is this needed?"
                    disabled={isThinking}
                    className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 transition-all outline-none"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || isThinking}
                    className="absolute right-1.5 top-1.5 p-1.5 bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-teal-600/20 text-slate-400 hover:text-indigo-500 dark:hover:text-teal-400 rounded-md transition-all disabled:opacity-30 border border-slate-200 dark:border-transparent shadow-sm"
                >
                    {isThinking ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <CornerDownLeft className="w-3.5 h-3.5" />}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/components/IntakeChatMessage.tsx`

```tsx
"use client";

import React from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Layers, FileText, Edit, Send, Sparkles, AlertTriangle } from "lucide-react";

export type MessageVariant =
  | "system"
  | "agent"
  | "user"
  | "section"
  | "warning"
  | "section_complete"
  | "review_summary"
  | "completion_options";

interface IntakeChatMessageProps {
  variant: MessageVariant;
  content: React.ReactNode;
  isLatest?: boolean;
  data?: Record<string, any>;
  onReview?: () => void;
  onSubmit?: () => void;
}

export function IntakeChatMessage({
  variant,
  content,
  isLatest,
  data,
  onReview,
  onSubmit
}: IntakeChatMessageProps) {
  
  // --- USER MESSAGE (Right Aligned) ---
  if (variant === "user") {
    return (
      <motion.div
        layout // [FIX] Smooth layout transition
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex justify-end mb-8 pl-12"
      >
        <div className="flex flex-col items-end gap-1.5 max-w-[90%]">
          <div className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-4 rounded-[1.5rem] rounded-tr-sm shadow-xl shadow-indigo-900/10 dark:shadow-indigo-500/20 border border-white/10 text-[15px] leading-relaxed">
             {content}
          </div>
          <span className="text-[10px] text-slate-400 font-medium mr-1 opacity-70">You</span>
        </div>
      </motion.div>
    );
  }

  // --- SPECIAL UI BLOCKS ---
  if (variant === "completion_options") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex flex-wrap gap-3 mt-4 mb-24 ml-14"
      >
        <button 
            onClick={onReview}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm hover:scale-105"
        >
            <Edit className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wide">Review Answers</span>
        </button>

        <button 
            onClick={onSubmit}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all font-bold text-xs uppercase tracking-wide"
        >
            <Send className="w-4 h-4" />
            <span>Finish & Submit</span>
        </button>
      </motion.div>
    );
  }

  if (variant === "review_summary") {
    const entries = Object.entries(data || {});
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 ml-14 max-w-md w-full"
      >
        <div className="rounded-2xl overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg">
            <div className="bg-indigo-50 dark:bg-indigo-500/10 px-5 py-3 border-b border-indigo-100 dark:border-indigo-500/20 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">Summary</span>
            </div>
            <div className="p-5 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {entries.map(([key, val]) => (
                    <div key={key} className="flex justify-between items-start gap-4 text-xs border-b border-slate-200/50 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                        <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium mt-0.5">{key}</span>
                        <span className="text-slate-800 dark:text-slate-200 text-right font-semibold">{String(val)}</span>
                    </div>
                ))}
            </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "section") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="my-10 flex items-center justify-center gap-4 opacity-70"
      >
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
        <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{content}</span>
        </div>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-indigo-500/50" />
      </motion.div>
    );
  }

  if (variant === "warning") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="ml-14 mr-8 my-2 p-3 rounded-lg border border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 flex gap-3 shadow-sm"
      >
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed font-medium">{content}</p>
      </motion.div>
    );
  }

  // --- AI ASSISTANT MESSAGE (Default) ---
  return (
    <motion.div
      layout // [FIX] Smooth layout transition
      initial={{ opacity: 0, y: 10, x: -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      className={clsx(
        "flex gap-4 mb-6 max-w-[95%] md:max-w-[85%]",
        isLatest ? "mb-8" : "mb-4"
      )}
    >
      {/* Avatar Column */}
      <div className="flex-none flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-2 ring-white dark:ring-slate-900 z-10">
              <Sparkles className="w-4 h-4 text-white" />
          </div>
      </div>
      
      {/* Content Column */}
      <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-baseline justify-between pl-1 pr-4">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Moreways AI</span>
              <span className="text-[10px] text-slate-400">Just now</span>
          </div>
          
          <div className={clsx(
              "px-6 py-4 rounded-[1.25rem] rounded-tl-sm text-[15px] leading-relaxed shadow-sm transition-all duration-500",
              isLatest 
                  ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 shadow-md" 
                  : "bg-transparent dark:bg-transparent border border-transparent text-slate-600 dark:text-slate-400 pl-0 py-0 shadow-none"
          )}>
            {content}
          </div>
      </div>
    </motion.div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/components/ReviewOverlay.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { X, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface ReviewOverlayProps {
  schema: FormSchemaJsonShape;
  data: Record<string, any>;
  onClose: () => void;
  onSubmit: (updatedData: Record<string, any>) => void;
}

export function ReviewOverlay({ schema, data, onClose, onSubmit }: ReviewOverlayProps) {
  // Local state for edits before saving
  const [localData, setLocalData] = useState(data);

  const handleChange = (key: string, val: any) => {
    setLocalData((prev) => ({ ...prev, [key]: val }));
  };

  // Determine order
  const keys = schema.order || Object.keys(schema.properties);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl h-[85vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/50">
          <div>
            <h2 className="text-lg font-bold text-white">Review & Edit</h2>
            <p className="text-xs text-slate-400">Make final corrections before submitting.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900">
          {keys.map((key) => {
            const def = schema.properties[key];
            if (!def || def.kind === "header" || def.kind === "info" || def.kind === "divider") return null;

            return (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {def.title}
                </label>
                
                {/* Input Rendering Logic */}
                {def.kind === "textarea" ? (
                  <textarea
                    value={localData[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                    rows={3}
                  />
                ) : (def.kind === "select" || def.kind === "radio") ? (
                   <select 
                      value={localData[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none appearance-none"
                   >
                      <option value="" disabled>Select...</option>
                      {def.options?.map((opt: any) => {
                          const val = typeof opt === 'string' ? opt : opt.value;
                          const label = typeof opt === 'string' ? opt : opt.label;
                          return <option key={val} value={val}>{label}</option>;
                      })}
                   </select>
                ) : (
                  <input
                    type={def.kind === "number" || def.kind === "currency" ? "number" : "text"}
                    value={localData[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 bg-slate-950/30 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => onSubmit(localData)} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
          >
            <Send className="w-4 h-4 mr-2" /> Submit Form
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/components/SectionSidebar.tsx`

```tsx
import React, { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface SectionSidebarProps {
  schema: FormSchemaJsonShape;
  currentFieldKey: string | null;
}

// [FIX] Define interface to prevent narrowing of 'status' to string literal
interface SectionItem {
  title: string;
  startKey: string;
  status: 'done' | 'active' | 'pending';
}

export function SectionSidebar({ schema, currentFieldKey }: SectionSidebarProps) {
  const fieldKeys = schema.order || Object.keys(schema.properties);
  const sections: SectionItem[] = [];
  
  // [FIX] Explicitly type the variable
  let currentSection: SectionItem = { 
    title: "Start", 
    startKey: fieldKeys[0] || "unknown", 
    status: 'pending' 
  };

  // Determine active section index
  let activeSectionIndex = 0;

  fieldKeys.forEach((key) => {
    const def = schema.properties[key];
    if (def.kind === 'header') {
        sections.push(currentSection);
        currentSection = { title: def.title, startKey: key, status: 'pending' };
    }
    if (key === currentFieldKey) {
        currentSection.status = 'active';
        // Mark previous as done
        sections.forEach(s => s.status = 'done');
        activeSectionIndex = sections.length;
    }
  });
  sections.push(currentSection);

  if (!currentFieldKey && sections.length > 0) {
      sections.forEach(s => s.status = 'done');
      activeSectionIndex = sections.length - 1;
  }

  // Auto-scroll mobile pills
  const pillsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pillsRef.current) {
        const activeEl = pillsRef.current.children[activeSectionIndex] as HTMLElement;
        if (activeEl) {
            pillsRef.current.scrollTo({ left: activeEl.offsetLeft - 20, behavior: 'smooth' });
        }
    }
  }, [activeSectionIndex]);

  return (
    <>
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:flex flex-col w-64 py-8 pr-6 pl-4 h-full border-r border-white/5 space-y-6 bg-slate-950/30">
            <div>
                <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 pl-1">Progress</h4>
                <div className="space-y-0 relative">
                    {/* Thinner Line */}
                    <div className="absolute left-[9px] top-2 bottom-2 w-[1px] bg-white/5 -z-10" />

                    {sections.map((s, i) => (
                        <div key={i} className={clsx("flex items-center gap-3 py-2 transition-all duration-500", s.status === 'active' ? "opacity-100" : s.status === 'done' ? "opacity-50" : "opacity-20")}>
                            <div className={clsx("w-5 h-5 rounded-full border flex items-center justify-center transition-colors bg-slate-950 z-10", 
                                s.status === 'active' ? "border-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : 
                                s.status === 'done' ? "border-emerald-500/30 text-emerald-500/50 bg-emerald-500/10" : "border-slate-800 text-slate-800"
                            )}>
                                {s.status === 'done' ? <Check className="w-3 h-3" /> : <div className={clsx("rounded-full bg-current", s.status === 'active' ? "w-1.5 h-1.5" : "w-1 h-1")} />}
                            </div>
                            <div>
                                <div className={clsx("text-xs font-medium leading-none", s.status === 'active' ? "text-emerald-400" : "text-slate-300")}>{s.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* MOBILE TOP PILLS */}
        <div className="lg:hidden h-12 border-b border-white/5 flex items-center overflow-x-auto no-scrollbar px-4 gap-2 bg-slate-950/80 backdrop-blur-xl z-20" ref={pillsRef}>
            {sections.map((s, i) => (
                <div key={i} className={clsx("flex-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors whitespace-nowrap", 
                    s.status === 'active' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : 
                    s.status === 'done' ? "bg-slate-800/50 border-white/5 text-slate-500" : "border-transparent text-slate-600"
                )}>
                    {s.title}
                </div>
            ))}
        </div>
    </>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/runner/components/ThinkingBubble.tsx`

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function ThinkingBubble() {
  return (
    <motion.div 
        layout // [FIX] Enables smooth layout transition when removed
        initial={{ opacity: 0, y: 10, scale: 0.9 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        className="flex gap-4 mb-6 max-w-[90%] md:max-w-[80%]"
    >
        {/* Avatar */}
        <div className="flex-none flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-2 ring-white dark:ring-slate-900 z-10">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
        </div>

        {/* Bubble (Dots Only) */}
        <div className="flex flex-col justify-center">
            <div className="px-5 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center w-fit">
                <motion.div 
                    className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                    animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div 
                    className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                    animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                />
                <motion.div 
                    className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                    animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                />
            </div>
        </div>
    </motion.div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/simulator/AutoFillEngine.ts`

```ts
/**
 * forms.ui.simulator.AutoFillEngine
 *
 * Logic to simulate human typing behavior for form demonstrations.
 * Supports different "Personas" with distinct data patterns.
 */

import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export type PersonaType = "standard" | "anxious" | "corporate" | "senior";

interface PersonaProfile {
  label: string;
  description: string;
  typingSpeed: number; // ms per char
  dataGenerator: (key: string, kind: string) => any;
}

// --- DATA GENERATORS ---

const GENERATORS: Record<PersonaType, PersonaProfile> = {
  standard: {
    label: "Standard User",
    description: "Efficient, clear answers. Good capitalization.",
    typingSpeed: 30,
    dataGenerator: (key, kind) => {
      const lower = key.toLowerCase();
      if (kind === 'date') return new Date().toISOString().split('T')[0];
      if (kind === 'checkbox') return true;
      if (lower.includes('email')) return "alex.smith@example.com";
      if (lower.includes('phone')) return "(555) 123-4567";
      if (lower.includes('name')) return "Alex Smith";
      if (kind === 'textarea') return "I was walking down the aisle when I slipped on a wet floor sign that had fallen over.";
      return "Sample Answer";
    }
  },
  anxious: {
    label: "Anxious Client",
    description: "Verbose, emotional, lower-case typing. Slow.",
    typingSpeed: 80,
    dataGenerator: (key, kind) => {
      const lower = key.toLowerCase();
      if (kind === 'date') return "2023-11-15";
      if (kind === 'checkbox') return true;
      if (lower.includes('email')) return "worried.customer@gmail.com";
      if (lower.includes('name')) return "jane doe...";
      if (kind === 'textarea') return "it happened so fast... i really dont know what to do now. i am in a lot of pain and i need help asap please.";
      return "please help";
    }
  },
  corporate: {
    label: "Busy Professional",
    description: "Brief, all-caps or jargon-heavy. Super fast.",
    typingSpeed: 10,
    dataGenerator: (key, kind) => {
      const lower = key.toLowerCase();
      if (kind === 'date') return new Date().toISOString().split('T')[0];
      if (kind === 'checkbox') return true;
      if (lower.includes('email')) return "admin@corp.legal";
      if (lower.includes('name')) return "R. STONE";
      if (kind === 'textarea') return "Incident confirmed per attached report. Claimant seeks damages. Proceeding with standard intake protocol.";
      return "N/A";
    }
  },
  senior: {
    label: "Senior Citizen",
    description: "Polite, slow typing. Detailed.",
    typingSpeed: 120,
    dataGenerator: (key, kind) => {
      const lower = key.toLowerCase();
      if (kind === 'date') return "1955-04-12";
      if (kind === 'checkbox') return true;
      if (lower.includes('email')) return "grandpa.joe@aol.com";
      if (lower.includes('name')) return "Mr. Joseph P. Sullivan";
      if (kind === 'textarea') return "Dear Sir/Madam, I am writing to inform you of an unfortunate fall I took at the grocery store last Tuesday.";
      return "Yes, thank you.";
    }
  }
};

/**
 * The Iterator.
 * Takes a schema and a callback, and "plays" the form field by field.
 */
export async function playSimulation(
  schema: FormSchemaJsonShape, 
  persona: PersonaType,
  onFieldUpdate: (key: string, value: any, isFinal: boolean) => void,
  onFieldFocus: (key: string | null) => void
) {
  const profile = GENERATORS[persona];
  const keys = schema.order || Object.keys(schema.properties);

  for (const key of keys) {
    const def = schema.properties[key];
    if (!def || ['header', 'info', 'divider'].includes(def.kind)) continue;

    // 1. Focus Field
    onFieldFocus(key);

    // 2. Generate Target Value
    let targetValue = profile.dataGenerator(key, def.kind);
    
    // Handle Selection Types (Instant fill, no typing)
    if (['select', 'radio', 'checkbox_group'].includes(def.kind)) {
       if (def.options && def.options.length > 0) {
           // Pick first option for simplicity
           const opt = def.options[0];
           targetValue = typeof opt === 'string' ? opt : opt.value;
       }
       // Slight delay for "thinking"
       await new Promise(r => setTimeout(r, 400));
       onFieldUpdate(key, targetValue, true);
       continue;
    }

    // Handle Boolean (Instant)
    if (def.kind === 'checkbox' || def.kind === 'switch') {
        await new Promise(r => setTimeout(r, 400));
        onFieldUpdate(key, true, true);
        continue;
    }

    // 3. Typing Simulation (Strings only)
    if (typeof targetValue === 'string' && targetValue.length > 0) {
        let currentBuffer = "";
        for (const char of targetValue) {
            currentBuffer += char;
            onFieldUpdate(key, currentBuffer, false);
            
            // Randomized variance in typing speed
            const variance = Math.random() * 30 - 15; 
            await new Promise(r => setTimeout(r, profile.typingSpeed + variance));
        }
    } else {
        // Numeric/Date direct set
        onFieldUpdate(key, targetValue, true);
    }

    // Pause between fields
    await new Promise(r => setTimeout(r, 500));
  }

  onFieldFocus(null); // Done
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/ui/simulator/SimulatorOverlay.tsx`

```tsx
// src/forms/ui/simulator/SimulatorOverlay.tsx

"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { Play, RotateCcw, User, Zap, Coffee, Briefcase } from "lucide-react";
import { playSimulation, type PersonaType } from "./AutoFillEngine";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface SimulatorOverlayProps {
  schema: FormSchemaJsonShape | null;
  onReset: () => void;
  onSimulateField: (key: string, val: any) => void;
}

export function SimulatorOverlay({ schema, onReset, onSimulateField }: SimulatorOverlayProps) {
  const [activePersona, setActivePersona] = useState<PersonaType>("standard");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  if (!schema) return null;

  const handlePlay = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    onReset(); // Clear form first

    await playSimulation(
        schema, 
        activePersona, 
        (key, val) => onSimulateField(key, val),
        (key) => setActiveField(key)
    );

    setIsPlaying(false);
  };

  const personas = [
    { id: "standard", label: "Standard", icon: <User className="w-3 h-3"/> },
    { id: "anxious", label: "Anxious", icon: <Coffee className="w-3 h-3"/> },
    { id: "corporate", label: "Pro", icon: <Briefcase className="w-3 h-3"/> },
    { id: "senior", label: "Senior", icon: <Zap className="w-3 h-3"/> },
  ];

  return (
    <div className="mt-12 border-t border-dashed border-slate-200 dark:border-slate-800 pt-8 relative">
      
      {/* Active Field Indicator (Floating Badge) */}
      {activeField && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-bounce z-20 border border-indigo-400">
           GHOST TYPING: {activeField}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner border border-slate-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
        
        {/* Animated Background Gradient (Subtle) */}
        <div className={clsx("absolute inset-0 opacity-10 dark:opacity-20 transition-opacity duration-500 pointer-events-none", isPlaying ? "opacity-30" : "opacity-0")}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 animate-pulse" />
        </div>

        {/* Left: Controls */}
        <div className="flex items-center gap-4 relative z-10 overflow-hidden w-full md:w-auto">
           <div className="flex items-center gap-2 flex-shrink-0">
              <div className={clsx("w-2 h-2 rounded-full transition-colors", isPlaying ? "bg-emerald-500 animate-pulse" : "bg-slate-400 dark:bg-slate-600")} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Simulator</span>
           </div>

           <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-2 flex-shrink-0" />

           {/* Persona Switcher (Scrollable) */}
           {/* [FIX] Added overflow-x-auto and max-w-full to prevent clipping on narrow screens */}
           <div className="flex bg-white dark:bg-black/40 p-1 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm overflow-x-auto max-w-full custom-scrollbar">
              {personas.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActivePersona(p.id as PersonaType)}
                    disabled={isPlaying}
                    className={clsx(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all disabled:opacity-50 whitespace-nowrap flex-shrink-0",
                        activePersona === p.id 
                            ? "bg-indigo-600 text-white shadow-md" 
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                    )}
                  >
                      {p.icon}
                      <span className="inline">{p.label}</span>
                  </button>
              ))}
           </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 relative z-10 flex-shrink-0">
            <button 
                onClick={handlePlay} 
                disabled={isPlaying}
                className={clsx(
                    "relative inline-flex items-center justify-center rounded-lg px-6 py-2 text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
                    "bg-slate-900 text-white hover:bg-slate-800",
                    "dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500"
                )}
            >
                {isPlaying ? (
                    <span className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> 
                        Running...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 fill-current" /> 
                        Auto-Fill
                    </span>
                )}
            </button>
            
            <button 
                onClick={onReset}
                disabled={isPlaying} 
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-30"
                title="Clear Form"
            >
                <RotateCcw className="w-4 h-4" />
            </button>
        </div>

      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/util/forms.util.elementInjector.ts`

```ts
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
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/util/forms.util.formSchemaNormalizer.ts`

```ts
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
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/util/forms.util.migrateSchema.ts`

```ts
/**
 * forms.util.migrateSchema
 *
 * runtime migration utility to upgrade legacy v1 schemas to the
 * v1.5 "Grand Unified Schema" format.
 *
 * Guarantees:
 * - Always returns a valid FormSchemaJsonShape with 'order' and 'properties'.
 * - Converts legacy 'required' array into 'field.isRequired' boolean.
 * - Safe to run on already-migrated schemas (idempotent).
 */

import type {
  FormSchemaJsonShape,
  FormFieldDefinition,
} from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export function migrateSchemaToV15(raw: any): FormSchemaJsonShape {
  if (!raw || typeof raw !== "object") {
    return { type: "object", order: [], properties: {}, required: [] };
  }

  const properties: Record<string, FormFieldDefinition> = raw.properties || {};
  
  // 1. Derive Order (Legacy schemas relied on object insertion order)
  let order: string[] = Array.isArray(raw.order)
    ? raw.order
    : Object.keys(properties);

  // 2. Handle Legacy Required Array
  const legacyRequired = new Set(Array.isArray(raw.required) ? raw.required : []);

  // 3. Normalize Fields
  const normalizedProperties: Record<string, FormFieldDefinition> = {};

  for (const key of order) {
    const originalField = properties[key];
    if (!originalField) continue;

    const field: FormFieldDefinition = {
      ...originalField,
      id: originalField.id || `field_${key}_${Math.random().toString(36).substr(2, 5)}`,
      key: key,
      kind: originalField.kind || "text",
      title: originalField.title || key,
      // [MIGRATION] Merge legacy array into boolean
      isRequired: originalField.isRequired ?? legacyRequired.has(key),
      // [v1.5] Ensure containers exist
      logic: Array.isArray(originalField.logic) ? originalField.logic : undefined,
      metadata: originalField.metadata || undefined,
      layout: originalField.layout || undefined,
    };

    normalizedProperties[key] = field;
  }

  // 4. Re-verify order matches valid keys only
  const finalOrder = order.filter((key) => !!normalizedProperties[key]);

  return {
    type: "object",
    order: finalOrder,
    properties: normalizedProperties,
    // We keep the legacy array for backward compat with older parsers if needed
    required: Array.from(legacyRequired) as string[],
  };
}
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/util/forms.util.publicMapper.ts`

```ts
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
```

### `C:/projects/moreways/argueOS-v1-form/src/forms/[id]/editor/page.tsx`

```tsx
import FormEditor from "@/forms/ui/forms.ui.FormEditor";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditorPage({ params }: PageProps) {
  return <FormEditor formId={params.id} />;
}
```

