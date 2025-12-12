# Attribution Engine – Technical Vision (v1.0)

**Project:** attribution-engine
**Focus:** High-fidelity server-side attribution with strict consent gating.
**Philosophy:** "Ingest locally, Dispatch conditionally."

---

## 1. Product Scope

This is a **headless Micro-SaaS**. It acts as the "Central Nervous System" for ad data across all client sites (Moreways, Client B, Client C).

It resolves the central conflict of modern digital marketing:
1.  **Signal Loss:** AdBlockers, ITP (Intelligent Tracking Prevention), and iOS privacy changes destroying pixel accuracy.
2.  **Regulatory Risk:** The legal liability of sending non-consented user data to third-party ad networks (GDPR/CCPA).

**The Solution:** A specialized engine that captures *everything* first-party (for internal billing/analytics) but only sends *consented* data to ad networks (for optimization).

---

## 2. Architecture: The "Titanium Gate" Model

We assume the browser environment is hostile (AdBlockers are active) and the regulatory environment is strict.

```text
[Browser Pixel] 
   │
   ├── (1. Signal Harvesting) ──> Reads `_fbp`, `_fbc`, `gclid`, `email`
   │
   ├── (2. Consent Check) ──────> Reads CMP State (Granted/Denied)
   │
   └── (3. Proxied Request) ────> [Client Next.js Server] 
                                         │
                                  (4. Relay via internal network)
                                         ▼
                                  [Ingestion API (Hono)] 
                                         │
                                  [Event Ledger (DB)]
                                         │
                                  (5. The Safety Switch)
                                         ▼
         ┌───────────────────────────────┴───────────────────────────────┐
    (If Consent = DENIED)                                      (If Consent = GRANTED)
         │                                                               │
 [Internal Analytics Only]                                      [Dispatcher Worker]
 - Attribution for Billing                                               │
 - Anonymized Reporting                                         (Server-Side API Calls)
 - No Data Sharing                                            Meta CAPI / Google Ads / LinkedIn
```

---

## 3. Key Capabilities

### A. The "Unblockable" Ingestion (Cloaking)
Standard ad-tech domains are blocked by uBlock Origin. To achieve **100% Ingestion**, the pixel supports a "First-Party Proxy" mode.
*   **Mechanism:** The script sends data to the client's own domain (e.g., `/api/telemetry`). The client's server then relays this to our engine.
*   **Result:** AdBlockers see internal traffic and allow it. We capture the lead even if the user is using aggressive privacy tools.

### B. The Cookie Bridge (Signal Density)
We do not rely solely on email matching. We actively bridge the gap between "Anonymous Browser" and "Known Social User" by extracting the ad networks' own first-party cookies:
*   **Meta:** `_fbp`, `_fbc`
*   **Google:** `_gcl_au`, `_ga`
*   **LinkedIn:** `li_fat_id`
*   **TikTok:** `ttclid`

Sending these keys server-side maximizes the **Event Match Quality Score** (aiming for >8.0/10).

### C. The Consent Gate (Compliance)
The system is "Compliance-Aware." Every event payload includes a `consent_policy` object.
*   **The Guardrail:** The Dispatcher Worker strictly enforces this policy. If `ad_storage` is denied, the event is **never** sent to Facebook/Google.
*   **The Benefit:** Clients can capture leads for their own internal ROI calculations without violating GDPR by sharing that data with Meta.

### D. The Intelligence Layer (Read)
We expose a secure, queryable API for the Admin CRM to visualize the User Journey.
*   *Example:* "Lead #505 clicked a Google Ad on Monday, a LinkedIn Ad on Tuesday, and converted on Wednesday."

---

## 4. Tech Stack Commitments

*   **Core:** Node.js 20+ (Hono framework for sub-millisecond overhead).
*   **Database:** PostgreSQL (via Drizzle ORM).
*   **Queue:** Redis (BullMQ) – *Critical for retrying failed CAPI requests and handling burst traffic.*
*   **Pixel:** Vanilla JS (ES6, <3KB, zero dependencies).

---

## 5. Success Metrics

1.  **Ingestion Reliability:** **100%**. Every valid form submission on a client site must be recorded in the internal ledger.
2.  **Compliance:** **0% Leakage**. No event with `consent: denied` is ever transmitted to a 3rd party API.
3.  **Latency:** The pixel script must add **<50ms** to the client site's Total Blocking Time (TBT).
4.  **Match Rate:** >90% for consented users (achieved via multi-signal bridging: Email + IP + Cookie + User Agent).
