# Attribution Engine – Project Structure & Standards (v1.0)

**Repo:** `attribution-engine`
**Type:** Monorepo-style structure (Single Repo, Multiple Entry Points).

This structure separates the **High-Speed API** (Hono), the **Background Worker** (BullMQ), and the **Client Pixel** (Vanilla JS) while sharing core logic.

---

## 1. Directory Tree

```text
attribution-engine/
├── .github/                   # CI/CD Workflows
├── docker/                    # Dockerfiles for API and Worker
├── docs/                      # Architecture Documentation
├── migrations/                # Drizzle SQL Migrations
├── public/                    # Static assets (hosted pixel)
│   └── tracking.js            # Build output from src/pixel
├── src/
│   ├── api/                   # ENTRY: Hono Server (Ingestion & Intel)
│   │   ├── index.ts           # Server entry point
│   │   └── routes/            # Route definitions
│   ├── pixel/                 # ENTRY: Client-Side SDK
│   │   ├── index.ts           # Pixel entry point
│   │   └── lib/               # Zero-dep helpers (cookie, fetch)
│   ├── worker/                # ENTRY: Background Jobs
│   │   ├── index.ts           # Worker entry point
│   │   └── processors/        # Job handlers (Meta, Google)
│   ├── core/                  # SHARED: Domain Logic & Types
│   │   ├── config/            # Env parsers
│   │   ├── db/                # Drizzle Schema & Client
│   │   ├── services/          # Pure Business Logic (Hashing, Consent)
│   │   └── types/             # Zod Schemas (Payload Contracts)
│   └── util/                  # Generic helpers (Logger, Crypto)
├── tests/                     # E2E Playwright Tests
├── drizzle.config.ts          # ORM Config
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 2. Shared Libraries (`src/core`)

To prevent drift between the Pixel and the API, we use shared Zod schemas.

### `src/core/types/events.ts`
Defines the "Titanium Payload" contract.
```typescript
import { z } from 'zod';

export const EventPayloadSchema = z.object({
  type: z.enum(['pageview', 'lead', 'purchase']),
  anonymousId: z.string().uuid(),
  consent: z.object({
    ad_storage: z.enum(['granted', 'denied']),
    // ...
  }),
  // ... rest of spec
});

export type EventPayload = z.infer<typeof EventPayloadSchema>;
```

*   **Usage in API:** Validates incoming `POST` requests.
*   **Usage in Worker:** Types the Redis Job payload.
*   **Usage in Pixel:** (Optional) If we use a build step, can be used for type checking via JSDoc, but usually kept separate to minimize bundle size.

---

## 3. The Three Entry Points

### A. The API (`src/api`)
*   **Runtime:** Node.js 20 (Distroless Docker).
*   **Responsibility:** Ingest, Validate, Buffer.
*   **Constraint:** **Zero logic.** It validates the JSON, checks the API Key, pushes to Redis, and returns 200 OK. No external API calls allowed here (too slow).

### B. The Worker (`src/worker`)
*   **Runtime:** Node.js 20.
*   **Responsibility:** Process, Hash, Dispatch.
*   **Logic:**
    1.  Read from Redis.
    2.  Check Consent (The Safety Switch).
    3.  Write to DB (The Ledger).
    4.  Call Facebook/Google APIs (The Dispatch).

### C. The Pixel (`src/pixel`)
*   **Build Tool:** `tsup` or `esbuild`.
*   **Output:** `public/tracking.js` (Minified, IIFE format).
*   **Constraint:** **No NPM dependencies.** All helpers (cookie reading, UUID generation) must be written as raw utility functions inside `src/pixel/lib` to keep size < 3KB.

---

## 4. Coding Standards

### 4.1 Strict Typing
*   **No `any`**: Use `unknown` if necessary and narrow with Zod.
*   **Environment:** Use `dotenv-safe` or `t3-env` to ensure the app crashes at startup if `PIXEL_DATABASE_URL` or `REDIS_URL` are missing.

### 4.2 Logging (JSON Structured)
All logs must be machine-readable for Datadog/CloudWatch.
```json
{
  "level": "info",
  "service": "dispatch-worker",
  "event_id": "evt_123",
  "action": "skipped_consent",
  "timestamp": "2023-10-27T10:00:00Z"
}
```

### 4.3 Database Access
*   **No Raw SQL:** Use Drizzle ORM query builder.
*   **Multi-Tenancy:** Every query must include a `where(eq(schema.tenantId, ...))` clause.

---

## 5. Deployment Architecture

This repo produces **two Docker images**:

1.  **`attribution-api`**: Scaled horizontally (Autoscaling Group / K8s Deployment). Handles high traffic.
2.  **`attribution-worker`**: Scaled based on Queue Depth. Handles the heavy lifting.

*Note:* The `tracking.js` file is uploaded to a CDN (S3/CloudFront) during the CI/CD pipeline.
