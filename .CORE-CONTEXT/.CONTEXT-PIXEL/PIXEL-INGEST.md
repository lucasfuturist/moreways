# File Scan: `apps/pixel/src/ingest`

## Tree: C:\projects\moreways-ecosystem\apps\pixel\src\ingest

```
ingest/

├── api/
│   ├── ingest.api.controller.ts
│   ├── ingest.api.offline.ts
│   ├── ingest.api.read.ts
├── types/
│   ├── ingest.types.offline.ts
│   ├── ingest.types.payload.ts
```

## Files

### `ingest/api/ingest.api.controller.ts`
**Role:** The primary HTTP ingestion endpoint (`/api/v1/track`) that receives, validates, and queues raw event payloads. It handles rate limiting (Redis), bot detection (User-Agent/Honeypot), GPC compliance overrides, and quarantines invalid payloads to the database.
**Key Exports:**
- `trackRoute` - Hono application instance mounted for tracking routes.
**Dependencies:** `bullmq`, `redis`, `zod`, `db`, `quarantine`.

### `ingest/api/ingest.api.offline.ts`
**Role:** Handles server-to-server offline conversions (e.g., from CRM or CallRail). It authenticates via secret key, rehydrates session context from historical data using user identifiers (email/phone), and queues the enriched event for attribution processing.
**Key Exports:**
- `offlineRoute` - Hono application instance mounted for offline routes.
**Dependencies:** `bullmq`, `db`, `rehydrateSession`.

### `ingest/api/ingest.api.read.ts`
**Role:** Provides a read-only Intelligence API (`/api/v1/journey`) that returns the full user journey and attribution model (First Touch, Last Touch, Lead Score) for a given `anonymousId`.
**Key Exports:**
- `readRoute` - Hono application instance mounted for read routes.
**Dependencies:** `db`, `modelJourney`.

### `ingest/types/ingest.types.offline.ts`
**Role:** Defines the Zod schema for offline conversion payloads (e.g., Salesforce updates), ensuring strict typing for server-side inputs.
**Key Exports:**
- `OfflineConversionSchema` - Zod schema definition.
- `OfflineConversionPayload` - TS type inferred from schema.
**Dependencies:** `zod`.

### `ingest/types/ingest.types.payload.ts`
**Role:** Defines the comprehensive Zod schema for all ingestion events, covering User PII, Consent, Browser Context, Cookies, and Click IDs. Updated to support B2B fields (Title, Company).
**Key Exports:**
- `EventPayloadSchema` - Zod schema for validation.
- `EventPayload` - TS type inferred from schema.
**Dependencies:** `zod`.