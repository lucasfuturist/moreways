// File: src/pixel/lib/pixel.lib.browser.ts
// Documentation: File 03-attribution-pixel-logic.md
// Role: Cookie Harvesting & UUID Generation
// Upgrade: "Golden List" Param Scraper

// 1. Generate UUID v4
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 2. Read Cookie by Name
export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// 3. Get URL Parameters (The Golden List)
export function getUrlParams(): Record<string, string> {
  const params: Record<string, string> = {};
  const search = window.location.search.substring(1);
  if (!search) return params;

  // The critical list of Ad Tech parameters to capture
  const TARGET_PARAMS = [
    'gclid',    // Google
    'wbraid',   // Google (iOS Web)
    'gbraid',   // Google (iOS App)
    'fbclid',   // Meta
    'ttclid',   // TikTok
    'msclkid',  // Microsoft/Bing
    'li_fat_id',// LinkedIn
    'utm_source',
    'utm_medium',
    'utm_campaign'
  ];

  const pairs = search.split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    if (pair.length === 2) {
      const key = decodeURIComponent(pair[0]);
      if (TARGET_PARAMS.includes(key) || key.startsWith('utm_')) {
        params[key] = decodeURIComponent(pair[1]);
      }
    }
  }
  return params;
}