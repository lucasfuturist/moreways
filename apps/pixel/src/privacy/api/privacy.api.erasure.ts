// File: src/privacy/api/privacy.api.erasure.ts
// Domain: Privacy
// Role: GDPR/CCPA Data Deletion Endpoint
// Upgrade: "The Eraser" (Right to be Forgotten)

import { Hono } from 'hono';
import { db } from '../../core/db';
import { identities, events, complianceLogs } from '../../core/db/core.db.schema';
import { eq } from 'drizzle-orm';

const app = new Hono<{ Variables: { tenantId: string } }>();

// DELETE /api/v1/privacy/erasure/:anonymousId
// Called by Tenant Backend when user requests deletion
app.delete('/:anonymousId', async (c) => {
  const tenantId = c.get('tenantId');
  const anonymousId = c.req.param('anonymousId');
  const reason = c.req.query('reason') || 'user_request';

  // 1. Find Identity
  const identity = await db.query.identities.findFirst({
    where: (t, { and, eq }) => and(eq(t.tenantId, tenantId), eq(t.anonymousId, anonymousId))
  });

  if (!identity) {
    return c.json({ found: false, message: 'Identity not found' }, 404);
  }

  // 2. Execute Transactional Erasure
  try {
    await db.transaction(async (tx) => {
      // A. Delete Events (Hard Delete)
      await tx.delete(events).where(eq(events.identityId, identity.id));
      
      // B. Delete Identity
      await tx.delete(identities).where(eq(identities.id, identity.id));
      
      // C. Log the Compliance Action (Must survive deletion to prove we did it)
      await tx.insert(complianceLogs).values({
        tenantId,
        action: 'data_erasure',
        reason: `gdpr_request:${reason}`,
        metadata: { deleted_identity_id: identity.id }
      });
    });

    return c.json({ 
      success: true, 
      message: 'Identity and associated data permanently deleted.' 
    });

  } catch (err) {
    console.error('Erasure Failed:', err);
    return c.json({ success: false, error: 'Erasure transaction failed' }, 500);
  }
});

export const privacyRoute = app;