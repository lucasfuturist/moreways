// File: src/dispatch/svc/dispatch.svc.geo.ts

type GeoResult = {
  city?: string;
  region?: string; // ISO State Code (e.g. NY)
  country?: string; // ISO Country Code (e.g. US)
  postal_code?: string;
};

export async function resolveIpLocation(ip: string): Promise<GeoResult> {
  // 1. Handle Localhost / Internal immediately
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return { city: 'Localhost', country: 'US' };
  }

  try {
    // 2. REAL FETCH: Using ip-api.com (Robust & Fast)
    // Note: For high production volume, buy a pro key or use ipinfo.io with a token.
    // This endpoint is free for up to 45 requests/minute.
    const url = `http://ip-api.com/json/${ip}?fields=status,message,countryCode,region,city,zip`;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000); // 2s Timeout (Fail Open)

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return {
          city: data.city,
          region: data.region, // This is the State Code (e.g., 'NY')
          country: data.countryCode,
          postal_code: data.zip
        };
      }
    }
    
    console.warn(`[Geo] API returned error for ${ip}`);
    return { city: 'Unknown', country: 'US' }; // Fail Open

  } catch (e) {
    console.error(`[Geo] Lookup failed for IP ${ip}:`, e);
    // Return empty but valid object so the worker doesn't crash
    return { city: 'Unknown', country: 'US' };
  }
}

// Keep the jurisdiction check logic, it's fine
export function checkJurisdiction(
  geo: GeoResult, 
  config: { allowed_countries?: string[]; allowed_regions?: string[] }
): boolean {
  if (!config.allowed_countries && !config.allowed_regions) return true;

  if (config.allowed_countries && config.allowed_countries.length > 0) {
    if (!geo.country || !config.allowed_countries.includes(geo.country)) {
      return false;
    }
  }

  if (config.allowed_regions && config.allowed_regions.length > 0) {
    if (!geo.region || !config.allowed_regions.includes(geo.region)) {
      return false;
    }
  }

  return true;
}