# File Scan: `apps/pixel/src/api`

## Tree: C:\projects\moreways-ecosystem\apps\pixel\src\api

```
api/

├── index.ts
```

## Files

### `api/index.ts`
**Role:** Entry point for the Hono-based Pixel application server, responsible for middleware configuration (CORS, Security), executing database migrations on startup, and mounting authentication logic and API routes.
**Key Exports:** None (Module executes `startServer()` as a side-effect).
**Dependencies:** `hono`, `@hono/node-server`, `drizzle-orm`, `db`, `runMigrations`, `trackRoute`, `readRoute`, `privacyRoute`, `statsRoute`, `evidenceRoute`, `offlineRoute`.