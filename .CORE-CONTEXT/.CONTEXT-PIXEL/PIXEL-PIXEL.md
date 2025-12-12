# File Scan: `apps/pixel/src/pixel`

## Tree: C:\projects\moreways-ecosystem\apps\pixel\src\pixel

```
pixel/

├── index.ts
├── lib/
│   ├── pixel.lib.browser.ts
│   ├── pixel.lib.network.ts
```

## Files

### `pixel/index.ts`
**Role:** The core client-side Pixel script (`tracking.js`) that handles identity management (local/session storage), auto-captures user interactions (forms, clicks, scrolls), injects hidden form fields for attribution, manages viral referral links via clipboard injection, and exposes the public `moreways` API.
**Key Exports:** None (Attaches `window.moreways` and executes `init` if config exists).
**Dependencies:** `pixel.lib.browser`, `pixel.lib.network`.

### `pixel/lib/pixel.lib.browser.ts`
**Role:** Utility library for generating UUIDs, reading cookies, and harvesting "Golden List" URL parameters (gclid, fbclid, utms) essential for attribution.
**Key Exports:**
- `generateUUID()`
- `getCookie(name)`
- `getUrlParams()`
**Dependencies:** None.

### `pixel/lib/pixel.lib.network.ts`
**Role:** Handles the robust transmission of event payloads using a "Cloak Strategy" that attempts a first-party proxy endpoint before falling back to the direct SaaS endpoint, ensuring data delivery even with ad blockers.
**Key Exports:**
- `sendEvent(payload, config)`
**Dependencies:** None.