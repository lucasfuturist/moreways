// File: src/ingest/api/ingest.api.read.ts
// Domain: Ingest (Read)
// Role: Intelligence API to fetch User Journey
// Upgrade: "The Oracle" (Attribution Modeling)

import { Hono } from 'hono';
import { db } from '../../core/db';
import { events, identities } from '../../core/db/core.db.schema';
import { eq, desc } from 'drizzle-orm';
import { modelJourney } from '../../reporting/svc/reporting.svc.modeler';

const app = new Hono<{ Variables: { tenantId: string } }>();

// GET /api/v1/journey/:anonymousId
// Used by: CRM, Chatbots, Admin Dashboard
app.get('/:anonymousId', async (c) => {
  const tenantId = c.get('tenantId');
  const anonymousId = c.req.param('anonymousId');

  // 1. Find Identity
  const identity = await db.query.identities.findFirst({
    where: (t, { and, eq }) => and(
      eq(t.tenantId, tenantId),
      eq(t.anonymousId, anonymousId)
    )
  });

  if (!identity) {
    return c.json({ found: false, message: 'Identity not found' }, 404);
  }

  // 2. Fetch All Events for this Identity
  const rawEvents = await db.query.events.findMany({
    where: eq(events.identityId, identity.id),
    orderBy: [desc(events.createdAt)],
    limit: 100 // Cap for performance
  });

  // 3. [ORACLE] Run Attribution Modeling
  const model = modelJourney(rawEvents);

  return c.json({
    found: true,
    identity: { 
      id: identity.id, 
      user_id: identity.userId,
      created_at: identity.createdAt 
    },
    oracle: {
      lead_score: model.lead_score,
      first_touch: model.first_touch?.source,
      last_touch: model.last_touch?.source,
      conversion_path: model.customer_journey.map(j => ({
        time: j.timestamp,
        action: j.type,
        channel: j.source.channel,
        source: j.source.source
      }))
    }
  });
});

export const readRoute = app;