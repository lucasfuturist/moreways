// File: src/ingest/api/ingest.api.offline.ts
// Domain: Ingest
// Role: Secure Endpoint for CRM Webhooks & CallRail Support
// Upgrade: CallRail Integration

import { Hono } from 'hono';
import { z } from 'zod';
import { Queue } from 'bullmq';
import { db } from '../../core/db';
import { tenants } from '../../core/db/core.db.schema';
import { eq } from 'drizzle-orm';
import { OfflineConversionSchema } from '../types/ingest.types.offline';
import { rehydrateSession } from '../../dispatch/svc/dispatch.svc.rehydrate';
import { EventPayload } from '../types/ingest.types.payload';

const eventsQueue = new Queue('events_queue', { connection: { url: process.env.REDIS_URL } });
const app = new Hono<{ Variables: { tenantId: string } }>();

// Auth Middleware (Secret Key)
app.use('*', async (c, next) => {
  // Allow specific routes to bypass standard auth if they use platform specific signatures (e.g. CallRail)
  // For V1, we will enforce Secret Key for simplicity or assume CallRail pushes to a specific path with a key in URL params.
  
  const secretKey = c.req.header('x-secret-key') || c.req.query('key');
  
  if (!secretKey) return c.json({ error: 'Missing x-secret-key' }, 401);

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.secretKey, secretKey),
    columns: { id: true }
  });

  if (!tenant) return c.json({ error: 'Invalid Secret Key' }, 403);
  c.set('tenantId', tenant.id);
  await next();
});

// Standard Offline Conversion (e.g. from Salesforce)
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const tenantId = c.get('tenantId');
    
    // 1. Parse Input
    const input = OfflineConversionSchema.parse(body);

    // 2. Rehydrate
    const sessionData = await rehydrateSession(tenantId, {
      email: input.email,
      phone: input.phone,
      external_id: input.external_id
    });

    if (!sessionData) {
      return c.json({ success: false, message: 'Identity not found in graph' }, 202);
    }

    // 3. Construct Payload
    const fullPayload: EventPayload = {
      type: 'offline_conversion',
      timestamp: input.occurred_at || new Date().toISOString(),
      anonymousId: sessionData.anonymousId!,
      consent: sessionData.consent!,
      
      user: {
        email: input.email,
        phone: input.phone,
        external_id: input.external_id
      },
      
      context: sessionData.context!,
      click: sessionData.click!,
      cookies: sessionData.cookies!,
      
      data: {
        event_name: input.event_name,
        value: input.value,
        currency: input.currency,
        source: 'crm_import'
      },
      
      // Mark as Internal/Safe
      _quality: { is_bot: false, score: 100 }
    };

    // 4. Queue
    await eventsQueue.add('process_event', {
      tenantId,
      payload: fullPayload
    });

    return c.json({ success: true, rehydrated: true });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ success: false, error: err.issues }, 400);
    }
    console.error('Offline Import Error:', err);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// [DIVINE UPGRADE] CallRail Support
app.post('/callrail', async (c) => {
  try {
    const body = await c.req.json();
    const tenantId = c.get('tenantId');

    // CallRail Payload Mapping
    // We map their specific fields to our generic EventPayload
    const payload: EventPayload = {
      type: 'lead', // A phone call is essentially a Lead
      anonymousId: body.gclid || `call_${body.id}`, // Fallback ID
      timestamp: body.start_time || new Date().toISOString(),
      
      // We assume consent is granted if they called the number displayed on the site
      // (Implied consent for business communication)
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },

      context: {
        url: body.landing_page_url || 'tel:' + body.tracking_phone_number,
        user_agent: 'CallRail/Webhook',
        referrer: body.referrer_url
      },

      click: {
        gclid: body.gclid, 
        gbraid: body.gbraid,
        wbraid: body.wbraid
      },

      user: {
        phone: body.customer_phone_number,
        city: body.customer_city,
        state: body.customer_state,
        country: body.customer_country
      },

      data: {
        source: 'phone_call',
        provider: 'callrail',
        duration: body.duration,
        recording: body.recording_player_url,
        status: body.answered ? 'answered' : 'missed'
      },

      _quality: { is_bot: false, score: 100 }
    };

    // Queue for attribution
    await eventsQueue.add('process_event', {
      tenantId,
      payload
    });

    return c.json({ success: true, provider: 'callrail' });

  } catch (err) {
    console.error('CallRail Webhook Error:', err);
    return c.json({ success: false, error: 'Internal Error' }, 500);
  }
});

export const offlineRoute = app;