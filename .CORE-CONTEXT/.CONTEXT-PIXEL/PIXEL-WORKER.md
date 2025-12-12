# File Scan: `apps/pixel/src/worker`

## Tree: C:\projects\moreways-ecosystem\apps\pixel\src\worker

```
worker/

├── cron/
│   ├── worker.cron.prune.ts
├── index.ts
```

## Files

### `worker/index.ts`
**Role:** Entry point for the background service that initializes BullMQ workers for event processing and schedules recurring system maintenance tasks.
**Key Exports:** None (Executes `initScheduler` and starts workers).
**Dependencies:** `bullmq`, `processEventJob`, `pruneOldData`.

### `worker/cron/worker.cron.prune.ts`
**Role:** Scheduled maintenance task ("The Janitor") enforcing data retention policies by permanently deleting old raw events and quarantine records.
**Key Exports:**
- `pruneOldData(): Promise<void>` - Deletes records exceeding the configured retention window (90 days for events, 30 days for quarantine).
**Dependencies:** `db`, `events`, `quarantine`.