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