# 05 – Project Structure & Naming Conventions

**Status:** Active  
**Version:** 1.0  
**Applies To:** All Source Code

## 1. Core Philosophy
Names must encode **Domain**, **Layer**, and **Action**. This ensures that the file system structure mirrors the logical signal flow. A developer should be able to deduce exactly what a file does and where it fits in the architecture solely by its name.

Formula: **`[domain].[layer].[action].ts`**

## 2. Directory Structure

```text
/
├── src/
│   ├── ingest/       # Domain: Parsing, OCR, text analysis (Write Path)
│   │   ├── svc/      # Services (e.g., ingest.svc.parsePdf.ts)
│   │   ├── util/     # Regex profiles, sanitizers
│   │   ├── api/      # Worker entry points
│   │   └── schema/   # Zod validators for raw input
│   ├── graph/        # Domain: Database interaction & Topology
│   │   ├── repo/     # Supabase/SQL interactions
│   │   └── schema/   # Zod definitions for Graph Nodes
│   ├── retrieve/     # Domain: Search & Context Assembly (Read Path)
│   │   └── svc/      # Context assembly logic
│   ├── api/          # Domain: Public Endpoints (HTTP/Edge)
│   ├── infra/        # Domain: Logging, Config, Cloud Adapters
│   └── shared/       # Shared Types & Kernel
├── tests/
│   ├── golden-set/   # Regression test artifacts (PDFs + Expected JSON)
│   └── mocks/        # Dependency injection mocks
└── docs/             # Architecture Specs
```

## 3. Domains (Top Level Folders)
*   `ingest`: All logic related to turning a raw file into structured data.
*   `graph`: All logic related to persistence, node management, and database constraints.
*   `retrieve`: All logic related to user queries, vector search, and context construction.
*   `infra`: External adapters (Azure Doc Intel, OpenAI, Supabase Client).
*   `api`: Route handlers and controllers.

## 4. Layers (Sub-folders)
*   `svc` (Service): Pure business logic. Contains the "How".
*   `repo` (Repository): Database access. Contains the "Where".
*   `util` (Utility): Stateless helpers (Regex, string manipulation).
*   `schema` (Schema): Data shape definitions and validation.

## 5. Naming Conventions

### 5.1 File Naming
Files use **dot-notation** to enforce grouping.

*   `ingest.svc.parsePdf.ts`
*   `ingest.util.regexProfiles.ts`
*   `graph.repo.nodeRepo.ts`
*   `retrieve.svc.contextAssembler.ts`
*   `api.handler.searchRoute.ts`

### 5.2 Function Naming
Functions follow the pattern: `[Domain][Action][Target][Async?]`

*   `IngestParseDocumentAsync`
*   `GraphFetchAncestorsAsync`
*   `RetrieveBuildContextAsync`

### 5.3 Pipeline Naming
Complex, multi-step flows are named `[Domain][Name]Pipeline`. Internal steps are numbered for clarity.

*   **File:** `ingest.svc.pdfToGraphPipeline.ts`
*   **Functions:**
    *   `ingestStep01_zonePage`
    *   `ingestStep02_buildStack`
    *   `ingestStep03_lintGraph`
    *   `ingestStep04_persistNodes`

## 6. Types and DTOs
*   **Data Models:** `[Domain][Entity]` (e.g., `LegalNode`, `AuditLog`).
*   **DTOs:** `[Direction][Domain][Action]Dto` (e.g., `ApiIngestRequestDto`).
