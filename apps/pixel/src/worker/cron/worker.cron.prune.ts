// File: src/worker/cron/worker.cron.prune.ts
// Role: GDPR Data Minimization (The Janitor)

import { db } from '../../core/db';
import { events, complianceLogs, quarantine } from '../../core/db/core.db.schema';
import { lt, eq } from 'drizzle-orm';

export async function pruneOldData() {
  const RETENTION_DAYS = 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

  console.log(`[Janitor] Starting prune for data older than ${cutoffDate.toISOString()}`);

  try {
    // 1. Prune Raw Events (The heavy table)
    // We intentionally do NOT delete Identities (the graph needs to persist),
    // but we delete the raw granular event history.
    const deletedEvents = await db.delete(events)
      .where(lt(events.createdAt, cutoffDate))
      .returning({ id: events.id });

    // 2. Prune Quarantine (Junk data)
    // Keep this shorter, maybe 30 days.
    const quarantineCutoff = new Date();
    quarantineCutoff.setDate(quarantineCutoff.getDate() - 30);
    
    await db.delete(quarantine)
      .where(lt(quarantine.createdAt, quarantineCutoff));

    // 3. Prune Compliance Logs?
    // NO. Legal logs usually need to be kept for 1-7 years depending on jurisdiction.
    // We skip this table.

    console.log(`[Janitor] Pruned ${deletedEvents.length} old events.`);
  } catch (err) {
    console.error('[Janitor] Prune failed:', err);
  }
}