// File: src/reporting/api/reporting.api.evidence.ts
// Domain: Reporting
// Role: "The Evidence Locker" - Forensic Data Export for Disputes

import { Hono } from 'hono';
import { db } from '../../core/db';
import { events, identities, complianceLogs } from '../../core/db/core.db.schema';
import { eq, desc } from 'drizzle-orm';

const app = new Hono<{ Variables: { tenantId: string } }>();

// GET /api/v1/evidence/:anonymousId
// Restricted to Admin/Tenant Backend
app.get('/:anonymousId', async (c) => {
  const tenantId = c.get('tenantId');
  const anonymousId = c.req.param('anonymousId');

  // 1. Resolve Identity
  const identity = await db.query.identities.findFirst({
    where: (t, { and, eq }) => and(eq(t.tenantId, tenantId), eq(t.anonymousId, anonymousId))
  });

  if (!identity) {
    return c.json({ found: false, message: 'Identity not found' }, 404);
  }

  // 2. Fetch The Entire Ledger for this User
  const history = await db.query.events.findMany({
    where: eq(events.identityId, identity.id),
    orderBy: [desc(events.createdAt)],
    // Fetch critical forensic fields
    columns: {
      id: true,
      type: true,
      createdAt: true,
      contextClient: true,  // IP Hash, User Agent
      contextCookies: true, // Ad Tech Cookies
      clickData: true,      // GCLID
      derivedGeo: true,     // Physical Location
      qualityScore: true,   // Bot Score
      attributionStats: true // Viral/Shared link status
    }
  });

  // 3. Fetch Compliance Audit Trail (Did we have consent?)
  const auditTrail = await db.query.complianceLogs.findMany({
    where: (t, { inArray }) => inArray(t.eventId, history.map(e => e.id)),
    orderBy: [desc(complianceLogs.timestamp)]
  });

  // 4. Construct Forensic Dossier
  const evidencePackage = {
    report_id: crypto.randomUUID(),
    generated_at: new Date().toISOString(),
    subject: {
      anonymous_id: identity.anonymousId,
      user_id: identity.userId, // CRM ID
      first_seen: identity.createdAt,
      last_seen: identity.lastSeenAt
    },
    risk_assessment: {
      // If multiple IPs were used, flag it
      distinct_ips: new Set(history.map(e => (e.contextClient as any)?.ip_hash)).size,
      // If multiple devices were used, flag it
      distinct_user_agents: new Set(history.map(e => (e.contextClient as any)?.user_agent)).size,
      // Bot probability of the initial touch
      bot_score: (history[history.length - 1]?.qualityScore as any)?.score || 100
    },
    chain_of_custody: history.map(e => ({
      timestamp: e.createdAt,
      action: e.type,
      ip_hash: (e.contextClient as any)?.ip_hash, // Anonymized but comparable
      location: `${(e.derivedGeo as any)?.city}, ${(e.derivedGeo as any)?.country}`,
      ad_click_id: (e.clickData as any)?.gclid || (e.clickData as any)?.fbclid || 'N/A',
      user_agent: (e.contextClient as any)?.user_agent
    })),
    compliance_audit: auditTrail.map(l => ({
      timestamp: l.timestamp,
      action: l.action,
      reason: l.reason
    }))
  };

  return c.json({ success: true, evidence: evidencePackage });
});

export const evidenceRoute = app;