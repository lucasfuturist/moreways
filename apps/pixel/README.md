This `README.md` is designed for the `apps/pixel` project. It highlights the system's role as a high-performance first-party data engine, focusing on identity resolution, server-side attribution, and ad-platform integration.

---

# MoreWays Pixel & Attribution Engine

The **MoreWays Pixel** is a privacy-first, high-throughput tracking infrastructure. It serves as the "nervous system" of the ecosystem, capturing user behavior, resolving anonymous sessions to known identities, and dispatching conversion signals directly to ad platforms (Meta CAPI, Google, TikTok) and CRMs via server-side APIs.

## 🚀 Core Capabilities

*   **Universal Ingestion:** Accepts events via a lightweight client-side JavaScript SDK (`tracking.js`) and server-to-server offline conversion webhooks.
*   **Identity Resolution Graph:** Uses a deterministic "Oldest Wins" merge strategy to link anonymous browsing sessions with known user profiles (email/phone) while hashing PII.
*   **Server-Side Dispatch (CAPI):** Bypasses ad blockers and browser tracking restrictions by sending conversion events directly from the server to Meta, Google Ads, LinkedIn, and TikTok.
*   **Resilience & Cloaking:** Implements a "Cloak Strategy" in the client SDK, attempting first-party proxy transmission before falling back to direct endpoints.
*   **Viral Loop Detection:** Automatically tracks "word-of-mouth" attribution chains to identify users who share links that result in new conversions.
*   **Forensic Evidence Locker:** Maintains an immutable audit trail of the user journey, IP addresses, and consent states for dispute resolution and compliance.

## 🛠️ Tech Stack

*   **Runtime:** Node.js v20 (Slim Docker Images)
*   **API Framework:** [Hono](https://hono.dev/) (Lightweight, Edge-ready)
*   **Database:** PostgreSQL (via [Drizzle ORM](https://orm.drizzle.team/))
*   **Queue System:** Redis + [BullMQ](https://docs.bullmq.io/)
*   **Client SDK:** Vanilla TypeScript (Zero-dependency, <5kb gzipped)

## 📁 Project Structure

```text
src/
├── api/        # Hono API entry point (HTTP Server)
├── core/       # Database configuration, Schemas, and Logger
├── dispatch/   # The "Output" layer: Adapters for Meta, Google, CRMs
├── identity/   # The "Brain": PII Hashing and Identity Graph merging logic
├── ingest/     # The "Input" layer: Validation, Bot Detection, Offline API
├── pixel/      # Source code for the client-side `tracking.js`
├── privacy/    # GDPR/CCPA Erasure endpoints
├── reporting/  # Attribution modeling (First/Last touch) and Stats
├── tenant/     # Tenant configuration and crypto key management
└── worker/     # Background job processor (BullMQ Worker)
```

## 🚦 Architecture Data Flow

1.  **Capture:** The `tracking.js` script collects browser signals (Cookies, URL Params, User Agent) and sends them to the `/api/v1/track` endpoint.
2.  **Ingest:** The **API** container validates the payload, checks for bot signatures, applies quarantine logic, and pushes the job to Redis.
3.  **Process:** The **Worker** container picks up the job:
    *   **Geo-IP:** Resolves IP to physical location.
    *   **Identity:** Hashes PII and merges the session into the Identity Graph.
    *   **Attribution:** Checks for viral referrers.
4.  **Dispatch:** The Worker executes parallel API calls to configured downstream providers (Meta CAPI, Google Offline Conversions, Webhooks).

## 🔌 Client Integration

Add the following snippet to the `<head>` of your application. Replace `TENANT_ID` with your specific ID.

```html
<script>
  !function(w,d,s,t,a){if(w.moreways)return;n=w.moreways=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!w._moreways)w._moreways=n;
  n.push=n;n.loaded=!0;n.version='1.0';n.queue=[];t=d.createElement(s);
  a=d.getElementsByTagName(s)[0];t.async=1;t.src='https://api.moreways.com/tracking.js';
  a.parentNode.insertBefore(t,a)}(window,document,'script');

  moreways('init', 'TENANT_ID');
  moreways('track', 'PageView');
</script>
```

### Standard Events
```javascript
moreways('track', 'Lead', {
  email: 'user@example.com', // Automatically hashed before storage
  value: 100.00
});
```

## 🐋 Deployment (Docker)

The application is split into two containers for scalability: `api` (High throughput HTTP) and `worker` (Heavy processing).

### Running Locally
```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL and Redis
docker-compose up -d postgres redis

# 3. Run Migrations
pnpm db:migrate

# 4. Start Development Mode (Runs both API and Worker)
pnpm dev
```

### Production Build
```bash
# Build API
docker build -f docker/Dockerfile.api -t pixel-api .

# Build Worker
docker build -f docker/Dockerfile.worker -t pixel-worker .
```

## 🔐 Security & Compliance

*   **PII Hashing:** All emails and phone numbers are normalized, salted, and hashed (SHA-256) via `identity.svc.hashing.ts` before touching the database.
*   **Quarantine:** Malformed payloads or suspicious bot traffic are shunted to a separate `quarantine` table to protect data integrity.
*   **Right to Erasure:** The `/api/v1/privacy/erasure` endpoint executes a transactional hard-delete of all user data, generating a compliance audit log.

## 🧪 Testing

*   **Integration Tests:** `pnpm test:int` - Tests the full pipeline from Ingest -> DB -> Worker.
*   **Unit Tests:** `pnpm test:unit` - Validates hashing logic and source classification.
*   **Chaos Testing:** `scripts-ps1/chaos.ps1` - Simulates high-load scenarios and network failures.

## 📄 License

Internal MoreWays Ecosystem Property.