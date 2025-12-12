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