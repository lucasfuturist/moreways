# Attribution Engine – Testing Strategy (v1.0)

**Objective:** Validate ingestion reliability, data integrity, and strict compliance enforcement without manual verification.

---

## 1. Unit Tests (Logic & Hashing)

**Tool:** Vitest
**Location:** `src/core/tests/*.test.ts`

Focus on the pure functions that handle sensitive data and consent logic.

*   **PII Normalization:** Verify `normalizeEmail("  User+Tag@Example.COM ")` returns `user@example.com` before hashing.
*   **Hashing Determinism:** Verify the SHA-256 implementation produces the exact same hash for the same input across different server reboots (ensure Salt handling is correct).
*   **Consent Evaluator:**
    *   Input: `{ ad_storage: 'denied' }` -> Output: `canDispatchToMeta: false`
    *   Input: `{ ad_storage: 'granted' }` -> Output: `canDispatchToMeta: true`

## 2. Integration Tests (API Layer)

**Tool:** Vitest + Supertest (HTTP Client)
**Location:** `src/ingest/tests/*.test.ts`

Focus on the Hono API endpoints and Database interactions.

*   **Ingestion Contract:**
    *   `POST /api/v1/track` with valid payload -> Returns 200 OK + `eventId`.
    *   Query DB -> Ensure `events` table contains the row.
    *   **Crucial:** Ensure raw PII is **NOT** present in the DB row, only the hash.
*   **Security Headers:**
    *   Send request with invalid `x-publishable-key` -> Expect 401 Unauthorized.
    *   Send payload > 10KB -> Expect 413 Payload Too Large.

## 3. The "Full Circuit" E2E Test (Black Box)

**Tool:** Playwright
**Setup:**
1.  Spin up the Hono Engine locally (Port 3000).
2.  Serve a dummy HTML page with `tracking.js` injected (Port 8080).
3.  Spin up a Mock Server to simulate Facebook CAPI (Port 4000).

### Scenario A: The "AdBlocker" Simulation (Proxy Fallback)
1.  **Mock:** Configure network to block requests to `localhost:3000` (The Engine).
2.  **Action:** Page calls `tracking.js` initialization.
3.  **Assert:** Script detects error, retries via `/api/telemetry` (The Proxy path).
4.  **Assert:** Engine receives data via the Proxy route.

### Scenario B: The "Compliance Gate" (Consent Denied)
1.  **Action:** Playwright loads page.
2.  **Action:** Sets `window.MW_CONSENT = { ad_storage: 'denied' }`.
3.  **Action:** Submits a form with `email: test@example.com`.
4.  **Verification (Internal):** Query the Engine DB. Confirm lead exists (for billing).
5.  **Verification (External):** Check Mock Facebook Server logs. Confirm **0 requests received**.

### Scenario C: The "Happy Path" (Consent Granted)
1.  **Action:** Playwright loads page.
2.  **Action:** Sets `document.cookie = "_fbp=fb.1.test_cookie"`.
3.  **Action:** Sets `window.MW_CONSENT = { ad_storage: 'granted' }`.
4.  **Action:** Submits form.
5.  **Verification:** Check Mock Facebook Server. Confirm request received **AND** payload contains `user_data.fbp = 'fb.1.test_cookie'`.

---

## 4. Load Testing

**Tool:** K6
**Target:** Ingestion API (`POST /track`)

*   **Goal:** Prove the system handles 1,000 req/sec (typical ad burst) with <50ms response time.
*   **Scenario:** 500 concurrent virtual users sending pageview events.
*   **Success Criteria:** p95 latency < 100ms, 0% Error Rate.
