# File Scan: `apps/pixel/src/privacy`

## Tree: C:\projects\moreways-ecosystem\apps\pixel\src\privacy

```
privacy/

├── api/
│   ├── privacy.api.erasure.ts
```

## Files

### `privacy/api/privacy.api.erasure.ts`
**Role:** Manages GDPR/CCPA compliance by executing transactional hard-deletes of user identities and their associated event history upon request ("Right to be Forgotten"), while persisting an audit log of the deletion.
**Key Exports:**
- `privacyRoute` - Hono application instance mounted for privacy endpoints.
**Dependencies:** `db`, `events`, `identities`, `complianceLogs`.