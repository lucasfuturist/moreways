# High-Resolution Interface Map: `apps/web/src/lib`

## Tree: C:\projects\moreways-ecosystem\apps\web\src\lib

```
lib/
├── api-hooks.test.ts
├── api-hooks.ts
├── argueos-client.ts
├── motion-config.ts
├── types/
│   ├── argueos-types.ts
│   ├── website.types.ts
│   ├── window.d.ts
├── utils.ts
```

---

## File Summaries

### `lib/api-hooks.ts`
**Role:** Defines Zod validation schemas for inbound webhooks and CRM data exchanges to ensure payload integrity.
**Key Exports:**
- `StatusWebhookSchema` - Validator for status updates pushed from external CRMs.
- `ClaimExportSchema` - Validator for claim data packages requested by external systems.
- `StatusWebhookPayload` - TypeScript inference of the webhook body.
**Dependencies:** `zod`.

### `lib/argueos-client.ts`
**Role:** Isomorphic HTTP client responsible for fetching form definitions from the backend and submitting intake data via local proxies.
**Key Exports:**
- `argueosClient` - Singleton instance of the client.
- `getFormBySlug(slug): Promise<PublicFormResponse | null>` - Server-side fetcher using private API keys.
- `submitForm(payload): Promise<any>` - Client-side submitter using the public API proxy.
**Dependencies:** `PublicFormResponse` (Type), `SERVER_API_BASE` (Env).

### `lib/motion-config.ts`
**Role:** A React hook that provides responsive Framer Motion animation variants, optimizing performance by disabling complex effects on mobile.
**Key Exports:**
- `useMotionConfig(): ConfigObject` - Returns animation props (`fadeProps`, `staggerContainerProps`) tailored to the current viewport.
**Dependencies:** `useIsMobile`, `framer-motion`.

### `lib/utils.ts`
**Role:** Standard utility for conditionally merging Tailwind CSS class names.
**Key Exports:**
- `cn(...inputs): string` - Merges class lists using `clsx` and `tailwind-merge`.
**Dependencies:** `clsx`, `tailwind-merge`.

### `lib/types/argueos-types.ts`
**Role:** The core domain definitions for the dynamic form engine, specifying field types, logic operators, and schema structures.
**Key Exports:**
- `FormFieldDefinition` - Interface for a single form input's configuration.
- `FormSchemaJson` - Interface for the complete form structure and field order.
- `LogicCondition` - Interface for conditional visibility rules.
**Dependencies:** None.

### `lib/types/window.d.ts`
**Role:** Global type declaration extending the browser's `Window` interface to support the custom telemetry SDK.
**Key Exports:**
- `Window` (Interface Extension) - Adds typing for `window.moreways` and `window.MW_CONFIG`.
**Dependencies:** None.