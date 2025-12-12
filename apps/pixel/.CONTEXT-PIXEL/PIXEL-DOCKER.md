# File Scan: `apps/pixel/docker`

## Tree: C:\projects\moreways-ecosystem\apps\pixel\docker

```
docker/

├── Dockerfile.api
├── Dockerfile.worker
```

## Files

### `docker/Dockerfile.api`
**Role:** Configuration for building and deploying the API container, handling dependency installation, migration assets, and the build step for the client-side pixel script (`tracking.js`).
**Key Exports:**
- `CMD` - Executes `npx tsx src/api/index.ts` to start the HTTP server.
**Dependencies:** `node:20-slim`, `pnpm`, `src/api`, `migrations`, `public` assets.

### `docker/Dockerfile.worker`
**Role:** Configuration for building and deploying the Worker container, optimized for background processing without exposing HTTP ports.
**Key Exports:**
- `CMD` - Executes `npx tsx src/worker/index.ts` to start the job processor.
**Dependencies:** `node:20-slim`, `pnpm`, `src/worker`.