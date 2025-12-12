# Attribution Engine – Platform Integration Standards (v1.0)

**Focus:** Mapping internal events to external Ad Network APIs.
**Goal:** Maximize "Event Match Quality" (EMQ) scores by sending every available signal.

---

## 1. Meta (Facebook) Conversions API (CAPI)

**Endpoint:** `POST https://graph.facebook.com/{API_VERSION}/{PIXEL_ID}/events`
**Auth:** Access Token (in `tenant.ad_config`).

### 1.1 Payload Mapping

| Internal Field | Meta Parameter | Format / Requirement |
| :--- | :--- | :--- |
| `event_type` | `event_name` | Mapped (e.g., `lead` -> `Lead`, `purchase` -> `Purchase`). |
| `timestamp` | `event_time` | Unix Timestamp (Seconds). |
| `anonymousId` | `event_id` | **CRITICAL.** Must match the Browser Pixel deduplication ID. |
| `context.url` | `event_source_url` | Full URL. |
| `user.email_hash` | `user_data.em` | SHA-256 hash. |
| `user.phone_hash` | `user_data.ph` | SHA-256 hash. |
| `cookies._fbp` | `user_data.fbp` | The Click ID cookie. **High Priority.** |
| `cookies._fbc` | `user_data.fbc` | The Browser ID cookie. |
| `context.ip_hash` | `user_data.client_ip_address` | *Compliance Warning:* Only send if raw IP available & consented. |
| `context.user_agent` | `user_data.client_user_agent` | Raw UA string. |
| `n/a` | `action_source` | Always set to `"website"`. |

### 1.2 Error Handling
*   **400 Bad Request:** (e.g., Missing param). Log error, **do not retry** (Data is bad).
*   **429/5xx:** (Rate Limit / Server Error). Exponential Backoff Retry via BullMQ.

---

## 2. Google Ads Offline Conversions

**Endpoint:** Google Ads API (gRPC / REST).
**Auth:** OAuth2 Refresh Token or Service Account.

### 2.1 Payload Mapping

Google requires a `gclid` (Google Click ID) to attribute. Without it, attribution is impossible via this API (unlike Meta which can use Email).

| Internal Field | Google Parameter | Notes |
| :--- | :--- | :--- |
| `click.gclid` | `gclid` | **Required.** Must be < 90 days old. |
| `event_type` | `conversion_action` | Resource name (e.g., `customers/123/conversionActions/456`). |
| `timestamp` | `conversion_date_time` | Format: `yyyy-mm-dd hh:mm:ss+|-hh:mm`. |
| `metadata.value` | `conversion_value` | Float. |
| `metadata.currency` | `currency_code` | ISO 3-letter code (USD). |
| `user.email_hash` | `user_identifiers` | Enhanced Conversions. SHA-256. |

### 2.2 The "Enhanced Conversions" Rule
To improve robustness, we send `user_identifiers` (hashed email) *alongside* the `gclid`. This helps Google attribute cross-device conversions even if the `gclid` cookie was lost but the user is logged into Chrome.

---

## 3. LinkedIn Conversions API

**Endpoint:** `POST https://api.linkedin.com/rest/conversionEvents`
**Auth:** OAuth2 Bearer Token.

### 3.1 Payload Mapping

| Internal Field | LinkedIn Parameter | Notes |
| :--- | :--- | :--- |
| `user.email_hash` | `userInfo.email` | **Required.** SHA-256. |
| `cookies.li_fat_id` | `userInfo.linkedinFirstPartyAdTrackingUUID` | First-party cookie ID. |
| `event_type` | `conversion` | URN (e.g., `urn:li:conversions:123`). |
| `timestamp` | `conversionTimestamp` | Unix Milliseconds. |

### 3.2 Strategy
LinkedIn relies heavily on the `userInfo` object. Since B2B users often browse on Mobile (LinkedIn App) but convert on Desktop (Work Computer), the **Email Hash** is the primary key here.

---

## 4. Universal Retry Strategy (The Worker)

External APIs are flaky. The Dispatch Worker must implement "Robust Delivery".

**Logic:**
1.  **Attempt 1:** Send.
2.  **Failure (Network/5xx):** Schedule Retry in **30 seconds**.
3.  **Failure (Attempt 2):** Schedule Retry in **5 minutes**.
4.  **Failure (Attempt 3):** Schedule Retry in **1 hour**.
5.  **Failure (Attempt 4):** Mark as `failed_permanently`. Log to Audit Trail. Alert Admin.

**Idempotency:**
*   We use the `event.id` (UUID) as the `deduplication_key` wherever possible (Meta allows this).
*   This ensures that if we retry a request that actually succeeded (but timed out on response), the Ad Network ignores the duplicate.
