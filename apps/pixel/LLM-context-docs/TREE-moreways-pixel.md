# File Scan

**Roots:**

- `C:\projects\moreways\attribution-engine`


## Tree: C:\projects\moreways\attribution-engine

```
attribution-engine/

├── .dockerignore
├── .env
├── .env.example
├── .github/
│   ├── workflows/
├── .gitignore
├── Dockerfile
├── LLM-context-docs/
│   ├── TREE-moreways-pixel.md
│   ├── docker-moreways-pixel.md
│   ├── docs-moreways-pixel.md
│   ├── src-moreways-pixel.md
│   ├── tests-moreways-docker.md
│   ├── tests-moreways-pixel.md
├── README.md
├── context-setting/
│   ├── context_setter_projects.md
│   ├── moreways-context-summary.md
│   ├── supabase-cols-context.md
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.worker
├── docker-compose.yml
├── docs/
│   ├── 01-attribution-technical-vision.md
│   ├── 02-attribution-data-and-api.md
│   ├── 03-attribution-pixel-logic.md
│   ├── 04-attribution-security-and-compliance.md
│   ├── 05-attribution-testing.md
│   ├── 06-attribution-project-structure.md
│   ├── 07-attribution-platform-integrations.md
│   ├── 08-attribution-observability.md
│   ├── 09-attribution-dev-rules.md
│   ├── 10-client-integration-guide.md
│   ├── 11-technical-validation-and-stress-test-report.md
│   ├── 12-marketing-ops-and-tracking-sop.md
│   ├── 13-database-bootstrap-guide.md
├── drizzle.config.ts
├── main.tf
├── migrations/
│   ├── 0000_closed_the_twelve.sql
│   ├── meta/
│   │   ├── 0000_snapshot.json
│   │   ├── _journal.json
├── package-lock.json
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── public/
│   ├── index.global.js
│   ├── test.html
│   ├── tracking.js
├── scripts-ps1/
│   ├── chaos.ps1
├── scripts-ts/
│   ├── dashboard-simulator.ts
├── src/
│   ├── api/
│   │   ├── index.ts
│   ├── core/
│   │   ├── db/
│   │   │   ├── core.db.client.ts
│   │   │   ├── core.db.schema.ts
│   │   │   ├── index.ts
│   │   │   ├── migrate.ts
│   │   ├── util/
│   │   │   ├── core.util.logger.ts
│   ├── dispatch/
│   │   ├── job/
│   │   │   ├── dispatch.job.processor.ts
│   │   ├── svc/
│   │   │   ├── adapters/
│   │   │   │   ├── dispatch.adapter.google.ts
│   │   │   │   ├── dispatch.adapter.linkedin.ts
│   │   │   │   ├── dispatch.adapter.meta.ts
│   │   │   │   ├── dispatch.adapter.tiktok.ts
│   │   │   ├── dispatch.svc.crm.ts
│   │   │   ├── dispatch.svc.geo.ts
│   │   │   ├── dispatch.svc.google.ts
│   │   │   ├── dispatch.svc.meta.ts
│   │   │   ├── dispatch.svc.rehydrate.ts
│   │   │   ├── dispatch.svc.types.ts
│   │   │   ├── dispatch.svc.viral.ts
│   │   │   ├── dispatch.svc.webhook.ts
│   ├── identity/
│   │   ├── svc/
│   │   │   ├── identity.svc.hashing.ts
│   │   │   ├── identity.svc.merge.ts
│   │   ├── util/
│   ├── ingest/
│   │   ├── api/
│   │   │   ├── ingest.api.controller.ts
│   │   │   ├── ingest.api.offline.ts
│   │   │   ├── ingest.api.read.ts
│   │   ├── types/
│   │   │   ├── ingest.types.offline.ts
│   │   │   ├── ingest.types.payload.ts
│   ├── pixel/
│   │   ├── index.ts
│   │   ├── lib/
│   │   │   ├── pixel.lib.browser.ts
│   │   │   ├── pixel.lib.network.ts
│   ├── privacy/
│   │   ├── api/
│   │   │   ├── privacy.api.erasure.ts
│   ├── reporting/
│   │   ├── api/
│   │   │   ├── reporting.api.evidence.ts
│   │   │   ├── reporting.api.stats.ts
│   │   ├── svc/
│   │   │   ├── reporting.svc.modeler.ts
│   │   │   ├── reporting.svc.source.ts
│   ├── tenant/
│   │   ├── repo/
│   │   │   ├── tenant.repo.keys.ts
│   │   ├── svc/
│   │   │   ├── tenant.svc.crypto.ts
│   ├── worker/
│   │   ├── cron/
│   │   │   ├── worker.cron.prune.ts
│   │   ├── index.ts
├── tests/
│   ├── e2e/
│   │   ├── pixel.spec.ts
│   ├── integration/
│   │   ├── api.quarantine.test.ts
│   │   ├── api.security.test.ts
│   │   ├── api.test.ts
│   │   ├── compliance.chaos.test.ts
│   │   ├── identity.merge.test.ts
│   │   ├── offline.callrail.test.ts
│   │   ├── offline.test.ts
│   │   ├── reporting.evidence.test.ts
│   │   ├── reporting.stats.test.ts
│   │   ├── resilience.test.ts
│   │   ├── worker.concurrency.test.ts
│   │   ├── worker.crm.test.ts
│   │   ├── worker.webhook.test.ts
│   ├── load/
│   │   ├── ingest.load.js
│   ├── mocks/
│   │   ├── meta.mock.ts
│   ├── unit/
│   │   ├── compliance.test.ts
│   │   ├── cron.prune.test.ts
│   │   ├── google.test.ts
│   │   ├── identity.test.ts
│   │   ├── legal.test.ts
│   │   ├── logic.test.ts
│   │   ├── reporting.test.ts
│   │   ├── viral.test.ts
│   │   ├── webhook.service.test.ts
├── tsconfig.json
├── vitest.config.ts

```
