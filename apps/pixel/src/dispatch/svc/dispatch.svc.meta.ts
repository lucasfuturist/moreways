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