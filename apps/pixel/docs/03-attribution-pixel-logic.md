# Attribution Engine – Pixel Specification (v1.0)

**File:** `public/tracking.js`
**Size Target:** < 3KB (Gzipped)
**Constraint:** Zero dependencies. Must run on any site (React, Wordpress, plain HTML).

---

## 1. Initialization & Configuration

The script initializes by checking for a global configuration object set by the site owner.

```javascript
window.MW_CONFIG = {
  publicKey: "pk_mw_...",    // Required: Identifies the tenant
  endpoint: "/api/telemetry", // Optional: First-party proxy path (The "Cloak")
  autoCapture: true           // Optional: Auto-hook forms
};
```

## 2. The "Cloaking" Logic (Proxy Fallback)

To ensure **100% Ingestion** even against aggressive AdBlockers, the pixel utilizes a "Race & Fallback" network strategy.

**Logic Flow:**
1.  **Attempt 1 (The Cloak):** Send beacon to the Client's First-Party Proxy (e.g., `client-site.com/api/telemetry`).
    *   *Why:* This looks like internal API traffic (Same Origin) and passes uBlock Origin/AdGuard.
2.  **Attempt 2 (The Fallback):** If Attempt 1 returns 404 or Network Error (proxy not set up), send directly to the SaaS Endpoint (`api.moreways-analytics.com/track`).

This ensures reliability: if the client forgets to set up the Next.js proxy, it still works. If the user blocks the SaaS domain, the proxy saves the data.

## 3. Cookie Harvesting (The Bridge)

The pixel aggressively scans `document.cookie` for "Golden Keys"—identifiers set by ad networks. These are crucial for the "Match Rate."

**Target Keys (Read-Only):**
*   `_fbp`, `_fbc` (Meta)
*   `_gcl_au`, `_ga`, `gclid` (Google)
*   `li_fat_id` (LinkedIn)
*   `ttclid` (TikTok)

*Note:* We do not set these cookies. We only read existing values set by the Ad Platforms to bridge the identity.

## 4. PII Scraping & Hashing

When a `lead` event occurs (form submit), the pixel executes a heuristic scan of `FormData`.

1.  **Detection:** Identify fields named `email`, `e-mail`, `phone`, `tel`, `mobile`.
2.  **Normalization:**
    *   Email: Trim whitespace, convert to lowercase.
    *   Phone: Remove non-numeric characters (keep `+`).
3.  **Transport:** Send the raw value over **TLS 1.3** to the Ingestion API.
    *   *Security Note:* Hashing happens Server-Side in memory. Doing SHA-256 client-side requires heavy crypto libraries (~20KB+) which violates our performance budget.

## 5. Consent Listening (The Safety Switch)

The pixel is **Passive**. It does not create its own popup; it listens to the existing Consent Management Platform (CMP).

**Integration Logic:**
1.  **Check 1 (Global Object):** Look for `window.MW_CONSENT` (e.g., `{ ad_storage: 'granted' }`).
2.  **Check 2 (GCM):** Listen for Google Consent Mode `dataLayer` updates.
3.  **Default:** If no signal is found, default to `denied` (Safe Mode) or `granted` (Aggressive Mode), based on Tenant Server Config.

## 6. Public Methods (SPA Support)

We expose a window object for developers using React/Next.js to manually trigger events without page reloads.

```javascript
// Manual Event Tracking
window.moreways.track('purchase', {
  value: 99.00,
  currency: 'USD',
  email: 'user@example.com' // Will be normalized & hashed server-side
});

// Update Consent dynamically (e.g., after user clicks "Accept")
window.moreways.consent({
  ad_storage: 'granted'
});
