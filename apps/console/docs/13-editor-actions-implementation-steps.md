## 1. Grand Unified Schema Upgrade (Forms Domain)

### 1.1 Schema Type Definition

* [ ] **`src/forms/schema/forms.schema.FormSchemaJsonShape.ts`**

  * [ ] Replace existing definitions with **ARGUEOS V1.5 GRAND UNIFIED SCHEMA**:

    * [ ] `FormFieldKind` supports primitives, temporal, selection, boolean, and structural kinds:

      * [ ] `"text" | "textarea" | "email" | "phone" | "number" | "currency"`
      * [ ] `"date" | "time" | "date_range"`
      * [ ] `"select" | "multiselect" | "radio" | "checkbox_group"`
      * [ ] `"checkbox" | "switch"`
      * [ ] `"header" | "info" | "group" | "divider"`.
    * [ ] Define `LogicOperator` and `FieldLogicRule`:

      * [ ] `operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "is_empty" | "is_not_empty"`.
      * [ ] `action: "show" | "hide" | "require" | "disable"`.
    * [ ] Define `FieldOption`, `FieldMetadata`, and `FieldLayout`:

      * [ ] `FieldMetadata` includes `isPII`, `complianceNote`, `externalMapping`, `isLocked`, `isHiddenInput`.
      * [ ] `FieldLayout` includes `width`, `newLine`, `hidden`.
    * [ ] Define `FormFieldDefinition` including:

      * [ ] `id`, `key`, `title`, `kind`.
      * [ ] optional `description`, `placeholder`.
      * [ ] validation: `isRequired`, `min`, `max`, `pattern`.
      * [ ] optional `options`, `allowOther`.
      * [ ] advanced: `logic?`, `metadata?`, `layout?`.
    * [ ] Update `FormSchemaJsonShape` root:

      * [ ] `type: "object"`.
      * [ ] `properties: Record<string, FormFieldDefinition>`.
      * [ ] `order?: string[]` (display order).
      * [ ] `required?: string[]` (legacy compatibility).

### 1.2 Legacy Compatibility + Migration Helpers

* [ ] **`src/forms/util/forms.util.migrateSchema.ts` (new helper)**

  * [ ] Implement a migration utility:

    * [ ] If `order` is missing, derive it from `Object.keys(properties)` deterministically.
    * [ ] If `required` exists, map keys → `field.isRequired = true` for those keys.
    * [ ] Ensure `logic`, `metadata`, `layout` default to `undefined` for older schemas.
  * [ ] Export helper and use it wherever schemas are loaded from DB.

* [ ] **Wire migration into repo**

  * [ ] **`src/forms/repo/forms.repo.FormSchemaRepo.ts`**

    * [ ] On read, pass raw JSON through `migrateSchemaToV15()` before returning `FormSchemaJsonShape` to callers.
    * [ ] On write, ensure:

      * [ ] `order` is always persisted.
      * [ ] `required` array is derived from `fields` with `isRequired === true`.

### 1.3 Schema Validation & Tests

* [ ] **`src/forms/schema/forms.schema.FormSchemaJsonShape.test.ts`**

  * [ ] Add tests to verify:

    * [ ] Minimal valid schema parses successfully.
    * [ ] Layout and metadata fields are optional and do not break existing flows.
    * [ ] Logic rules reference only existing `key`s (basic sanity check).
  * [ ] Add migration tests:

    * [ ] Old v1-style schema (no `order`, `required` only) transforms correctly to v1.5.
    * [ ] v1.5 schemas round-trip through repo without shape changes.

---

## 2. LLM Contract & Envelope Types (LLM Domain)

### 2.1 LLM Response Envelope Types

* [ ] **`src/llm/schema/llm.schema.FormEditResponse.ts` (new file)**

  * [ ] Define the envelope interface:

    ```ts
    import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

    export interface LlmFormEditResponse {
      thought_process: string;
      summary_message: string;
      schema_update: FormSchemaJsonShape;
    }
    ```

  * [ ] Optionally add a `change_summary` stub:

    ```ts
    export interface LlmFormEditChangeSummary {
      added_fields?: string[];
      updated_fields?: string[];
      removed_fields?: string[];
    }
    ```

    (Can be filled in later; keep optional.)

### 2.2 JSON Parsing & Validation

* [ ] **`src/llm/util/llm.util.parseFormEditEnvelope.ts` (new file)**

  * [ ] Implement a safe JSON parser:

    * [ ] Take raw string from LLM.
    * [ ] Attempt `JSON.parse`.
    * [ ] Verify presence & types of `thought_process`, `summary_message`, `schema_update`.
    * [ ] Validate `schema_update` against `FormSchemaJsonShape` (type-level + runtime checks as needed).
    * [ ] On failure, throw a structured error (for pipeline to catch and convert into user-facing message).

* [ ] **Tests**

  * [ ] Add tests for:

    * [ ] Valid envelope parses successfully.
    * [ ] Missing `schema_update` or `summary_message` results in a clear error.
    * [ ] Malformed JSON is handled gracefully.

---

## 3. Prompt Template – “Principal Architect” Upgrade

### 3.1 Edit Prompt Template

* [ ] **`prompts/v1/edit-form-schema.txt`**

  * [ ] Update persona:

    * [ ] “You are argueOS, the Principal Legal Knowledge Engineer. Your goal is to REFACTOR an existing form schema based on user requests.”

  * [ ] Add **Capabilities** section:

    * [ ] Explicitly list:

      * [ ] Change `kind`.
      * [ ] Manipulate `logic` (show/hide/require/disable).
      * [ ] Manipulate `layout` (e.g., `width: "half"`).
      * [ ] Manipulate `metadata` (`isPII`, `complianceNote`, `externalMapping`, etc.).

  * [ ] Add **Schema Rules (STRICT)**:

    * [ ] `logic` triggers must refer to existing `key`s.
    * [ ] `options` must be well-formed `{ "label": string, "value": string }`.
    * [ ] `schema_update` MUST be a **full** schema: includes `type`, `properties`, `order`, and `required` when relevant.

  * [ ] Add **Behavioral Rules**:

    * [ ] Expand “Finances” → specific fields (`annualIncome`, `totalDebt`, etc.).
    * [ ] Auto-layout first/last name with `layout.width = "half"`.
    * [ ] Mark SSN-like fields as PII and attach a compliance note.

  * [ ] Enforce **Output JSON Envelope**:

    ```json
    {
      "thought_process": "Reasoning...",
      "summary_message": "Plain-language explanation for the lawyer.",
      "schema_update": { ...full updated schema... }
    }
    ```

  * [ ] Add an explicit example of a small **before schema → user request → after envelope** pair at the end of the prompt.

### 3.2 Prompt Loader Wiring

* [ ] **`src/llm/util/llm.util.loadPromptTemplate.ts`**

  * [ ] Ensure `edit-form-schema.txt` is loaded via the existing prompt loader.
  * [ ] Add template variables:

    * [ ] `{{current_schema_json}}`
    * [ ] `{{chat_history}}`
    * [ ] `{{user_prompt}}`

* [ ] **Tests**

  * [ ] Add a template smoke test (ensures the file loads and variables can be interpolated).

---

## 4. Intake Domain & Pipeline Changes

### 4.1 Intake Request/Response Contracts

* [ ] **`src/intake/schema/intake.schema.FormEditRequest.ts` (or existing request types)**

  * [ ] Extend request type to include:

    * [ ] `messages: { role: "user" | "assistant"; content: string }[]` (conversation history).
    * [ ] `currentSchema: FormSchemaJsonShape` (or a reference to load it server-side).

* [ ] **`src/intake/schema/intake.schema.FormEditResponse.ts`**

  * [ ] Define response shape:

    * [ ] `summaryMessage: string;`
    * [ ] `schema: FormSchemaJsonShape;`

### 4.2 Intake Pipeline (“Prompt → Envelope → Schema”)

* [ ] **`src/intake/svc/intake.svc.IntakePromptToFormPipeline.ts`**

  * [ ] Update pipeline steps:

    * [ ] **Step 01 – Normalize conversation history & prompt**

      * [ ] Trim / sanitize incoming `messages`.
      * [ ] Optionally limit history length.
    * [ ] **Step 02 – Call LLM with envelope prompt**

      * [ ] Build LLM input with:

        * [ ] `current_schema_json` (stringified schema).
        * [ ] `chat_history`.
        * [ ] `user_prompt`.
      * [ ] Call LLM adapter (`LlmGenerateFormEditAsync` or similar).
    * [ ] **Step 03 – Parse JSON envelope**

      * [ ] Use `parseFormEditEnvelope()` to obtain `LlmFormEditResponse`.
    * [ ] **Step 04 – Validate `schema_update`**

      * [ ] Ensure valid `FormSchemaJsonShape` (including `order` and `required`).
      * [ ] Run any existing schema validation (field kinds, options, requireds).
    * [ ] **Step 05 – Persist Schema**

      * [ ] Save updated schema via `FormSchemaRepo`.
    * [ ] **Step 06 – Return response DTO**

      * [ ] Return:

        * [ ] `summaryMessage` (from `summary_message`).
        * [ ] `schema` (from `schema_update`).

* [ ] **Error Handling**

  * [ ] On parse or validation failure:

    * [ ] Return a user-safe error message to UI (“I couldn’t safely update the form; nothing was changed.”).
    * [ ] Do **not** persist a partial schema.
    * [ ] Log internal error with `thought_process` and raw content (sanitized for PII where possible).

---

## 5. API Route & UI Wiring (Chat IDE)

### 5.1 API Route

* [ ] **`src/app/api/forms/edit/route.ts` (or equivalent)**

  * [ ] Accept:

    * [ ] `organizationId` (from auth).
    * [ ] `messages[]` (conversation history).
    * [ ] Any other payload needed to identify/load the current schema.
  * [ ] Load current schema for the user’s organization and form id.
  * [ ] Call `IntakePromptToFormPipeline` with:

    * [ ] `messages`.
    * [ ] `currentSchema`.
  * [ ] Return:

    * [ ] `summaryMessage`.
    * [ ] updated `schema`.

### 5.2 Chat Panel Integration

* [ ] **`src/intake/ui/chat/ChatPanel.tsx`**

  * [ ] Maintain local `messages` state:

    * [ ] Append user message on send.
    * [ ] Append assistant message using `summaryMessage` from API response.
  * [ ] On send:

    * [ ] POST `messages` to the new API route.
    * [ ] Receive `summaryMessage` + updated `schema`.
    * [ ] Pass updated `schema` to `ReactiveCanvas` / preview component.

### 5.3 Reactive Canvas Update Trigger

* [ ] **`src/forms/ui/canvas/ReactiveCanvas.tsx`**

  * [ ] Accept updated `schema` as props or via context.
  * [ ] On schema change:

    * [ ] Re-render the form fields according to `properties` and `order`.
    * [ ] Trigger subtle “flash” or highlight animation for changed fields (can be added in Phase 2 UI work).

---

## 6. Safety, Logging & Tests

### 6.1 Logging Strategy

* [ ] Ensure `thought_process` is:

  * [ ] Logged only on the server side (for debugging).
  * [ ] Never sent back to the UI directly.
* [ ] Redact or avoid logging raw user content that may include PII where possible.

### 6.2 End-to-End Tests

* [ ] Add **integration tests** covering:

  * [ ] “Make this field required” → updates `isRequired` + `required[]`.
  * [ ] “Show this only if X is yes” → adds `logic` rule on target field.
  * [ ] “Mark SSN as sensitive” → sets `metadata.isPII` and `complianceNote`.
  * [ ] “Make first and last name side-by-side” → sets both `layout.width = "half"`.

* [ ] Verify:

  * [ ] Old v1 schemas still load and can be edited.
  * [ ] Broken LLM envelope does **not** corrupt the stored schema.
  * [ ] UI receives a helpful error when LLM output is invalid.

---

