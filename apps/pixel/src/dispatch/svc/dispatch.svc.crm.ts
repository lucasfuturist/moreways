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