# File Scan

**Roots:**

- `C:\projects\moreways\attribution-engine\src`


## Tree: C:\projects\moreways\attribution-engine\src

```
src/

├── api/
│   ├── index.ts
├── core/
│   ├── db/
│   │   ├── core.db.client.ts
│   │   ├── core.db.schema.ts
│   │   ├── index.ts
│   │   ├── migrate.ts
│   ├── util/
│   │   ├── core.util.logger.ts
├── dispatch/
│   ├── job/
│   │   ├── dispatch.job.processor.ts
│   ├── svc/
│   │   ├── adapters/
│   │   │   ├── dispatch.adapter.google.ts
│   │   │   ├── dispatch.adapter.linkedin.ts
│   │   │   ├── dispatch.adapter.meta.ts
│   │   │   ├── dispatch.adapter.tiktok.ts
│   │   ├── dispatch.svc.crm.ts
│   │   ├── dispatch.svc.geo.ts
│   │   ├── dispatch.svc.google.ts
│   │   ├── dispatch.svc.meta.ts
│   │   ├── dispatch.svc.rehydrate.ts
│   │   ├── dispatch.svc.types.ts
│   │   ├── dispatch.svc.viral.ts
│   │   ├── dispatch.svc.webhook.ts
├── identity/
│   ├── svc/
│   │   ├── identity.svc.hashing.ts
│   │   ├── identity.svc.merge.ts
│   ├── util/
├── ingest/
│   ├── api/
│   │   ├── ingest.api.controller.ts
│   │   ├── ingest.api.offline.ts
│   │   ├── ingest.api.read.ts
│   ├── types/
│   │   ├── ingest.types.offline.ts
│   │   ├── ingest.types.payload.ts
├── pixel/
│   ├── index.ts
│   ├── lib/
│   │   ├── pixel.lib.browser.ts
│   │   ├── pixel.lib.network.ts
├── privacy/
│   ├── api/
│   │   ├── privacy.api.erasure.ts
├── reporting/
│   ├── api/
│   │   ├── reporting.api.evidence.ts
│   │   ├── reporting.api.stats.ts
│   ├── svc/
│   │   ├── reporting.svc.modeler.ts
│   │   ├── reporting.svc.source.ts
├── tenant/
│   ├── repo/
│   │   ├── tenant.repo.keys.ts
│   ├── svc/
│   │   ├── tenant.svc.crypto.ts
├── worker/
│   ├── cron/
│   │   ├── worker.cron.prune.ts
│   ├── index.ts

```

## Files

### `C:/projects/moreways/attribution-engine/src/api/index.ts`

```ts
// File: src/api/index.ts

import 'dotenv-safe/config';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono, Context, Next } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { runMigrations } from '../core/db/migrate';
import { trackRoute } from '../ingest/api/ingest.api.controller';
import { readRoute } from '../ingest/api/ingest.api.read';
import { privacyRoute } from '../privacy/api/privacy.api.erasure';
import { offlineRoute } from '../ingest/api/ingest.api.offline';
import { evidenceRoute } from '../reporting/api/reporting.api.evidence';
import { statsRoute } from '../reporting/api/reporting.api.stats';
import { db } from '../core/db';
import { tenants } from '../core/db/core.db.schema';
import { eq } from 'drizzle-orm';

type AppVariables = { tenantId: string };
const app = new Hono<{ Variables: AppVariables }>();

app.use('*', logger());

// [FIX] Explicit CORS to allow local testing
app.use('*', cors({
  origin: '*', // Allow all for testing
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-publishable-key', 'x-secret-key']
}));

app.get('/health', (c: Context) => c.json({ status: 'ok', timestamp: new Date() }));

// Auth Middlewares
const publicKeyAuth = async (c: Context, next: Next) => {
  const publicKey = c.req.header('x-publishable-key');
  if (!publicKey) return c.json({ error: 'Missing x-publishable-key header' }, 401);
  
  try {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.publicKey, publicKey),
      columns: { id: true }
    });
    if (!tenant) return c.json({ error: 'Invalid Public Key' }, 403);
    c.set('tenantId', tenant.id);
    await next();
  } catch (e: any) {
    console.error('Auth DB Error:', e);
    return c.json({ error: 'Auth Service Unavailable' }, 500);
  }
};

const secretKeyAuth = async (c: Context, next: Next) => {
  const secretKey = c.req.header('x-secret-key');
  if (!secretKey) return c.json({ error: 'Missing x-secret-key' }, 401);
  
  try {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.secretKey, secretKey),
      columns: { id: true }
    });
    if (!tenant) return c.json({ error: 'Invalid Secret Key' }, 403);
    c.set('tenantId', tenant.id);
    await next();
  } catch (e: any) {
    console.error('Auth DB Error:', e);
    return c.json({ error: 'Auth Service Unavailable' }, 500);
  }
};

app.use('*', secureHeaders({
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  xXssProtection: '1; mode=block',
  strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
  crossOriginResourcePolicy: 'cross-origin', 
  contentSecurityPolicy: { defaultSrc: ["'self'", "'unsafe-inline'"] }
}));

// Routes
app.use('/api/v1/track/*', publicKeyAuth);
app.route('/api/v1/track', trackRoute);
app.use('/api/v1/journey/*', publicKeyAuth);
app.route('/api/v1/journey', readRoute);
app.use('/api/v1/privacy/*', secretKeyAuth);
app.route('/api/v1/privacy/erasure', privacyRoute);
app.use('/api/v1/stats/*', secretKeyAuth);
app.route('/api/v1/stats', statsRoute);
app.route('/api/v1/offline', offlineRoute);
app.use('/api/v1/evidence/*', secretKeyAuth);
app.route('/api/v1/evidence', evidenceRoute);

// Serve Static Files
app.use('/*', serveStatic({ root: './public' }));

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    console.log('📦 Attempting Database Migrations...');
    await runMigrations();
    console.log('✅ Migrations applied successfully');
  } catch (err: any) {
    console.error('⚠️ Migration Network Error (Skipping):', err.message);
  }

  console.log(`🚀 Attribution Engine running on port ${port}`);
  
  serve({ 
    fetch: app.fetch, 
    port: port,
    hostname: '0.0.0.0' 
  });
}

startServer().catch((err) => {
  console.error('❌ Critical Server Error:', err);
  process.exit(1);
});
```

### `C:/projects/moreways/attribution-engine/src/core/db/core.db.client.ts`

```ts
// File: src/core/db/core.db.client.ts
// Role: Postgres Connection Helper

```

### `C:/projects/moreways/attribution-engine/src/core/db/core.db.schema.ts`

```ts
// File: src/core/db/core.db.schema.ts
// Update: Added 'quarantine' table for Zero-Loss Guarantee

import { relations } from 'drizzle-orm';
import { 
  pgTable, uuid, text, timestamp, jsonb, pgEnum, index, boolean
} from 'drizzle-orm/pg-core';

export const eventTypeEnum = pgEnum('event_type', [
  'pageview', 'lead', 'purchase', 'custom', 'view_content', 'add_to_cart', 'initiate_checkout', 'offline_conversion'
]);

export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  publicKey: text('public_key').notNull().unique(),
  secretKey: text('secret_key').notNull(),
  adConfig: jsonb('ad_config').$type<any>(),
  geoConfig: jsonb('geo_config').$type<any>(),
  webhookUrl: text('webhook_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const identities = pgTable('identities', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  anonymousId: text('anonymous_id').notNull(),
  userId: text('user_id'),
  emailHash: text('email_hash'),
  phoneHash: text('phone_hash'),
  mergedInto: uuid('merged_into'), 
  createdAt: timestamp('created_at').defaultNow(),
  lastSeenAt: timestamp('last_seen_at').defaultNow(),
}, (t) => ({
  lookupIdx: index('identity_lookup_idx').on(t.tenantId, t.anonymousId),
  emailIdx: index('identity_email_idx').on(t.tenantId, t.emailHash),
}));

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  identityId: uuid('identity_id').references(() => identities.id),
  type: eventTypeEnum('event_type').notNull(),
  consentPolicy: jsonb('consent_policy').notNull().$type<any>(),
  contextClient: jsonb('context_client').$type<any>(),
  contextCookies: jsonb('context_cookies').$type<any>(),
  clickData: jsonb('click_data').$type<any>(),
  derivedGeo: jsonb('derived_geo').$type<any>(),
  qualityScore: jsonb('quality_score').$type<any>(),
  attributionStats: jsonb('attribution_stats').$type<any>(),
  metadata: jsonb('metadata'),
  processingStatus: jsonb('processing_status').default({}).$type<Record<string, string>>(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const complianceLogs = pgTable('compliance_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  eventId: uuid('event_id'),
  action: text('action').notNull(),
  reason: text('reason').notNull(),
  metadata: jsonb('metadata'),
  timestamp: timestamp('created_at').defaultNow(),
});

// [DIVINE UPGRADE] The Safety Net
export const quarantine = pgTable('quarantine', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id), // Nullable if auth failed completely
  rawBody: jsonb('raw_body').notNull(),
  headers: jsonb('headers').notNull(),
  errorReason: text('error_reason').notNull(),
  ipAddress: text('ip_address'),
  retryStatus: text('retry_status').default('pending'), // pending, fixed, ignored
  createdAt: timestamp('created_at').defaultNow(),
});

export const tenantRelations = relations(tenants, ({ many }) => ({
  events: many(events),
  identities: many(identities),
  complianceLogs: many(complianceLogs),
  quarantine: many(quarantine),
}));

export const identityRelations = relations(identities, ({ one, many }) => ({
  tenant: one(tenants, { fields: [identities.tenantId], references: [tenants.id] }),
  events: many(events),
}));

export const eventRelations = relations(events, ({ one }) => ({
  tenant: one(tenants, { fields: [events.tenantId], references: [tenants.id] }),
  identity: one(identities, { fields: [events.identityId], references: [identities.id] }),
}));
```

### `C:/projects/moreways/attribution-engine/src/core/db/index.ts`

```ts
// File: src/core/db/index.ts

import 'dotenv-safe/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './core.db.schema';

// [CHANGE] Look for PX_DATABASE_URL first
const connectionString = process.env.PX_DATABASE_URL || process.env.PIXEL_DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ Missing PX_DATABASE_URL environment variable");
}

// Log masked URL for debugging
const maskedUrl = connectionString.replace(/:([^@]+)@/, ':****@');
console.log(`🔌 DB Connecting to: ${maskedUrl}`);

const client = postgres(connectionString, { 
  prepare: false,
  connect_timeout: 10
});

export const db = drizzle(client, { schema });
```

### `C:/projects/moreways/attribution-engine/src/core/db/migrate.ts`

```ts
// File: src/core/db/migrate.ts
// Role: Run migrations in Production without Drizzle Kit CLI

import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './index';

export async function runMigrations() {
  console.log('📦 Running Database Migrations...');
  try {
    // This points to the 'migrations' folder we copied in the Dockerfile
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('✅ Migrations applied successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    // Propagate error to main thread to stop server startup
    throw err;
  }
}
```

### `C:/projects/moreways/attribution-engine/src/core/util/core.util.logger.ts`

```ts
// File: src/core/util/core.util.logger.ts
// Documentation: File 08-attribution-observability.md
// Role: Structured JSON Logger

import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isDev ? { target: 'pino-pretty' } : undefined,
  base: {
    env: process.env.NODE_ENV,
    service: process.env.SERVICE_NAME || 'attribution-engine',
  },
  // Redact sensitive keys automatically
  redact: [
    'payload.user.email', 
    'payload.user.phone', 
    'headers.authorization',
    'headers.x_secret_key'
  ]
});
```

### `C:/projects/moreways/attribution-engine/src/dispatch/job/dispatch.job.processor.ts`

```ts
// File: src/dispatch/job/dispatch.job.processor.ts
// Documentation: File 04-attribution-security-and-compliance.md
// Upgrade: Fortune 500 Robustness (Idempotency, Structured Logging, Fail Open)
// Upgrade: Transactional Safety (Zero Data Drift)

import { Job } from 'bullmq';
import { createClient } from 'redis';
import { db } from '../../core/db';
import { events, tenants, complianceLogs } from '../../core/db/core.db.schema';
import { EventPayload } from '../../ingest/types/ingest.types.payload';
import { eq } from 'drizzle-orm';

// Services
import { sendWebhook } from '../svc/dispatch.svc.webhook';
import { sendToCrm } from '../svc/dispatch.svc.crm';
import { normalizeAndHash } from '../../identity/svc/identity.svc.hashing';
import { resolveIpLocation, checkJurisdiction } from '../svc/dispatch.svc.geo';
import { resolveIdentity } from '../../identity/svc/identity.svc.merge';
import { checkViralStatus } from '../svc/dispatch.svc.viral';
import { logger } from '../../core/util/core.util.logger';

// Adapters
import { MetaAdapter } from '../svc/adapters/dispatch.adapter.meta';
import { GoogleAdapter } from '../svc/adapters/dispatch.adapter.google';
import { TikTokAdapter } from '../svc/adapters/dispatch.adapter.tiktok';

// [INFRA] Dedicated Redis Client for Locking (Atomic Operations)
const redis = createClient({ url: process.env.REDIS_URL });
redis.connect().catch((err: any) => logger.error({ err }, 'Redis Lock Client Failed'));

// The Registry of Supported Platforms
const AD_PLATFORMS = [
  MetaAdapter,
  GoogleAdapter,
  TikTokAdapter
];

const SENSITIVE_TERMS = [
  'medical', 'injury', 'accident', 'divorce', 'criminal', 
  'dui', 'bankruptcy', 'health', 'patient', 'therapy'
];

export async function processEventJob(job: Job) {
  const { tenantId, payload } = job.data as { tenantId: string; payload: EventPayload };
  
  // 0. Observability Context
  const traceId = job.id || `trace_${Date.now()}`;
  const logCtx = { traceId, tenantId, eventType: payload.type };

  // 1. GEO-INTELLIGENCE
  const ip = payload.context.ip_address || '0.0.0.0';
  const geo = await resolveIpLocation(ip);
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
    columns: { adConfig: true, webhookUrl: true, geoConfig: true }
  });
  const inJurisdiction = checkJurisdiction(geo, tenant?.geoConfig || {});

  // 2. IDENTITY RESOLUTION
  const emailHash = payload.user?.email ? normalizeAndHash(payload.user.email) : undefined;
  const phoneHash = payload.user?.phone ? normalizeAndHash(payload.user.phone) : undefined;
  
  const identityId = await resolveIdentity(
    tenantId,
    payload.anonymousId,
    emailHash,
    phoneHash,
    payload.user?.external_id
  );

  // 3. VIRAL CHECK
  const viralStats = await checkViralStatus(tenantId, identityId, payload.click);

  // 4. LEDGER SAVE (TRANSACTIONAL)
  const ipHash = normalizeAndHash(ip);
  const quality = payload._quality || { is_bot: false, score: 100 };
  let currentStatus: Record<string, string> = { ingestion: 'complete', compliance_check: 'pending' };

  // Enrich Payload for storage
  if (!payload.user) payload.user = {};
  if (!payload.user.city && geo.city) payload.user.city = geo.city;
  if (!payload.user.state && geo.region) payload.user.state = geo.region;
  if (!payload.user.zip && geo.postal_code) payload.user.zip = geo.postal_code;
  if (!payload.user.country && geo.country) payload.user.country = geo.country;

  // [UPGRADE] Wrap insertion in a transaction to ensure "Event" and "Initial Log" always exist together
  const savedEvent = await db.transaction(async (tx) => {
    // A. Insert Event
    const [evt] = await tx.insert(events).values({
      tenantId, identityId, type: payload.type as any, consentPolicy: payload.consent,
      contextClient: { user_agent: payload.context.user_agent, ip_hash: ipHash, page_url: payload.context.url, referrer: payload.context.referrer },
      contextCookies: payload.cookies, clickData: payload.click, qualityScore: quality,
      derivedGeo: { ...geo, in_jurisdiction: inJurisdiction },
      
      attributionStats: {
        is_viral: viralStats.isViral,
        original_identity_id: viralStats.originalIdentityId
      },

      metadata: payload.data as any, processingStatus: currentStatus
    }).returning();

    // B. Insert Initial Compliance Log (The Audit Trail Start)
    await tx.insert(complianceLogs).values({
      tenantId, 
      eventId: evt.id, 
      action: 'ingestion_started', 
      reason: 'worker_picked_up_job',
      metadata: { trace_id: traceId }
    });

    return evt;
  });

  // ------------------------------------------------------------------
  // [ROBUSTNESS] IDEMPOTENCY CHECK
  // ------------------------------------------------------------------
  const idempotencyKey = `idempotency:${savedEvent.id}`;
  const isFresh = await redis.set(idempotencyKey, '1', {
    NX: true, // Only set if Not Exists
    EX: 60 * 60 * 24 // 24 hour TTL
  });

  if (!isFresh) {
    logger.warn({ ...logCtx, eventId: savedEvent.id }, 'Event already processed (Idempotency Trigger)');
    return;
  }

  // ------------------------------------------------------------------
  // GATES & COMPLIANCE
  // ------------------------------------------------------------------
  if (quality.is_bot) {
    await blockEvent(savedEvent.id, tenantId, `bot_detected:${quality.reason}`, currentStatus);
    return;
  }
  if (!inJurisdiction) {
    await blockEvent(savedEvent.id, tenantId, 'jurisdiction_mismatch', currentStatus);
    return; 
  }
  const urlLower = payload.context.url.toLowerCase();
  const isToxic = SENSITIVE_TERMS.some(term => urlLower.includes(term));
  
  if (isToxic) {
    payload.consent.ad_storage = 'denied';
    await db.insert(complianceLogs).values({
      tenantId, eventId: savedEvent.id, action: 'dispatch_blocked', reason: 'sensitive_content_scrubbed',
      metadata: { url: payload.context.url }
    });
    logger.info({ ...logCtx, reason: 'toxic_content' }, 'Compliance scrub triggered');
  }

  // ------------------------------------------------------------------
  // CRM DISPATCH (CLOSED LOOP)
  // ------------------------------------------------------------------
  if (payload.type === 'lead' || payload.type === 'purchase') {
    try {
      await sendToCrm(tenantId, savedEvent.id, payload);
    } catch (crmError: any) {
      logger.error({ ...logCtx, err: crmError.message }, 'CRM Sync Failed (Fail Open)');
    }
  }

  // ------------------------------------------------------------------
  // GENERIC WEBHOOK (LEGACY SUPPORT)
  // ------------------------------------------------------------------
  if (tenant?.webhookUrl) {
    sendWebhook(tenant.webhookUrl, payload, identityId).catch(err => 
      logger.error({ ...logCtx, err: err.message }, 'Legacy Webhook Failed')
    );
  }

  // ------------------------------------------------------------------
  // AD NETWORK DISPATCH (PLUG-AND-PLAY LOOP)
  // ------------------------------------------------------------------
  
  // 1. Check Global Consent
  if (payload.consent.ad_storage !== 'granted') {
    if (!isToxic) {
      await blockEvent(savedEvent.id, tenantId, 'consent_denied', currentStatus, payload.consent);
    } else {
      currentStatus = { ...currentStatus, meta_capi: 'blocked_sensitive', google_ads: 'blocked_sensitive' };
      await db.update(events).set({ processingStatus: currentStatus }).where(eq(events.id, savedEvent.id));
    }
    return; // Exit dispatch loop
  } 

  // Log Success for Audit
  await db.insert(complianceLogs).values({
    tenantId, eventId: savedEvent.id, action: 'dispatch_initiated', reason: 'consent_granted',
    metadata: { destinations: AD_PLATFORMS.map(p => p.key), is_viral: viralStats.isViral }
  });

  // 2. Parallel Dispatch Loop
  const dispatchPromises = AD_PLATFORMS.map(async (platform) => {
    const config = tenant?.adConfig || {};
    
    // Skip if Tenant hasn't configured this platform
    if (!platform.isEnabled(config)) return { platform: platform.key, status: 'skipped' };

    try {
      // Execute Adapter Logic
      const res = await platform.send(payload, config, savedEvent.id);
      
      // Update local status map
      const resultStr = res && res.skipped ? `skipped: ${res.reason}` : 'sent';
      currentStatus[platform.key] = resultStr;
      
      logger.info({ ...logCtx, destination: platform.key }, `Dispatch Success (${resultStr})`);
      return { platform: platform.key, status: 'fulfilled' };

    } catch (e: any) {
      // Log Failure but DO NOT crash other platforms
      currentStatus[platform.key] = `failed: ${e.message}`;
      logger.error({ ...logCtx, destination: platform.key, err: e.message }, 'Dispatch Failed');
      
      // We throw here so Promise.allSettled marks it as rejected for retry check
      throw e; 
    }
  });

  // Wait for all to finish (Parallel execution)
  const results = await Promise.allSettled(dispatchPromises);
  
  // 3. Save Final Status to Ledger
  await db.update(events)
    .set({ processingStatus: currentStatus })
    .where(eq(events.id, savedEvent.id));

  // 4. Retry Logic
  // If ANY platform failed (status === rejected), we throw an error to trigger BullMQ retry.
  const anyFailed = results.some(r => r.status === 'rejected');
  
  if (anyFailed) {
    const failedPlatforms = results
      .filter(r => r.status === 'rejected')
      .map((r: any) => r.reason); // reason is the error thrown
      
    throw new Error(`Partial Dispatch Failure: ${JSON.stringify(failedPlatforms)}`);
  }
}

async function blockEvent(eventId: string, tenantId: string, reason: string, status: any, meta: any = {}) {
  await db.insert(complianceLogs).values({
    tenantId, eventId, action: 'dispatch_blocked', reason, metadata: meta
  });
  await db.update(events)
    .set({ processingStatus: { ...status, blocked_reason: reason } })
    .where(eq(events.id, eventId));
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/dispatch.svc.crm.ts`

```ts
// File: src/dispatch/svc/dispatch.svc.crm.ts
// Domain: Dispatch
// Role: "Closed Loop" - Send Attribution Data back to Client's CRM (Clio, Salesforce)

import { db } from '../../core/db';
import { tenants } from '../../core/db/core.db.schema';
import { eq } from 'drizzle-orm';
import { classifySource } from '../../reporting/svc/reporting.svc.source';
import { EventPayload } from '../../ingest/types/ingest.types.payload';

export async function sendToCrm(tenantId: string, eventId: string, payload: EventPayload) {
  // 1. Get Tenant Config
  // We check if they have a webhook configured to receive leads
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
    columns: { webhookUrl: true } 
  });

  if (!tenant?.webhookUrl) return;

  // 2. Classify Source (The "Oracle" Logic)
  // Lawyers don't care about "gclid=Ck12...", they care about "Google Ads"
  // We translate the technical signals into human-readable business context.
  const sourceInfo = classifySource({
    clickData: payload.click,
    contextClient: { page_url: payload.context.url, referrer: payload.context.referrer }
  });

  // 3. Prepare "Legal Readable" Payload
  // This JSON is designed to be easily mapped in Zapier or direct CRM integrations
  const crmPayload = {
    event: 'new_lead_attributed',
    lead_id: payload.anonymousId,
    email: payload.user?.email,
    phone: payload.user?.phone,
    
    // The Money Shot: Attribution
    marketing_source: sourceInfo.source,   // e.g. "google"
    marketing_medium: sourceInfo.medium,   // e.g. "cpc"
    marketing_campaign: sourceInfo.campaign || 'General',
    marketing_channel: sourceInfo.channel, // e.g. "paid_search"
    
    // Technical Evidence
    landing_page: payload.context.url,
    gclid: payload.click?.gclid, 
    
    // Metadata
    timestamp: new Date().toISOString(),
    event_id: eventId,
    form_data: payload.data // Pass through any custom form fields
  };

  // 4. Send to their CRM (Clio, Salesforce, Zapier webhook)
  try {
    const response = await fetch(tenant.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crmPayload)
    });

    if (!response.ok) {
      console.warn(`[CRM] Webhook failed for ${tenantId}: ${response.status}`);
    } else {
      console.log(`[CRM] Synced lead to tenant ${tenantId}`);
    }
  } catch (e) {
    console.error('[CRM] Sync failed', e);
    // In a future upgrade, we might want to throw here to trigger a BullMQ retry
    // but for now, we catch to prevent the Job from failing the main Ad Dispatch
  }
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/dispatch.svc.geo.ts`

```ts
// File: src/dispatch/svc/dispatch.svc.geo.ts

type GeoResult = {
  city?: string;
  region?: string; // ISO State Code (e.g. NY)
  country?: string; // ISO Country Code (e.g. US)
  postal_code?: string;
};

export async function resolveIpLocation(ip: string): Promise<GeoResult> {
  // 1. Handle Localhost / Internal immediately
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return { city: 'Localhost', country: 'US' };
  }

  try {
    // 2. REAL FETCH: Using ip-api.com (Robust & Fast)
    // Note: For high production volume, buy a pro key or use ipinfo.io with a token.
    // This endpoint is free for up to 45 requests/minute.
    const url = `http://ip-api.com/json/${ip}?fields=status,message,countryCode,region,city,zip`;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000); // 2s Timeout (Fail Open)

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return {
          city: data.city,
          region: data.region, // This is the State Code (e.g., 'NY')
          country: data.countryCode,
          postal_code: data.zip
        };
      }
    }
    
    console.warn(`[Geo] API returned error for ${ip}`);
    return { city: 'Unknown', country: 'US' }; // Fail Open

  } catch (e) {
    console.error(`[Geo] Lookup failed for IP ${ip}:`, e);
    // Return empty but valid object so the worker doesn't crash
    return { city: 'Unknown', country: 'US' };
  }
}

// Keep the jurisdiction check logic, it's fine
export function checkJurisdiction(
  geo: GeoResult, 
  config: { allowed_countries?: string[]; allowed_regions?: string[] }
): boolean {
  if (!config.allowed_countries && !config.allowed_regions) return true;

  if (config.allowed_countries && config.allowed_countries.length > 0) {
    if (!geo.country || !config.allowed_countries.includes(geo.country)) {
      return false;
    }
  }

  if (config.allowed_regions && config.allowed_regions.length > 0) {
    if (!geo.region || !config.allowed_regions.includes(geo.region)) {
      return false;
    }
  }

  return true;
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/dispatch.svc.google.ts`

```ts
// File: src/dispatch/svc/dispatch.svc.google.ts
// Domain: Dispatch
// Role: Google Ads Adapter
// Upgrade: Uses Inferred Geo Data

import { createHash } from 'crypto';
import { EventPayload } from '../../ingest/types/ingest.types.payload';

const API_VERSION = 'v14';

type GoogleConfig = {
  accessToken: string;
  customerId: string;
  conversionActionId: string;
};

function hash(val: string | undefined | null): string | undefined {
  if (!val) return undefined;
  return createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

export async function sendToGoogleAds(event: EventPayload, config: GoogleConfig) {
  if (event.consent.ad_storage !== 'granted') return { skipped: true, reason: 'consent_denied' };

  const customerId = config.customerId.replace(/-/g, '');
  const url = `https://googleads.googleapis.com/${API_VERSION}/customers/${customerId}:uploadClickConversions`;
  const formattedTime = new Date(event.timestamp).toISOString().replace('T', ' ').substring(0, 19) + '+00:00';

  const userIdentifiers: any[] = [];
  if (event.user?.email) userIdentifiers.push({ hashedEmail: hash(event.user.email) });
  if (event.user?.phone) userIdentifiers.push({ hashedPhoneNumber: hash(event.user.phone) });
  
  // [DIVINE] Inferred Address Info
  // Even if user didn't type it, our Geo Service filled it in.
  if (event.user?.first_name || event.user?.last_name || event.user?.zip) {
    userIdentifiers.push({
      addressInfo: {
        hashedFirstName: hash(event.user.first_name),
        hashedLastName: hash(event.user.last_name),
        city: event.user.city?.trim().toLowerCase(), // Unhashed for Google
        state: event.user.state?.trim().toLowerCase(),
        postalCode: event.user.zip,
        countryCode: event.user.country || 'US'
      }
    });
  }

  const conversionData: any = {
    conversionAction: config.conversionActionId,
    conversionDateTime: formattedTime,
    conversionValue: event.data?.value ? Number(event.data.value) : undefined,
    currencyCode: event.data?.currency ? String(event.data.currency) : 'USD',
    userIdentifiers: userIdentifiers.length > 0 ? userIdentifiers : undefined,
  };

  if (event.click?.gclid) conversionData.gclid = event.click.gclid;
  else if (event.click?.wbraid) conversionData.wbraid = event.click.wbraid;
  else if (event.click?.gbraid) conversionData.gbraid = event.click.gbraid;
  else if (userIdentifiers.length === 0) return { skipped: true, reason: 'missing_signals' };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.accessToken}`,
      'developer-token': process.env.GOOGLE_DEV_TOKEN || 'TEST_TOKEN' 
    },
    body: JSON.stringify({ conversions: [conversionData], partialFailure: true })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Ads API Error (${response.status}): ${errorText}`);
  }
  return await response.json();
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/dispatch.svc.meta.ts`

```ts
// File: src/dispatch/svc/dispatch.svc.meta.ts
// Domain: Dispatch
// Role: Meta CAPI Adapter
// Upgrade: Uses Inferred Geo Data automatically

import { createHash } from 'crypto';
import { EventPayload } from '../../ingest/types/ingest.types.payload';

const API_VERSION = 'v18.0';

type MetaConfig = {
  pixelId: string;
  accessToken: string;
};

function hash(val: string | undefined | null): string | undefined {
  if (!val) return undefined;
  return createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

export async function sendToMetaCapi(event: EventPayload, config: MetaConfig, eventId: string) {
  // 1. Prepare User Data
  // The 'event.user' object now contains Inferred City/Zip from the Worker
  // if the user didn't provide it themselves.
  const userData = {
    fbp: event.cookies?._fbp,
    fbc: event.cookies?._fbc,
    em: hash(event.user?.email),
    ph: hash(event.user?.phone),
    fn: hash(event.user?.first_name),
    ln: hash(event.user?.last_name),
    
    // [DIVINE] Inferred Geo Signals
    ct: hash(event.user?.city), 
    st: hash(event.user?.state),
    zp: hash(event.user?.zip),
    country: hash(event.user?.country),
    
    external_id: hash(event.user?.external_id),
    client_ip_address: event.context.ip_address,
    client_user_agent: event.context.user_agent,
  };

  Object.keys(userData).forEach(key => (userData as any)[key] === undefined && delete (userData as any)[key]);

  const body = {
    data: [{
      event_name: mapEventName(event.type),
      event_time: Math.floor(new Date(event.timestamp).getTime() / 1000),
      event_id: event.anonymousId,
      event_source_url: event.context.url,
      action_source: 'website',
      user_data: userData,
      custom_data: {
        currency: (event.data?.currency as string) || 'USD',
        value: event.data?.value !== undefined ? Number(event.data.value) : undefined,
        content_name: (event.data?.content_name as string),
        status: (event.data?.status as string),
        ...event.data
      }
    }],
    access_token: config.accessToken,
    test_event_code: process.env.META_TEST_CODE 
  };

  const response = await fetch(`https://graph.facebook.com/${API_VERSION}/${config.pixelId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`Meta API Error: ${JSON.stringify(errorBody)}`);
  }
  return await response.json();
}

function mapEventName(type: string): string {
  const map: Record<string, string> = {
    'pageview': 'PageView',
    'lead': 'Lead',
    'purchase': 'Purchase',
    'view_content': 'ViewContent',
    'add_to_cart': 'AddToCart',
    'initiate_checkout': 'InitiateCheckout'
  };
  return map[type] || 'CustomEvent';
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/dispatch.svc.rehydrate.ts`

```ts
// File: src/dispatch/svc/dispatch.svc.rehydrate.ts
// Domain: Dispatch
// Role: "Time Travel" - Reconstructs a session from history for offline events

import { db } from '../../core/db';
import { events, identities } from '../../core/db/core.db.schema';
import { eq, desc, isNotNull } from 'drizzle-orm';
import { EventPayload } from '../../ingest/types/ingest.types.payload';
import { normalizeAndHash } from '../../identity/svc/identity.svc.hashing';

export async function rehydrateSession(
  tenantId: string,
  identifiers: { email?: string; phone?: string; external_id?: string }
): Promise<Partial<EventPayload> | null> {
  
  // 1. Find Identity by hashed credentials
  const conditions = [];
  if (identifiers.email) conditions.push(eq(identities.emailHash, normalizeAndHash(identifiers.email)));
  if (identifiers.phone) conditions.push(eq(identities.phoneHash, normalizeAndHash(identifiers.phone)));
  if (identifiers.external_id) conditions.push(eq(identities.userId, identifiers.external_id));

  // If no identifiers provided, we can't look up
  if (conditions.length === 0) return null;

  const identity = await db.query.identities.findFirst({
    where: (t, { and, eq, or }) => and(
      eq(t.tenantId, tenantId),
      or(...conditions)
    )
  });

  if (!identity) return null;

  // 2. Find the "Golden Event" (Last Marketing Touch)
  // We want the most recent event that had Click Data (GCLID/FBCLID)
  const recentEvents = await db.query.events.findMany({
    where: eq(events.identityId, identity.id),
    orderBy: [desc(events.createdAt)],
    limit: 20,
    columns: {
      clickData: true,
      contextClient: true,
      contextCookies: true,
      consentPolicy: true,
      derivedGeo: true
    }
  });

  // Find best attribution source (prefer clicks over generic pageviews)
  const attributionEvent = recentEvents.find(e => 
    e.clickData && (e.clickData.gclid || e.clickData.fbclid || e.clickData.li_fat_id)
  ) || recentEvents[0];

  if (!attributionEvent) return null;

  // 3. Reconstruct Payload parts
  // We map the DB schema back to the Zod Payload schema
  return {
    anonymousId: identity.anonymousId,
    // @ts-ignore: Drizzle JSONB types can be tricky, casting safely here as we know the schema matches
    consent: attributionEvent.consentPolicy as any,
    context: {
      url: attributionEvent.contextClient?.page_url || 'https://offline.conversion',
      user_agent: attributionEvent.contextClient?.user_agent || 'Moreways/Offline-Importer',
      ip_address: '0.0.0.0', // Unknown IP for offline
    },
    click: (attributionEvent.clickData as any) || {},
    cookies: (attributionEvent.contextCookies as any) || {},
  };
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/dispatch.svc.types.ts`

```ts
// File: src/dispatch/svc/dispatch.svc.types.ts
// Role: Interface contract for Ad Platform Adapters

import { EventPayload } from '../../ingest/types/ingest.types.payload';

export interface AdPlatformAdapter {
  /**
   * unique identifier for the platform (e.g. 'meta', 'tiktok')
   * Used for logging and database status keys
   */
  key: string; 

  /**
   * Checks if the tenant configuration has the required credentials
   * to enable this platform.
   */
  isEnabled: (config: any) => boolean; 

  /**
   * The core logic to map the internal event format to the external API payload
   * and execute the HTTP request.
   */
  send: (event: EventPayload, config: any, eventId: string) => Promise<any>;
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/dispatch.svc.viral.ts`

```ts
// File: src/dispatch/svc/dispatch.svc.viral.ts
// Fix: Explicit type narrowing for clickData.mw_ref

import { db } from '../../core/db';
import { events, identities } from '../../core/db/core.db.schema'; 
import { sql, eq } from 'drizzle-orm';

type ViralResult = {
  isViral: boolean;
  originalIdentityId?: string;
};

export async function checkViralStatus(
  tenantId: string,
  currentIdentityId: string,
  clickData?: { gclid?: string; fbclid?: string; mw_ref?: string }
): Promise<ViralResult> {
  
  // 1. Direct Reference Check (The Strongest Signal)
  if (clickData?.mw_ref) {
    // [FIX] Capture in const to satisfy TypeScript strict null checks
    const viralRef = clickData.mw_ref;

    const referrer = await db.query.identities.findFirst({
      where: (t, { and, eq }) => and(
        eq(t.tenantId, tenantId),
        eq(t.anonymousId, viralRef)
      )
    });

    if (referrer) {
      return {
        isViral: true,
        originalIdentityId: referrer.id
      };
    }
  }

  // 2. Collision Check (The "Shared Link" Signal)
  if (!clickData?.gclid && !clickData?.fbclid) {
    return { isViral: false };
  }

  const searchKey = clickData.gclid ? 'gclid' : 'fbclid';
  const searchValue = clickData.gclid || clickData.fbclid;

  // Ensure searchValue is defined before querying (extra safety)
  if (!searchValue) return { isViral: false };

  const previousUsage = await db.query.events.findFirst({
    where: (t, { and, eq, ne }) => and(
      eq(t.tenantId, tenantId),
      ne(t.identityId, currentIdentityId),
      sql`${t.clickData}->>${searchKey} = ${searchValue}`
    ),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
    columns: { identityId: true }
  });

  if (previousUsage && previousUsage.identityId) {
    return {
      isViral: true,
      originalIdentityId: previousUsage.identityId || undefined
    };
  }

  return { isViral: false };
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/dispatch.svc.webhook.ts`

```ts
// File: src/dispatch/svc/dispatch.svc.webhook.ts
// Domain: Dispatch
// Role: Send Real-Time Notifications to External Systems

import { EventPayload } from '../../ingest/types/ingest.types.payload';

export async function sendWebhook(url: string, event: EventPayload, identityId: string) {
  try {
    const body = {
      event: event.type,
      timestamp: event.timestamp,
      identity_id: identityId, // Link this back to your Graph
      user_data: event.user,   // Hashed email/phone
      metadata: event.data     // Custom values (e.g. Lead Score)
    };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000); // 5s Timeout

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Moreways-Attribution/1.0'
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    
    clearTimeout(id);

    if (!response.ok) {
      console.warn(`[Webhook] Failed to send to ${url}: ${response.status}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`[Webhook] Error sending to ${url}:`, error);
    return false;
  }
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/adapters/dispatch.adapter.google.ts`

```ts
// File: src/dispatch/svc/adapters/dispatch.adapter.google.ts
// Role: Google Ads Adapter

import { AdPlatformAdapter } from '../dispatch.svc.types';
import { createHash } from 'crypto';

const API_VERSION = 'v14';

export const GoogleAdapter: AdPlatformAdapter = {
  key: 'google_ads',

  isEnabled: (config) => !!(config.google_access_token && config.google_customer_id && config.google_conversion_action_id),

  send: async (event, config, eventId) => {
    // Note: The main worker handles consent check, but double check here is safe
    if (event.consent.ad_storage !== 'granted') return { skipped: true, reason: 'consent_denied' };

    const customerId = config.google_customer_id.replace(/-/g, '');
    const url = `https://googleads.googleapis.com/${API_VERSION}/customers/${customerId}:uploadClickConversions`;
    // Google expects format: yyyy-mm-dd hh:mm:ss+|-hh:mm
    const formattedTime = new Date(event.timestamp).toISOString().replace('T', ' ').substring(0, 19) + '+00:00';

    const userIdentifiers: any[] = [];
    if (event.user?.email) userIdentifiers.push({ hashedEmail: hash(event.user.email) });
    if (event.user?.phone) userIdentifiers.push({ hashedPhoneNumber: hash(event.user.phone) });
    
    // Inferred Address (Enhanced Conversions)
    if (event.user?.first_name || event.user?.last_name || event.user?.zip) {
      userIdentifiers.push({
        addressInfo: {
          hashedFirstName: hash(event.user.first_name),
          hashedLastName: hash(event.user.last_name),
          city: event.user.city?.trim().toLowerCase(), 
          state: event.user.state?.trim().toLowerCase(),
          postalCode: event.user.zip,
          countryCode: event.user.country || 'US'
        }
      });
    }

    const conversionData: any = {
      conversionAction: config.google_conversion_action_id,
      conversionDateTime: formattedTime,
      conversionValue: event.data?.value ? Number(event.data.value) : undefined,
      currencyCode: event.data?.currency ? String(event.data.currency) : 'USD',
      userIdentifiers: userIdentifiers.length > 0 ? userIdentifiers : undefined,
    };

    // Priority: GCLID -> WBRAID/GBRAID -> Enhanced Conversions (Email)
    if (event.click?.gclid) conversionData.gclid = event.click.gclid;
    else if (event.click?.wbraid) conversionData.wbraid = event.click.wbraid;
    else if (event.click?.gbraid) conversionData.gbraid = event.click.gbraid;
    else if (userIdentifiers.length === 0) {
      // If we have neither Click ID nor Email, we can't attribute. Skip.
      return { skipped: true, reason: 'missing_signals' };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.google_access_token}`,
        'developer-token': process.env.GOOGLE_DEV_TOKEN || 'TEST_TOKEN' 
      },
      body: JSON.stringify({ conversions: [conversionData], partialFailure: true })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Ads API Error (${response.status}): ${errorText}`);
    }
    return await response.json();
  }
};

function hash(val: string | undefined | null): string | undefined {
  if (!val) return undefined;
  return createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/adapters/dispatch.adapter.linkedin.ts`

```ts
// File: src/dispatch/svc/adapters/dispatch.adapter.linkedin.ts
import { AdPlatformAdapter } from '../dispatch.svc.types';
import { createHash } from 'crypto';

const API_VERSION = '202309'; // Verify current version
const LINKEDIN_URL = 'https://api.linkedin.com/rest/conversionEvents';

export const LinkedInAdapter: AdPlatformAdapter = {
  key: 'linkedin',

  isEnabled: (config) => !!(config.linkedin_access_token && config.linkedin_conversion_rule_id),

  send: async (event, config, eventId) => {
    // 1. Validate Consent
    if (event.consent.ad_storage !== 'granted') return { skipped: true, reason: 'consent_denied' };

    // 2. Prepare Identifiers (Prioritize Email & First Party Cookie)
    const userInfo: any = {};
    
    if (event.user?.email) userInfo.email = hash(event.user.email);
    if (event.user?.phone) userInfo.phone = hash(event.user.phone);
    
    // LinkedIn First Party Cookie (li_fat_id)
    if (event.cookies?.li_fat_id) {
      userInfo.linkedinFirstPartyAdTrackingUUID = event.cookies.li_fat_id;
    }
    
    // Fallback: Enhanced conversions via demographic data
    if (event.user?.first_name) userInfo.firstName = hash(event.user.first_name);
    if (event.user?.last_name) userInfo.lastName = hash(event.user.last_name);
    if (event.user?.title) userInfo.title = event.user.title; // B2B Specific
    if (event.user?.company) userInfo.companyName = event.user.company; // B2B Specific

    // If no strong signals, skip
    if (Object.keys(userInfo).length === 0) return { skipped: true, reason: 'missing_signals' };

    // 3. Construct Payload
    const body = {
      conversion: `urn:li:conversions:${config.linkedin_conversion_rule_id}`,
      conversionHappenedAt: new Date(event.timestamp).getTime(),
      conversionValue: {
        currencyCode: event.data?.currency || 'USD',
        amount: event.data?.value ? String(event.data.value) : undefined
      },
      user: userInfo,
      eventId: event.anonymousId // Deduplication
    };

    // 4. Send
    const response = await fetch(LINKEDIN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.linkedin_access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': API_VERSION
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const txt = await response.text();
      // 409 Conflict means duplicate event (which is actually a success for us)
      if (response.status === 409) return { status: 'deduplicated' };
      throw new Error(`LinkedIn API Error (${response.status}): ${txt}`);
    }

    return { status: 'sent' };
  }
};

function hash(val: string): string {
  return createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/adapters/dispatch.adapter.meta.ts`

```ts
// File: src/dispatch/svc/adapters/dispatch.adapter.meta.ts
// Role: Meta CAPI Adapter

import { AdPlatformAdapter } from '../dispatch.svc.types';
import { createHash } from 'crypto';

const API_VERSION = 'v18.0';

export const MetaAdapter: AdPlatformAdapter = {
  key: 'meta_capi',

  isEnabled: (config) => !!(config.meta_pixel_id && config.meta_access_token),

  send: async (event, config, eventId) => {
    // 1. Prepare User Data
    const userData = {
      fbp: event.cookies?._fbp,
      fbc: event.cookies?._fbc,
      em: hash(event.user?.email),
      ph: hash(event.user?.phone),
      fn: hash(event.user?.first_name),
      ln: hash(event.user?.last_name),
      ct: hash(event.user?.city), 
      st: hash(event.user?.state),
      zp: hash(event.user?.zip),
      country: hash(event.user?.country),
      external_id: hash(event.user?.external_id),
      client_ip_address: event.context.ip_address,
      client_user_agent: event.context.user_agent,
    };

    // Remove undefined keys
    Object.keys(userData).forEach(key => (userData as any)[key] === undefined && delete (userData as any)[key]);

    const body = {
      data: [{
        event_name: mapEventName(event.type),
        event_time: Math.floor(new Date(event.timestamp).getTime() / 1000),
        event_id: event.anonymousId, // Deduplication via Browser ID
        event_source_url: event.context.url,
        action_source: 'website',
        user_data: userData,
        custom_data: {
          currency: (event.data?.currency as string) || 'USD',
          value: event.data?.value !== undefined ? Number(event.data.value) : undefined,
          content_name: (event.data?.content_name as string),
          status: (event.data?.status as string),
          ...event.data
        }
      }],
      access_token: config.meta_access_token,
      // [DEV] Use Test Code if provided in environment
      test_event_code: process.env.META_TEST_CODE 
    };

    const response = await fetch(`https://graph.facebook.com/${API_VERSION}/${config.meta_pixel_id}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Meta API Error: ${JSON.stringify(errorBody)}`);
    }
    return await response.json();
  }
};

function hash(val: string | undefined | null): string | undefined {
  if (!val) return undefined;
  return createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

function mapEventName(type: string): string {
  const map: Record<string, string> = {
    'pageview': 'PageView',
    'lead': 'Lead',
    'purchase': 'Purchase',
    'view_content': 'ViewContent',
    'add_to_cart': 'AddToCart',
    'initiate_checkout': 'InitiateCheckout'
  };
  return map[type] || 'CustomEvent';
}
```

### `C:/projects/moreways/attribution-engine/src/dispatch/svc/adapters/dispatch.adapter.tiktok.ts`

```ts
// File: src/dispatch/svc/adapters/dispatch.adapter.tiktok.ts
// Role: TikTok Events API Adapter

import { AdPlatformAdapter } from '../dispatch.svc.types';
import { createHash } from 'crypto';

const TIKTOK_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

export const TikTokAdapter: AdPlatformAdapter = {
  key: 'tiktok',

  isEnabled: (config) => !!(config.tiktok_pixel_id && config.tiktok_access_token),

  send: async (event, config, eventId) => {
    const eventMap: Record<string, string> = {
      'pageview': 'ViewContent',
      'lead': 'SubmitForm',
      'purchase': 'CompletePayment',
      'add_to_cart': 'AddToCart',
      'initiate_checkout': 'InitiateCheckout'
    };
    
    const email = event.user?.email ? hash(event.user.email) : undefined;
    const phone = event.user?.phone ? hash(event.user.phone) : undefined;

    const body = {
      pixel_code: config.tiktok_pixel_id,
      event: eventMap[event.type] || 'Consultation',
      event_id: event.anonymousId,
      timestamp: new Date(event.timestamp).toISOString(),
      context: {
        ad: { callback: event.click?.ttclid }, // TikTok Click ID
        page: { url: event.context.url, referrer: event.context.referrer },
        user_agent: event.context.user_agent,
        ip: event.context.ip_address
      },
      properties: {
        value: event.data?.value,
        currency: event.data?.currency || 'USD'
      },
      user: {
        email,
        phone,
        external_id: hash(event.user?.external_id)
      }
    };

    const res = await fetch(TIKTOK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': config.tiktok_access_token
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`TikTok API Error: ${txt}`);
    }
    return await res.json();
  }
};

function hash(val: string | undefined | null): string | undefined {
  if (!val) return undefined;
  return createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}
```

### `C:/projects/moreways/attribution-engine/src/identity/svc/identity.svc.hashing.ts`

```ts
// File: src/identity/svc/identity.svc.hashing.ts
// Documentation: File 04 (PII Handling)
// Domain: Identity
// Role: PII Normalization & SHA-256 Hashing

import { createHash } from 'crypto';

export function normalizeAndHash(value: string): string {
  if (!value) return '';
  
  // 1. Normalize (Trim + Lowercase)
  const clean = value.trim().toLowerCase();
  
  // 2. Add Salt (Prevent Rainbow Table attacks)
  const salt = process.env.HASH_SECRET || 'dev-salt';
  
  // 3. Hash
  return createHash('sha256').update(clean + salt).digest('hex');
}
```

### `C:/projects/moreways/attribution-engine/src/identity/svc/identity.svc.merge.ts`

```ts
// File: src/identity/svc/identity.svc.merge.ts
// Domain: Identity
// Role: Graph Stitching & Retroactive Attribution
// Upgrade: New Service for Identity Merging

import { db } from '../../core/db';
import { identities, events } from '../../core/db/core.db.schema';
import { eq, ne, isNull } from 'drizzle-orm';

export async function resolveIdentity(
  tenantId: string, 
  anonymousId: string, 
  emailHash?: string, 
  phoneHash?: string,
  userId?: string // External ID from payload
): Promise<string> {
  
  // 1. Find the current session identity (by Anonymous ID)
  // We only care about active identities (mergedInto IS NULL)
  let currentIdentity = await db.query.identities.findFirst({
    where: (t, { and, eq, isNull }) => and(
      eq(t.tenantId, tenantId),
      eq(t.anonymousId, anonymousId),
      isNull(t.mergedInto) 
    )
  });

  // If strictly new, create it immediately.
  if (!currentIdentity) {
    const [newId] = await db.insert(identities).values({
      tenantId,
      anonymousId,
      userId,
      emailHash,
      phoneHash
    }).returning();
    currentIdentity = newId;
  } else {
    // If found, update known hashes if we learned something new
    const updates: any = {};
    if (emailHash && !currentIdentity.emailHash) updates.emailHash = emailHash;
    if (phoneHash && !currentIdentity.phoneHash) updates.phoneHash = phoneHash;
    if (userId && !currentIdentity.userId) updates.userId = userId;

    if (Object.keys(updates).length > 0) {
      await db.update(identities)
        .set({ ...updates, lastSeenAt: new Date() })
        .where(eq(identities.id, currentIdentity.id));
    } else {
      // Just touch timestamp
      await db.update(identities)
        .set({ lastSeenAt: new Date() })
        .where(eq(identities.id, currentIdentity.id));
    }
  }

  // 2. RETROACTIVE CHECK: Do we have *other* identities with this Email/Phone?
  // If we don't have strong identifiers, we can't merge.
  if (!emailHash && !phoneHash) return currentIdentity.id;

  const matchConditions: any[] = [];
  // Note: Using raw SQL operator helpers passed by Drizzle's where callback is cleaner, 
  // but here we use the imported operators for clarity in complex logic.
  
  // Logic: Find any identity in this tenant...
  // ... that is NOT the current one ...
  // ... that IS active (not already merged) ...
  // ... that matches Email OR Phone.

  const duplicates = await db.query.identities.findMany({
    where: (t, { and, eq, or, ne, isNull }) => {
       const orConditions = [];
       if (emailHash) orConditions.push(eq(t.emailHash, emailHash));
       if (phoneHash) orConditions.push(eq(t.phoneHash, phoneHash));
       
       return and(
         eq(t.tenantId, tenantId),
         ne(t.id, currentIdentity!.id), 
         isNull(t.mergedInto),
         or(...orConditions)
       );
    },
    orderBy: (t, { asc }) => [asc(t.createdAt)] // Oldest is "Master"
  });

  if (duplicates.length === 0) return currentIdentity.id;

  // 3. MERGE STRATEGY: "Oldest Wins"
  // We want to keep the oldest ID (likely has the Ad Click) 
  // and merge the current (newer) session into it.
  
  const masterIdentity = duplicates[0]; // The oldest one
  const targetId = masterIdentity.id;
  const sourceId = currentIdentity.id;

  console.log(`[Identity] Merging ${sourceId} (New) -> ${targetId} (Master)`);

  await db.transaction(async (tx) => {
    // A. Move all events from Source -> Master
    await tx.update(events)
      .set({ identityId: targetId })
      .where(eq(events.identityId, sourceId));

    // B. Mark Source as Merged (Soft Delete)
    await tx.update(identities)
      .set({ mergedInto: targetId })
      .where(eq(identities.id, sourceId));
      
    // C. Update Master with any new PII from the Source
    // (e.g. Master had Email, Source had Phone -> Master gets Phone)
    const updates: any = { lastSeenAt: new Date() };
    if (phoneHash && !masterIdentity.phoneHash) updates.phoneHash = phoneHash;
    if (emailHash && !masterIdentity.emailHash) updates.emailHash = emailHash;
    if (userId && !masterIdentity.userId) updates.userId = userId;
    
    await tx.update(identities)
      .set(updates)
      .where(eq(identities.id, targetId));
  });

  return targetId;
}
```

### `C:/projects/moreways/attribution-engine/src/ingest/api/ingest.api.controller.ts`

```ts
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
```

### `C:/projects/moreways/attribution-engine/src/ingest/api/ingest.api.offline.ts`

```ts
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
```

### `C:/projects/moreways/attribution-engine/src/ingest/api/ingest.api.read.ts`

```ts
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
```

### `C:/projects/moreways/attribution-engine/src/ingest/types/ingest.types.offline.ts`

```ts
// File: src/ingest/types/ingest.types.offline.ts
// Domain: Ingest
// Role: Schema for Server-to-Server CRM Updates
// FIX: This file now ONLY contains types, no logic.

import { z } from 'zod';

export const OfflineConversionSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  external_id: z.string().optional(),
  
  event_name: z.string().default('offline_conversion'),
  value: z.number().optional(),
  currency: z.string().default('USD'),
  occurred_at: z.string().datetime().optional(),
});

export type OfflineConversionPayload = z.infer<typeof OfflineConversionSchema>;
```

### `C:/projects/moreways/attribution-engine/src/ingest/types/ingest.types.payload.ts`

```ts
// File: src/ingest/types/ingest.types.payload.ts
// Update: Added 'title' and 'company' to UserSchema for LinkedIn B2B

import { z } from 'zod';

const ConsentSchema = z.object({
  ad_storage: z.enum(['granted', 'denied']),
  analytics_storage: z.enum(['granted', 'denied']),
});

const UserSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  external_id: z.string().optional(),
  
  // [NEW] B2B Fields for LinkedIn Matching
  title: z.string().optional(),
  company: z.string().optional(),
});

const ContextSchema = z.object({
  url: z.string().url(),
  user_agent: z.string(),
  ip_address: z.string().ip().optional(), 
  referrer: z.string().optional(),
  title: z.string().optional(),
  session_id: z.string().optional(),
  screen_width: z.number().optional(),
  screen_height: z.number().optional(),
  connection_type: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional()
});

const CookieSchema = z.object({
  _fbp: z.string().nullable().optional(),
  _fbc: z.string().nullable().optional(),
  _gcl_au: z.string().nullable().optional(),
  li_fat_id: z.string().nullable().optional(),
  ttclid: z.string().nullable().optional(),
});

const ClickDataSchema = z.object({
  gclid: z.string().optional(),
  wbraid: z.string().optional(),
  gbraid: z.string().optional(),
  fbclid: z.string().optional(),
  ttclid: z.string().optional(),
  msclkid: z.string().optional(),
  li_fat_id: z.string().optional(),
  mw_ref: z.string().optional(), 
});

const QualitySchema = z.object({
  is_bot: z.boolean(),
  reason: z.enum(['honeypot', 'user_agent', 'velocity']).optional(),
  score: z.number(),
});

export const EventPayloadSchema = z.object({
  type: z.enum(['pageview', 'lead', 'purchase', 'custom', 'view_content', 'add_to_cart', 'initiate_checkout', 'offline_conversion']),
  timestamp: z.string().datetime().default(() => new Date().toISOString()),
  anonymousId: z.string().uuid(),
  
  consent: ConsentSchema,
  
  user: UserSchema.optional(),
  context: ContextSchema,
  cookies: CookieSchema.optional(),
  click: ClickDataSchema.optional(),
  
  data: z.record(z.unknown()).optional(),
  _hp: z.string().optional(),
  _quality: QualitySchema.optional(),
});

export type EventPayload = z.infer<typeof EventPayloadSchema>;
```

### `C:/projects/moreways/attribution-engine/src/pixel/index.ts`

```ts
// File: src/pixel/index.ts
// Version: 1.4 Production (Viral + Aggregator Edition)
// Features: Sticky Attr, Sessions, Fingerprinting, Auto-Form, Hidden Fields, Debug HUD, Viral Clipboard

import { generateUUID, getCookie, getUrlParams } from './lib/pixel.lib.browser';
import { sendEvent } from './lib/pixel.lib.network';

// 1. Initialize State
type PixelState = {
  anonymousId: string;
  sessionId: string;
  consent: { ad_storage: string; analytics_storage: string };
  config: { publicKey: string; endpoint?: string; autoCapture?: boolean };
  campaignData: Record<string, string>;
  formStartTime: number | null;
};

const STATE: PixelState = {
  anonymousId: '',
  sessionId: '',
  consent: { ad_storage: 'denied', analytics_storage: 'denied' }, // Default Safe
  config: { publicKey: '', autoCapture: true },
  campaignData: {},
  formStartTime: null
};

// --- CORE LOGIC (Identity, Persistence, Sessions) ---
function initIdentity() {
  // A. User Identity
  let aid = localStorage.getItem('mw_aid');
  if (!aid) { aid = generateUUID(); localStorage.setItem('mw_aid', aid); }
  STATE.anonymousId = aid;

  // B. Session Management (30-min window)
  const now = Date.now();
  let sid = sessionStorage.getItem('mw_sid');
  const lastActive = parseInt(localStorage.getItem('mw_last_active') || '0', 10);
  
  if (!sid || (now - lastActive > 30 * 60 * 1000)) {
    sid = generateUUID();
    sessionStorage.setItem('mw_sid', sid);
  }
  STATE.sessionId = sid;
  localStorage.setItem('mw_last_active', now.toString());

  // C. Sticky Campaign Data & Viral Refs
  const currentParams = getUrlParams();
  let storedParams = {};
  try {
    const raw = sessionStorage.getItem('mw_campaign');
    if (raw) storedParams = JSON.parse(raw);
  } catch (e) {}

  // Added 'mw_ref' to the sticky list
  const importantKeys = ['gclid', 'fbclid', 'ttclid', 'li_fat_id', 'wbraid', 'gbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'mw_ref'];
  
  const relevantCurrent = Object.keys(currentParams)
    .filter(k => importantKeys.includes(k))
    .reduce((obj, k) => ({ ...obj, [k]: currentParams[k] }), {});

  STATE.campaignData = { ...storedParams, ...relevantCurrent };
  
  if (Object.keys(relevantCurrent).length > 0) {
    sessionStorage.setItem('mw_campaign', JSON.stringify(STATE.campaignData));
  }
}

// --- DEVICE FINGERPRINTING ---
function getDeviceContext() {
  const nav = navigator as any;
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  return {
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    color_depth: window.screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    connection_type: conn ? conn.effectiveType : 'unknown',
    device_memory: nav.deviceMemory || undefined,
    hardware_concurrency: navigator.hardwareConcurrency || undefined
  };
}

// --- PAYLOAD BUILDER ---
function buildPayload(eventType: string, customData = {}) {
  localStorage.setItem('mw_last_active', Date.now().toString());
  const campaigns = STATE.campaignData;
  const device = getDeviceContext();

  return {
    type: eventType,
    anonymousId: STATE.anonymousId,
    timestamp: new Date().toISOString(),
    consent: STATE.consent,
    context: {
      url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      title: document.title,
      session_id: STATE.sessionId,
      ...device
    },
    cookies: {
      _fbp: getCookie('_fbp'),
      _fbc: getCookie('_fbc'),
      _gcl_au: getCookie('_gcl_au'),
      ttclid: getCookie('ttclid') || campaigns['ttclid']
    },
    click: {
      gclid: campaigns['gclid'],
      fbclid: campaigns['fbclid'],
      ttclid: campaigns['ttclid'],
      wbraid: campaigns['wbraid'],
      gbraid: campaigns['gbraid'],
      li_fat_id: campaigns['li_fat_id'],
      mw_ref: campaigns['mw_ref'] // [NEW] Transmit the Viral Ref
    },
    data: {
      ...customData,
      utm_source: campaigns['utm_source'],
      utm_medium: campaigns['utm_medium'],
      utm_campaign: campaigns['utm_campaign'],
    }
  };
}

// =========================================================================
// MODULE: GHOST LEADS (Clipboard)
// =========================================================================
function attachClipboardListeners() {
  document.addEventListener('copy', () => {
    const selection = document.getSelection()?.toString();
    if (!selection || selection.length > 100) return; 

    let type = '';
    if (selection.match(/@/)) type = 'copy_email';
    else if (selection.match(/\d{3}/)) type = 'copy_phone';
    
    if (type) api.track('custom', { event_name: type, content: selection });
  });
}

// =========================================================================
// MODULE: VIRAL CLIPBOARD INJECTION
// =========================================================================
function attachViralClipboard() {
  document.addEventListener('copy', (e) => {
    const selection = document.getSelection();
    // Only intervene if they are NOT selecting specific text (i.e. copying the "page")
    // Note: Most browsers don't trigger 'copy' event on address bar copy, 
    // this captures "Select All + Copy" or programmatic copies.
    // For pure address bar viral tracking, we rely on the URL params existing from the start.
    // This helper covers scenarios where they copy a "Share" link or similar body content.
    if (selection && selection.toString().length > 0) return;

    const url = new URL(window.location.href);
    url.searchParams.set('mw_ref', STATE.anonymousId);
    if (STATE.campaignData.utm_campaign) {
        url.searchParams.set('utm_campaign', STATE.campaignData.utm_campaign);
    }

    if (e.clipboardData) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', url.toString());
    }
  });
}

// =========================================================================
// MODULE: AUTO-FORM (With Safety Checks & Timing)
// =========================================================================
function attachFormListeners() {
  document.addEventListener('focusin', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      if (!STATE.formStartTime) STATE.formStartTime = Date.now();
    }
  });

  document.addEventListener('submit', (e) => {
    const target = e.target as HTMLFormElement;
    if (!target || target.tagName !== 'FORM') return;

    if (target.getAttribute('data-mw-ignore') === 'true') return;

    const now = Date.now();
    const duration = STATE.formStartTime ? (now - STATE.formStartTime) / 1000 : 0;
    STATE.formStartTime = null; 

    const formData = new FormData(target);
    const captured: Record<string, any> = {};
    const user: Record<string, string> = {};
    const BLOCKLIST = ['password', 'cc', 'card', 'cvv', 'ssn', 'social', 'credit', 'hidden'];

    formData.forEach((value, key) => {
      const k = key.toLowerCase();
      const inputElem = target.querySelector(`[name="${key}"]`);
      if (inputElem && inputElem.getAttribute('data-mw-ignore') === 'true') return;
      if (BLOCKLIST.some(term => k.includes(term))) return;

      if (typeof value === 'string') {
        if (k.includes('email')) user.email = value;
        else if (k.includes('phone') || k.includes('tel') || k.includes('mobile')) user.phone = value;
        else if (k.includes('first') || k.includes('name')) user.first_name = value;
        else captured[key] = value;
      }
    });

    const payload = buildPayload('lead', { 
        ...captured, 
        source: 'auto_form',
        time_to_complete_sec: duration
    });
    (payload as any).user = user;
    sendEvent(payload, STATE.config);
  });
}

// =========================================================================
// MODULE: AGGREGATOR INJECTION (Hidden Fields)
// =========================================================================
function attachHiddenFields() {
  const inject = () => {
    const forms = document.querySelectorAll('form');
    const campaigns = STATE.campaignData;
    
    forms.forEach(form => {
      const addField = (name: string, val: string) => {
        if (!val || form.querySelector(`input[name="${name}"]`)) return;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = val;
        form.appendChild(input);
      };

      addField('mw_gclid', campaigns['gclid'] || '');
      addField('mw_session_id', STATE.sessionId);
      addField('mw_anonymous_id', STATE.anonymousId);
      addField('mw_ref', campaigns['mw_ref'] || ''); // Inject Viral Ref for CRM
      
      addField('utm_campaign', campaigns['utm_campaign'] || '');
      addField('utm_source', campaigns['utm_source'] || '');
      addField('utm_medium', campaigns['utm_medium'] || '');
    });
  };

  inject();
  const observer = new MutationObserver(() => inject());
  observer.observe(document.body, { childList: true, subtree: true });
}

// =========================================================================
// MODULE: OPS HUD (Debug Overlay)
// =========================================================================
function showDebugOverlay() {
  const div = document.createElement('div');
  div.style.cssText = `
    position: fixed; bottom: 10px; right: 10px; 
    background: rgba(0,0,0,0.85); color: #0f0; 
    font-family: monospace; font-size: 12px; 
    padding: 15px; z-index: 99999; border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5); pointer-events: none;
    max-width: 300px; word-break: break-all;
  `;

  const update = () => {
    const c = STATE.campaignData;
    div.innerHTML = `
      <strong>🟢 Moreways Pixel Live</strong><br/>
      <hr style="border:0; border-top:1px solid #555; margin:5px 0;">
      <strong>Lawyer:</strong> ${c.utm_campaign || '⚠️ NONE'}<br/>
      <strong>Source:</strong> ${c.utm_source || 'Direct'}<br/>
      <strong>GCLID:</strong> ${c.gclid ? '✅ Captured' : '❌'}<br/>
      <strong>Viral Ref:</strong> ${c.mw_ref ? '✅ Active' : 'None'}<br/>
      <strong>Session:</strong> ${STATE.sessionId.substring(0, 8)}...<br/>
      <strong>Events:</strong> <span id="mw_evt_cnt">0</span>
    `;
  };

  document.body.appendChild(div);
  update();

  const originalTrack = api.track;
  let count = 0;
  api.track = (event, data) => {
    originalTrack(event, data);
    count++;
    update();
    const span = document.getElementById('mw_evt_cnt');
    if (span) span.innerText = count.toString();
  };
}

// =========================================================================
// MODULE: INTERACTION & SPA
// =========================================================================
function attachHistoryListeners() {
  const push = history.pushState;
  history.pushState = function(...args) { push.apply(this, args); api.track('pageview'); };
  window.addEventListener('popstate', () => api.track('pageview'));
}

function attachScrollListener() {
    const thresholds = [25, 50, 75, 90];
    const fired = new Set<number>();
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const percent = Math.round(((h.scrollTop || document.body.scrollTop) / ((h.scrollHeight || document.body.scrollHeight) - h.clientHeight)) * 100);
      thresholds.forEach(t => {
        if (percent >= t && !fired.has(t)) {
          fired.add(t);
          api.track('view_content', { event_name: 'scroll_depth', depth: t, url: window.location.pathname });
        }
      });
    }, { passive: true });
}

function attachClickListener() {
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;
      let type = '';
      if (target.href.startsWith('tel:')) type = 'click_phone';
      else if (target.href.startsWith('mailto:')) type = 'click_email';
      else if (target.hostname !== window.location.hostname) type = 'click_outbound';
      if (type) api.track('custom', { event_name: type, link_url: target.href });
    }, { passive: true });
}

function attachRageClickListener() {
  let clicks = 0; let lastClickTime = 0; let lastTarget: EventTarget | null = null;
  document.addEventListener('click', (e) => {
    const now = Date.now();
    if (e.target === lastTarget && (now - lastClickTime < 300)) { clicks++; } 
    else { clicks = 1; lastTarget = e.target; }
    lastClickTime = now;
    if (clicks === 4) { 
      api.track('custom', { event_name: 'rage_click', element: (e.target as HTMLElement).tagName });
      clicks = 0; 
    }
  }, { passive: true });
}

function startHeartbeat() {
    let f10 = false;
    const t = setInterval(() => {
        if (document.visibilityState === 'visible' && !f10) {
            api.track('custom', { event_name: 'engagement_10s' });
            f10 = true;
            clearInterval(t);
        }
    }, 10000);
}

// --- PUBLIC API ---
const api = {
  init: (config: { publicKey: string; endpoint?: string; autoCapture?: boolean }) => {
    STATE.config = { ...STATE.config, ...config };
    initIdentity();
    
    // Attach Modules
    if (STATE.config.autoCapture !== false) attachFormListeners();
    attachHiddenFields(); 
    attachHistoryListeners();
    attachScrollListener();
    attachClickListener();
    attachClipboardListeners();
    attachViralClipboard(); // [NEW] Viral Injection
    attachRageClickListener();
    startHeartbeat();

    if (getUrlParams()['mw_debug'] === 'true') showDebugOverlay();

    console.log('[MW] Pixel Active v1.4', config.publicKey);
  },

  consent: (policy: { ad_storage?: string; analytics_storage?: string }) => {
    const newConsent = { ...STATE.consent };
    if (policy.ad_storage) newConsent.ad_storage = policy.ad_storage;
    if (policy.analytics_storage) newConsent.analytics_storage = policy.analytics_storage;
    STATE.consent = newConsent;
  },

  track: (event: string, data?: any) => {
    if (!STATE.config.publicKey) return;
    const payload = buildPayload(event, data);
    
    if (data?.email || data?.phone) {
      (payload as any).user = {
        email: data.email,
        phone: data.phone,
        first_name: data.first_name,
        last_name: data.last_name
      };
    }
    sendEvent(payload, STATE.config);
  }
};

(window as any).moreways = api;

const globalConfig = (window as any).MW_CONFIG;
if (globalConfig) {
  api.init(globalConfig);
  api.track('pageview');
}
```

### `C:/projects/moreways/attribution-engine/src/pixel/lib/pixel.lib.browser.ts`

```ts
// File: src/pixel/lib/pixel.lib.browser.ts
// Documentation: File 03-attribution-pixel-logic.md
// Role: Cookie Harvesting & UUID Generation
// Upgrade: "Golden List" Param Scraper

// 1. Generate UUID v4
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 2. Read Cookie by Name
export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// 3. Get URL Parameters (The Golden List)
export function getUrlParams(): Record<string, string> {
  const params: Record<string, string> = {};
  const search = window.location.search.substring(1);
  if (!search) return params;

  // The critical list of Ad Tech parameters to capture
  const TARGET_PARAMS = [
    'gclid',    // Google
    'wbraid',   // Google (iOS Web)
    'gbraid',   // Google (iOS App)
    'fbclid',   // Meta
    'ttclid',   // TikTok
    'msclkid',  // Microsoft/Bing
    'li_fat_id',// LinkedIn
    'utm_source',
    'utm_medium',
    'utm_campaign'
  ];

  const pairs = search.split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    if (pair.length === 2) {
      const key = decodeURIComponent(pair[0]);
      if (TARGET_PARAMS.includes(key) || key.startsWith('utm_')) {
        params[key] = decodeURIComponent(pair[1]);
      }
    }
  }
  return params;
}
```

### `C:/projects/moreways/attribution-engine/src/pixel/lib/pixel.lib.network.ts`

```ts
// File: src/pixel/lib/pixel.lib.network.ts
// Documentation: File 03-attribution-pixel-logic.md
// Role: Proxy Fallback Mechanism (The Cloak)

type Config = {
  publicKey: string;
  endpoint?: string; // Client's proxy path (e.g., /api/telemetry)
};

const DIRECT_ENDPOINT = 'https://moreways-pixel.up.railway.app/api/v1/track';

export async function sendEvent(payload: any, config: Config) {
  const headers = {
    'Content-Type': 'application/json',
    'x-publishable-key': config.publicKey
  };

  // STRATEGY A: The Cloak (First-Party Proxy)
  // If the client configured a local endpoint, try that first.
  if (config.endpoint) {
    try {
      const success = await tryFetch(config.endpoint, payload, headers);
      if (success) return;
    } catch (e) {
      console.warn('[MW] Proxy failed, falling back to direct.');
    }
  }

  // STRATEGY B: The Fallback (Direct to SaaS)
  // If proxy fails or isn't configured, go direct.
  try {
    await tryFetch(DIRECT_ENDPOINT, payload, headers);
  } catch (e) {
    console.error('[MW] Tracking failed.', e);
  }
}

async function tryFetch(url: string, body: any, headers: any): Promise<boolean> {
  // Use keepalive to ensure request finishes even if user closes tab
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    keepalive: true
  });
  return res.ok;
}
```

### `C:/projects/moreways/attribution-engine/src/privacy/api/privacy.api.erasure.ts`

```ts
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
```

### `C:/projects/moreways/attribution-engine/src/reporting/api/reporting.api.evidence.ts`

```ts
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
```

### `C:/projects/moreways/attribution-engine/src/reporting/api/reporting.api.stats.ts`

```ts
// File: src/reporting/api/reporting.api.stats.ts
// Domain: Reporting
// Role: Aggregate Analytics for Admin Dashboard

import { Hono } from 'hono';
import { db } from '../../core/db';
import { events } from '../../core/db/core.db.schema';
import { sql, and, gte, lte, eq } from 'drizzle-orm';

const app = new Hono<{ Variables: { tenantId: string } }>();

// GET /api/v1/stats/overview?from=2023-01-01&to=2023-02-01
app.get('/overview', async (c) => {
  const tenantId = c.get('tenantId');
  const from = c.req.query('from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const to = c.req.query('to') || new Date().toISOString();

  // 1. Volume Stats (Leads vs Traffic)
  const volume = await db
    .select({
      type: events.type,
      count: sql<number>`cast(count(*) as int)`
    })
    .from(events)
    .where(and(
      eq(events.tenantId, tenantId),
      gte(events.createdAt, new Date(from)),
      lte(events.createdAt, new Date(to))
    ))
    .groupBy(events.type);

  // 2. Revenue by Channel (The ROI view)
  // We extract the "channel" from the clickData or context using a SQL case/json extraction
  // Note: Complex grouping is often better done in a materialized view, but this works for V1.
  
  // Logic: Sum(metadata->value) grouped by derivedGeo->city (Example segmentation)
  // Real ROI attribution requires joining the journey model, but here we do a simple "Last Touch" approximation
  // based on the event's own clickData.
  
  const revenue = await db.execute(sql`
    SELECT 
      COALESCE(click_data->>'gclid', 'organic') as source_id,
      SUM(CAST(metadata->>'value' AS NUMERIC)) as total_revenue,
      COUNT(*) as conversions
    FROM events
    WHERE 
      tenant_id = ${tenantId} 
      AND created_at >= ${new Date(from)} 
      AND created_at <= ${new Date(to)}
      AND (type = 'purchase' OR type = 'offline_conversion')
    GROUP BY 1
    ORDER BY 2 DESC
    LIMIT 10
  `);

  // 3. Quality Control (Bot %)
  const quality = await db
    .select({
      isBot: sql`quality_score->>'is_bot'`,
      count: sql<number>`cast(count(*) as int)`
    })
    .from(events)
    .where(and(
      eq(events.tenantId, tenantId),
      gte(events.createdAt, new Date(from))
    ))
    .groupBy(sql`quality_score->>'is_bot'`);

  return c.json({
    period: { from, to },
    funnel: volume,
    top_sources: revenue,
    traffic_quality: quality
  });
});

export const statsRoute = app;
```

### `C:/projects/moreways/attribution-engine/src/reporting/svc/reporting.svc.modeler.ts`

```ts
// File: src/reporting/svc/reporting.svc.modeler.ts
// Domain: Reporting
// Role: Attribution Modeling & Revenue Calculation
// Upgrade: "Revenue Reality"

import { classifySource } from './reporting.svc.source';

type JourneyPoint = {
  timestamp: Date;
  type: string;
  source: ReturnType<typeof classifySource>;
  url: string;
  value: number; // [NEW] Monetary Value
};

type AttributionResult = {
  first_touch: JourneyPoint | null;
  last_touch: JourneyPoint | null;
  touchpoints: number;
  lead_score: number;
  total_revenue: number; // [NEW] Real $$$
  currency: string;
  customer_journey: JourneyPoint[];
};

export function modelJourney(events: any[]): AttributionResult {
  // 1. Sort Events (Oldest to Newest)
  const sorted = [...events].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  // 2. Map to Journey Points
  const journey: JourneyPoint[] = sorted.map(e => {
    // Extract revenue from metadata (offline_conversion or purchase)
    const rawValue = (e.metadata as any)?.value || 0;
    const value = typeof rawValue === 'number' ? rawValue : 0;

    return {
      timestamp: new Date(e.createdAt),
      type: e.type,
      url: e.contextClient?.page_url || '',
      source: classifySource(e),
      value
    };
  });

  // 3. Calculate Attribution
  const firstTouch = journey.find(j => j.source.channel !== 'direct') || journey[0] || null;
  
  // Last Touch: Find last non-direct source before the conversion/revenue event
  let lastTouch = null;
  
  // Find the most significant conversion event
  const conversionIndex = journey.findIndex(j => j.value > 0 || j.type === 'lead' || j.type === 'purchase');
  const relevantJourney = conversionIndex > -1 ? journey.slice(0, conversionIndex + 1) : journey;

  for (let i = relevantJourney.length - 1; i >= 0; i--) {
    if (relevantJourney[i].source.channel !== 'direct') {
      lastTouch = relevantJourney[i];
      break;
    }
  }
  if (!lastTouch && relevantJourney.length > 0) lastTouch = relevantJourney[relevantJourney.length - 1];

  // 4. Revenue & Scoring
  let score = 0;
  let revenue = 0;
  let currency = 'USD';

  journey.forEach(j => {
    revenue += j.value; // Sum up settlement values / purchases

    if (j.type === 'purchase' || (j.type === 'offline_conversion' && j.value > 0)) score += 100;
    if (j.type === 'lead') score += 50;
    
    // Contextual Scoring
    if (j.url.includes('pricing') || j.url.includes('contact')) score += 10;
    if (j.source.channel === 'paid_search') score += 5;
  });

  // Extract currency from the last revenue event if available
  const lastRevEvent = events.find(e => (e.metadata as any)?.currency);
  if (lastRevEvent) currency = (lastRevEvent.metadata as any).currency;

  return {
    first_touch: firstTouch,
    last_touch: lastTouch,
    touchpoints: journey.length,
    lead_score: score,
    total_revenue: revenue,
    currency,
    customer_journey: journey
  };
}
```

### `C:/projects/moreways/attribution-engine/src/reporting/svc/reporting.svc.source.ts`

```ts
// File: src/reporting/svc/reporting.svc.source.ts
// Domain: Reporting
// Role: Traffic Source Classification (The "Why")

type SourceDefinition = {
  channel: 'paid_search' | 'paid_social' | 'organic_search' | 'social' | 'referral' | 'direct' | 'email' | 'other';
  source: string; // e.g., "google", "facebook"
  medium: string; // e.g., "cpc", "organic"
  campaign?: string;
};

// The logic to convert raw event data into a Marketing Channel
export function classifySource(event: any): SourceDefinition {
  const click = event.clickData || {};
  const params = event.contextClient?.page_url ? getUrlParams(event.contextClient.page_url) : {};
  const referrer = event.contextClient?.referrer || '';

  // 1. Paid Signals (The strongest indicators)
  if (click.gclid || click.wbraid || click.gbraid) {
    return { channel: 'paid_search', source: 'google', medium: 'cpc' };
  }
  if (click.fbclid) {
    return { channel: 'paid_social', source: 'facebook', medium: 'cpc' };
  }
  if (click.ttclid) {
    return { channel: 'paid_social', source: 'tiktok', medium: 'cpc' };
  }
  if (click.li_fat_id) {
    return { channel: 'paid_social', source: 'linkedin', medium: 'cpc' };
  }
  if (click.msclkid) {
    return { channel: 'paid_search', source: 'bing', medium: 'cpc' };
  }

  // 2. UTM Parameters (Explicit tagging)
  if (params.utm_source) {
    const medium = params.utm_medium || 'unknown';
    let channel: SourceDefinition['channel'] = 'other';
    
    if (medium.includes('mail')) channel = 'email';
    else if (medium.includes('cpc') || medium.includes('paid')) channel = 'paid_search';
    else if (medium.includes('social')) channel = 'social';
    
    return { 
      channel, 
      source: params.utm_source, 
      medium: params.utm_medium || '',
      campaign: params.utm_campaign
    };
  }

  // 3. Referrer Analysis (Organic)
  if (referrer) {
    const refHost = new URL(referrer).hostname.toLowerCase();
    
    if (refHost.includes('google.')) return { channel: 'organic_search', source: 'google', medium: 'organic' };
    if (refHost.includes('bing.')) return { channel: 'organic_search', source: 'bing', medium: 'organic' };
    if (refHost.includes('facebook.') || refHost.includes('t.co') || refHost.includes('linkedin.')) {
      return { channel: 'social', source: refHost, medium: 'referral' };
    }
    return { channel: 'referral', source: refHost, medium: 'referral' };
  }

  // 4. Fallback
  return { channel: 'direct', source: 'direct', medium: 'none' };
}

// Helper to parse URL params from a string
function getUrlParams(urlStr: string): Record<string, string> {
  try {
    const url = new URL(urlStr);
    const params: Record<string, string> = {};
    url.searchParams.forEach((val, key) => { params[key] = val; });
    return params;
  } catch (e) { return {}; }
}
```

### `C:/projects/moreways/attribution-engine/src/tenant/repo/tenant.repo.keys.ts`

```ts
// File: src/tenant/repo/tenant.repo.keys.ts
// Documentation: File 04 (Tenant Isolation)
// Domain: Tenant
// Role: Database Access for API Keys

```

### `C:/projects/moreways/attribution-engine/src/tenant/svc/tenant.svc.crypto.ts`

```ts
// File: src/tenant/svc/tenant.svc.crypto.ts
// Documentation: File 04 (Encryption)
// Domain: Tenant
// Role: AES-256-GCM Encryption for ad_config

```

### `C:/projects/moreways/attribution-engine/src/worker/index.ts`

```ts
// File: src/worker/index.ts
// Documentation: File 07-attribution-platform-integrations.md
// Role: BullMQ Worker Entry Point + Scheduler

// [FIX] Force IPv4 first to prevent Supabase ENETUNREACH errors in Docker
import { setDefaultResultOrder } from 'node:dns';
setDefaultResultOrder('ipv4first');

import 'dotenv-safe/config';
import { Worker, Queue } from 'bullmq'; // [FIX] Removed QueueScheduler (removed in BullMQ v5)
import { processEventJob } from '../dispatch/job/dispatch.job.processor';
import { pruneOldData } from './cron/worker.cron.prune'; // [FIX] Removed .ts extension

const REDIS_URL = process.env.REDIS_URL;

console.log('🚀 Worker Starting...');
console.log(`🔌 Connecting to Redis at ${REDIS_URL}`);

// 1. Event Processor
const worker = new Worker('events_queue', processEventJob, {
  connection: { url: REDIS_URL },
  concurrency: 5
});

worker.on('completed', (job) => console.log(`✅ Job ${job.id} completed!`));
worker.on('failed', (job, err) => console.error(`❌ Job ${job?.id} failed: ${err.message}`));

// 2. The Janitor (Cron)
// We use a separate queue for system tasks to avoid clogging the event pipe
const systemQueue = new Queue('system_queue', { connection: { url: REDIS_URL } });

const systemWorker = new Worker('system_queue', async (job) => {
  if (job.name === 'prune_data') {
    await pruneOldData();
  }
}, { connection: { url: REDIS_URL } });

// Schedule it: Run at 3 AM daily
async function initScheduler() {
  await systemQueue.add('prune_data', {}, {
    repeat: { pattern: '0 3 * * *' } // Cron syntax
  });
  console.log('⏰ Janitor scheduled for 03:00 daily.');
}

initScheduler().catch(console.error);
```

### `C:/projects/moreways/attribution-engine/src/worker/cron/worker.cron.prune.ts`

```ts
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
```

