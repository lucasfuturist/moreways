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