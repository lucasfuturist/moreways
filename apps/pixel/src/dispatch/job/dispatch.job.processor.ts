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