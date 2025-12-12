# Attribution Engine – Observability & Maintenance (v1.0)

**Focus:** Monitoring the health, latency, and compliance of the engine in production.

---

## 1. Key Performance Indicators (KPIs)

We monitor these metrics in real-time (Grafana / Datadog / CloudWatch).

### 1.1 Ingestion Health (The API)
*   **Request Rate:** `req/sec` per Tenant. (Detects traffic spikes or DDOS).
*   **Latency p95:** Target **< 50ms**. (If this spikes, the API is too slow).
*   **Error Rate (5xx):** Target **0%**. (Any 500 implies a code bug or DB outage).
*   **Payload Size:** Average bytes. (Detects if a client is sending massive junk data).

### 1.2 Dispatcher Health (The Worker)
*   **Queue Depth:** Number of events waiting in Redis.
    *   *Alert:* If Depth > 1000 for > 5 minutes, scale up Workers.
*   **Dispatch Success Rate:** `%` of 200 OK responses from Meta/Google.
    *   *Alert:* If Success < 90%, an API Token might be expired or invalid.
*   **Consent Block Rate:** `%` of events blocked by the Safety Switch.
    *   *Insight:* If 100% are blocked, the Client likely misconfigured their CMP.

---

## 2. Structured Logging Standards

Logs are the primary debugging tool. We use JSON logs exclusively.

**Schema:**
```json
{
  "level": "info | error",
  "service": "api | worker",
  "trace_id": "req_123...",     // Correlates logs across services
  "tenant_id": "tenant_abc...", // Isolates client data
  "event": "ingest_received | dispatch_attempt | dispatch_success",
  "meta": {
    "latency_ms": 12,
    "destination": "meta_capi",
    "status_code": 200
  }
}
```

**Sensitive Data Rule:**
*   **NEVER log:** Raw PII (Email, Phone), Auth Tokens.
*   **OK to log:** Event IDs, Tenant IDs, Anonymized Errors ("Invalid JSON").

---

## 3. Alerts & Incident Response

### Severity 1: Critical (Page the Engineer)
*   **API Down:** Health check (`/health`) returns non-200.
*   **DB Unreachable:** Ingestion API failing to write to Postgres.
*   **Redis Full:** Queue is rejecting new jobs.

### Severity 2: Warning (Slack Notification)
*   **High Queue Depth:** Workers are lagging behind ingestion.
*   **Elevated 401s:** A client might have rotated their keys improperly.
*   **CAPI Rejection Spike:** Facebook API is rejecting our payloads (Schema change?).

---

## 4. Maintenance SOPs

### 4.1 Key Rotation
*   **Tenant Keys:** If a Tenant suspects a leak, we generate a new `pk_...` and `sk_...` via the CLI. The old keys are immediately invalidated in Redis/DB.
*   **Platform Keys:** If a Facebook Token expires, the system logs a specific error (`auth_error`). The Admin must update the `ad_config` column for that Tenant.

### 4.2 Database Pruning (GDPR)
*   **Job:** A nightly cron job runs `DELETE FROM events WHERE created_at < NOW() - INTERVAL '90 DAYS'`.
*   **Config:** Tenants can customize this window (e.g., 30 days) via their config.

### 4.3 Pixel Updates
*   **Versioning:** The pixel is served from `cdn.moreways.com/v1/tracking.js`.
*   **Immutable:** We never overwrite a version. We publish `v1.1`, then `v1.2`.
*   **Cache:** Set `Cache-Control: public, max-age=3600` (1 hour) to balance performance with update speed.
