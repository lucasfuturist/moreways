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