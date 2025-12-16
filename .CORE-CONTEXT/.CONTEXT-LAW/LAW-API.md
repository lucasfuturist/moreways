Here is the updated **High-Resolution Interface Map** for `apps/law/src/api`, incorporating the changes to the validation route handler.

---

# High-Resolution Interface Map: `apps/law/src/api`

## Tree: `apps/law/src/api`

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

## File Summaries

### `server.ts`
**Role:** Configures the Express application, applies global middleware, initializes core dependencies (Graph Reader, Repo, Assembler), and mounts route controllers.
**Key Exports:**
- `createApp(): Express` - Factory function that constructs and configures the Express app instance.
- `app` - The initialized singleton Express application.
**Dependencies:** `express`, `SearchController`, `NodeController`, `ValidateController`, `ContextAssembler`, `SupabaseGraphReader`, `SupabaseOverrideRepo`.

### `handler/api.handler.nodeRoute.ts`
**Role:** Handles requests to fetch specific legal graph nodes (by UUID or URN), dynamically expanding content for non-leaf nodes (Sections/Parts) to include their children.
**Key Exports:**
- `NodeController` - Class handling node retrieval logic.
- `handleGetNode(req, res, next): Promise<void>` - Validates ID, queries the Graph Reader, formats text, and returns the node record.
**Dependencies:** `SupabaseGraphReader`, `zod`, `formatLegalText`.

### `handler/api.handler.searchRoute.ts`
**Role:** Orchestrates the primary RAG search pipeline, including query normalization, hybrid search, relevance filtering, context assembly, and answer synthesis.
**Key Exports:**
- `SearchController` - Class handling search logic and context assembly injection.
- `handleSearch(body): Promise<object>` - executes the full RAG pipeline, manages caching strategies, and constructs the response payload with citations.
**Dependencies:** `ContextAssembler`, `QueryNormalizer`, `HybridSearchService`, `RelevanceFilterService`, `synthesizeAnswer`, `cache`.

### `handler/api.handler.validateRoute.ts`
**Role:** Endpoint for the "Magistrate" feature, validating user intent and form data against legal requirements using the Judge service.
**Key Exports:**
- `ValidateController` - Class handling the validation endpoint.
- `handleValidation(req, res, next): Promise<void>` - Parses validation requests, executes the `JudgeService` logic, and enriches the final verdict with real citation evidence excerpts.
**Dependencies:** `JudgeService`, `HybridSearchService`, `SupabaseGraphReader`, `SupabaseOverrideRepo`, `ValidationRequestSchema`.