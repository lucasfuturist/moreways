
# argueOS Formgen Testing Strategy**

## 🎯 Purpose

This document defines how tests are written, organized, named, and executed inside the argueOS Formgen repo.
It ensures:

* predictable quality
* consistent patterns across domains (intake, forms, CRM, LLM, infra)
* safe integration with agents (AI or human)
* reliability as the system grows

---

# **1. Testing Framework**

We use:

* **Vitest** (recommended)
  or
* **Jest** (fallback if needed)

Why Vitest?

* blazing fast
* TS-native
* matches Vite ecosystem
* great mocking + snapshot support

Install:

```bash
pnpm add -D vitest @types/node
```

Add script:

```json
"scripts": {
  "test": "vitest --run",
  "test:watch": "vitest"
}
```

---

# **2. Test Folder Structure**

All tests live in:

```
src/tests/
```

Each test file is named after its feature:

```
src/tests/intake.svc.IntakePromptToFormPipeline.test.ts
src/tests/llm.svc.LlmGenerateFormFromPromptAsync.test.ts
src/tests/forms.repo.FormSchemaRepo.test.ts
src/tests/intake.api.createFormFromPromptRoute.test.ts
```

This naming pattern mirrors the code tree:

```
src/<domain>/<layer>/<file>.ts
```

So tests remain:

* searchable
* auto-discoverable
* predictable for agents

---

# **3. Types of Tests**

## **3.1 Unit Tests (80% of tests)**

Unit tests verify single functions or modules:

Examples:

* `formSchemaNormalizer` — ensures shapes normalize predictably
* `jsonParseSafe` — ensures malformed LLM responses fail gracefully
* `FormSchemaRepo.createVersion` — ensures version increment logic works
* `LlmGenerateFormFromPromptAsync` — mock vendor call, test transform

Unit tests:

* **NEVER hit the database**
* rely on in-memory mocks
* never use real LLM calls
* are deterministic

---

## **3.2 Domain Integration Tests (15%)**

These verify multiple services working together **without** external systems.

Example:

`IntakePromptToFormPipeline.test.ts`

* mock LLM
* mock repo persistence
* mock logger
* run through entire pipeline:

```
prompt → normalized → llm → validated schema → normalized schema → versioned → returned
```

Goal:

* ensure vertical logic is intact
* ensure all steps execute in correct order
* ensure failures propagate correctly

---

## **3.3 API Route Tests (5%)**

Examples:

* `intake.api.createFormFromPromptRoute.test.ts`

We use **supertest** (or built-in Next.js test utils) to:

* call API route
* supply req/res mocks
* assert:

  * auth
  * validation
  * response shape
  * HTTP codes

These are **not** e2e tests.
They are “API surface unit tests.”

---

# **4. Mocking Conventions**

## **4.1 LLM Mocks**

Location:

```
src/tests/mocks/llm.mock.ts
```

Expose:

```ts
export const mockLLMResponse = {
  fields: [...],
  required: [...],
  metadata: {...}
}
```

LLM functions must use dependency injection so tests can override:

```ts
LlmGenerateFormFromPromptAsync(prompt, { llmClient: mockLLM })
```

Never mock inside the test file.
Always mock from `/tests/mocks`.

---

## **4.2 Repo Mocks**

Location:

```
src/tests/mocks/repo.mock.ts
```

Purpose:

* simulate DB insert/read
* return deterministic objects
* test multi-tenancy behavior

Repos should use interfaces so tests can inject mocks:

```ts
new FormSchemaRepo({ db: mockDB })
```

---

## **4.3 Infra Mocks**

For:

* envConfig
* logger

Environment:

```ts
vi.mock("../../infra/config/infra.svc.envConfig.ts")
vi.mock("../../infra/logging/infra.svc.logger.ts")
```

The logger mock must **never** print to console during tests.

---

# **5. Snapshot Tests (optional)**

Useful for:

* JSON schema generation from LLM
* form preview snapshots
* version comparison

Pattern:

```ts
expect(normalizedSchema).toMatchSnapshot()
```

Snapshots live beside the test file.

---

# **6. Required Tests Per Feature**

Any new `.ts` file that contains logic MUST be paired with a test.

### **6.1 For any new service file (`*.svc.*.ts`)**

Tests must cover:

* happy path
* invalid input
* dependency failure
* output shape

### **6.2 For any repo file (`*.repo.*.ts`)**

Tests must cover:

* create / get / version logic
* multi-tenant checks
* failure paths
* shape persistence

### **6.3 For any util file**

Tests must cover:

* deterministic behavior
* edge cases
* invalid input
* unexpected shapes

### **6.4 For any LLM-facing file**

Tests must cover:

* transform logic
* JSON parsing
* error handling
* fallback behavior (mock mode)

---

# **7. Running Tests**

### Full test run:

```bash
pnpm test
```

### Watch mode:

```bash
pnpm test:watch
```

### Run single file:

```bash
pnpm test src/tests/llm.svc.LlmGenerateFormFromPromptAsync.test.ts
```

---

# **8. CI Integration (Future)**

You can add:

* GitHub Actions workflow
* lint + typecheck + test before merge
* test coverage threshold (e.g., 80%)

Example minimal CI config:

```
.github/workflows/test.yml
```

---

# **9. Principle: Tests Describe Behavior**

Tests exist not just to catch bugs but to **define contracts.**

* behavior before code
* correctness before optimization
* clarity before cleverness
* no mocking internal behavior (only external boundaries)
