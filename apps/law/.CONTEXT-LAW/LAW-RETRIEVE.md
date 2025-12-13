# High-Resolution Interface Map: `apps/law/src/retrieve`

## Tree: `apps/law/src/retrieve`

```
retrieve/

├── schema/
│   ├── retrieve.schema.contet.ts
│   ├── retrieve.schema.context.ts
├── svc/
│   ├── retrieve.svc.contextAssembler.ts
│   ├── retrieve.svc.hybridSearch.ts
│   ├── retrieve.svc.queryNormalizer.ts
│   ├── retrieve.svc.relevanceFilter.ts
│   ├── retrieve.svc.synthesizer.ts
```

## File Summaries

### `retrieve.schema.contet.ts`
**Role:** Defines the Zod schema and TypeScript type for the context payload provided to the LLM (Duplicate of `context.ts`).
**Key Exports:**
- `ScopedContextSchema` - Zod object validating the structure of the LLM payload (target, ancestry, definitions, alerts).
- `ScopedContext` - Type inference of the schema.
**Dependencies:** `LegalNodeRecordSchema`

### `retrieve.schema.context.ts`
**Role:** Defines the Zod schema and TypeScript type for the context payload provided to the LLM.
**Key Exports:**
- `ScopedContextSchema` - Zod object validating the structure of the LLM payload (target, ancestry, definitions, alerts).
- `ScopedContext` - Type inference of the schema.
**Dependencies:** `LegalNodeRecordSchema`

### `retrieve.svc.contextAssembler.ts`
**Role:** Aggregates related graph data (ancestors, children, siblings, definitions) and safety alerts to build the full context for a target URN.
**Key Exports:**
- `IGraphReader` - Interface defining required methods for fetching nodes, ancestors, and siblings.
- `ContextAssembler` - Class managing the assembly logic.
- `assembleContext(targetUrn: string): Promise<ScopedContext>` - Fetches target node, resolves graph relationships, checks overrides, and returns the assembled context.
**Dependencies:** `LegalNodeRecord`, `ScopedContext`, `IOverrideRepo`

### `retrieve.svc.hybridSearch.ts`
**Role:** Orchestrates the search process by generating embeddings and querying the database using a weighted mix of vector similarity and keyword matching.
**Key Exports:**
- `SearchResult` - Interface defining the structure of a search hit (scores, content, urn).
- `HybridSearchService` - Class managing the search execution.
- `search(userQuery: string, limit: number): Promise<SearchResult[]>` - Vectorizes the query and calls the Supabase RPC `match_legal_nodes_hybrid`.
**Dependencies:** `openai`, `supabase`

### `retrieve.svc.queryNormalizer.ts`
**Role:** Uses an LLM to transform natural language user inputs into optimized legal search keywords and statute references.
**Key Exports:**
- `NormalizedQuery` - Interface holding the original and transformed query strings.
- `QueryNormalizer` - Class managing the transformation logic.
- `normalize(rawQuery: string): Promise<NormalizedQuery>` - Calls GPT-4o-mini to remove noise and expand terms into legal equivalents.
**Dependencies:** `openai`

### `retrieve.svc.relevanceFilter.ts`
**Role:** acts as a second-pass filter by using an LLM to review raw search candidates and discard irrelevant entries based on the user query.
**Key Exports:**
- `RelevanceFilterService` - Class managing the filtering logic.
- `filterRelevance(query: string, candidates: SearchResult[]): Promise<SearchResult[]>` - Sends text fragments to an LLM to identify and return only relevant items.
**Dependencies:** `openai`, `SearchResult`

### `retrieve.svc.synthesizer.ts`
**Role:** Generates the final, cited conversational response using the assembled legal context and alerts.
**Key Exports:**
- `synthesizeAnswer(query: string, contextNodes: LegalNodeRecord[], alerts: Alert[]): Promise<string>` - Constructs the prompt with context/alerts and retrieves the final answer from GPT-4o.
**Dependencies:** `openai`, `LegalNodeRecord`