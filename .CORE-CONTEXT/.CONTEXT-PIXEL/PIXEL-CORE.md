# File Scan: `apps/pixel/src/core`

## Tree: C:\projects\moreways-ecosystem\apps\pixel\src\core

```
core/

├── db/
│   ├── core.db.client.ts
│   ├── core.db.schema.ts
│   ├── index.ts
│   ├── migrate.ts
├── util/
│   ├── core.util.logger.ts
```

## Files

### `core/db/core.db.schema.ts`
**Role:** Defines the Drizzle ORM schema for the Postgres database, including tenants, identities, events, compliance logs, and the quarantine safety net.
**Key Exports:**
- `tenants`, `identities`, `events`, `complianceLogs`, `quarantine` - Table definitions.
- `eventTypeEnum` - Enum for tracking event types (pageview, purchase, etc.).
- Relations (`tenantRelations`, `identityRelations`, etc.) - Defined relationships for ORM queries.
**Dependencies:** `drizzle-orm`.

### `core/db/index.ts`
**Role:** Establishes the database connection using `postgres.js` and initializes the Drizzle ORM instance with the schema.
**Key Exports:**
- `db` - The initialized Drizzle database client.
**Dependencies:** `drizzle-orm`, `postgres`, `core.db.schema`, `dotenv-safe`.

### `core/db/migrate.ts`
**Role:** Provides a programmatic way to run database migrations on application startup, referencing the `./migrations` folder.
**Key Exports:**
- `runMigrations(): Promise<void>` - Executes pending migrations.
**Dependencies:** `drizzle-orm`, `db`.

### `core/util/core.util.logger.ts`
**Role:** Configures a structured JSON logger (Pino) with automatic redaction of sensitive fields (email, phone, keys) and pretty-printing in development.
**Key Exports:**
- `logger` - The configured Pino logger instance.
**Dependencies:** `pino`.

### `core/db/core.db.client.ts`
*File present in tree but content provided was empty.*