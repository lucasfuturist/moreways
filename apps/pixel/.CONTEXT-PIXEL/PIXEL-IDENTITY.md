# File Scan: `apps/pixel/src/identity`

## Tree: C:\projects\moreways-ecosystem\apps\pixel\src\identity

```
identity/

├── svc/
│   ├── identity.svc.hashing.ts
│   ├── identity.svc.merge.ts
├── util/
```

## Files

### `identity/svc/identity.svc.hashing.ts`
**Role:** Handles PII normalization and cryptographic hashing (SHA-256 with salt) to ensure user data privacy before storage.
**Key Exports:**
- `normalizeAndHash(value): string` - Trims, lowercases, salts, and hashes an input string (email/phone).
**Dependencies:** `crypto`, `process.env`.

### `identity/svc/identity.svc.merge.ts`
**Role:** Manages the Identity Graph by resolving session IDs to persistent profiles and executing retroactive merges ("Oldest Wins" strategy) when shared PII is detected.
**Key Exports:**
- `resolveIdentity(tenantId, anonymousId, emailHash, phoneHash, userId): Promise<string>` - Finds or creates an identity record, detects duplicates across the tenant, and performs a transactional merge of events if a collision occurs.
**Dependencies:** `db`, `identities`, `events`.