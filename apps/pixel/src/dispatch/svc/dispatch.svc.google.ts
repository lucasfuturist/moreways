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