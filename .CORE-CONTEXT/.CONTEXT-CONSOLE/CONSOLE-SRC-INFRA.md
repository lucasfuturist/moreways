--- START OF FILE CONSOLE-SRC-INFRA.md ---

# High-Resolution Interface Map

## Tree: `apps/console/src/infra`

```
infra/
├── audit/
│   ├── infra.svc.audit.ts
├── config/
│   ├── infra.config.env.ts
│   ├── infra.svc.envConfig.ts
├── db/
│   ├── infra.repo.dbClient.ts
│   ├── infra.repo.migrationsRunner.ts
├── logging/
│   ├── infra.svc.logger.ts
│   ├── infra.svc.promptLogger.ts
├── security/
│   ├── security.svc.encryption.ts
│   ├── security.svc.rateLimiter.ts
├── ui/
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useOs.ts
```

## File Summaries

### `audit/infra.svc.audit.ts`
**Role:** Implements an immutable audit trail service for tracking sensitive system events like PII access and schema modifications.
**Key Exports:**
- `AuditService` - Singleton object containing the `log(entry)` method.
- `AuditAction` - Type definition for tracked events (`PII_ACCESS`, `LOGIN_FAILURE`, etc.).
- `AuditEntry` - Interface for the structured log payload.
**Dependencies:** `logger`.

### `config/infra.config.env.ts`
**Role:** Centralized configuration loader that parses environment variables using Zod, implementing a "Fail Open" strategy to prevent build crashes in missing-env contexts.
**Key Exports:**
- `envConfig` - The parsed configuration object (or mock values if validation fails during build).
**Dependencies:** `zod`.

### `config/infra.svc.envConfig.ts`
**Role:** Validates runtime environment variables against a strict schema and maps them to a normalized camelCase configuration object.
**Key Exports:**
- `env` - The global configuration object containing keys like `databaseUrl`, `encryptionKey`, `nodeEnv`, and `lawServiceUrl`.
**Dependencies:** `zod`.

### `db/infra.repo.dbClient.ts`
**Role:** Instantiates and exports a singleton Prisma Client to ensure a single database connection pool across the application.
**Key Exports:**
- `db` - The global `PrismaClient` instance, configured with logging based on the environment.
**Dependencies:** `PrismaClient`, `env`, `logger`.

### `db/infra.repo.migrationsRunner.ts`
**Role:** *Placeholder.* Intended to handle programmatic database migration execution.
**Key Exports:**
- *None (Empty File)*
**Dependencies:** *None*

### `logging/infra.svc.logger.ts`
**Role:** Provides a structured logging service with automatic PII redaction and support for contextual metadata (Organization ID, Request ID).
**Key Exports:**
- `logger` - Object exposing standard log methods (`info`, `warn`, `error`, `debug`).
- `LogContext` - Interface for passing contextual tracing data.
**Dependencies:** None (Wraps `console`).

### `logging/infra.svc.promptLogger.ts`
**Role:** Specialized logger that writes raw LLM interactions (prompts and responses) to a local JSONL file for auditing and debugging.
**Key Exports:**
- `logLlmInteraction(entry)` - Appends a structured interaction log to the file system asynchronously.
**Dependencies:** `fs`, `path`.

### `security/security.svc.encryption.ts`
**Role:** Provides utilities for symmetric encryption (AES-256-GCM) to protect sensitive data at rest.
**Key Exports:**
- `EncryptionService` - Object containing `encrypt(text)` and `decrypt(packed)` methods.
- `EncryptedPayload` - Type definition for the internal structure of encrypted data (IV, content, tag).
**Dependencies:** `crypto`, `env`.

### `security/security.svc.rateLimiter.ts`
**Role:** Implements a lightweight, in-memory IP-based rate limiter to protect API routes from abuse.
**Key Exports:**
- `RateLimiter` - Object containing the `check(config)` method which throws an error if limits are exceeded.
**Dependencies:** `next/headers`.

### `ui/hooks/useDebounce.ts`
**Role:** React hook that delays updating a value until a specified time has passed without further changes.
**Key Exports:**
- `useDebounce(value, delay)` - Returns the debounced version of the input value.
**Dependencies:** `React`.

### `ui/hooks/useLocalStorage.ts`
**Role:** React hook for persisting state to `localStorage` with support for hydration and updates across key changes.
**Key Exports:**
- `useLocalStorage(key, initialValue)` - Returns `[storedValue, setValue, isHydrated]`.
**Dependencies:** `React`.

### `ui/hooks/useOs.ts`
**Role:** React hook that detects the user's operating system to provide appropriate keyboard shortcuts (e.g., Command vs Ctrl).
**Key Exports:**
- `useOs()` - Returns the detected OS (`mac`, `windows`, `other`) and the appropriate meta key symbol.
**Dependencies:** `React`.