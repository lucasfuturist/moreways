# High-Resolution Interface Map

## Tree: `apps/console/src/intake`

```
intake/
├── api/
│   ├── intake.api.createFormFromPromptRoute.ts
├── logic/
│   ├── SimpleIntakeEngine.ts
│   ├── dumpFormJson.ts
├── schema/
│   ├── intake.schema.IntakeRequestTypes.ts
├── svc/
│   ├── intake.svc.IntakeCreateFormFromPromptAsync.ts
│   ├── intake.svc.IntakePromptToFormPipeline.ts
├── ui/
│   ├── chat/
│   │   ├── ChatPanel.tsx
│   ├── intake.ui.FormFromPromptPage.tsx
│   ├── intake.ui.FormSchemaPreview.tsx
│   ├── intake.ui.SchemaJsonViewer.tsx
│   ├── magic-input/
│   │   ├── CommandPalette.tsx
│   │   ├── SuggestionEngine.ts
```

## File Summaries

### `api/intake.api.createFormFromPromptRoute.ts`
**Role:** HTTP Endpoint handler (`POST /api/intake/forms/from-prompt`) for generating or editing forms via natural language.
**Key Exports:**
- `createFormFromPromptRoute(req, deps): Promise<Response>` - Validates auth/org scope, injects micro-edit instructions if scoped, and calls `IntakeCreateFormFromPromptAsync`.
**Dependencies:** `IntakeCreateFormFromPromptAsync`, `logger`, `getCurrentUser`.

### `logic/SimpleIntakeEngine.ts`
**Role:** Core utility for summarizing form progress into a snapshot for the AI agent.
**Key Exports:**
- `buildSimpleIntakeSnapshot(schema, formData): SimpleIntakeSnapshot` - Returns an object categorizing all schema fields into `filled` (with values) and `unfilled` lists.
**Dependencies:** `FormSchemaJsonShape`.

### `logic/dumpFormJson.ts`
**Role:** Utility to serialize the form snapshot to a JSON string for debugging or LLM context injection.
**Key Exports:**
- `dumpFormJson(schema, formData): string` - Returns formatted JSON string of the intake snapshot.
**Dependencies:** `buildSimpleIntakeSnapshot`.

### `schema/intake.schema.IntakeRequestTypes.ts`
**Role:** Defines the shared API contracts (Request/Response shapes) for the AI Form Generation workflow.
**Key Exports:**
- `CreateFormFromPromptRequest` - Interface including `prompt`, `orgId`, `currentSchema`, and `scopedFieldKey`.
- `CreateFormFromPromptResponse` - Interface returning the generated `schema` and an explanation `message`.
- `isErrorResponse(payload): boolean` - Type guard for error handling.
**Dependencies:** `FormSchemaJsonShape`.

### `svc/intake.svc.IntakeCreateFormFromPromptAsync.ts`
**Role:** Service layer entry point that orchestrates the form generation request.
**Key Exports:**
- `IntakeCreateFormFromPromptAsync(req, user, deps): Promise<Response>` - Maps the API request to the pipeline input and executes `IntakePromptToFormPipelineAsync`.
**Dependencies:** `IntakePromptToFormPipelineAsync`.

### `svc/intake.svc.IntakePromptToFormPipeline.ts`
**Role:** The core pipeline ("Talk + Do") that converts a prompt into a persisted form schema.
**Key Exports:**
- `IntakePromptToFormPipelineAsync(input, deps): Promise<Output>` - Runs the multi-step process: Normalize Prompt -> Generate Draft via LLM -> Validate Schema -> Persist to Repo.
**Dependencies:** `LlmGenerateFormFromPromptAsync`, `formSchemaRepo`, `openaiClient`, `logger`.

### `ui/chat/ChatPanel.tsx`
**Role:** Renders the "AI Architect" chat interface where users describe form changes.
**Key Exports:**
- `ChatPanel({ messages, input, setInput, onSubmit })` - Displays chat history and an input area with dynamic suggestions.
**Dependencies:** `framer-motion`, `lucide-react`.

### `ui/intake.ui.FormFromPromptPage.tsx`
**Role:** The main "Form Builder" page connecting the Canvas, Chat Panel, and Inventory.
**Key Exports:**
- `FormFromPromptPage({ initialFormId })` - Manages global state (`fields`, `messages`), handles keyboard shortcuts, orchestrates AI updates via `fetch`, and renders the workspace layout.
**Dependencies:** `ReactiveCanvas`, `ChatPanel`, `AssistantPanel`, `ElementInventory`, `useHistory`.

### `ui/intake.ui.FormSchemaPreview.tsx`
**Role:** Renders a live, interactive preview of the generated form schema using React Hook Form.
**Key Exports:**
- `FormSchemaPreview({ schema, formId })` - Dynamically renders form inputs based on the schema and handles submission simulation.
**Dependencies:** `react-hook-form`, `GlassSelect`, `SimulatorOverlay`.

### `ui/intake.ui.SchemaJsonViewer.tsx`
**Role:** A developer utility component to view the raw JSON of the generated schema.
**Key Exports:**
- `SchemaJsonViewer({ schema })` - Renders a syntax-highlighted (or simple pre) block of the schema JSON.
**Dependencies:** None.

### `ui/magic-input/CommandPalette.tsx`
**Role:** A floating input bar ("Magic Input") for quickly generating forms via prompt.
**Key Exports:**
- `CommandPalette({ value, onChange, onSubmit })` - Renders a centered input card with suggestion chips.
**Dependencies:** `GlassCard`, `SuggestionEngine`.

### `ui/magic-input/SuggestionEngine.ts`
**Role:** Provides heuristic-based prompt suggestions for the Command Palette.
**Key Exports:**
- `getSuggestions(currentValue): Suggestion[]` - Returns a list of suggested prompts based on whether the input is empty or has content.
**Dependencies:** None.