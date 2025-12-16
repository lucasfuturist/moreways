# High-Resolution Interface Map: `apps/console/src/auth`

## Tree: `apps/console/src/auth`

```
auth/
├── api/
│   ├── auth.api.signInRoute.ts
│   ├── auth.api.signOutRoute.ts
├── schema/
│   ├── auth.schema.UserTypes.ts
├── svc/
│   ├── auth.svc.AuthenticateUserAsync.ts
│   ├── auth.svc.GetCurrentUserAsync.ts
```

## File Summaries

### `api/auth.api.signInRoute.ts`
**Role:** *Placeholder.* Intended to handle the API route logic for user sign-in events.
**Key Exports:**
- *None (Empty File)*
**Dependencies:** *None*

### `api/auth.api.signOutRoute.ts`
**Role:** *Placeholder.* Intended to handle the API route logic for user sign-out events.
**Key Exports:**
- *None (Empty File)*
**Dependencies:** *None*

### `schema/auth.schema.UserTypes.ts`
**Role:** Defines the core TypeScript interfaces for user identity and authentication context used across the application.
**Key Exports:**
- `UserRole` - Type definition for user permission levels (`admin` | `staff`).
- `User` - Interface defining the shape of a user object (includes `id`, `organizationId`, `email`, `role`).
- `AuthContext` - Interface for attaching user data to request contexts.
**Dependencies:** None.

### `svc/auth.svc.AuthenticateUserAsync.ts`
**Role:** *Placeholder.* Intended to contain the business logic for verifying credentials and issuing sessions.
**Key Exports:**
- *None (Empty File)*
**Dependencies:** *None*

### `svc/auth.svc.GetCurrentUserAsync.ts`
**Role:** Authenticates requests by validating tokens (Header or Cookie) using the Supabase Service Role key and resolving the identity against the local database.
**Key Exports:**
- `GetCurrentUserAsync(req): Promise<User | null>` - Returns the mapped user context, or a dev mock if keys are missing.
**Dependencies:** `createClient` (Supabase), `db`, `cookies`, `env`, `logger`.