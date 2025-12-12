# Moreways Technical Bible: Section 1
## The Brain: Ingestion Architecture

**Repository:** `law-parsing-engine`
**Core Responsibility:** Transforming unstructured regulatory PDFs into a hierarchical, temporal, and semantic Knowledge Graph.

---

### 1.1 The Input Layer: Optical Character Recognition (OCR)

The system processes documents as **geometry first, text second**. We rely on spatial coordinates to reconstruct the hierarchy of legal statutes (indentation implies depth).

#### 1.1.1 The Azure Integration (`infra.azure.docIntel.ts`)
We utilize **Azure Document Intelligence** (formerly Form Recognizer) using the `prebuilt-layout` model.
*   **Why Layout?** Standard "Read" models flatten text streams. "Layout" preserves bounding boxes (`bbox`) for every line, which is critical for distinguishing between a "Section Header" and a "Paragraph Body" based on indentation.
*   **Extraction Logic:**
    *   Input: Raw `Buffer`.
    *   Output: `RawPdfLine[]` containing text, page number, and `bbox: [x, y, w, h]`.
    *   **Normalization:** Azure returns coordinates in inches for PDFs.
*   **Strict Sorting:** The raw API response is often unordered. We enforce a deterministic reading order before parsing:
    ```typescript
    // Logic: Sort by Page -> Y Position -> X Position
    return output.sort((a, b) => {
        if (a.pageNumber !== b.pageNumber) return a.pageNumber - b.pageNumber;
        // 0.1 tolerance handles slight skew/rotation in scanned docs
        if (Math.abs(a.bbox[1] - b.bbox[1]) > 0.1) return a.bbox[1] - b.bbox[1];
        return a.bbox[0] - b.bbox[0];
    });
    ```

#### 1.1.2 Local Development & Fuzzing (`infra.local.pdf.ts`)
For local testing and CI/CD pipelines (where Azure credentials might be absent or costly), we use `pdf2json`.
*   **The Silencer:** The codebase monkey-patches `console.log` and `console.warn` to suppress known verbose logging from `pdf2json` during execution.
*   **Smart Merge:** Local PDF extraction often splits words based on kerning (e.g., `S ec t i on`). The local client implements a `mergeFragments` algorithm: if the horizontal gap between two tokens is `< 0.4`, they are joined into a single string.

### 1.2 The Parser: A Stateful Stack Machine

The parsing logic (`ingest.svc.parsePdf.ts`) is not a regex scraper. It is a **Stateful Stack Machine**. It maintains a cursor (`stack`) representing the current ancestry chain (e.g., `[ROOT, PART, SECTION, PARAGRAPH]`).

#### 1.2.1 The Sanitization Pass (`ingest.util.sanitizer.ts`)
Before entering the stack machine, every line passes through a sanitizer:
1.  **Header/Footer Removal:** Lines are rejected based on Y-coordinates.
    *   Top Margin: `y < 0.5`
    *   Bottom Margin: `y > 10.5` (Standard Letter Paper)
    *   *Regex Filters:* Removes "Page X of Y", "Mass. Register #...", and eCFR watermarks.
2.  **Wide Text Repair:** Legal headers are often stylized as `T I T L E`.
    *   The sanitizer uses an iterative regex loop to collapse `Char Space Char` patterns until the string stabilizes.
    *   *Special Handling:* Handles punctuation boundaries to correctly parse strings like `9 4 0 C M R : O F F I C E` -> `940CMR:OFFICE`.

#### 1.2.2 Hierarchy Detection (Regex Profiles)
The parser loads a **Jurisdiction Profile** (`ingest.util.regexProfiles.ts`) to determine node depth.

**Profile A: Massachusetts (MA)**
*   **Depth 1 (SECTION):** `^\s*(\d{1,3}\.\d{2,})` (e.g., "3.01")
*   **Depth 2 (DEFINITION):** `^\s*([A-Z][\w\s]+):` (e.g., "Contractor:") — *Atomizes definitions into their own nodes.*
*   **Depth 2 (SUBSECTION):** `^\s*\(\d{1,2}\)` (e.g., "(1)")
*   **Depth 3 (PARAGRAPH):** `^\s*\([a-z]\)` (e.g., "(a)")

**Profile B: Federal (FED)**
*   **Depth 1 (SECTION):** `^\s*(?:§|Sec\.|Section|Part)?\s*(\d+[\.-]\d+)` (e.g., "§ 310.4")
*   **Depth 2 (PARAGRAPH):** `^\s*\([a-z]\)` (e.g., "(a)") — *Federal code often skips the numeric subsection level.*
*   **Depth 3 (SUBPARAGRAPH):** `^\s*\(\d{1,2}\)` (e.g., "(1)")

#### 1.2.3 The Stack Logic
For every line:
1.  **Level Detection:** The line is matched against the active Regex Profile.
2.  **Stack Operation:**
    *   **Close Block:** If `NewDepth <= CurrentStackTip.Depth`, pop the stack until a parent (lower depth) is found.
    *   **Open Block:** If `NewDepth > CurrentStackTip.Depth`, create a new node and push to stack.
    *   **Append:** If no level is detected, append text to the current node's content buffer.
3.  **Orphan Guard (The "Phantom Section"):**
    *   *Problem:* A document starts with `(a)` (Depth 3) but no Section Header (Depth 1).
    *   *Fix:* If `parent.type === 'ROOT'` and `detected.depth > 1`, the parser automatically injects a synthetic `Phantom Section` node to maintain topological integrity.

#### 1.2.4 The Ghost Buster (`pruneGhostNodes`)
Legal PDFs often include a Table of Contents (TOC) that mirrors the structure of the actual law.
*   **Detection:** The parser groups sibling nodes by their citation number (e.g., multiple children claiming to be "3.01").
*   **Resolution:** It calculates a score based on `(ChildCount * 1000) + ContentLength`. The "Winner" (the actual law) is kept; the "Loser" (the TOC entry) is recursively deleted from the graph.

### 1.3 The Database: Topological Storage

The data layer is built on **Supabase (PostgreSQL)** using `ltree` for hierarchy and `pgvector` for AI.

#### 1.3.1 Table Definition: `legal_nodes`
Matches the deployed schema as of v1.6.

```sql
CREATE TABLE legal_nodes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identity
    urn text NOT NULL, -- "urn:lex:ma:940cmr:3_01"
    jurisdiction text, -- "MA" | "FED"
    
    -- Hierarchy (Ltree)
    citation_path ltree NOT NULL, -- "root.310_4.a.1"
    parentId uuid, -- Adjacency List for fast direct lookups
    
    -- Content
    structure_type text NOT NULL, -- "SECTION", "PARAGRAPH", "DEFINITION"
    content_text text NOT NULL,
    
    -- Semantics & AI
    embedding vector(1536), -- OpenAI text-embedding-3-small
    logic_summary jsonb, -- Extracted rules (Actor/Action/Exception)
    fts tsvector, -- Full Text Search (English Dictionary)
    
    -- Provenance (SCD Type 2)
    validity_range daterange NOT NULL DEFAULT '[2000-01-01,)',
    created_at timestamptz DEFAULT now()
);

-- Performance Indexes
CREATE INDEX idx_nodes_urn ON legal_nodes(urn);
CREATE INDEX idx_nodes_path ON legal_nodes USING gist (citation_path);
CREATE INDEX idx_nodes_vector ON legal_nodes USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_nodes_fts ON legal_nodes USING gin (fts);
```

#### 1.3.2 Time Travel (SCD Type 2)
We enforce temporal uniqueness using an Exclusion Constraint.
*   **Constraint:** `exclude using gist (urn with =, validity_range with &&)`
*   **Effect:** Prevents two rows with the same URN from having overlapping `validity_range`. This allows us to store historical versions of a law while ensuring only one version is "active" at any given moment.

### 1.4 The Commit Strategy (`graph.repo.nodeRepo.ts`)

The ingestion worker performs a **Differential Commit** to ensure idempotency.

1.  **URN Generation:** URNs are constructed hierarchically: `ParentURN` + `:` + `SanitizedSegment`.
    *   *Sanitization:* Spaces become underscores, special characters removed.
    *   *Collision Handling:* If two siblings generate the same URN (e.g., two paragraphs labeled "(a)"), a 4-char hash is appended to the second one.
2.  **State Comparison:**
    *   The repo queries the DB for all URNs in the new batch.
    *   **Match:** If URN exists and `content_text` is identical -> **Skip** (No-Op).
    *   **Update:** If URN exists but content differs -> **Expire** old row (set `upper(validity_range)` to `now()`) and **Insert** new row.
    *   **New:** If URN does not exist -> **Insert**.

This architecture ensures that re-running the ingestion pipeline on 1,000 unchanged files results in zero database writes.

# Moreways Technical Bible: Section 2
## The Brain: Retrieval & Judgment Architecture

**Repository:** `law-parsing-engine`
**Core Responsibility:** The semantic search engine and the AI Magistrate.

---

### 2.1 The Hybrid Search Engine

Your SQL diagnostics (Query 2 & 3) confirmed the existence of `match_legal_nodes_hybrid` and the `idx_nodes_fts` (GIN) index. This proves the system does **not** rely on vector search alone. It uses a weighted algorithm to balance "Concept" vs. "Keyword".

#### 2.1.1 The Database Function
The search logic is compiled directly into PostgreSQL to minimize latency.

*   **Function Name:** `match_legal_nodes_hybrid`
*   **Signature:** `(query_embedding vector, query_text text, match_threshold float, match_count int)`
*   **The Ranking Formula:**
    ```sql
    -- From migration_add_fts.sql
    (
      (1 - (legal_nodes.embedding <=> query_embedding)) * 0.7 +  -- 70% Vector
      (ts_rank(legal_nodes.fts, plainto_tsquery('english', query_text))) * 0.3 -- 30% Keyword
    )
    ```
*   **Why this matters:** If a user searches for "Section 310.4", pure vector search might return "Section 310.5" because they are semantically identical. The `fts` rank forces the exact keyword match to the top.

#### 2.1.2 Query Normalization (`retrieve.svc.queryNormalizer.ts`)
Before hitting the DB, we "repair" the user's query.
*   **Input:** "stop calling me at work"
*   **Transformation:** We use `gpt-4o-mini` to expand this into legal terms found in your corpus.
*   **Output:** "debt collector communication employer workplace prohibition cease and desist"
*   *Note:* This expanded string is what feeds the `query_text` argument in the SQL function.

### 2.2 Context Assembly (The "Ladder" Logic)

Finding a node is not enough. A single paragraph `(a)` is meaningless without its Section and Part headers.

#### 2.2.1 The Assembly Algorithm (`retrieve.svc.contextAssembler.ts`)
When a Search Result is selected (e.g., `urn:lex:fed:16_cfr...:310_4:a`), we execute a multi-stage fetch:

1.  **Target Fetch:** `SELECT * FROM legal_nodes WHERE urn = $1`
2.  **Ancestry Climb:**
    *   Your data uses `ltree` paths like `root.310_4.a`.
    *   We query: `SELECT * FROM legal_nodes WHERE citation_path @> 'root.310_4.a'`.
    *   This returns the Root -> Part 310 -> Section 310.4 -> Paragraph (a).
3.  **Scoped Definitions (The Secret Weapon):**
    *   Words like "Seller" or "Consumer" have specific definitions *within* a specific regulation.
    *   We find all nodes where `structure_type = 'DEFINITION'` AND `parentId` matches any ID in the Ancestry chain.
    *   *Result:* The AI Judge gets the *exact* definition of "Seller" applicable to 16 CFR 310, ignoring definitions from other laws.

### 2.3 The Magistrate (AI Judge)

Located in `validate.svc.judge.ts`. This is the logic that decides if a claim is valid.

#### 2.3.1 Anchor Resolution
*   **Hardcoded Paths:** For high-volume intents (like "Robocalls"), we skip search and lock to `urn:lex:fed:16_cfr...:310_4` (The Telemarketing Sales Rule).
*   **Dynamic Fallback:** For edge cases, we use Hybrid Search to find the most relevant regulation on the fly.

#### 2.3.2 The Verdict Protocol
We send the assembled Law Context + User Facts to GPT-4o with a strict JSON schema (`VerdictSchema`):

```typescript
{
  "status": "LIKELY_VIOLATION", // Enum: LIKELY, POSSIBLE, UNLIKELY, INELIGIBLE
  "confidence_score": 0.95,
  "analysis": {
    "summary": "The user registered on DNC List on Jan 1. Received call on Feb 15 (45 days later). Violation of 31-day grace period.",
    "missing_elements": [], // e.g. "Did you give prior consent?"
    "strength_factors": ["DNC Registered", "No prior relationship"]
  }
}
```

### 2.4 The API Contract (`api/v1/search`)

The Gateway calls this endpoint. It returns a `ScopedContext`.

*   **Response Format:**
    *   `answer`: A synthesized natural language answer ("Yes, that is illegal under...").
    *   `context`: The raw nodes used to generate that answer (for citations).
    *   `debug`: Detailed breakdown of Vector vs. Keyword scores (visible in your QA logs).

---

# Moreways Technical Bible: Section 3
## The Factory: Schema, State, and Logic

**Repository:** `argueOS-v1-form`
**Core Responsibility:** The operational engine for law firms. It defines the "shape" of legal intakes, manages the state of those intakes during the build process, and provides the "Reactive Canvas" for editing them.

---

### 3.1 The Grand Unified Schema (v1.6)

The entire Moreways platform—UI rendering, AI logic, and Database storage—is driven by a single JSON schema definition. This file (`forms.schema.FormSchemaJsonShape.ts`) is the contract between the Lawyer (Admin) and the System. It is stored in the `form_schemas` table in Postgres.

#### 3.1.1 The Field Definition
Every field in an intake is an object stored within the `properties` map of the schema.

```typescript
export interface FormFieldDefinition {
  id: string;           // Internal UUID for stable React rendering keys
  key: string;          // The Database Column Name (e.g., "incidentDate")
  title: string;        // Human Label (e.g., "When did this happen?")
  kind: FormFieldKind;  // The UI Widget Type (Discriminator)
  
  // UI Presentation
  description?: string;
  placeholder?: string;
  
  // Validation Constraints
  isRequired?: boolean;
  min?: number;         // For 'number' or 'slider' types
  max?: number;
  pattern?: string;     // Regex for custom validation (e.g., VIN number)

  // Selection Data
  options?: FieldOption[]; // Array of { id, label, value }

  // Advanced V2 Logic (Conditional Behavior)
  logic?: FieldLogicRule[];
  
  // Operational Flags
  metadata?: {
    isPII?: boolean;          // Triggers Field-Level Encryption in the Repo
    complianceNote?: string;  // Internal note for auditors
    isLocked?: boolean;       // Prevents edits in the Drag-and-Drop Builder
  };
}
```

#### 3.1.2 The Logic Engine (V2)
Logic in Moreways is not "code"; it is serializable data. This allows the Schema to be portable (JSON) and safe to execute in any environment (Client-side React or Server-side Node.js).

*   **Rule Structure:**
    ```typescript
    interface FieldLogicRule {
      // What happens when the condition is met?
      action: "show" | "hide" | "require" | "flag";
      
      // Used only if action is 'flag' (Risk Guardrails)
      flagCode?: "STATUTE_RISK" | "HIGH_VALUE"; 
      flagMessage?: string; 
      
      // The Condition
      when: {
        // Boolean Grouping
        allOf?: LogicCondition[];
        anyOf?: LogicCondition[];
        
        // Atomic Condition
        fieldKey?: string;
        operator?: "equals" | "not_equals" | "contains" | "greater_than" | "older_than_years";
        value?: any;
      };
    }
    ```
*   **Evaluation Logic (`forms.logic.evaluateSubmissionFlags.ts`):** This is a deterministic, pure function. It takes `(Schema, FormData)` and returns `SubmissionFlag[]`.
    1.  **Client-Side Execution:** Runs in the `UnifiedRunner` to show/hide fields dynamically as the user types.
    2.  **Server-Side Execution:** Runs in the `submit` API route to calculate Risk Flags for the CRM (e.g., flagging a case as "Statute Risk" if the incident date is > 3 years ago).

### 3.2 The Reactive Canvas (Form Editor)

The Form Editor (`FormEditor.tsx`) is a sophisticated React application that manipulates the JSON Schema in real-time. It does not use external state libraries like Redux; it uses an internal immutable history stack.

#### 3.2.1 State Management (`useHistory.ts`)
We developed a custom hook to treat the Schema State as an immutable timeline, enabling robust Undo/Redo functionality without API calls.

*   **State Structure:** `{ past: T[], present: T, future: T[] }`.
*   **Actions:** `undo()`, `redo()`, `set(newState)`.
*   **Shortcuts:** The hook binds to `window` keyboard events to capture `Cmd+Z` / `Cmd+Shift+Z`. It includes a heuristic check to ignore these shortcuts if the user is focused on an `<input>` or `<textarea>`, preserving native browser text-undo behavior.

#### 3.2.2 The AI Architect (`AssistantPanel.tsx`)
This sidebar allows Admins to edit the form via natural language commands.

*   **Input:** "Add a contact block and make email required."
*   **The Pipeline (`IntakePromptToFormPipeline.ts`):**
    1.  **Context Assembly:** Packages the *current* Schema JSON + the User Prompt.
    2.  **LLM Call:** Sends payload to `gpt-4o`. The System Prompt instructs the model to act as a "Senior React Architect" and return a **JSON Patch**.
    3.  **Normalization:** The returned JSON runs through `formSchemaNormalizer.ts`. This utility sanitizes inputs, ensures every field has a stable UUID, and coerces types (fixing common LLM hallucinations like `type: "string"` instead of `kind: "text"`).
    4.  **Merge:** The normalized patch replaces the `present` state of the canvas.

#### 3.2.3 Micro-Edits (Scoped Prompting)
To prevent the LLM from rewriting the entire form when a user only wants to change one field, we use a **Scoped Prompt** strategy.

1.  **Trigger:** Admin clicks "Ask AI" on a specific field card.
2.  **Request:** The API request includes a `scopedFieldKey`.
3.  **Prompt Injection:** The backend detects the scope and prepends a strict system instruction: `[FOCUS: Modifying ONLY the field with key '${scopedFieldKey}'. Do not alter other fields.]`.
4.  **Result:** High-precision updates with zero collateral damage to the rest of the schema.

### 3.3 Persistence & Auto-Save

The Factory ensures no work is lost during the editing process.

*   **Debounce Strategy:** The editor monitors the `fields` array. Changes trigger a `useDebounce` hook (1000ms delay).
*   **Ref Check:** Before saving, the system compares the current JSON string against a `lastSavedState` ref. If they match, the API call is skipped (idempotency).
*   **Versioning:** Every save creates a new version in the `form_schemas` table. The `version` column is auto-incremented by the repository logic (`forms.repo.FormSchemaRepo.ts`), preserving a full audit trail of the form's evolution.

# Moreways Technical Bible: Section 4
## The Factory: Deep Listening Engine

**Repository:** `argueOS-v1-form`
**Core Responsibility:** The "Harvesting" algorithm that allows the AI to fill forms non-linearly during conversation, extracting multiple facts from a single user message.

---

### 4.1 The Core Concept

Traditional chatbots operate on a "Ping Pong" model: Bot asks "What is your name?", User says "John", Bot records "John". Bot asks "Age?", User says "30".

**Deep Listening** operates on a "Harvesting" model:
*   **Bot:** "What is your name?"
*   **User:** "I'm John, I'm 30 years old, and I fell at Walmart."
*   **Engine:** Extracts `Name="John"`, `Age=30`, `Location="Walmart"`, `IncidentType="Slip & Fall"`.

This reduces friction by allowing users to speak naturally without being constrained by the form's linear order.

### 4.2 The Agent Service (`LlmIntakeAgentAsync`)

This service (`llm.svc.LlmIntakeAgentAsync.ts`) is the brain of the conversational intake.

#### 4.2.1 Dynamic Prompt Construction
The System Prompt is rebuilt for every single turn of the conversation to ensure the LLM has full context.

*   **Inputs:**
    *   `Target Field`: The specific question the UI is currently trying to answer.
    *   `Schema Summary`: A condensed list of *all* fields in the form (`Key: Title (Type)`).
    *   `Current Data`: A summary of what has already been collected (to detect contradictions).
    *   `User Message`: The latest input string.

*   **The "Side-Loading" Instruction:**
    The prompt explicitly instructs the model:
    > "Your job is to harvest data. The user might answer the current question, but they might also provide information for OTHER fields. Aggressively scan the USER INPUT for data matching ANY OTHER field in the Schema Summary. If found, include it in the 'updates' object."

*   **The "Contradiction" Guardrail:**
    > "If the user provides new info that conflicts with DATA ALREADY COLLECTED, do NOT overwrite silently. Return type 'question' and ask for clarification."

### 4.3 The Extraction Protocol

The LLM does not return free text. It returns a strict JSON object conforming to the `ExtractionResult` interface.

```typescript
interface ExtractionResult {
  // The action the UI should take
  type: "answer" | "question" | "chitchat";
  
  // The value for the CURRENT TARGET field (if found)
  extractedValue?: any; 
  
  // The Harvest: A dictionary of OTHER fields found in the text
  updates?: Record<string, any>; 
  
  // What the bot says back to the user
  replyMessage: string;
  
  // Boolean flag: Did the user explicitly correct previous info?
  isCorrection?: boolean;
}
```

### 4.4 State Merging Logic (`forms.logic.mergeExtraction.ts`)

This module is the "Gatekeeper" that safely applies the LLM's harvest to the application state. It prevents hallucinations and accidental data loss.

1.  **Input:** `CurrentFormData` + `ExtractionResult` + `FormSchema`.
2.  **Validity Filter:** The merger iterates through the `updates` object.
    *   It checks if the `key` actually exists in the `FormSchema`. If not, the update is dropped (preventing "Schema Pollution" or hallucinations).
3.  **Type Coercion:** It attempts to cast values to the correct type defined in the schema (e.g., converting string "true" to boolean `true` for a checkbox).
4.  **Overwrite Logic (Safety Lock):**
    *   **Scenario A (Empty Field):** If `CurrentFormData[key]` is empty, the update is applied immediately.
    *   **Scenario B (Correction):** If `CurrentFormData[key]` has a value AND `ExtractionResult.isCorrection` is `true`, the update is applied (User changed their mind).
    *   **Scenario C (Conflict):** If `CurrentFormData[key]` has a value AND `isCorrection` is `false` (or undefined), the update is **IGNORED**.
        *   *Why?* This prevents a user's casual remark later in the conversation (e.g., "My brother is 20") from accidentally overwriting their own previously extracted age.

### 4.5 The Smart Iterator (`forms.logic.schemaIterator.ts`)

Once the data is merged, the system must decide *what to ask next*. A standard loop (`i++`) would be annoying because it would ask for fields that were already "Harvested" via side-loading.

*   **The `getNextFieldKey` Algorithm:**
    1.  It accepts the `schema`, the `currentData`, and the `lastFieldKey`.
    2.  It iterates through the `schema.order` array starting from the position of `lastFieldKey`.
    3.  For each field, it runs two checks:
        *   **Logic Check:** Is this field visible? (Runs `evaluateShowHide`). If hidden, skip.
        *   **Data Check:** Is this field **already filled**? (Runs `isFieldFilled`).
            *   If `currentData[key]` has a valid value, the iterator **SKIPS** this field entirely.
    4.  It returns the key of the first field that is both *Visible* and *Unfilled*.

**Result:** The user experiences a "Magic" flow where answering "I'm John, 30, from Boston" causes the bot to skip the "Name", "Age", and "City" questions and jump straight to "What happened?".

# Moreways Technical Bible: Section 5
## The Gateway: Client Architecture

**Repository:** `moreways-site`
**Core Responsibility:** The public-facing entry point. It handles high-performance marketing, client authentication, and the secure, interactive "Intake Runner" that users engage with.

---

### 5.1 The Unified Runner (`UnifiedRunner.tsx`)

This component is the centerpiece of the client experience. It is a **Polymorphic UI Container** designed to support multiple modes of interaction while maintaining a single source of truth for data.

#### 5.1.1 Hybrid State Architecture
The Runner maintains the `formData` state in React and persists it to `localStorage` (`intake_draft_{id}`). This ensures progress is saved even if the user refreshes the page or loses connection.

*   **Chat Mode (`ChatRunner.tsx`):**
    *   The default view for most users.
    *   Renders a stream of `IntakeChatMessage` components.
    *   Calls the `/api/intake/agent` proxy to drive the conversation via the Deep Listening Engine.
    *   *Validation Hook:* When the `schemaIterator` returns `null` (indicating the form is complete), the Chat Runner automatically triggers a call to the Brain's `validate` endpoint before showing the final "Submit" options.
*   **Form Mode (`LiveFormView.tsx`):**
    *   A standard, linear HTML form view.
    *   Useful for power users who prefer speed over guidance, or for reviewing answers before submission.
    *   **Synchronization:** Because both Chat and Form modes read from the same `formData` state object, switching is instantaneous and lossless. A user can fill half the form in Chat, switch to Form Mode to correct a typo in a previous field, and switch back.

### 5.2 The "Handshake" Router (`/api/chat`)

We do not present users with a confusing list of 50 legal forms. We use an **Intent Classifier** to route them.

1.  **Input:** On the homepage, the user types a natural language description of their problem (e.g., "My landlord kept my deposit").
2.  **Classification:** The API sends this input to `gpt-4o`, which maps it to one of 9 fixed "Intents" (e.g., `Housing – Landlord/Tenant`, `Auto – Dealership`, `Debt Collection`).
3.  **Confidence Check:**
    *   **High Confidence:** The router returns a `router_data` object containing the target slug (e.g., `/issue/security-deposit-issues`). The UI redirects immediately.
    *   **Low Confidence:** If the input is vague (e.g., "I want to sue"), the API returns `needs_clarification: "yes"` along with a specific follow-up question generated by the LLM. The UI displays this question in the chat interface, keeping the user engaged until a route is determined.

### 5.3 The Security Proxy (`/api/intake/submit`)

The Gateway is a Next.js application running on the Edge (or Node). It acts as a security firewall between the User's Browser and the Factory's sensitive API.

*   **The Problem:** The Factory API (`argueOS-v1-form`) requires a high-privilege `ARGUEOS_API_KEY` to write submissions into the CRM. Exposing this key in client-side JavaScript would be a catastrophic security vulnerability.
*   **The Solution (Server-Side Proxy):**
    1.  The Client Component POSTs the submission payload to a *local* route: `/api/intake/submit`.
    2.  This local route executes on the server. It validates the payload structure using Zod.
    3.  It retrieves the `ARGUEOS_API_KEY` from secure server-side environment variables.
    4.  It forwards the request to the Factory's backend URL (`http://localhost:3001/api/public/v1/submit`).
*   **Result:** The Browser only knows about the Gateway. The Factory only trusts requests from the Gateway. The API Key never leaves the server environment.

### 5.4 Client Portal & Authentication

The Gateway provides a secure dashboard for clients to track their cases.

*   **Stateless Authentication (`auth.service.ts`):**
    *   We use **JWTs (JSON Web Tokens)** signed with `HS256`.
    *   The token contains the `userId` and `role` (client).
    *   It is stored in an **HTTP-Only, Secure Cookie** named `session`. This prevents XSS attacks from stealing the token.
    *   **Middleware:** `middleware.ts` intercepts all requests to `/dashboard/*`. It verifies the JWT signature using `jose`. If invalid, it redirects to `/login`.
*   **Mock Authentication (Dev Mode):**
    *   To facilitate testing, the auth service includes a "Dev Login" backdoor that is strictly gated by `process.env.NODE_ENV !== 'production'`. This allows developers to log in as "Mock Client" without email verification.
*   **Data Synchronization:**
    *   The Client Dashboard does *not* query the Factory database directly (which would break tenant isolation).
    *   Instead, when a lawyer updates a case in the Factory CRM, the Factory fires a **Webhook** (`/api/v1/hooks/status`) to the Gateway.
    *   The Gateway updates its own local `portal_claims` table (Postgres/Drizzle).
    *   This "Push" architecture ensures the Client Portal remains fast and available even if the Factory backend is undergoing maintenance.

    # Moreways Technical Bible: Section 6
## Infrastructure & Security

**Scope:** Cross-cutting concerns affecting all three repositories (Brain, Factory, Gateway). This section defines the "Physics" of the Moreways universe—the rules that cannot be broken.

---

### 6.1 Tenant Isolation & Data Segregation

Although the system behaves as a unified platform, the data architecture enforces strict isolation.

*   **The Brain (`law-parsing-engine`):**
    *   The `legal_nodes` table is effectively "Public Read" for the system (laws are public domain).
    *   However, future "Private Knowledge Bases" (firm-specific precedents) will be scoped by `organization_id` at the Row Level Security (RLS) layer.
*   **The Factory (`argueOS-v1-form`):**
    *   **Hard Requirement:** Every single table (`FormSchema`, `Client`, `Submission`) includes an `organizationId` column.
    *   **Repository Enforcement:** The data access layer (`FormSubmissionRepo.ts`) does not expose generic "Find All" methods. Every method signature *requires* `organizationId` as the first argument (e.g., `findMany(orgId, ...)`).
*   **The Gateway (`moreways-site`):**
    *   User data is siloed by `userId`.
    *   The `portalRepo` automatically appends `.where(eq(claims.userId, session.userId))` to every query, ensuring clients can never see each other's cases.

### 6.2 Encryption Architecture (The Vault)

We employ a **"Vault Pattern"** for Personally Identifiable Information (PII). We do not rely on "Encryption at Rest" provided by the cloud provider (which protects against disk theft but not DB admin access). We implement **Application-Level Encryption**.

*   **Algorithm:** `AES-256-GCM` (Galois/Counter Mode).
*   **Key Management:** A 32-byte hex key is injected via the `ENCRYPTION_KEY` environment variable.
*   **Scope Strategy:** We do *not* encrypt the entire database row (which would destroy query performance).
    *   **Metadata-Driven:** The system checks the Form Schema for fields flagged with `metadata: { isPII: true }`.
    *   **Selective Encryption:** Only these specific fields are encrypted before INSERT.
    *   **Storage Format:** The ciphertext is stored as a string: `iv_hex:tag_hex:content_hex`.
*   **Decryption:** Occurs on-the-fly in the Repository layer *only* when a valid, authorized session requests the data. This event triggers an audit log entry.

### 6.3 Audit Logging

Compliance requires visibility.

*   **Service:** `infra.svc.audit.ts`.
*   **Event Types:**
    *   `PII_ACCESS`: Triggered whenever encrypted data is decrypted.
    *   `SUBMISSION_EXPORT`: Triggered when a lawyer copies a case file to clipboard.
    *   `LOGIN_FAILURE`: Tracks brute-force attempts.
*   **Immutable Vault (Brain):** The `law-parsing-engine` implements a Postgres Trigger (`init_backup_vault.sql`) that copies every INSERT/UPDATE/DELETE on the legal graph into a `legal_nodes_vault` table. This table has RLS enabled with **zero policies**, making it a "Black Hole" that no API can read or modify—only the database superuser can access it for forensic auditing.

### 6.4 Resilience & Error Handling

The system is designed to "Fail Open" for the user wherever possible.

*   **The "Magistrate" Fallback:** In `api.handler.validateRoute.ts` (Brain), if the AI Judge fails (timeout, rate limit), we catch the error and return a `POSSIBLE_VIOLATION` verdict with a low confidence score (`0.5`). This ensures a user is never blocked from submitting a claim just because the validation service is down.
*   **The `withRetry` Utility:** Located in `shared/utils/resilience.ts`.
    *   Wraps all unstable external calls (OpenAI, Azure).
    *   Implements **Exponential Backoff** (1s -> 2s -> 4s).
    *   **Smart Filtering:** It *only* retries transient errors (HTTP 429, 503, ECONNRESET). It fails fast on logic errors (HTTP 400) to prevent infinite loops.

### 6.5 Testing Strategy

We use a "Swiss Cheese" testing model—multiple layers of different testing types to catch bugs.

1.  **Golden Set Testing (Brain):**
    *   We maintain a `BLESSED_HASH` of a reference PDF parse.
    *   CI/CD parses the PDF, serializes the graph, hashes it, and compares it.
    *   *Benefit:* Guarantees zero regression in the core parsing logic.
2.  **Fuzzing (Brain):**
    *   `pdf.fuzzer.test.ts` generates "Frankenstein" PDFs with impossible geometry (negative coordinates, recursive depth).
    *   *Goal:* Ensure the Stack Machine handles chaos gracefully without crashing.
3.  **End-to-End (Gateway):**
    *   Playwright tests (`client-flow.spec.ts`) simulate a full user journey: Chat -> Redirect -> Form Fill -> Submit.
    *   **Mocking:** We intercept OpenAI API calls during E2E tests (`page.route`) to ensure deterministic results and zero cost.

---

**This concludes the Moreways Technical Bible.**