--- START OF FILE CONSOLE-SRC-FORMS.md ---

# High-Resolution Interface Map

## Tree: `apps/console/src/forms`

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
│   │   │   ├── VerdictCard.tsx
│   ├── simulator/
│   │   ├── AutoFillEngine.ts
│   │   ├── SimulatorOverlay.tsx
├── util/
│   ├── forms.util.elementInjector.ts
│   ├── forms.util.formSchemaNormalizer.ts
│   ├── forms.util.migrateSchema.ts
│   ├── forms.util.publicMapper.ts
```

## File Summaries

### `data/starterTemplates.ts`
**Role:** Defines hardcoded starting templates for forms (e.g., NDA, Personal Injury) to seed the database or UI.
**Key Exports:**
- `STARTER_TEMPLATES` - Array of template objects containing metadata and schema JSON.
**Dependencies:** `FormSchemaJsonShape`.

### `logic/forms.logic.evaluateSubmissionFlags.ts`
**Role:** Deterministic guardrail engine that evaluates a submission against schema logic rules to detect risks.
**Key Exports:**
- `evaluateSubmissionFlags(schema, data): SubmissionFlag[]` - Runs "When X then Flag" rules defined in the schema against the provided data.
**Dependencies:** `FormSchemaJsonShape`.

### `logic/forms.logic.mergeExtraction.ts`
**Role:** Merges AI extraction results into the form data state, applying type coercion and anti-hallucination guardrails.
**Key Exports:**
- `mergeExtractionIntoFormData(currentData, extraction, schema): Result` - Returns updated data, applied keys, and dropped keys.
**Dependencies:** `logger`, `ExtractionResult`, `FormSchemaJsonShape`.

### `logic/forms.logic.naturalizer.ts`
**Role:** Converts technical field definitions into natural language questions for the chat interface, adding conversational bridges.
**Key Exports:**
- `generateNaturalQuestion(fieldDef, isFirst): string` - Returns a conversational question using intelligent mapping (detects Name, Date, Phone contexts).
- `generateNaturalTransition(): string` - Returns random transition phrases (e.g., "Got it. Moving on...").
**Dependencies:** `FormFieldDefinition`.

### `logic/forms.logic.schemaIterator.ts`
**Role:** Determines the next field to ask in the flow, handling conditional logic (Show/Hide) and skipping already-filled fields.
**Key Exports:**
- `getNextFieldKey(schema, currentData, lastKey): string | null` - Returns the key of the next visible, unfilled field or null if complete.
**Dependencies:** `FormSchemaJsonShape`.

### `repo/forms.repo.FormSchemaRepo.ts`
**Role:** Data access layer for Form Schemas, handling versioning, retrieval, soft deletes, and publishing.
**Key Exports:**
- `formSchemaRepo` - Singleton instance.
- `createVersion(input): Promise<FormSchema>` - Creates a new draft version.
- `publishVersion(params): Promise<void>` - Marks a specific version as live and unpublishes others.
- `softDelete(params): Promise<void>` - Marks a form family as deprecated.
- `getPublicById(id): Promise<FormSchema>` - Fetches schema only if published and active.
**Dependencies:** `db`, `logger`, `migrateSchemaToV15`.

### `runner/useChatRunnerController.ts`
**Role:** Custom hook managing the state and API interactions for a chat-based form runner.
**Key Exports:**
- `useChatRunnerController({ formName, schema })` - Returns history, loading state, and answer handlers.
**Dependencies:** `fetch`, `useState`.

### `schema/forms.schema.ElementCatalog.ts`
**Role:** Defines the library of available form elements (Inputs, Selects, Smart Blocks) for the form builder.
**Key Exports:**
- `ELEMENT_CATALOG` - Array of `ElementCatalogItem` defining default props for every field type.
**Dependencies:** `FormFieldDefinition`.

### `schema/forms.schema.FormFieldValues.ts`
**Role:** Type definition for the flat key-value map used to store form answers.
**Key Exports:**
- `FormFieldValues` - `Record<string, unknown>`.
**Dependencies:** None.

### `schema/forms.schema.FormSchemaJsonShape.ts`
**Role:** The "Grand Unified Schema" definition for the JSON structure stored in the database.
**Key Exports:**
- `FormSchemaJsonShape` - Root interface for the form document.
- `FormFieldDefinition` - Interface for individual field props (kind, logic, layout).
- `FieldLogicRule` - Interface for conditional logic rules.
**Dependencies:** None.

### `schema/forms.schema.FormSchemaModel.ts`
**Role:** Domain model wrapper for the database row, decoupling Prisma types from application logic.
**Key Exports:**
- `FormSchema` - Domain interface matching the DB row but with typed JSON.
- `mapDbFormSchemaRowToDomain(row): FormSchema` - Mapper function.
**Dependencies:** `PrismaClient`, `FormSchemaJsonShape`.

### `ui/CrmDashboard.tsx`
**Role:** A specific dashboard view used within the CRM context to view submissions and form stats.
**Key Exports:**
- `CrmDashboard()` - Renders a split view of form selection and submission details.
**Dependencies:** `GlassCard`, `Button`, `fetch`.

### `ui/ai/AssistantPanel.tsx`
**Role:** The "AI Architect" sidebar in the Form Editor, mediating between the user chat and the schema generation API.
**Key Exports:**
- `AssistantPanel(props)` - Manages chat history and calls the `/api/intake/forms/from-prompt` endpoint.
**Dependencies:** `ChatPanel`.

### `ui/ai/FieldAiPromptBubble.tsx`
**Role:** A popover input allowing users to request AI changes for a specific field (Micro-Edits).
**Key Exports:**
- `FieldAiPromptBubble({ onSubmit })` - Renders a small text area for field-specific prompts.
**Dependencies:** `Button`.

### `ui/canvas/DraggableFieldList.tsx`
**Role:** The main list area of the form builder, handling drag-and-drop reordering of fields.
**Key Exports:**
- `DraggableFieldList(props)` - Renders `Reorder.Group` containing field items.
**Dependencies:** `framer-motion`, `FieldRenderer`, `FieldToolbar`.

### `ui/canvas/FieldMicroEditor.tsx`
**Role:** A small settings panel for quick edits to a field (Label, Type, Required) directly on the canvas.
**Key Exports:**
- `FieldMicroEditor({ field, onChange })` - Renders basic input controls for field properties.
**Dependencies:** `GlassCard`.

### `ui/canvas/FieldToolbar.tsx`
**Role:** Hover toolbar for fields providing actions like Polish, Translate, Duplicate, and Delete.
**Key Exports:**
- `FieldToolbar(props)` - Renders action buttons appearing above a selected field.
**Dependencies:** `framer-motion`, `lucide-react`.

### `ui/canvas/FloatingFieldEditor.tsx`
**Role:** The detailed "Inspector" panel that appears when a field is selected, offering tabs for Settings, Logic, and Data.
**Key Exports:**
- `FloatingFieldEditor(props)` - Renders a draggable, tabbed interface for deep field configuration.
**Dependencies:** `framer-motion`, `LogicEditor`, `DataSettings`.

### `ui/canvas/ReactiveCanvas.tsx`
**Role:** The central workspace of the Form Editor, managing selection, drag-drop, and view modes (Desktop/Mobile).
**Key Exports:**
- `ReactiveCanvas(props)` - Orchestrates the `DraggableFieldList` and `FloatingFieldEditor`.
**Dependencies:** `DraggableFieldList`, `FloatingFieldEditor`, `useLocalStorage`.

### `ui/canvas/field-actions.ts`
**Role:** Helper functions for manipulating field definitions (adding options, generating IDs).
**Key Exports:**
- `generateKeyFromLabel(label)` - Creates camelCase keys.
- `addOptionToField(field)` - Appends a new option.
**Dependencies:** `FormFieldDefinition`.

### `ui/canvas/forms.ui.canvas.FieldRenderer.tsx`
**Role:** Renders the visual representation of a field (Input, Select, etc.) on the canvas.
**Key Exports:**
- `FieldRenderer({ def })` - Maps `def.kind` to the appropriate HTML/UI element with PII warnings.
**Dependencies:** `PiiWarning`, `lucide-react`.

### `ui/dashboard/DashboardComponents.tsx`
**Role:** Reusable widget components for the main dashboard (Metrics, Activity Feed).
**Key Exports:**
- `MetricsRow` - Displays high-level stats cards.
**Dependencies:** `GlassCard`.

### `ui/dashboard/FormCard.tsx`
**Role:** A card component representing a single form in the dashboard grid with spotlight effects and management actions.
**Key Exports:**
- `FormCard({ form, onDelete })` - Renders form stats (leads, conversion), version info, and context menu (Archive).
**Dependencies:** `GlassMenu`, `framer-motion`.

### `ui/editor/HistoryControl.tsx`
**Role:** Floating UI control to toggle the Version History slider.
**Key Exports:**
- `HistoryControl(props)` - Renders the history button and the slider panel.
**Dependencies:** `VersionHistorySlider`.

### `ui/editor/VersionHistorySlider.tsx`
**Role:** A timeline slider allowing users to browse and revert to previous versions of a form.
**Key Exports:**
- `VersionHistorySlider({ versions })` - Renders a visual timeline of form versions.
**Dependencies:** `FormVersionSummary`.

### `ui/forms.ui.FormEditor.tsx`
**Role:** The top-level page component for the Form Builder experience, managing autosave, publishing, and versioning.
**Key Exports:**
- `FormEditor({ formId })` - Manages global state, handles "Publish Live" workflow, and integrates `VersionHistorySlider`.
**Dependencies:** `ReactiveCanvas`, `AssistantPanel`, `HistoryControl`.

### `ui/guardrails/PiiWarning.tsx`
**Role:** Wrapper component that highlights fields potentially containing Sensitive Data (PII).
**Key Exports:**
- `PiiWarning({ label })` - Analyzes label text against regex heuristics to show a warning badge.
**Dependencies:** None.

### `ui/hooks/forms.ui.hooks.useHistory.ts`
**Role:** Custom hook implementing Undo/Redo functionality for generic state.
**Key Exports:**
- `useHistory(initial)` - Returns state, setters, and undo/redo functions with keyboard shortcuts.
**Dependencies:** `useState`, `useEffect`.

### `ui/inspector/forms.ui.inspector.DataSettings.tsx`
**Role:** Inspector tab for configuring field metadata (PII flags, database keys).
**Key Exports:**
- `DataSettings({ def, onChange })` - Renders checkboxes and inputs for `def.metadata`.
**Dependencies:** `FormFieldDefinition`.

### `ui/inspector/forms.ui.inspector.LogicEditor.tsx`
**Role:** Inspector tab for defining conditional logic rules (Show/Hide/Flag).
**Key Exports:**
- `LogicEditor({ def, onChange })` - Renders a UI for building `when/then` logic rules, including an AI generator.
**Dependencies:** `fetch` (for AI generation).

### `ui/inventory/ElementInventory.tsx`
**Role:** Sidebar panel displaying the catalog of available form elements for drag-and-drop.
**Key Exports:**
- `ElementInventory({ onAdd })` - Renders categorized lists of elements from `ELEMENT_CATALOG`.
**Dependencies:** `ELEMENT_CATALOG`.

### `ui/overlays/CommandPalette.tsx`
**Role:** A specialized command palette (Cmd+K/J) for the Form Editor context.
**Key Exports:**
- `CommandPalette({ isOpen, onAction })` - Renders a searchable list of editor actions and elements.
**Dependencies:** `ELEMENT_CATALOG`.

### `ui/overlays/SaveFormDialog.tsx`
**Role:** Modal dialog for naming and saving a form.
**Key Exports:**
- `SaveFormDialog({ onSave })` - Renders a name input and save button.
**Dependencies:** `Button`.

### `ui/overlays/ShareDialog.tsx`
**Role:** Modal dialog for sharing a public form link or getting embed code.
**Key Exports:**
- `ShareDialog({ formId })` - Displays the public URL and copy buttons.
**Dependencies:** `Button`.

### `ui/runner/ChatRunner.tsx`
**Role:** The conversational engine UI that executes the form schema as a chat, integrating AI question generation and data extraction.
**Key Exports:**
- `ChatRunner(props)` - Orchestrates the loop: Agent asks -> User answers -> AI extracts/validates -> Next Field.
**Dependencies:** `IntakeChatMessage`, `ReviewOverlay`, `fetch` (/api/intake/agent).

### `ui/runner/FormRunner.tsx`
**Role:** A traditional (non-chat) form renderer for linear data entry.
**Key Exports:**
- `FormRunner(props)` - Renders all fields at once using `react-hook-form` and handles submission.
**Dependencies:** `react-hook-form`, `Button`.

### `ui/runner/LiveFormView.tsx`
**Role:** A traditional form view that includes "Ask AI" bubbles for field assistance.
**Key Exports:**
- `LiveFormView(props)` - Renders a long-scrolling form with helper buttons.
**Dependencies:** `FieldAssistantBubble`.

### `ui/runner/UnifiedRunner.tsx`
**Role:** The public-facing container that manages form state, submission, and displays the final verdict/assessment.
**Key Exports:**
- `UnifiedRunner(props)` - Handles `formData` state, submission to API, and renders `VerdictCard` on success.
**Dependencies:** `ChatRunner`, `VerdictCard`.

### `ui/runner/buildChatContext.ts`
**Role:** *Placeholder.* Likely intended for constructing the context payload for the chat agent.
**Key Exports:** *None (Empty File)*
**Dependencies:** *None*

### `ui/runner/components/ChatHeader.tsx`
**Role:** Header component for the Chat Runner showing progress and branding.
**Key Exports:**
- `ChatHeader({ formName, progress })` - Renders the top bar with a progress indicator.
**Dependencies:** `ThemeToggle`.

### `ui/runner/components/ChatInputBar.tsx`
**Role:** Input area for the Chat Runner, supporting text, date, and other specialized inputs.
**Key Exports:**
- `ChatInputBar(props)` - Renders the text area and send button.
**Dependencies:** `framer-motion`.

### `ui/runner/components/FieldAssistantBubble.tsx`
**Role:** A popup bubble allowing users to ask questions about a specific field during intake.
**Key Exports:**
- `FieldAssistantBubble(props)` - Renders a chat interface scoped to a single field.
**Dependencies:** `fetch`.

### `ui/runner/components/IntakeChatMessage.tsx`
**Role:** Renders specialized chat bubbles for the intake runner (System, User, Section Dividers, Review Summaries).
**Key Exports:**
- `IntakeChatMessage({ variant, content })` - Handles layout for various message types using `forwardRef` for animations.
**Dependencies:** `framer-motion`.

### `ui/runner/components/ReviewOverlay.tsx`
**Role:** A modal overlay allowing users to review and edit all answers before final submission.
**Key Exports:**
- `ReviewOverlay(props)` - Renders a scrollable summary form of collected data for quick edits.
**Dependencies:** `Button`.

### `ui/runner/components/SectionSidebar.tsx`
**Role:** A visual progress tracker showing form sections during the runner session.
**Key Exports:**
- `SectionSidebar({ schema, currentFieldKey })` - Renders a list of sections, highlighting the active one.
**Dependencies:** None.

### `ui/runner/components/ThinkingBubble.tsx`
**Role:** Animated loading indicator for the Chat Runner.
**Key Exports:**
- `ThinkingBubble()` - Renders a pulsing dot animation with exit transitions.
**Dependencies:** `framer-motion`.

### `ui/runner/components/VerdictCard.tsx`
**Role:** Displays the AI-generated assessment results (Score, Eligibility) after form submission.
**Key Exports:**
- `VerdictCard({ verdict, onReset })` - Visualizes the claim strength, missing elements, and legal citations.
**Dependencies:** `lucide-react`.

### `ui/simulator/AutoFillEngine.ts`
**Role:** Logic for simulating different user personas (Standard, Anxious, Corporate) filling out a form.
**Key Exports:**
- `playSimulation(schema, persona, callback)` - Iterates through the schema and "types" answers based on the selected persona profile.
**Dependencies:** `FormSchemaJsonShape`.

### `ui/simulator/SimulatorOverlay.tsx`
**Role:** UI control panel for the Auto-Fill Simulator.
**Key Exports:**
- `SimulatorOverlay(props)` - Renders buttons to select a persona and start/stop simulation.
**Dependencies:** `AutoFillEngine`.

### `util/forms.util.elementInjector.ts`
**Role:** Logic for instantiating new fields from the catalog into the form schema.
**Key Exports:**
- `injectCatalogItem(fields, item): FieldEntry[]` - Generates unique keys and IDs for new fields and appends them.
**Dependencies:** `ElementCatalogItem`.

### `util/forms.util.formSchemaNormalizer.ts`
**Role:** Ensures raw JSON from the database or LLM conforms to the strict `FormSchemaJsonShape`.
**Key Exports:**
- `normalizeFormSchemaJsonShape(raw): FormSchemaJsonShape` - Fills missing properties, generates IDs, and sanitizes input.
**Dependencies:** `FormSchemaJsonShape`.

### `util/forms.util.migrateSchema.ts`
**Role:** Runtime utility to upgrade legacy schema versions to the current format.
**Key Exports:**
- `migrateSchemaToV15(raw): FormSchemaJsonShape` - Moves `required` arrays to boolean flags and ensures structural integrity.
**Dependencies:** `FormSchemaJsonShape`.

### `util/forms.util.publicMapper.ts`
**Role:** Maps internal platform schema types to a simplified public format (if needed for external consumption).
**Key Exports:**
- `mapPlatformToPublic(schema): PublicField[]` - Converts schema to a flat list of public field definitions.
**Dependencies:** `FormSchemaJsonShape`.

### `[id]/editor/page.tsx`
**Role:** Server Component wrapper for the Form Editor route.
**Key Exports:**
- `EditorPage({ params })` - Renders the `FormEditor` component with the `formId` from the URL.
**Dependencies:** `FormEditor`.