# File Scan: `apps/law/src/retrieve`

## Tree: C:\projects\moreways-ecosystem\apps\law\src\retrieve

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

## Files

### `retrieve/schema/retrieve.schema.context.ts`
**Role:** Defines the data structure ("Context Object") passed to the LLM, containing the target node, its ancestry, definitions, and safety alerts.
**Key Exports:**
- `ScopedContextSchema` - Zod schema validating the context payload.
- `ScopedContext` - TypeScript type inferred from the schema.
**Dependencies:** `zod`, `LegalNodeRecordSchema`.

### `retrieve/svc/retrieve.svc.contextAssembler.ts`
**Role:** Aggregates related graph nodes (ancestors, children, siblings, definitions) around a target URN to build a comprehensive legal context.
**Key Exports:**
- `ContextAssembler` - Class responsible for fetching and de-duplicating graph data.
- `assembleContext(targetUrn): Promise<ScopedContext>` - Fetches the target node and expands its context with relevant definitions and override alerts.
- `IGraphReader` - Interface abstracting the database read operations.
**Dependencies:** `LegalNodeRecord`, `ScopedContext`, `IOverrideRepo`.

### `retrieve/svc/retrieve.svc.hybridSearch.ts`
**Role:** Executes the search strategy using a combination of OpenAI vector embeddings and PostgreSQL full-text search (via Supabase RPC).
**Key Exports:**
- `HybridSearchService` - Class handling the search logic.
- `search(userQuery, limit): Promise<SearchResult[]>` - Vectorizes the query and returns scored matches from the database.
- `SearchResult` - Interface defining the structure of a search hit (score, content, URN).
**Dependencies:** `openai`, `supabase`.

### `retrieve/svc/retrieve.svc.queryNormalizer.ts`
**Role:** Uses an LLM to transform natural language user questions into optimized keyword-rich search strings for better retrieval recall.
**Key Exports:**
- `QueryNormalizer` - Class responsible for query preprocessing.
- `normalize(rawQuery): Promise<NormalizedQuery>` - Returns both the original query and the LLM-transformed version.
**Dependencies:** `openai`.

### `retrieve/svc/retrieve.svc.relevanceFilter.ts`
**Role:** Acts as an "AI Judge" to filter raw search results, discarding irrelevant chunks before they reach the expensive context assembly phase.
**Key Exports:**
- `RelevanceFilterService` - Class wrapping the filtering logic.
- `filterRelevance(query, candidates): Promise<SearchResult[]>` - Sends candidates to an LLM to select only the relevant indices.
**Dependencies:** `openai`, `SearchResult`.

### `retrieve/svc/retrieve.svc.synthesizer.ts`
**Role:** Generates the final natural language answer for the user based on the assembled legal context.
**Key Exports:**
- `synthesizeAnswer(query, contextNodes): Promise<string>` - Constructs a prompt with the context nodes and asks the LLM to answer the query with citations.
**Dependencies:** `openai`, `LegalNodeRecord`.

### `retrieve/schema/retrieve.schema.contet.ts`
*Note: This appears to be a duplicate or typo of `retrieve.schema.context.ts` containing identical schema definitions.*