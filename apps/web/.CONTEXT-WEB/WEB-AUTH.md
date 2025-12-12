# High-Resolution Interface Map: `apps/web/src/auth`

## Tree: C:\projects\moreways-ecosystem\apps\web\src\auth

```
auth/

├── svc/
│   ├── auth.service.test.ts
│   ├── auth.service.ts
├── ui/
│   ├── LoginForm.tsx
│   ├── LogoutButton.tsx
│   ├── RegisterForm.tsx
```

---

## File Summaries

### `auth/svc/auth.service.ts`
**Role:** The core security service responsible for password cryptography, JWT session management via HTTP-only cookies, and user retrieval from the database.
**Key Exports:**
- `authService` - Singleton object containing the following methods:
  - `hashPassword(password): Promise<string>` - Generates bcrypt hashes for storage.
  - `verifyPassword(plain, hashed): Promise<boolean>` - Validates credentials against stored hashes or dev-mode fallbacks.
  - `createSession(userId, role): Promise<void>` - Mints a signed JWT and sets it as a secure HTTP-only cookie.
  - `getSession(): Promise<{ userId: string; role: string } | null>` - Verifies and decodes the current session cookie.
  - `logout(): Promise<void>` - Invalidates the session by deleting the cookie.
  - `getUser(email): Promise<User | null>` - Fetches user record by email with production guardrails.
  - `getUserById(id): Promise<User | null>` - Fetches user record by primary key.
**Dependencies:** `jose` (JWT), `bcryptjs`, `next/headers`, `db` (Drizzle Client), `users` (Schema).

### `auth/ui/LoginForm.tsx`
**Role:** Client-side component handling credential submission, error display, and developer shortcuts for rapid role switching.
**Key Exports:**
- `LoginForm(): JSX.Element` - Renders the login UI and manages authentication state transitions.
**Dependencies:** `useRouter`, `Button`, `Input`, `window.moreways` (Telemetry).

### `auth/ui/LogoutButton.tsx`
**Role:** A functional UI trigger that calls the logout endpoint and forces a hard redirect to the home page.
**Key Exports:**
- `LogoutButton(): JSX.Element` - Renders a ghost button to terminate the session.
**Dependencies:** `Button`, `LogOut` (Lucide Icons).

### `auth/ui/RegisterForm.tsx`
**Role:** Interactive registration form managing user input validation, real-time password matching, and phone number formatting.
**Key Exports:**
- `RegisterForm(): JSX.Element` - Handles account creation logic and telemetry events for successful registrations.
**Dependencies:** `useRouter`, `Button`, `Input`, `framer-motion` (Animations), `window.moreways` (Telemetry).