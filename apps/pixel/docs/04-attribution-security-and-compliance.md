# Attribution Engine – Security & Compliance Strategy (v1.0)

**Objective:** Maximize data utility for the client while strictly adhering to GDPR, CCPA, and ePrivacy directives.

---

## 1. PII Handling & Pseudonymization

We act as a **Data Processor**. We treat all incoming user data as toxic until processed.

### 1.1 IP Address Handling (Passive Fingerprinting)
We utilize "Passive Fingerprinting" (IP + User Agent) for identity resolution. To remain compliant:
*   **No Raw Storage:** IP addresses are never written to the `events` table in plain text.
*   **The Daily Salt:** IPs are hashed using `SHA-256(IP + Tenant_Secret + Rotation_Salt)`.
    *   *Why:* This prevents "Rainbow Table" attacks where a bad actor could reverse-engineer the hashes to find real user locations.
*   **Analytics View:** For reporting UI, we store a separate truncated version (e.g., `192.168.1.xxx`) which is legally considered anonymized in many jurisdictions.

### 1.2 Email & Phone
*   **In-Memory Hashing:** When the API receives raw PII (e.g., `user@example.com`) over TLS, it is normalized (lowercase/trim) and hashed **in memory** immediately.
*   **Garbage Collection:** The raw value variable is dereferenced immediately after hashing and never touches the disk logs or database.

---

## 2. The "Safety Switch" (Dispatcher Logic)

This is the central compliance enforcement point. It resides in the `dispatch` worker queue.

**Logic Flow:**

```typescript
export async function dispatchEvent(event: EventEntity) {
  // 1. READ CONSENT POLICY
  // This was captured by the Pixel at the moment of the event
  const policy = event.consent_policy; // e.g. { ad_storage: 'denied', analytics: 'granted' }

  // 2. INTERNAL LEDGER (Legitimate Interest)
  // We always allow internal processing for billing verification and fraud checks.
  // This data stays within the "First Party" boundary.
  await saveToInternalLedger(event);

  // 3. EXTERNAL GATE (Consent Required)
  if (policy.ad_storage !== 'granted') {
    // 🛑 STOP. Do not pass go.
    logger.info(`[Compliance] Blocked CAPI dispatch for Event ${event.id}. Reason: Consent Denied.`);
    
    // Audit the block for the client dashboard
    await auditLog.create({ 
      eventId: event.id, 
      destination: 'meta_capi', 
      status: 'blocked', 
      reason: 'consent_policy' 
    });
    return;
  }

  // 4. DISPATCH (If Granted)
  // Only now do we transmit the Hashed Email / FBP Cookie to Meta/Google.
  await metaCapi.send(event);
  await googleAds.send(event);
}
```

---

## 3. Tenant Isolation & Security

Since this is a multi-tenant system potentially hosting competitors, data isolation is paramount.

*   **Encryption at Rest:** The `ad_config` column (containing Client Facebook Access Tokens and Google Conversions IDs) is encrypted using **AES-256-GCM**.
*   **Write-Only Public Keys:** The Public Key (`pk_...`) exposed in the browser can **only** write events. It cannot query data.
    *   *Scenario:* A hacker scrapes the `pk_` from a client site.
    *   *Impact:* They can spam fake leads (mitigated by Rate Limiting), but they **cannot** read any existing lead data.
*   **Row-Level Security:** All database queries utilize a strict `where(eq(events.tenantId, currentTenant.id))` clause enforced at the Repository level.

---

## 4. Audit Trail (Right to Access)

To satisfy GDPR "Right to Access" and "Accountability" principles, we maintain a disposition log.

*   **Disposition Logging:** We record *why* data was or was not shared.
    *   *Client Question:* "Why isn't Lead X showing up in my Facebook Ads Manager?"
    *   *System Answer:* "Audit log `evt_55` shows `ad_storage: denied` at 10:42 AM. Transmission was blocked by policy."
*   **Data Retention:** We implement an automated TTL (Time To Live). Raw event logs are archived or deleted after 90 days, retaining only aggregate statistics, unless configured otherwise by the Data Controller (The Client).
