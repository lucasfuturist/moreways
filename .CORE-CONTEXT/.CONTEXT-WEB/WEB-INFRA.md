# High-Resolution Interface Map: `apps/web/src/infra`

## Tree: `apps/web/src/infra`

```
infra/
├── config/
│   ├── infra.config.env.ts
├── db/
│   ├── client.ts
│   ├── schema.ts
├── logging/
│   ├── infra.svc.logger.ts
```

## File Summaries

### `infra/config/infra.config.env.ts`
**Role:** Centralized configuration loader that validates environment variables against a strict schema before app startup.
**Key Exports:**
- `envConfig` - Validated object containing type-safe configuration values (e.g., `DATABASE_URL`, `OPENAI_API_KEY`).
**Dependencies:** `zod`.

### `infra/db/client.ts`
**Role:** Initializes the active database connection pool using Drizzle ORM and the Postgres driver, optimized for serverless environments (prefetch disabled).
**Key Exports:**
- `db` - The Drizzle client instance configured with the schema, ready for query execution.
**Dependencies:** `drizzle-orm`, `postgres`, `schema`.

### `infra/db/schema.ts`
**Role:** Defines the database structure, mapping TypeScript objects to PostgreSQL tables for user management, legal claims, and intake form definitions.
**Key Exports:**
- `eventTypeEnum` - Shared enum definition for analytics event types.
- `users` - Table definition mapping to `portal_users` (Auth & Profile data).
- `claims` - Table definition mapping to `portal_claims` (Legal case data).
- `formSchemas` - Table definition mapping to `form_schemas` (Published intake templates).
**Dependencies:** `drizzle-orm/pg-core`.

### `infra/logging/infra.svc.logger.ts`
**Role:** A structured logging service wrapper ensuring all application logs include standard context (timestamp, organization ID).
**Key Exports:**
- `logger` - Singleton instance providing methods for `info` and `error` logging levels.
**Dependencies:** None (Native Console).