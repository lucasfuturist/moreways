# File Scan: `apps/pixel/src/dispatch`

## Tree: C:\projects\moreways-ecosystem\apps\pixel\src\dispatch

```
dispatch/

├── job/
│   ├── dispatch.job.processor.ts
├── svc/
│   ├── adapters/
│   │   ├── dispatch.adapter.google.ts
│   │   ├── dispatch.adapter.linkedin.ts
│   │   ├── dispatch.adapter.meta.ts
│   │   ├── dispatch.adapter.tiktok.ts
│   ├── dispatch.svc.crm.ts
│   ├── dispatch.svc.geo.ts
│   ├── dispatch.svc.google.ts
│   ├── dispatch.svc.meta.ts
│   ├── dispatch.svc.rehydrate.ts
│   ├── dispatch.svc.types.ts
│   ├── dispatch.svc.viral.ts
│   ├── dispatch.svc.webhook.ts
```

## Files

### `dispatch/job/dispatch.job.processor.ts`
**Role:** Main BullMQ worker logic for processing event jobs. It orchestrates Geo-IP resolution, Identity resolution, Viral attribution checks, Database persistence (Transactional), and parallel dispatch to external Ad Platforms (Meta, Google, TikTok) and CRMs.
**Key Exports:**
- `processEventJob(job: Job): Promise<void>` - The primary worker function.
**Dependencies:** `db`, `redis`, `GeoService`, `IdentityService`, `AdAdapters`, `CrmService`.

### `dispatch/svc/dispatch.svc.crm.ts`
**Role:** Sends "Closed Loop" attribution data (leads/purchases) back to the client's CRM via a configured webhook, translating technical signals into business-readable fields.
**Key Exports:**
- `sendToCrm(tenantId, eventId, payload): Promise<void>` - Executes the webhook POST request.
**Dependencies:** `db`, `classifySource`.

### `dispatch/svc/dispatch.svc.geo.ts`
**Role:** Resolves IP addresses to physical locations (City, State, Country) using external APIs (ip-api.com) and enforces jurisdiction compliance checks.
**Key Exports:**
- `resolveIpLocation(ip): Promise<GeoResult>` - Fetches location data.
- `checkJurisdiction(geo, config): boolean` - Validates if the location is allowed.
**Dependencies:** `ip-api.com`.

### `dispatch/svc/dispatch.svc.rehydrate.ts`
**Role:** Reconstructs digital session context (cookies, clicks) from historical events for offline conversions (e.g., CSV uploads) by looking up past identities.
**Key Exports:**
- `rehydrateSession(tenantId, identifiers): Promise<Partial<EventPayload> | null>` - Finds the "Golden Event" to attribute offline actions.
**Dependencies:** `db`, `identities`, `events`.

### `dispatch/svc/dispatch.svc.viral.ts`
**Role:** Detects viral loops (word-of-mouth sharing) by checking if a click originated from a shared link containing another user's reference ID (`mw_ref`) or shared ad click ID.
**Key Exports:**
- `checkViralStatus(tenantId, identityId, clickData): Promise<ViralResult>` - Returns viral status and original referrer ID.
**Dependencies:** `db`.

### `dispatch/svc/dispatch.svc.webhook.ts`
**Role:** Generic utility to send real-time JSON webhooks to external endpoints with timeout handling.
**Key Exports:**
- `sendWebhook(url, event, identityId): Promise<boolean>` - Performs the HTTP POST.
**Dependencies:** None.

### `dispatch/svc/dispatch.svc.types.ts`
**Role:** Defines the TypeScript interface contract for Ad Platform Adapters, ensuring consistent implementation of `isEnabled` and `send` methods.
**Key Exports:**
- `AdPlatformAdapter` - Interface definition.
**Dependencies:** `EventPayload`.

### `dispatch/svc/adapters/dispatch.adapter.google.ts`
**Role:** Adapter for sending offline conversions to Google Ads API, handling user data hashing and payload formatting.
**Key Exports:**
- `GoogleAdapter` - Implementation of `AdPlatformAdapter`.
**Dependencies:** `crypto`.

### `dispatch/svc/adapters/dispatch.adapter.linkedin.ts`
**Role:** Adapter for sending conversion events to LinkedIn's Conversion API, supporting first-party cookie (`li_fat_id`) and enhanced conversions.
**Key Exports:**
- `LinkedInAdapter` - Implementation of `AdPlatformAdapter`.
**Dependencies:** `crypto`.

### `dispatch/svc/adapters/dispatch.adapter.meta.ts`
**Role:** Adapter for Meta Conversions API (CAPI), mapping internal event types to Facebook standard events and hashing user PII.
**Key Exports:**
- `MetaAdapter` - Implementation of `AdPlatformAdapter`.
**Dependencies:** `crypto`.

### `dispatch/svc/adapters/dispatch.adapter.tiktok.ts`
**Role:** Adapter for TikTok Events API, supporting standard event mapping and click ID (`ttclid`) passthrough.
**Key Exports:**
- `TikTokAdapter` - Implementation of `AdPlatformAdapter`.
**Dependencies:** `crypto`.

### `dispatch/svc/dispatch.svc.google.ts`
*Redundant file*: Contains logic similar to `dispatch.adapter.google.ts`. Likely a legacy file or duplicate service layer logic.

### `dispatch/svc/dispatch.svc.meta.ts`
*Redundant file*: Contains logic similar to `dispatch.adapter.meta.ts`. Likely a legacy file or duplicate service layer logic.