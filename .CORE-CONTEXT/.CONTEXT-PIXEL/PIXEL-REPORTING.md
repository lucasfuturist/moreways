# File Scan: `apps/pixel/src/reporting`

## Tree: C:\projects\moreways-ecosystem\apps\pixel\src\reporting

```
reporting/

├── api/
│   ├── reporting.api.evidence.ts
│   ├── reporting.api.stats.ts
├── svc/
│   ├── reporting.svc.modeler.ts
│   ├── reporting.svc.source.ts
```

## Files

### `reporting/api/reporting.api.evidence.ts`
**Role:** Provides a forensic "Evidence Locker" API endpoint (`/api/v1/evidence/:anonymousId`) that reconstructs a full audit trail of a user's journey, including event history, IP/geo data, quality scores, and compliance logs, for use in dispute resolution.
**Key Exports:**
- `evidenceRoute` - Hono application instance mounted for evidence retrieval.
**Dependencies:** `db`, `events`, `identities`, `complianceLogs`.

### `reporting/api/reporting.api.stats.ts`
**Role:** Delivers aggregate analytics API endpoint (`/api/v1/stats/overview`) for the admin dashboard, summarizing traffic volume, top revenue sources (via simple last-touch attribution), and bot traffic quality metrics.
**Key Exports:**
- `statsRoute` - Hono application instance mounted for stats retrieval.
**Dependencies:** `db`, `events`.

### `reporting/svc/reporting.svc.modeler.ts`
**Role:** Processes raw event streams into a structured "Customer Journey," calculating Lead Scores, Total Revenue, and determining First/Last Touch attribution points based on channel classification.
**Key Exports:**
- `modelJourney(events): AttributionResult` - The core modeling function.
**Dependencies:** `classifySource`.

### `reporting/svc/reporting.svc.source.ts`
**Role:** Acts as the traffic classification engine, analyzing click IDs (GCLID, FBCLID), UTM parameters, and Referrer headers to categorize traffic into channels (e.g., Paid Search, Organic Social, Direct).
**Key Exports:**
- `classifySource(event): SourceDefinition` - Returns normalized source/medium/campaign data.
**Dependencies:** None.