# High-Resolution Interface Map: `apps/web/src/portal`

## Tree: C:\projects\moreways-ecosystem\apps\web\src\portal

```
portal/
├── config/
│   ├── status.config.tsx
├── repo/
│   ├── portal.repo.ts
```

---

## File Summaries

### `portal/config/status.config.tsx`
**Role:** Central configuration map that translates backend claim status enums into UI properties like colors, icons, and progress indicators.
**Key Exports:**
- `ClaimStatus` - Type definition for valid claim lifecycle states.
- `STATUS_CONFIG` - Constant dictionary mapping states to visual attributes.
- `getStatusUI(status): ConfigObject` - Helper accessor that returns specific UI config or a safe default.
**Dependencies:** `lucide-react`.

### `portal/repo/portal.repo.ts`
**Role:** Data access layer responsible for fetching authenticated user claims and specific claim details, with built-in mock fallbacks for system resilience.
**Key Exports:**
- `portalRepo` - Singleton object containing:
  - `getClaimsForUser(userId): Promise<Claim[]>` - Retrieves a summary list of all claims for the dashboard.
  - `getClaimDetail(userId, claimId): Promise<Claim | null>` - Retrieves full case details with security checks for ownership.
**Dependencies:** `db` (Drizzle Client), `claims` (Schema), `drizzle-orm`.