# 09 – Commenting Standards

**Status:** Active  
**Version:** 1.0  
**Applies To:** All Source Code

## 1. Core Philosophy: Intent Over Syntax
We do not use comments to restate what TypeScript types already define. We use comments to explain **Legal Reasoning**, **Architectural Intent**, and **Safety Constraints**.

### ❌ Bad (Redundant)
```typescript
// Function to parse the PDF
// Returns a Promise
async function parsePdf(file: Buffer): Promise<void> { ... }
```

### ✅ Good (Intent-Focused)
```typescript
/**
 * IngestParseDocumentAsync
 * 
 * Implements the "Stack Machine" logic to convert raw PDF streams into 
 * a hierarchical JSON tree.
 * 
 * Guarantees:
 * - Idempotency via content hashing
 * - Zonal filtering of Headers/Footers
 * 
 * Ref: Spec 03 - Ingestion Protocol
 */
async function IngestParseDocumentAsync(file: Buffer): Promise<void> { ... }
```

## 2. Semantic Tags
Use these standardized tags to allow developers and AI agents to quickly grep for critical logic blocks.

| Tag | Usage Context |
| :--- | :--- |
| `// [PROFILE]` | Logic specific to a jurisdiction's formatting (e.g., "MA CMR uses (1) before (a)"). |
| `// [LINTER]` | Code enforcing data integrity (e.g., checking broken cross-references). |
| `// [OVERRIDE]` | Safety logic regarding Judicial Overrides or Kill Switches. |
| `// [LLM]` | Blocks involving Prompt Engineering, Zod Schema definitions, or Token Management. |
| `// [SCD]` | Logic handling "Slowly Changing Dimensions" (Time travel/Versioning). |
| `// [SECURITY]` | Auth checks, PII redaction, or encryption logic. |

**Example:**
```typescript
// [PROFILE] Massachusetts Regulation (CMR)
// MA hierarchy implies that (1) is a subsection of a Section, whereas Federal (a) is a paragraph.
const isMaSection = /^\d{1,2}\.\d{2}:/.test(line);
```

## 3. Pipeline Step Markers
In complex pipeline files (e.g., `ingest.svc.pipeline.ts`), use numbered step markers. This mirrors the architectural diagrams in Spec 01.

```typescript
// [PIPELINE] Step 01 - Normalize Unicode & Ligatures
const cleanText = sanitize(rawText);

// [PIPELINE] Step 02 - Detect Indentation Level
const level = detectLevel(cleanText, profile);

// [PIPELINE] Step 03 - Stack Operation (Push/Pop)
if (level > currentDepth) stack.push(node);
```

## 4. Spec Linking
If a block of code exists specifically to satisfy a requirement in the `docs/specs/` folder, link to it. This creates a bi-directional trace between Code and Documentation.

```typescript
// Implements Spec 02 - Data Schema (Validity Range Exclusion)
// Ensures we never have two active versions of the same URN at the same time.
await db.rpc('enforce_validity_range', { urn });
```

## 5. Zod Schema Comments
When defining Zod schemas for LLM extraction, comments are functional—they are often passed to the LLM to guide generation. Keep them descriptive.

```typescript
const LogicSummarySchema = z.object({
  // The entity performing the action (e.g., "Landlord", "Telemarketer")
  actor: z.string(),
  
  // The specific prohibition or obligation (e.g., "Must pay interest")
  action: z.string(),
  
  // [LLM] Extract exact citations for exceptions, do not hallucinate URNs
  exceptions: z.array(z.string())
});
```
