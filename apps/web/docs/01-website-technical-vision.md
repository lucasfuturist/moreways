START OF FILE 01-website-technical-vision.md ---
argueOS Website – Technical Vision (v1)
Project: moreways-site (argueOS Entry)
Focus: High-performance marketing, AI Intake Router, and Client Portal entry.
1. Product Scope
The "Website" repo serves three distinct functions:
Public Marketing (SEO): Static, high-performance pages explaining the value prop.
Intake Router (AI): The conversational interface that triages users and redirects them to specific forms.
Client Portal (Dashboard): A lightweight view for clients to check status (post-login).
Explicit Non-Goals:
This repo does not host the complex Form Builder (Lawyer Admin).
This repo does not perform heavy document generation.
2. Architecture: The "Route Group" Strategy
We use Next.js Route Groups to strictly separate concerns.
code
Text
src/app/
├── (marketing)/       # Static, SEO-optimized, Zero-Auth
│   ├── page.tsx
│   ├── about/
│   └── layout.tsx     # Marketing Navbar/Footer
├── (intake)/          # Interactive, Stateful, AI-driven
│   ├── start/
│   ├── issue/[slug]/  # The "Handshake" pages
│   └── layout.tsx     # Minimalist layout (focus mode)
├── (portal)/          # Authenticated, Dynamic
│   ├── dashboard/
│   └── layout.tsx     # Sidebar layout, Auth guards
└── api/               # Serverless Route Handlers
3. Tech Stack Commitments
Framework: Next.js 14+ (App Router).
Styling: TailwindCSS + Shadcn UI (consistent with the main app).
AI Router: OpenAI GPT-4o (via server-side API routes only).
Analytics: Privacy-preserving (e.g., PostHog/Plausible), strictly server-side if possible.
Content: Hardcoded TSX for v1 (no heavy CMS dependency yet).
4. Domain & Layer Naming (Website Specific)
We adapt the global naming convention ([domain].[layer].[role]) to the website context.
Domains (Prefixes)
content – Static marketing components (Hero, Features, FAQ).
router – The AI chat interface and logic.
leads – Data capture (email, name, issue summary).
auth – Login/Signup flows.
portal – The client dashboard views.
Examples
content.ui.HeroSection.tsx
router.svc.classifyIntent.ts
leads.repo.leadSubmissionRepo.ts
portal.ui.CaseStatusCard.tsx
5. Critical UX Guidelines
Speed is Trust: Marketing pages must score 90+ on Lighthouse.
The "Handshake": Never dump a user from Chat -> Form without a confirmation step (see Intake Handshake Pattern).
Mobile First: The Intake Router must work perfectly on mobile (slide-up drawers, thumb-friendly buttons).
--- END OF FILE 01-website-technical-vision.m