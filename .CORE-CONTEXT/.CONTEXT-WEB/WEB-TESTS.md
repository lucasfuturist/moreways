# High-Resolution Interface Map: `apps/web/src/tests`

## Tree: C:\projects\moreways-ecosystem\apps\web\src\tests

```
tests/
├── a11y.e2e.spec.ts
├── attribution.e2e.spec.ts
├── auth.e2e.spec.ts
├── backend-integrity.test.ts
├── intake.e2e.spec.ts
├── portal.e2e.spec.ts
├── submission.e2e.spec.ts
├── validation.e2e.spec.ts
```

---

## File Summaries

### `tests/a11y.e2e.spec.ts`
**Role:** Automated accessibility testing suite using Axe to verify compliance (WCAG) across critical pages.
**Key Exports:**
- `test('Marketing Home Page')` - Scans landing page.
- `test('Intake Start Page')` - Scans intake entry point.
- `test('Login Page')` - Scans auth screen.
**Dependencies:** `@playwright/test`, `@axe-core/playwright`.

### `tests/attribution.e2e.spec.ts`
**Role:** Verifies the telemetry pipeline, ensuring pixel events (pageview, click, lead) are correctly dispatched and captured.
**Key Exports:**
- `test('Pageview')` - Checks auto-tracking.
- `test('Signal Bridge')` - Checks URL parameter harvesting (GCLID).
- `test('Conversion')` - Checks manual event triggers.
**Dependencies:** `@playwright/test`, `window.moreways`.

### `tests/auth.e2e.spec.ts`
**Role:** Validates authentication flows, including login success, role-based redirects, and security boundaries.
**Key Exports:**
- `test('Client Login')` - Verifies dashboard access.
- `test('Lawyer Redirect')` - Checks cross-app navigation logic.
- `test('Security')` - Confirms protected route blocking.
**Dependencies:** `@playwright/test`.

### `tests/backend-integrity.test.ts`
**Role:** Integration tests for backend services (Repo, API Routes) running in a Node environment with mocks for external dependencies (DB, OpenAI).
**Key Exports:**
- `describe('Repo Fallback Safety')` - Verifies DB failure resilience.
- `describe('API Chaos')` - Fuzz tests API endpoints for stability.
**Dependencies:** `vitest`, `portalRepo`, `NextRequest`.

### `tests/intake.e2e.spec.ts`
**Role:** End-to-end test for the AI-driven intake router, verifying chat interactions and routing logic.
**Key Exports:**
- `test('Happy Path')` - Checks chat-to-form redirection.
- `test('Clarification Path')` - Checks AI follow-up questions.
**Dependencies:** `@playwright/test`.

### `tests/portal.e2e.spec.ts`
**Role:** Verifies the client portal functionality, including dashboard rendering, claim listing, and detail views.
**Key Exports:**
- `test('Dashboard loads list')` - Checks data display.
- `test('View Claim Details')` - Checks navigation and sensitive data rendering.
**Dependencies:** `@playwright/test`.

### `tests/submission.e2e.spec.ts`
**Role:** Tests the formal form runner (non-chat mode), validating input handling, validation rules, and submission API calls.
**Key Exports:**
- `test('Switch to Form View')` - Checks UI mode toggling.
- `test('Validation')` - Verifies required field blocking.
**Dependencies:** `@playwright/test`.

### `tests/validation.e2e.spec.ts`
**Role:** Verifies the AI Judge integration, checking that valid claims receive a "Likely Violation" verdict and blocking scenarios work as expected.
**Key Exports:**
- `test('Strong Case verdict')` - Checks positive validation flow.
- `test('fail open')` - Checks error handling during validation outages.
**Dependencies:** `@playwright/test`.