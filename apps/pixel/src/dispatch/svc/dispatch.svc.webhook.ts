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