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