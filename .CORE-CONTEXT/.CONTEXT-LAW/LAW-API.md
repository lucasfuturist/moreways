# File Scan: `apps/law/src/api`

## Tree: C:\projects\moreways-ecosystem\apps\law\src\api

```
api/

├── handler/
│   ├── api.handler.ingestRoute.ts
│   ├── api.handler.nodeRoute.ts
│   ├── api.handler.searchRoute.ts
│   ├── api.handler.validateRoute.ts
├── middleware/
│   ├── api.middleware.auth.ts
│   ├── api.middleware.validation.ts
├── server.ts
```

## Files

### `api/server.ts`
**Role:** Express application entry point responsible for middleware configuration, dependency injection, and route definition.
**Key Exports:**
- `createApp(): Express.Application` - Instantiates the app, injects dependencies (GraphReader, Assembler, Controllers), and mounts routes.
- `app` - The initialized Express application instance.
**Dependencies:** `SearchController`, `NodeController`, `ValidateController`, `ContextAssembler`, `SupabaseGraphReader`, `SupabaseOverrideRepo`.

### `api/handler/api.handler.nodeRoute.ts`
**Role:** Controller managing the retrieval of specific legal graph nodes and their hierarchical children.
**Key Exports:**
- `NodeController` - Class handling node lookup logic.
- `handleGetNode(req, res, next): Promise<Response>` - Fetches a node by UUID or URN, aggregates child content for context, and formats text.
**Dependencies:** `SupabaseGraphReader`, `formatLegalText`, `zod`.

### `api/handler/api.handler.searchRoute.ts`
**Role:** Orchestrator for the RAG (Retrieval-Augmented Generation) pipeline, managing query normalization, search, filtering, context assembly, and answer synthesis.
**Key Exports:**
- `SearchController` - Class wrapping the search orchestration logic.
- `handleSearch(body): Promise<SearchResultPayload>` - Executes the full search pipeline with caching, normalization, vector search, and LLM synthesis.
**Dependencies:** `ContextAssembler`, `QueryNormalizer`, `HybridSearchService`, `RelevanceFilterService`, `synthesizeAnswer`, `cache`.

### `api/handler/api.handler.validateRoute.ts`
**Role:** Controller responsible for evaluating user intent against form data using an AI-driven judgment service.
**Key Exports:**
- `ValidateController` - Class handling validation requests.
- `handleValidation(req, res, next): Promise<void>` - Parses validation requests and triggers the `JudgeService` to return a verdict.
**Dependencies:** `JudgeService`, `HybridSearchService`, `SupabaseGraphReader`.

### `api/handler/api.handler.ingestRoute.ts`
*File present in tree but content provided was empty.*

### `api/middleware/api.middleware.auth.ts`
*File present in tree but content provided was empty.*

### `api/middleware/api.middleware.validation.ts`
*File present in tree but content provided was empty.*