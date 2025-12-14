# High-Resolution Interface Map: `apps/console/src/app`

## Tree: `apps/console/src/app`

```
app/
├── admin/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── ui/
│   │   ├── AdminSidebar.tsx
│   │   ├── FormFactoryView.tsx
│   │   ├── OpsNavbar.tsx
│   ├── views/
│   │   ├── CommunicationsView.tsx
│   │   ├── CustomersView.tsx
│   │   ├── FormFactoryView.tsx
│   │   ├── SupportView.tsx
├── api/
│   ├── ai/
│   │   ├── assess-claim/
│   │   │   ├── route.ts
│   │   ├── critique/
│   │   │   ├── route.ts
│   │   ├── generate-intro/
│   │   │   ├── route.ts
│   │   ├── generate-options/
│   │   │   ├── route.ts
│   │   ├── generate-rules/
│   │   │   ├── route.ts
│   │   ├── generate-suggestions/
│   │   │   ├── route.ts
│   │   ├── refine-field/
│   │   │   ├── route.ts
│   ├── auth/
│   │   ├── signout/
│   │   │   ├── route.ts
│   ├── crm/
│   │   ├── submissions/
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts
│   │   │   ├── route.ts
│   ├── dev/
│   │   ├── seed/
│   │   │   ├── route.ts
│   │   ├── seed-form/
│   │   │   ├── route.ts
│   ├── forms/
│   │   ├── [id]/
│   │   │   ├── route.ts
│   │   │   ├── versions/
│   │   │   │   ├── route.ts
│   │   ├── route.ts
│   ├── intake/
│   │   ├── agent/
│   │   │   ├── route.ts
│   │   ├── forms/
│   │   │   ├── from-prompt/
│   │   │   │   ├── route.ts
│   │   ├── review/
│   │   │   ├── route.ts
│   │   ├── snapshot/
│   │   │   ├── route.ts
│   │   ├── turn/
│   │   │   ├── route.ts
│   ├── public/
│   │   ├── v1/
│   │   │   ├── agent/
│   │   │   │   ├── route.ts
│   │   │   ├── forms/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts
│   │   │   │   ├── route.ts
│   │   │   ├── submit/
│   │   │   │   ├── route.ts
│   ├── submit/
│   │   ├── [formId]/
│   │   │   ├── assess/
│   │   │   │   ├── route.ts
│   │   │   ├── route.ts
├── crm/
│   ├── inbox/
│   │   ├── page.tsx
│   ├── page.tsx
├── forms/
│   ├── [id]/
│   │   ├── editor/
│   │   │   ├── page.tsx
│   ├── new-from-prompt/
│   │   ├── page.tsx
│   ├── page.tsx
├── globals.css
├── layout.tsx
├── page.tsx
├── s/
│   ├── [formId]/
│   │   ├── page.tsx
├── template.tsx
```

## File Summaries

### `globals.css`
**Role:** Defines global styles, Tailwind directives, and CSS variables for the application theme.
**Key Exports:**
- CSS Variables (`--primary`, `--background`, etc.)
- Utility Classes (`.glass-panel`, `.bg-noise`)
**Dependencies:** Tailwind CSS.

### `layout.tsx`
**Role:** Root application layout that wraps all pages.
**Key Exports:**
- `RootLayout({ children })` - Provides global providers (`ThemeProvider`, `SmoothScroll`) and conditionally renders the `AdminNavbar` based on the route.
**Dependencies:** `AdminNavbar`, `AuroraBackground`, `GlobalCommandPalette`.

### `page.tsx`
**Role:** Root entry point (`/`).
**Key Exports:**
- `Home()` - Redirects traffic immediately to `/crm`.
**Dependencies:** `redirect`.

### `template.tsx`
**Role:** Handles page transition animations.
**Key Exports:**
- `Template({ children })` - Wraps content in a `framer-motion` div for fade/scale transitions on navigation.
**Dependencies:** `framer-motion`.

---

### `admin/layout.tsx`
**Role:** Layout for the Operations Center (`/admin`).
**Key Exports:**
- `AdminLayout({ children })` - Renders the `OpsNavbar` and a content container with specific padding.
**Dependencies:** `OpsNavbar`.

### `admin/page.tsx`
**Role:** Main dashboard for the Operations Center.
**Key Exports:**
- `OperationsConsole()` - Manages active tab state and renders specific admin views (Forms, Customers, Support).
**Dependencies:** `AdminSidebar`, `FormFactoryView`, `CustomersView`.

### `admin/ui/AdminSidebar.tsx`
**Role:** Sidebar navigation component for the Admin Console.
**Key Exports:**
- `AdminSidebar(props)` - Renders navigation buttons for admin tabs.
**Dependencies:** `lucide-react`.

### `admin/ui/FormFactoryView.tsx`
**Role:** View component for managing master form templates.
**Key Exports:**
- `FormFactoryView({ forms, isLoading })` - Displays a grid of `FormCard`s and provides search functionality.
**Dependencies:** `FormCard`, `fuse.js`.

### `admin/ui/OpsNavbar.tsx`
**Role:** Top navigation bar for the Admin Console.
**Key Exports:**
- `OpsNavbar()` - Renders admin branding and the `UserMenu`.
**Dependencies:** `UserMenu`.

### `admin/views/CommunicationsView.tsx`
**Role:** UI for sending system-wide or direct messages to tenants.
**Key Exports:**
- `CommunicationsView()` - Renders message composition and recipient selection.
**Dependencies:** `Button`.

### `admin/views/CustomersView.tsx`
**Role:** UI for viewing tenant/customer data.
**Key Exports:**
- `CustomersView()` - Renders a table of customer firms (currently using mock data).
**Dependencies:** None.

### `admin/views/FormFactoryView.tsx`
**Role:** *(Duplicate of ui/FormFactoryView.tsx)* - Renders the template management grid.
**Key Exports:**
- `FormFactoryView(props)` - See `ui/FormFactoryView.tsx`.
**Dependencies:** `FormCard`.

### `admin/views/SupportView.tsx`
**Role:** UI for viewing support tickets.
**Key Exports:**
- `SupportView()` - Renders a list of active support tickets.
**Dependencies:** `GlassCard`.

---

### `api/ai/assess-claim/route.ts`
**Role:** AI endpoint to evaluate the legal merit of a submission.
**Key Exports:**
- `POST(req)` - Calls `LlmClaimAssessorAsync` with submission data.
**Dependencies:** `LlmClaimAssessorAsync`, `GetCurrentUserAsync`.

### `api/ai/critique/route.ts`
**Role:** AI endpoint to critique conversational transcripts.
**Key Exports:**
- `POST(req)` - Calls `LlmPromptCriticAsync` to grade agent performance.
**Dependencies:** `LlmPromptCriticAsync`.

### `api/ai/generate-intro/route.ts`
**Role:** Generates a conversational opening line for an intake form.
**Key Exports:**
- `POST(req)` - Uses `openaiClient` to generate a 1-sentence intro.
**Dependencies:** `openaiClient`.

### `api/ai/generate-options/route.ts`
**Role:** Generates dropdown options for a specific field label.
**Key Exports:**
- `POST(req)` - Uses `openaiClient` to return a JSON list of options.
**Dependencies:** `openaiClient`.

### `api/ai/generate-rules/route.ts`
**Role:** Generates conditional logic rules from natural language prompts.
**Key Exports:**
- `POST(req)` - Calls `LlmGenerateLogicFromPromptAsync`.
**Dependencies:** `LlmGenerateLogicFromPromptAsync`.

### `api/ai/generate-suggestions/route.ts`
**Role:** Generates user-facing reply suggestions ("Magic Input").
**Key Exports:**
- `POST(req)` - Calls `LlmGenerateSuggestionsAsync`.
**Dependencies:** `LlmGenerateSuggestionsAsync`.

### `api/ai/refine-field/route.ts`
**Role:** Utility endpoint to polish or translate field labels.
**Key Exports:**
- `POST(req)` - Uses `openaiClient` to rewrite text based on the requested operation.
**Dependencies:** `openaiClient`.

### `api/auth/signout/route.ts`
**Role:** Handles user logout.
**Key Exports:**
- `POST()` - Deletes the session cookie.
**Dependencies:** `cookies`.

### `api/crm/submissions/route.ts`
**Role:** Fetches a list of submissions for the authenticated organization.
**Key Exports:**
- `GET(req)` - Calls `FormSubmissionRepo.findMany`.
**Dependencies:** `FormSubmissionRepo`, `GetCurrentUserAsync`.

### `api/crm/submissions/[id]/route.ts`
**Role:** Fetches a single submission by ID.
**Key Exports:**
- `GET(req, context)` - Calls `formSubmissionRepo.getWithSchema`.
**Dependencies:** `formSubmissionRepo`.

### `api/dev/seed/route.ts`
**Role:** Seeds the database with development data (Organizations, Clients, Forms).
**Key Exports:**
- `POST()` - Executes seeding logic (Blocked in production).
**Dependencies:** `db`.

### `api/dev/seed-form/route.ts`
**Role:** Resets a specific test form ("Auto Dealer Dispute").
**Key Exports:**
- `GET()` - Upserts a specific schema for testing.
**Dependencies:** `db`.

### `api/forms/route.ts`
**Role:** CRUD for Form Schemas.
**Key Exports:**
- `GET(req)` - Lists forms via `formSchemaRepo`.
- `POST(req)` - Creates a new form version via `formSchemaRepo`.
**Dependencies:** `formSchemaRepo`.

### `api/forms/[id]/route.ts`
**Role:** Operations on a specific Form Schema.
**Key Exports:**
- `GET(req, context)` - Retrieves form by ID.
- `PUT(req, context)` - Updates (creates new version) of a form.
**Dependencies:** `formSchemaRepo`.

### `api/forms/[id]/versions/route.ts`
**Role:** Retrieves version history for a form.
**Key Exports:**
- `GET(req, context)` - Lists all versions sharing the same form name.
**Dependencies:** `formSchemaRepo`.

### `api/intake/agent/route.ts`
**Role:** Main conversational loop endpoint for the intake agent.
**Key Exports:**
- `POST(req)` - Calls `LlmIntakeAgentAsync` to process user input and extract data.
**Dependencies:** `LlmIntakeAgentAsync`.

### `api/intake/forms/from-prompt/route.ts`
**Role:** Generates or edits a form schema based on a text prompt.
**Key Exports:**
- `POST(req)` - Delegates logic to `createFormFromPromptRoute`.
**Dependencies:** `createFormFromPromptRoute`.

### `api/intake/review/route.ts`
**Role:** Generates a review summary of collected data.
**Key Exports:**
- `POST(req)` - Calls `buildDeterministicReviewReply`.
**Dependencies:** `buildDeterministicReviewReply`.

### `api/intake/snapshot/route.ts`
**Role:** Builds a snapshot of the current form state (filled vs unfilled fields).
**Key Exports:**
- `POST(req)` - Calls `buildSimpleIntakeSnapshot`.
**Dependencies:** `buildSimpleIntakeSnapshot`.

### `api/intake/turn/route.ts`
**Role:** Handles a single turn of the "Intake Engine" (Extract -> Merge -> Next).
**Key Exports:**
- `POST(req)` - Calls `callExtractionModel` and `mergeExtractionIntoFormData`.
**Dependencies:** `callExtractionModel`, `mergeExtractionIntoFormData`.

### `api/public/v1/agent/route.ts`
**Role:** Public API for external agents (Stub/Beta).
**Key Exports:**
- `POST(req)` - Simple chitchat responder (Placeholder).
**Dependencies:** None.

### `api/public/v1/forms/route.ts`
**Role:** Public API to fetch a form schema by slug.
**Key Exports:**
- `GET(req)` - Validates API key and returns schema JSON.
**Dependencies:** `formSchemaRepo`.

### `api/public/v1/forms/[id]/route.ts`
**Role:** Public API to fetch a specific form schema by UUID (rather than slug).
**Key Exports:**
- `GET(req)` - Validates API key and returns specific schema JSON.
**Dependencies:** `formSchemaRepo`.

### `api/public/v1/submit/route.ts`
**Role:** Public API for submitting form data (Server-to-Server).
**Key Exports:**
- `POST(req)` - Saves submission and triggers attribution logic.
**Dependencies:** `formSubmissionRepo`, `evaluateSubmissionFlags`.

### `api/submit/[formId]/route.ts`
**Role:** Endpoint for the public web runner to submit data.
**Key Exports:**
- `POST(req, context)` - Checks rate limits and honeypots, then saves submission.
**Dependencies:** `RateLimiter`, `formSubmissionRepo`.

### `api/submit/[formId]/assess/route.ts`
**Role:** Endpoint to trigger AI assessment for a specific submission session.
**Key Exports:**
- `POST(req, context)` - Triggers assessment logic for the submission context.
**Dependencies:** `LlmClaimAssessorAsync` (Inferred).

---

### `crm/page.tsx`
**Role:** Main CRM Dashboard page.
**Key Exports:**
- `CrmPage()` - Renders `CrmDashboard`.
**Dependencies:** `CrmDashboard`.

### `crm/inbox/page.tsx`
**Role:** Submission Inbox page.
**Key Exports:**
- `Page()` - Renders `InboxPage`.
**Dependencies:** `SubmissionInbox`.

---

### `forms/page.tsx`
**Role:** Redirects legacy access to the Admin console.
**Key Exports:**
- `FormsIndexPage()` - Redirects to `/admin`.
**Dependencies:** `redirect`.

### `forms/new-from-prompt/page.tsx`
**Role:** The "AI Form Architect" page.
**Key Exports:**
- `Page()` - Renders `FormFromPromptPage` wrapped in Suspense.
**Dependencies:** `FormFromPromptPage`.

### `forms/[id]/editor/page.tsx`
**Role:** Form Editor page.
**Key Exports:**
- `EditorPage({ params })` - Renders `FormFromPromptPage` initialized with an existing form ID.
**Dependencies:** `FormFromPromptPage`.

---

### `s/[formId]/page.tsx`
**Role:** Public-facing form runner page.
**Key Exports:**
- `PublicFormPage({ params })` - A dedicated wrapper that renders the `UnifiedRunner` component.
**Dependencies:** `UnifiedRunner`.