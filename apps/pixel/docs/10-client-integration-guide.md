# Moreways Analytics – Client Integration Guide

**Welcome.** This guide explains how to install the Moreways Pixel.
Unlike standard pixels, this system uses a **First-Party Proxy** to ensure 100% data accuracy, even when users have AdBlockers installed.

---

## Step 1: Add the Pixel

Add the following code to the `<head>` of your website (or via Google Tag Manager).

**Replace `pk_mw_...` with your unique Public Key.**

```html
<script>
  window.MW_CONFIG = {
    publicKey: "pk_mw_YOUR_PUBLIC_KEY",
    endpoint: "/api/telemetry", // We will create this proxy in Step 2
    autoCapture: true // Automatically tracks form submissions
  };
</script>
<script async src="https://cdn.moreways.io/v1/tracking.js"></script>
```

---

## Step 2: Configure the Proxy (The "Cloak")

To bypass ad blockers, you must relay traffic through your own domain.

### If you use Next.js (App Router)

Create a file at `src/app/api/telemetry/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

const TARGET_URL = "https://api.moreways-analytics.com/api/v1/track";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Forward the request to Moreways Engine
    const response = await fetch(TARGET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-key": body.publicKey || "", // Passed from client
        "x-forwarded-for": req.headers.get("x-forwarded-for") || "127.0.0.1",
        "user-agent": req.headers.get("user-agent") || ""
      },
      body: JSON.stringify(body) // Pass the full payload
    });

    // Return success to the browser regardless of upstream result (Fail Open)
    return NextResponse.json({ success: true });
    
  } catch (e) {
    // Silently fail to avoid breaking client UI
    return NextResponse.json({ success: true }); 
  }
}
```

### If you use WordPress / PHP

Add this to your `functions.php` or a custom plugin endpoint:

```php
add_action('rest_api_init', function () {
  register_rest_route('moreways/v1', '/telemetry', array(
    'methods' => 'POST',
    'callback' => 'moreways_proxy_telemetry',
    'permission_callback' => '__return_true',
  ));
});

function moreways_proxy_telemetry($request) {
  $body = $request->get_json_params();
  $response = wp_remote_post('https://api.moreways-analytics.com/api/v1/track', array(
      'headers' => array(
          'Content-Type' => 'application/json',
          'x-publishable-key' => $body['publicKey'],
          'x-forwarded-for' => $_SERVER['REMOTE_ADDR'],
          'user-agent' => $_SERVER['HTTP_USER_AGENT']
      ),
      'body' => json_encode($body)
  ));
  return new WP_REST_Response(array('success' => true), 200);
}
```

---

## Step 3: Handle Consent (GDPR/CCPA)

Our system respects your users' privacy choices. You must tell the pixel when consent is granted.

**Scenario A: Cookie Banner Accepted**
When the user clicks "Accept" on your banner, run this JavaScript:

```javascript
window.moreways.consent({
  ad_storage: 'granted',
  analytics_storage: 'granted'
});
```

**Scenario B: Default Denied**
If you do not call the above function, the system defaults to `denied`. We will still count the lead for your internal dashboard, but **we will not share it with Facebook/Google Ads**.

---

## Step 4: Verification

1.  Open your website in Incognito mode.
2.  Open Developer Tools -> Network Tab.
3.  Filter by `telemetry`.
4.  Reload the page.
5.  You should see a request to `yoursite.com/api/telemetry` with status `200 OK`.
6.  The payload should contain `anonymousId`, `context`, and `cookies`.

## Step 5: Advanced Integrations

### 5.1 CallRail (Phone Tracking)
If you use CallRail, you can attribute phone calls to the Google Ad click that drove them.

1.  Login to CallRail.
2.  Go to **Integrations** -> **Webhooks**.
3.  Add a new Webhook: `POST https://api.moreways-analytics.com/api/v1/offline/callrail`
4.  **Important:** Ensure you have enabled "Google Ads Integration" in CallRail so the `gclid` is included in the webhook payload.

### 5.2 The Evidence Locker (Disputes)
If you need to dispute a lead quality issue with a vendor, you can download a forensic dossier.

**API Endpoint:** `GET /api/v1/evidence/:anonymousId`
**Header:** `x-secret-key: sk_...`

**Response:**
```json
{
  "risk_assessment": { "bot_score": 100, "distinct_ips": 1 },
  "chain_of_custody": [
    { "time": "10:00", "action": "pageview", "location": "New York, US", "click_id": "GCLID_123" },
    { "time": "10:05", "action": "lead", "location": "New York, US" }
  ]
}