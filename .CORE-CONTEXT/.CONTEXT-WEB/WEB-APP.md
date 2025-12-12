# High-Resolution Interface Map: `apps/web/src/app`

## Tree: C:\projects\moreways-ecosystem\apps\web\src\app

```
app/

├── (intake)/
│   ├── issue/
│   │   ├── [slug]/
│   │   │   ├── page.tsx
│   ├── start/
│   │   ├── [id]/
│   │   │   ├── page.tsx
│   │   ├── page.tsx
├── (marketing)/
│   ├── about/
│   │   ├── page.tsx
│   ├── consumers/
│   │   ├── page.tsx
│   ├── contact/
│   │   ├── page.tsx
│   ├── faq/
│   │   ├── page.tsx
│   ├── for-law-firms/
│   │   ├── page.tsx
│   ├── how-it-works/
│   │   ├── page.tsx
│   ├── issues/
│   │   ├── page.tsx
│   ├── layout.tsx
│   ├── legal-demo/
│   │   ├── page.tsx
│   ├── page.tsx
├── (portal)/
│   ├── dashboard/
│   │   ├── claim/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   ├── page.tsx
│   ├── layout.tsx
│   ├── login/
│   │   ├── page.tsx
│   ├── register/
│   │   ├── page.tsx
├── api/
│   ├── auth/
│   │   ├── dev-login/
│   │   │   ├── route.ts
│   │   ├── login/
│   │   │   ├── route.ts
│   │   ├── logout/
│   │   │   ├── route.ts
│   │   ├── register/
│   │   │   ├── route.ts
│   ├── chat/
│   │   ├── legal/
│   │   │   ├── route.ts
│   │   ├── route.test.ts
│   │   ├── route.ts
│   ├── intake/
│   │   ├── agent/
│   │   │   ├── route.ts
│   │   ├── form/
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts
│   │   ├── get-schema-by-slug/
│   │   │   ├── route.ts
│   │   ├── submit/
│   │   │   ├── route.ts
│   │   ├── validate/
│   │   │   ├── route.ts
│   ├── lex/
│   │   ├── node/
│   │   │   ├── route.ts
│   ├── telemetry/
│   │   ├── route.ts
│   ├── v1/
│   │   ├── hooks/
│   │   │   ├── claims/
│   │   │   │   ├── route.ts
│   │   ├── hooks/
│   │   │   ├── status/
│   │   │   │   ├── route.ts
├── error.tsx
├── globals.css
├── layout.tsx
├── not-found.tsx
├── opengraph-image.png
├── robots.ts
├── sitemap.ts
```

---

## File Summaries

### `layout.tsx` (Root)
**Role:** The primary application shell containing global providers, fonts, and tracking instrumentation.
**Key Exports:**
- `RootLayout({ children }): Promise<JSX.Element>` - Injects global styles, theme providers, navigation, and telemetry components into every page.
**Dependencies:** `authService`, `AttributionPixel`, `RouteObserver`, `CookieConsent`, `ThemeProvider`, `AuroraBackground`, `PageTransition`.

### `(intake)/issue/[slug]/page.tsx`
**Role:** Dynamic route that resolves SEO-friendly slugs to specific intake forms with built-in fallback schemas.
**Key Exports:**
- `IssuePage({ params }): Promise<JSX.Element>` - Fetches form schemas by slug and initializes the intake runner with tracking.
- `dynamic` - Forced to `"force-dynamic"` to ensure fresh schema retrieval.
**Dependencies:** `argueosClient`, `UnifiedRunner`, `consumerIssues` (static content), `IssueTracker`.

### `(intake)/start/page.tsx`
**Role:** Multi-stage entry point that transitions from an AI-driven chat interface to a structured intake form.
**Key Exports:**
- `StartClaim(): JSX.Element` - Manages the transition state between the router chat and the `UnifiedRunner`.
**Dependencies:** `ChatInterface`, `UnifiedRunner`, `PublicFormResponse` (type).

### `(portal)/dashboard/page.tsx`
**Role:** Main authenticated landing page for clients to track active legal claims or redirect to the CRM.
**Key Exports:**
- `DashboardPage(): Promise<JSX.Element>` - Handles role-based redirection and renders the client dashboard.
- `ClientDashboard({ session }): Promise<JSX.Element>` - Fetches and displays a user's claim history as status cards.
**Dependencies:** `authService`, `portalRepo`, `getStatusUI` (config), `SpotlightCard`, `AuroraBackground`.

### `(portal)/dashboard/claim/[id]/page.tsx`
**Role:** Detail view for a specific claim providing status descriptions, submitted data, and an evidence locker.
**Key Exports:**
- `ClaimDetailPage({ params }): Promise<JSX.Element>` - Displays deep-dive information for a single claim ID.
**Dependencies:** `authService`, `portalRepo`, `getStatusUI`.

### `api/auth/login/route.ts` (and register/dev-login)
**Role:** Server-side handlers for session management and role-based redirection to the Lawyer App or Client Dashboard.
**Key Exports:**
- `POST(req): Promise<NextResponse>` - Authenticates credentials, creates an HTTP-only session cookie, and returns a redirect URL.
**Dependencies:** `authService`.

### `api/chat/route.ts`
**Role:** AI Classification gateway that maps natural language user input to specific form categories.
**Key Exports:**
- `POST(req): Promise<NextResponse>` - Uses GPT-4o to analyze issues and return a `form_type` or clarifying question.
**Dependencies:** `OpenAI`.

### `api/chat/legal/route.ts`
**Role:** Gateway to the Legal Brain for RAG-based search and synthesis of law library content.
**Key Exports:**
- `POST(req): Promise<NextResponse>` - Proxies queries to the Brain API and formats citations for the UI.
**Dependencies:** `BRAIN_API_URL` (env).

### `api/intake/validate/route.ts`
**Role:** Legal logic gateway that evaluates submitted facts against statutes to provide a "Likely Violation" verdict.
**Key Exports:**
- `POST(req): Promise<NextResponse>` - Proxies form data to the Brain Judge with a local mock fallback for testing.
**Dependencies:** `BRAIN_API_URL`.

### `api/telemetry/route.ts`
**Role:** Secure proxy for application analytics and event tracking to the Attribution Engine.
**Key Exports:**
- `POST(req): Promise<NextResponse>` - Forwards client-side events to the internal tracking service with publishable key verification.
**Dependencies:** `ATTRIBUTION_ENGINE_URL` (env).

### `api/v1/hooks/status/route.ts`
**Role:** Inbound webhook handler that allows the external CRM to update claim statuses within the portal.
**Key Exports:**
- `POST(req): Promise<NextResponse>` - Validates CRM signatures and updates the database with new claim states.
**Dependencies:** `db` (Drizzle), `StatusWebhookSchema` (Zod).

### `sitemap.ts`
**Role:** Dynamic SEO configuration generating URLs for static pages and all individual issue types.
**Key Exports:**
- `sitemap(): MetadataRoute.Sitemap` - Aggregates application routes and dynamic consumer issue slugs for search engines.
**Dependencies:** `consumerIssues` (data).