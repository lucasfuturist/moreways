# Attribution Engine – Development Standards & Rules (v1.0)

**Status:** Active
**Applies To:** All contributors
**Philosophy:** "Performance is a feature. Compliance is binary."

---

## 1. Core Principles

1.  **Do No Harm (The Pixel Rule):** The client-side script (`tracking.js`) runs on someone else's website. It must **never** crash their UI, block their main thread, or throw visible console errors. Wrap everything in `try/catch`.
2.  **Fail Open (The API Rule):** If the DB is down, log it and return `200 OK` to the browser. Never let a tracking error become a client-facing error.
3.  **Consent is Absolute:** If `consent.ad_storage !== 'granted'`, we do not send data to Meta. There are no "grey areas" in code.

---

## 2. Naming Conventions

We use **Domain-First** naming to keep the monolith modular.

### 2.1 Directory Structure
`src/[domain]/[layer]/[file].ts`

**Domains:**
*   `ingest`: Hono API, request validation.
*   `dispatch`: BullMQ workers, external API adapters.
*   `identity`: Hashing logic, graph resolution.
*   `tenant`: API key validation, config encryption.

**Layers:**
*   `api`: HTTP Handlers (Hono).
*   `svc`: Pure business logic (Services).
*   `repo`: Database interaction (Drizzle).
*   `job`: Queue processors.

### 2.2 File Naming
Pattern: `[domain].[layer].[role].ts`

*   ✅ `ingest.api.trackRoute.ts`
*   ✅ `dispatch.svc.metaCapiAdapter.ts`
*   ✅ `identity.util.hashNormalizer.ts`
*   ❌ `utils.ts` (Too vague)
*   ❌ `MetaService.ts` (Doesn't indicate domain)

### 2.3 Function Naming
Pattern: `[Action][Domain][Entity][Async]`

*   `validateTenantKeyAsync(...)`
*   `dispatchMetaEventAsync(...)`
*   `hashEmailSync(...)` (Sync functions don't need suffix, but explicit is better)

---

## 3. Data & Security Rules

### 3.1 PII Handling
*   **The "Hot Potato" Rule:** Raw PII (email, phone, IP) exists in memory **only** long enough to be hashed.
*   **No Logging:** Never log `req.body` if it contains raw user data. Log `event_id` instead.
*   **Encryption:** Tenant API tokens (Meta Access Token) must be encrypted at rest using `tenant.svc.crypto.ts`.

### 3.2 Database Access
*   **Tenant Isolation:** Every query **MUST** include `.where(eq(schema.tenantId, ctx.tenantId))`.
*   **ORM:** Use Drizzle ORM query builder. Raw SQL is forbidden without explicit Lead Dev approval.

### 3.3 The "Titanium Gate" (Compliance)
Any code that touches external APIs (Meta/Google) **MUST** be preceded by the Compliance Check.

```typescript
// [COMPLIANCE] The Safety Switch
if (event.consent_policy.ad_storage !== 'granted') return;
```

---

## 4. The Pixel (`src/pixel`) Rules

The client-side code has strict constraints.

1.  **Zero Dependencies:** No `npm install`. No `axios`, no `uuid`, no `lodash`. Write raw JS.
2.  **ES6 target:** We target modern browsers, but keep syntax simple.
3.  **Size Budget:** The final minified output must be **< 3KB**.
4.  **Network Resilience:** Use `navigator.sendBeacon` or `fetch` with `keepalive: true`.

---

## 5. Commenting Strategy

Do not explain *what* the code does (TypeScript does that). Explain *why*.

### 5.1 Tagging
Use these tags to flag critical logic for auditors and AI agents:

*   `// [SECURITY]`: PII hashing, Auth checks, Encryption.
*   `// [COMPLIANCE]`: Consent gates, GDPR logic.
*   `// [MULTI-TENANT]`: Tenant ID filtering.
*   `// [PERFORMANCE]`: Pixel-specific optimizations (requestAnimationFrame, etc).

**Example:**
```typescript
// [COMPLIANCE] Check consent before dispatching to 3rd party
if (!hasConsent) return;

// [SECURITY] Hash IP immediately to prevent raw storage
const ipHash = hashIp(req.header('x-forwarded-for'));
```

---

## 6. Testing Strategy

**Framework:** Vitest + Playwright.

### 6.1 Requirement for Merge
*   **Logic:** Any function modifying data shapes (hashing, normalization) needs a Unit Test.
*   **API:** Any new endpoint needs an Integration Test (Supertest).
*   **Compliance:** Any change to the Dispatcher requires running the **E2E Consent Suite** (verifying that denied consent = 0 outgoing network requests).

### 6.2 Mocking
*   Never use real API keys in tests.
*   Use `src/tests/mocks/meta.mock.ts` to simulate Ad Network responses.

---

## 7. Git Workflow

1.  **Branching:** `feature/[domain]-[short-desc]` (e.g., `feature/dispatch-linkedin`).
2.  **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`).
3.  **Review:** PRs touching `src/pixel` or `src/dispatch` require **2 approvals** due to the high risk of breaking client sites or violating GDPR.
