// File: src/ingest/api/ingest.api.controller.ts

import { Hono } from 'hono';
import { z } from 'zod';
import { Queue } from 'bullmq';
import { createClient } from 'redis';
import { db } from '../../core/db';
import { quarantine } from '../../core/db/core.db.schema';
import { EventPayloadSchema } from '../types/ingest.types.payload';

// --- REDIS SETUP ---
const redisUrl = process.env.REDIS_URL;
const eventsQueue = new Queue('events_queue', { connection: { url: redisUrl } });
// Separate client for Rate Limiting
const redis = createClient({ url: redisUrl });
redis.connect().catch(console.error);

const app = new Hono<{ Variables: { tenantId: string } }>();

// Rate Limit Config
const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX = 100;

app.post('/', async (c) => {
  let rawBody: any;
  let tenantId = '';

  try {
    rawBody = await c.req.json();
    tenantId = c.get('tenantId');
    
    // [FIX] Robust IP Extraction
    // Handle list: "1.2.3.4, 10.0.0.1" -> "1.2.3.4"
    let ip = c.req.header('x-forwarded-for') || '127.0.0.1';
    if (Array.isArray(ip)) ip = ip[0]; // Handle weird array case
    if (ip.includes(',')) ip = ip.split(',')[0].trim();

    const userAgent = c.req.header('user-agent') || '';
    const isGpcActive = c.req.header('Sec-GPC') === '1';

    // 1. Rate Limiting
    const rateKey = `rl:${tenantId}:${ip}`;
    const hits = await redis.incr(rateKey);
    if (hits === 1) await redis.expire(rateKey, RATE_LIMIT_WINDOW);

    if (hits > RATE_LIMIT_MAX) {
      return c.json({ success: false, error: 'Too Many Requests' }, 429);
    }

    // 2. Validate Payload
    const payload = EventPayloadSchema.parse(rawBody);

    // 3. GPC Override
    if (isGpcActive) {
      payload.consent.ad_storage = 'denied';
      payload.consent.analytics_storage = 'denied';
      payload.data = { ...payload.data, _compliance_gpc_override: true };
    }

    // 4. Spam Shield
    let isBot = false;
    let botReason: 'honeypot' | 'user_agent' | undefined;

    if (rawBody._hp && rawBody._hp.length > 0) {
      isBot = true;
      botReason = 'honeypot';
    }

    const ua = userAgent.toLowerCase();
    if (ua.includes('bot') || ua.includes('spider') || ua.length < 10) {
      isBot = true;
      botReason = 'user_agent';
    }

    // 5. Enrich Payload
    const enrichedPayload = {
      ...payload,
      context: { ...payload.context, ip_address: ip },
      _quality: {
        is_bot: isBot,
        reason: botReason,
        score: isBot ? 0 : 100
      }
    };

    // 6. Push to Queue
    await eventsQueue.add('process_event', {
      tenantId,
      payload: enrichedPayload
    }, {
      attempts: 5, 
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true, 
      removeOnFail: false 
    });

    return c.json({ success: true, queued: true });

  } catch (err: any) {
    console.error('Ingest Error:', err);

    if (tenantId) {
      await db.insert(quarantine).values({
        tenantId,
        rawBody: rawBody || {},
        headers: c.req.header(),
        errorReason: err instanceof z.ZodError ? JSON.stringify(err.issues) : err.message,
        ipAddress: c.req.header('x-forwarded-for') || 'unknown'
      });
      return c.json({ success: true, status: 'quarantined_for_review' }, 202);
    }

    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

export const trackRoute = app;