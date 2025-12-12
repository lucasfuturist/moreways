# High-Resolution Interface Map

## Tree: `apps/console/src/crm`

```
crm/
├── repo/
│   ├── crm.repo.ClientRepo.ts
│   ├── crm.repo.FormSubmissionRepo.ts
│   ├── crm.repo.MatterRepo.ts
├── schema/
│   ├── crm.schema.ClientModel.ts
│   ├── crm.schema.FormSubmissionModel.ts
│   ├── crm.schema.MatterModel.ts
├── ui/
│   ├── ClaimAnalysisCard.tsx
│   ├── CrmDashboard.tsx
│   ├── MemoExportButton.tsx
│   ├── SubmissionInbox.tsx
├── util/
│   ├── crm.util.memoFormatter.ts
```

## File Summaries

### `repo/crm.repo.ClientRepo.ts`
**Role:** Manages database operations for Client entities, mapping between domain models (First/Last name) and database models (Full Name).
**Key Exports:**
- `ClientRepo` - Object containing CRUD methods.
- `create(data): Promise<Client>` - Persists a new client, optionally linking to a portal user ID.
- `findByEmail(organizationId, email): Promise<Client | null>` - Retrieves a client by email and parses their full name back into first/last components.
**Dependencies:** `db` (Prisma), `Client` (Schema).

### `repo/crm.repo.FormSubmissionRepo.ts`
**Role:** Manages Form Submissions with built-in security features including Field-Level Encryption (FLE) for PII and audit logging for access events.
**Key Exports:**
- `FormSubmissionRepo` - Object containing retrieval and persistence logic.
- `create(input): Promise<Result>` - Encrypts sensitive fields based on schema metadata, auto-links or creates a Client, and saves the submission.
- `findMany(organizationId, formId?): Promise<Result[]>` - Fetches submissions and decrypts PII on-the-fly for authorized lists.
- `findById(organizationId, submissionId, actorId): Promise<Result | null>` - Fetches a specific submission, decrypts data, and logs a `PII_ACCESS` audit event.
**Dependencies:** `db`, `EncryptionService`, `AuditService`, `FormSchemaJsonShape`.

### `repo/crm.repo.MatterRepo.ts`
**Role:** Manages "Matters" (Legal Cases) linked to Clients.
**Key Exports:**
- `MatterRepo` - Object containing CRUD methods for matters.
- `findMany(organizationId, clientId?): Promise<Matter[]>` - Lists matters, optionally filtering by a specific client.
- `create(data): Promise<Matter>` - Converts a lead/submission into a formal legal matter.
- `updateStatus(organizationId, matterId, status): Promise<Matter>` - Updates the workflow status of a case.
**Dependencies:** `db`, `MatterStatus`.

### `schema/crm.schema.ClientModel.ts`
**Role:** Defines the Zod schema and TypeScript type for a Client (Lead/Customer).
**Key Exports:**
- `ClientSchema` - Zod definition validation rules (email, names, organization linkage).
- `Client` - TypeScript interface inferred from the schema.
**Dependencies:** `zod`.

### `schema/crm.schema.FormSubmissionModel.ts`
**Role:** Defines the Zod schema for the immutable record of a user's intake form answers.
**Key Exports:**
- `FormSubmissionSchema` - Zod definition including `answers` (JSON), logic flags, and context IDs.
- `FormSubmission` - TypeScript interface inferred from the schema.
**Dependencies:** `zod`.

### `schema/crm.schema.MatterModel.ts`
**Role:** Defines the Zod schema for a Legal Matter (Case) and its workflow statuses.
**Key Exports:**
- `MatterStatusSchema` - Enum definition for case lifecycle (e.g., `intake_pending`, `accepted`).
- `MatterSchema` - Zod definition for the matter entity.
- `Matter` - TypeScript interface.
**Dependencies:** `zod`.

### `ui/ClaimAnalysisCard.tsx`
**Role:** A visualization component that displays AI-generated merit scores, executive summaries, and prima facie element analysis.
**Key Exports:**
- `ClaimAnalysisCard({ assessment, isLoading, onRunAssessment })` - Renders the score gauge, logic grid, and credibility warnings.
**Dependencies:** `GlassCard`, `lucide-react`.

### `ui/CrmDashboard.tsx`
**Role:** The main landing page for the CRM module, displaying high-level metrics and recent activity feeds.
**Key Exports:**
- `CrmDashboard()` - Renders metric cards (e.g., Active Clients) and a feed of recent system events.
**Dependencies:** `GlassCard`, `useRouter`, `lucide-react`.

### `ui/MemoExportButton.tsx`
**Role:** A utility button that formats raw submission data into a professional legal memo and copies it to the clipboard.
**Key Exports:**
- `MemoExportButton(props)` - Invokes `formatSubmissionAsMemo` and handles the clipboard write operation.
**Dependencies:** `formatSubmissionAsMemo`, `Button`, `Clipboard API`.

### `ui/SubmissionInbox.tsx`
**Role:** The primary workspace for reviewing intake submissions, chatting with clients (mock), and triggering AI analysis.
**Key Exports:**
- `InboxPage()` - Manages state for the list view, detail view, chat history, and AI assessment triggering.
**Dependencies:** `MemoExportButton`, `ClaimAnalysisCard`, `fetch`, `useState`.

### `util/crm.util.memoFormatter.ts`
**Role:** Pure utility that transforms structured JSON form data into a Markdown-formatted legal memo.
**Key Exports:**
- `formatSubmissionAsMemo(schema, data, meta): string` - Iterates through schema fields to produce a human-readable text report.
**Dependencies:** `FormSchemaJsonShape`.