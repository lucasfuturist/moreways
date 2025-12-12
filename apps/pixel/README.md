# Attribution Engine v1.0

A high-fidelity, privacy-first attribution ledger.
"Ingest locally, Dispatch conditionally."

## 🚀 Quick Start

1. **Setup Env**: Copy `.env.example` to `.env`.
2. **Install**: `npm install`
3. **Database**: `npm run db:migrate`
4. **Run**:
   - API: `npm run dev:api`
   - Worker: `npm run dev:worker`

## 🔗 Hooks & Integrations

### 1. The Javascript Pixel
Add this to your client's website `<head>`:

```html
<script>
  window.MW_CONFIG = { publicKey: "pk_...", endpoint: "/api/telemetry" };
</script>
<script src="https://cdn.your-domain.com/tracking.js"></script>