# 06 – API Standards & Conventions

**Status:** Active  
**Version:** 1.0  
**Applies To:** Public & Internal APIs

## 1. General Principles
*   **Statelessness:** All APIs must be stateless. Context is derived solely from the request payload and database state.
*   **Determinism:** Given the same input and the same database state, the output must be identical.
*   **Strict Typing:** Request and Response bodies must be validated via Zod schemas before processing.

## 2. Response Envelope
All API responses must adhere to the standard envelope to ensure consistent parsing by clients.

```json
{
  "data": { ... },       // The actual payload (Node, Search Results, etc.)
  "meta": {              // Metadata (Pagination, Processing Time, Trace ID)
    "traceId": "abc-123",
    "latencyMs": 120,
    "timestamp": "2023-10-27T10:00:00Z"
  }
}
```

## 3. Error Handling
Errors return structured JSON, never plain text or HTML.

```json
{
  "error": {
    "code": "urn_not_found",
    "message": "The requested URN does not exist in the active graph.",
    "details": { 
      "urn": "urn:lex:ma:999cmr",
      "suggestion": "Check for typos or deprecated citations."
    }
  }
}
```

## 4. Standard Endpoints

### `POST /api/v1/ingest`
*   **Auth:** Service Token (Internal Only).
*   **Body:** Multipart/Form-Data (PDF Binary) + Metadata JSON.
*   **Behavior:** Triggers the asynchronous ingestion pipeline.
*   **Response:** Returns a Job ID for polling status.

### `GET /api/v1/query`
*   **Auth:** User Token.
*   **Query Params:** `?q=landlord%20deposit&jurisdiction=ma`
*   **Behavior:** Performs Hybrid Search -> Context Assembly -> LLM Synthesis.
*   **Response:** Returns the synthesized answer, a list of cited URNs, and any preemption warnings.

### `GET /api/v1/node/:urn`
*   **Auth:** User Token.
*   **Behavior:** Returns the raw node data, its immediate ancestry, and valid definitions within its scope.
*   **Use Case:** Debugging or "Source View" in the UI.

## 5. Versioning
*   API versioning is handled via URL path: `/api/v1/...`
*   Breaking changes require a bump to `/api/v2/...`
*   Database schema changes must be backward compatible with the active API version.
