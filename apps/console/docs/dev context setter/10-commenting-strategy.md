# argueOS – Commenting Strategy (v1)

This document defines the commenting conventions used across the argueOS codebase.  
Comments exist to clarify intent, encode business rules, and link code to the written specifications — not to restate obvious TypeScript facts.

This strategy applies to **services**, **repos**, **pipelines**, **infra**, and any non-trivial module.

---

## 1. High-Level Module Header

Every important file begins with a **short doc block** describing:

- **What the module is**
- **Which specs it aligns with** (e.g., Product Spec, Data/API Spec, FAT, Security Policy)
- **Any critical guarantees**, such as:
  - multi-tenancy requirements  
  - PII handling constraints  
  - LLM safety considerations  

**Example:**

```ts
/**
 * IntakePromptToFormPipeline
 *
 * Pipeline: prompt → normalized → LLM draft → validated schema → persisted version.
 *
 * Related docs:
 * - 01-product-spec-v1.md
 * - 03-security-and-data-handling.md
 * - 06-fat-v1-prompt-to-preview.md
 *
 * Guarantees:
 * - enforces organization scoping
 * - validates & normalizes LLM output before writing to DB
 */
````

---

## 2. Section Tags for Important Logic

Use **tagged comments** instead of long prose. These markers make critical logic easy to locate during audits, debugging, or agent runs.

* `// [SECURITY]` – org scoping, auth checks, PII handling
* `// [MULTI-TENANT]` – queries or repos involving `organizationId`
* `// [PIPELINE]` – pipeline wiring or step boundaries
* `// [LLM]` – LLM calls, parsing, schema validation

**Example:**

```ts
// [SECURITY] ensure authenticated user belongs to organizationId
```

These tags become fast reference points throughout the codebase.

---

## 3. Pipeline Step Comments

For pipeline modules (e.g., `IntakePromptToFormPipeline`), use **short, numbered comments** that mirror the FAT workflow.

**Example:**

```ts
// [PIPELINE] Step 01 – normalize prompt
// [PIPELINE] Step 02 – call LLM
// [PIPELINE] Step 03 – validate & normalize schema
// [PIPELINE] Step 04 – persist schema
// [PIPELINE] Step 05 – emit events
```

No essays.
Just clean signal flow.

---

## 4. Avoid “Type Echo” Comments

Do **not** comment things TypeScript already expresses.

### ❌ Bad

```ts
// id of the form
id: string;

// returns a promise
async function doThing() { ... }
```

### ✔️ Good

Comment only when:

* There’s a **business rule**

  * e.g., *“reject prompts that request unrelated legal areas”*
* There’s a **security requirement**

  * e.g., *“must check orgId to prevent cross-tenant access”*
* There’s a **non-obvious implementation detail**

  * e.g., *“coerce to array because LLM sometimes returns single object”*

Comments should clarify *intent*, not restate syntax.

---

## 5. Tie Back to Specs When It Matters

If a line of code directly encodes a rule from the written specs, link it once with a tag.

**Example:**

```ts
// [SECURITY] Enforce org scoping per 03-security-and-data-handling.md
```

This keeps code and documentation in sync without adding noise.

---

## Summary

Use comments to:

* explain **intent**, not syntax
* mark **security**, **multi-tenant**, **pipeline**, and **LLM** boundaries
* establish a repeatable structure for all modules
* maintain traceability back to the formal specs

This approach keeps the codebase **auditable**, **agent-friendly**, and **future-proof** as argueOS grows.

