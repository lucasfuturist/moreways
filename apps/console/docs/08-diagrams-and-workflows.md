
# argueOS Formgen – Diagrams & Workflows

This doc visualizes the core architecture and workflows for the v1 form generator:

- High-level system overview
- Prompt → Form Schema → DB → Preview flow
- CRM data model
- Feature relationships
- Development cycle

All diagrams are written in Mermaid so they can be rendered in GitHub or other viewers.

---

## 1. High-Level System Overview

```mermaid
flowchart LR
    %% Nodes
    LUI["Lawyer UI (/forms/new-from-prompt)"]
    API["POST /api/intake/forms/from-prompt"]
    SVC["IntakeCreateFormFromPromptAsync + IntakePromptToFormPipeline"]
    FORMSVC["FormSchemaRepo + form schema normalizer"]
    LLMSVC["LlmGenerateFormFromPromptAsync"]
    AUTH["Auth Services / GetCurrentUserAsync"]
    DB["Postgres: orgs, users, form_schemas, clients, matters, form_submissions"]
    LLM["Model API"]

    %% Subgraphs
    subgraph LawyerSide
        LUI
    end

    subgraph Backend
        API
        SVC
        FORMSVC
        LLMSVC
        AUTH
    end

    subgraph Storage
        DB
    end

    subgraph LLMVendor
        LLM
    end

    %% Edges
    LUI -->|"prompt + orgId"| API
    API --> AUTH
    AUTH --> API

    API -->|"validated request"| SVC
    SVC --> LLMSVC
    LLMSVC -->|"template + prompt"| LLM
    LLM -->|"raw JSON text"| LLMSVC
    LLMSVC -->|"validated JSON"| SVC

    SVC --> FORMSVC
    FORMSVC --> DB

    SVC -->|"normalized schema"| API
    API -->|"schema + version"| LUI

```

---

## 2. Prompt → Form Schema → DB → Preview (Sequence)

```mermaid
sequenceDiagram
    participant Lawyer as Lawyer (User)
    participant UI as FormFromPromptPage (UI)
    participant API as intake.api.createFormFromPromptRoute
    participant Auth as GetCurrentUserAsync
    participant SVC as IntakeCreateFormFromPromptAsync
    participant Pipe as IntakePromptToFormPipeline
    participant LLM as LlmGenerateFormFromPromptAsync
    participant Repo as FormSchemaRepo
    participant DB as Postgres

    Lawyer->>UI: Type free-text prompt + click "Generate form"
    UI->>API: POST /api/intake/forms/from-prompt\n{ prompt, organizationId }

    API->>Auth: GetCurrentUserAsync(request)
    Auth-->>API: User { id, organizationId, role }

    API->>API: Check user.organizationId == body.organizationId
    API->>SVC: IntakeCreateFormFromPromptAsync(request, user)

    SVC->>Pipe: Run pipeline(prompt, organizationId, formName?)

    rect rgb(240,240,240)
    note right of Pipe: Step 1 – Normalize prompt
    Pipe->>Pipe: promptFormStep01_normalizePrompt(prompt)
    end

    rect rgb(240,240,240)
    note right of Pipe: Step 2 – Generate draft schema via LLM
    Pipe->>LLM: LlmGenerateFormFromPromptAsync(normalizedPrompt)
    LLM->>LLM: Load prompt template + call vendor
    LLM-->>Pipe: Draft JSON schema (raw)
    end

    rect rgb(240,240,240)
    note right of Pipe: Step 3 – Validate & normalize schema
    Pipe->>Pipe: promptFormStep03_validateAndNormalizeSchema(draftSchema)
    Pipe->>Pipe: formSchemaNormalizer (coerce/clean)
    end

    rect rgb(240,240,240)
    note right of Pipe: Step 4 – Persist schema
    Pipe->>Repo: createVersion({ orgId, name, schemaJson })
    Repo->>DB: INSERT form_schemas(...)
    DB-->>Repo: Saved row (with id, version)
    Repo-->>Pipe: Persisted schema record
    end

    rect rgb(240,240,240)
    note right of Pipe: Step 5 – Emit events / log
    Pipe->>Pipe: promptFormStep05_emitEvents(persisted)
    end

    Pipe-->>SVC: Persisted schema
    SVC-->>API: { formSchemaId, version, schema }

    API-->>UI: 200 OK + JSON response
    UI->>UI: Update state with schema
    UI-->>Lawyer: Render live form preview + JSON viewer
```

---

## 3. CRM & Data Model (ER Diagram)

```mermaid
erDiagram
    ORGANIZATIONS {
        string id
        string name
        datetime createdAt
        datetime updatedAt
    }

    USERS {
        string id
        string organizationId
        string email
        string role
        string passwordHash
        datetime createdAt
        datetime updatedAt
    }

    FORM_SCHEMAS {
        string id
        string organizationId
        string name
        int version
        jsonb schemaJson
        boolean isDeprecated
        datetime createdAt
        datetime updatedAt
    }

    CLIENTS {
        string id
        string organizationId
        string fullName
        string email
        datetime createdAt
        datetime updatedAt
    }

    MATTERS {
        string id
        string organizationId
        string clientId
        string name
        string status
        datetime createdAt
        datetime updatedAt
    }

    FORM_SUBMISSIONS {
        string id
        string organizationId
        string formSchemaId
        string clientId
        string matterId
        jsonb submissionData
        datetime createdAt
        datetime updatedAt
    }

    ORGANIZATIONS ||--o{ USERS : "has many"
    ORGANIZATIONS ||--o{ FORM_SCHEMAS : "owns"
    ORGANIZATIONS ||--o{ CLIENTS : "has clients"
    ORGANIZATIONS ||--o{ MATTERS : "has matters"
    ORGANIZATIONS ||--o{ FORM_SUBMISSIONS : "owns submissions"

    CLIENTS ||--o{ MATTERS : "can have many matters"
    CLIENTS ||--o{ FORM_SUBMISSIONS : "can have many submissions"
    MATTERS ||--o{ FORM_SUBMISSIONS : "can collect submissions"
    FORM_SCHEMAS ||--o{ FORM_SUBMISSIONS : "template for"
```

---

## 4. Feature Relationships (Intake, Formgen, CRM)

```mermaid
flowchart LR
    subgraph Intake["INTAKE"]
        PromptFlow["Prompt-based form creation\n(lawyer-facing)"]
        FutureChat["Chat-based intake\n(client-facing, future)"]
        FutureUpload["Doc upload intake\n(future)"]
    end

    subgraph FormEngine["FORM GENERATION ENGINE"]
        LLMGen["LLM schema generation"]
        Normalizer["Schema normalizer"]
        Versioner["Versioned form_schemas"]
    end

    subgraph CRM["CRM / DATA"]
        Orgs[("organizations")]
        Users[("users")]
        Clients[("clients")]
        Matters[("matters")]
        Submissions[("form_submissions")]
    end

    PromptFlow -->|"calls"| LLMGen
    LLMGen --> Normalizer
    Normalizer --> Versioner
    Versioner --> Orgs

    FutureChat -->|"writes"| Submissions
    FutureUpload -->|"writes"| Submissions

    Orgs --> Users
    Orgs --> Clients
    Orgs --> Matters
    Orgs --> Submissions

    Clients --> Matters
    Clients --> Submissions
    Matters --> Submissions
    Versioner --> Submissions

    FormEngine -->|"reusable"| Intake
    CRM -->|"backbone for"| Intake
    CRM -->|"backbone for"| FutureChat
    CRM -->|"backbone for"| FutureUpload
```

---

## 5. Development Cycle for Features (Spec → Ship)

```mermaid
flowchart LR
    Spec["Write / update specs\n(01–07 docs)"]
    Plan["Update 00-implementation-steps.md\nwith tasks + checkboxes"]
    Skeleton["Add / adjust file skeleton\nin /src"]
    Impl["Implement code\n(domain + layer)"]
    Tests["Write / update tests\nin /src/tests"]
    RunChecks["Run lint / typecheck / tests"]
    PR["Open PR / merge"]
    Deploy["Deploy / release"]
    Feedback["Collect feedback\n(internal + users)"]

    Spec --> Plan
    Plan --> Skeleton
    Skeleton --> Impl
    Impl --> Tests
    Tests --> RunChecks

    RunChecks -->|pass| PR
    RunChecks -->|fail| Impl

    PR --> Deploy
    Deploy --> Feedback
    Feedback --> Spec
```

---

## 6. Where New Features Plug In

```mermaid
flowchart TB
    NewFeature["New Feature Idea"]
    ChooseDomain["Choose domain:\nintake / forms / crm / auth / llm / infra"]
    UpdateDocs["Update specs in /docs\n(01–07) as needed"]
    UpdatePlan["Extend 00-implementation-steps.md\nwith new tasks"]
    AddFiles["Add new files in src/<domain>/<layer>"]
    Implement["Implement services / APIs / UI"]
    ExtendTests["Extend tests to cover new flow"]
    Ship["Ship behind existing contracts"]

    NewFeature --> ChooseDomain
    ChooseDomain --> UpdateDocs
    UpdateDocs --> UpdatePlan
    UpdatePlan --> AddFiles
    AddFiles --> Implement
    Implement --> ExtendTests
    ExtendTests --> Ship
```

---

```

