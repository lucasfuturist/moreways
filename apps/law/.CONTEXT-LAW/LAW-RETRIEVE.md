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

### `retrieve.schema.context.ts`
**Role:** Defines the Zod schema and TypeScript type for the full context payload (Target + Ancestry + Definitions + Alerts) passed to the LLM.
**Key Exports:**
- `ScopedContextSchema` - Zod validator ensuring the LLM context object has the correct structure.
- `ScopedContext` - TypeScript type inference for the context object.
**Dependencies:** `LegalNodeRecordSchema`

### `retrieve.schema.contet.ts`
**Role:** *Duplicate/Typo of `retrieve.schema.context.ts`*. Contains the same schema definition.
**Key Exports:**
- `ScopedContextSchema` - Zod validator.
- `ScopedContext` - TypeScript type.
**Dependencies:** `LegalNodeRecordSchema`

### `retrieve.svc.contextAssembler.ts`
**Role:** Aggregates the graph neighborhood (Ancestors, Children, Siblings) and scoped definitions around a specific target node to build the `ScopedContext`.
**Key Exports:**
- `IGraphReader` - Interface defining the read operations required for graph traversal.
- `ContextAssembler` - Class orchestration the context gathering logic.
- `assembleContext(targetUrn): Promise<ScopedContext>` - Fetches the target node, traverses relations, resolves definitions, and checks for overrides.
**Dependencies:** `IOverrideRepo`, `LegalNodeRecord`, `ScopedContext`

### `retrieve.svc.hybridSearch.ts`
**Role:** Executes the search logic by generating embeddings and querying the database using a weighted mix of Vector Similarity and Full-Text Search (keyword) scores.
**Key Exports:**
- `SearchResult` - Interface defining the structure of a search hit (URN, scores, content).
- `HybridSearchService` - Class managing the search execution.
- `search(userQuery, limit): Promise<SearchResult[]>` - Vectorizes the input and calls the Supabase RPC `match_legal_nodes_hybrid`.
**Dependencies:** `openai`, `supabase`

### `retrieve.svc.queryNormalizer.ts`
**Role:** Uses an LLM to rewrite raw user questions into optimized legal search strings (removing noise, expanding legal terms, adding statute names).
**Key Exports:**
- `NormalizedQuery` - Interface holding the original and transformed query strings.
- `QueryNormalizer` - Class managing the transformation prompt.
- `normalize(rawQuery): Promise<NormalizedQuery>` - Sends the query to GPT-4o-mini for optimization.
**Dependencies:** `openai`

### `retrieve.svc.relevanceFilter.ts`
**Role:** Acts as a second-pass filter by sending raw search candidates to an LLM to determine if they are actually relevant to the user's specific question.
**Key Exports:**
- `RelevanceFilterService` - Class managing the filtering prompt.
- `filterRelevance(query, candidates): Promise<SearchResult[]>` - Returns a subset of candidates that the LLM deems relevant.
**Dependencies:** `openai`, `SearchResult`

### `retrieve.svc.synthesizer.ts`
**Role:** Generates the final, conversational answer by feeding the assembled context and alerts to the LLM with strict citation rules.
**Key Exports:**
- `synthesizeAnswer(query, contextNodes, alerts): Promise<string>` - Constructs the system prompt and returns the LLM's text response.
**Dependencies:** `openai`, `LegalNodeRecord`