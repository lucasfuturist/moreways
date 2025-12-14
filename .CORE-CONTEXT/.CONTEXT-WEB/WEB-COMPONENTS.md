# High-Resolution Interface Map: `apps/web/src/components`

## Tree: `apps/web/src/components`

```
components/

├── AmbientLight.tsx
├── AttributionPixel.tsx
├── ChatInterface.tsx
├── ChatMessage.tsx
├── CitationCard.tsx
├── ClientNavbar.tsx
├── ClientUserMenu.tsx
├── CookieConsent.tsx
├── DefinitionPanel.tsx
├── Footer.tsx
├── FrozenRoute.tsx
├── IssueTracker.tsx
├── LegalChatInterface.tsx
├── LegalResearchBot.tsx
├── Navbar.tsx
├── PageTransition.tsx
├── ResponsiveDefinition.tsx
├── RouteObserver.tsx
├── SmoothScroll.tsx
├── StandardComplaintsFab.tsx
├── ThemeToggle.tsx
├── runner/
│   ├── UnifiedRunner.tsx
│   ├── components/
│   │   ├── ChatRunner.tsx
│   │   ├── CookieConsent.tsx
│   │   ├── FieldAssistantBubble.tsx
│   │   ├── IntakeChatMessage.tsx
│   │   ├── LiveFormView.tsx
│   │   ├── ReviewOverlay.tsx
│   │   ├── SectionSidebar.tsx
│   │   ├── VerdictCard.tsx
│   ├── logic/
│   │   ├── schemaIterator.test.ts
│   │   ├── schemaIterator.ts
├── theme-provider.tsx
├── ui/
│   ├── accordion.tsx
│   ├── aurora-background.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── decoder-text.tsx
│   ├── drawer.tsx
│   ├── hover-card.tsx
│   ├── input.tsx
│   ├── magnetic-button.tsx
│   ├── motion-wrappers.tsx
│   ├── popover.tsx
│   ├── shimmer-button.tsx
│   ├── spotlight-card.tsx
│   ├── text-reveal.tsx
│   ├── textarea.tsx
│   ├── voice-orb.tsx
```

## File Summaries

### `AmbientLight.tsx`
**Role:** Renders a mouse-following radial gradient effect for visual depth on the landing page.
**Key Exports:**
- `AmbientLight()` - Manages a fixed overlay with dynamic CSS variables for cursor coordinates.
**Dependencies:** Native DOM Events.

### `AttributionPixel.tsx`
**Role:** Injects the custom tracking script (`mwpx.js`) and manages cross-subdomain cookie synchronization for attribution.
**Key Exports:**
- `AttributionPixel()` - Loads the script tag with configuration and handles local storage syncing.
**Dependencies:** `next/script`.

### `ChatInterface.tsx`
**Role:** The primary "Intake Router" chat UI that converses with the user to determine which specific legal form they need.
**Key Exports:**
- `ChatInterface({ onFormRouted })` - Manages chat state, sends messages to `/api/chat`, and triggers a callback when the AI determines a form slug.
**Dependencies:** `VoiceOrb`, `ChatMessage`, `fetch`.

### `ChatMessage.tsx`
**Role:** Presentational component for individual chat bubbles (User vs Assistant) with distinct styling.
**Key Exports:**
- `ChatMessage({ message, isUser })` - Renders styled text bubbles with Framer Motion entrance animations.
**Dependencies:** `framer-motion`, `lucide-react`.

### `CitationCard.tsx`
**Role:** An interactive link representing a legal citation that fetches and displays a preview of the law text on hover.
**Key Exports:**
- `CitationCard({ idOrUrn })` - Fetches node data from the Law Engine API and renders a tooltip preview.
**Dependencies:** `fetch` (Law Engine API).

### `ClientNavbar.tsx`
**Role:** Navigation bar specifically for the authenticated Client Dashboard area.
**Key Exports:**
- `ClientNavbar({ user })` - Renders links to "My Claims", "Settings", and the `ClientUserMenu`.
**Dependencies:** `ClientUserMenu`, `next/link`.

### `ClientUserMenu.tsx`
**Role:** Dropdown menu for authenticated users providing access to profile settings and the logout action.
**Key Exports:**
- `ClientUserMenu({ user })` - Renders the user avatar and handles the sign-out flow (calling `/api/auth/logout` and force-reloading).
**Dependencies:** `framer-motion`, `fetch`.

### `CookieConsent.tsx`
**Role:** GDPR/CCPA compliant consent banner requesting permission for analytics tracking.
**Key Exports:**
- `CookieConsent()` - Renders a bottom banner and communicates the user's choice to the `window.moreways` pixel.
**Dependencies:** `window.moreways`, `localStorage`.

### `DefinitionPanel.tsx`
**Role:** A slide-out drawer that fetches and displays full legal texts or definitions when a user interacts with a citation.
**Key Exports:**
- `DefinitionPanel({ urn, onClose })` - Fetches legal node content by URN and supports "drill-down" navigation into sub-citations.
**Dependencies:** `fetch` (Law Engine API), `framer-motion`.

### `Footer.tsx`
**Role:** Application-wide footer containing sitemap links, legal disclaimers, and branding.
**Key Exports:**
- `Footer()` - Renders the footer layout with navigation columns.
**Dependencies:** `next/link`.

### `FrozenRoute.tsx`
**Role:** Helper component for `PageTransition` that freezes the React context of the exiting route to allow animations to finish.
**Key Exports:**
- `FrozenRoute({ children })` - Wraps content to maintain state during exit transitions.
**Dependencies:** `next/dist/shared/lib/app-router-context.shared-runtime`.

### `IssueTracker.tsx`
**Role:** Invisible component that fires specific `view_content` telemetry events when specific legal issue pages are mounted.
**Key Exports:**
- `IssueTracker({ slug, title })` - Triggers `window.moreways.track`.
**Dependencies:** `window.moreways`.

### `LegalChatInterface.tsx`
**Role:** A specialized Q&A interface for querying the legal database (RAG) directly, displaying answers with citations.
**Key Exports:**
- `LegalChatInterface()` - Manages input/history for the legal bot endpoint `/api/chat/legal`.
**Dependencies:** `CitationCard`.

### `LegalResearchBot.tsx`
**Role:** A complex split-screen tool combining a chat interface with a dedicated document viewer for deep legal research.
**Key Exports:**
- `LegalResearchBot()` - Manages chat history and a side-panel state that loads full legal texts when citations are clicked.
**Dependencies:** `fetch` (Law Engine API), `framer-motion`.

### `Navbar.tsx`
**Role:** The main public navigation bar handling scroll states, mobile menus, and conditional rendering based on authentication status.
**Key Exports:**
- `Navbar({ user })` - Renders the navigation pills, theme toggle, and auth actions.
**Dependencies:** `ClientUserMenu`, `ThemeToggle`.

### `PageTransition.tsx`
**Role:** Wraps page content to provide fade/scale transitions and initializes smooth scrolling (Lenis) for desktop users.
**Key Exports:**
- `PageTransition({ children })` - Manages `AnimatePresence` and the Lenis scroll instance.
**Dependencies:** `Lenis`, `framer-motion`.

### `ResponsiveDefinition.tsx`
**Role:** Displays a term's definition in a `HoverCard` on desktop or a `Drawer` on mobile devices.
**Key Exports:**
- `ResponsiveDefinition({ term, definition })` - Renders the appropriate UI primitive based on viewport width.
**Dependencies:** `HoverCard`, `Drawer`, `useIsMobile`.

### `RouteObserver.tsx`
**Role:** Invisible component that listens for route changes and automatically fires `pageview` events to the telemetry system.
**Key Exports:**
- `RouteObserver()` - Hooks into `usePathname` and `useSearchParams` to trigger tracking.
**Dependencies:** `window.moreways`.

### `SmoothScroll.tsx`
**Role:** Headless component that initializes Lenis smooth scrolling (desktop only) without wrapping content.
**Key Exports:**
- `SmoothScroll()` - Sets up the global scroll listener.
**Dependencies:** `Lenis`.

### `StandardComplaintsFab.tsx`
**Role:** Floating Action Button (FAB) providing quick access to common legal complaint templates via a popover menu.
**Key Exports:**
- `StandardComplaintsFab()` - Renders the floating button and menu of issues.
**Dependencies:** `consumerIssues` (Data), `Popover`.

### `ThemeToggle.tsx`
**Role:** Button component to toggle between light and dark themes using `next-themes`.
**Key Exports:**
- `ThemeToggle()` - Renders a sun/moon icon button.
**Dependencies:** `next-themes`.

### `theme-provider.tsx`
**Role:** Wrapper for the `next-themes` provider to handle hydration safely.
**Key Exports:**
- `ThemeProvider(props)` - Context provider for theme management.
**Dependencies:** `next-themes`.

---

### `runner/UnifiedRunner.tsx`
**Role:** The top-level orchestrator for the public-facing Form Runner. Handles schema fetching (via proxy), local persistence, layout switching, submission, and AI assessment display.
**Key Exports:**
- `UnifiedRunner(props)` - Manages the full intake lifecycle from loading to verdict.
**Dependencies:** `ChatRunner`, `SectionSidebar`, `VerdictCard`, `fetch` (Console Proxy API).

### `runner/components/ChatRunner.tsx`
**Role:** The logic core for the conversational form execution. Drives the form flow based on schema logic and user input.
**Key Exports:**
- `ChatRunner(props)` - Orchestrates the loop: Ask Question -> Receive Input -> Validate -> Next Field.
**Dependencies:** `IntakeChatMessage`, `schemaIterator`.

### `runner/components/FieldAssistantBubble.tsx`
**Role:** A helper popup allowing users to ask "Why is this needed?" for specific form fields.
**Key Exports:**
- `FieldAssistantBubble({ field })` - Simulates an AI explanation for a field context.
**Dependencies:** None.

### `runner/components/IntakeChatMessage.tsx`
**Role:** Renders specialized chat bubbles for the intake runner (e.g., Section Headers, Warnings, summaries).
**Key Exports:**
- `IntakeChatMessage({ variant, content })` - Handles layout for various system/agent message types.
**Dependencies:** `framer-motion`.

### `runner/components/LiveFormView.tsx`
**Role:** An alternative view rendering the schema as a standard, long-scrolling HTML form instead of a chat.
**Key Exports:**
- `LiveFormView({ schema })` - Maps schema fields to standard inputs.
**Dependencies:** `FieldAssistantBubble`.

### `runner/components/ReviewOverlay.tsx`
**Role:** A modal interface allowing users to review and edit all collected answers before final submission.
**Key Exports:**
- `ReviewOverlay({ schema, data })` - Renders a summary form for quick edits.
**Dependencies:** None.

### `runner/components/SectionSidebar.tsx`
**Role:** Visual progress indicator showing the user's position within the form sections.
**Key Exports:**
- `SectionSidebar({ schema, currentFieldKey })` - Renders a list of sections, highlighting the active one.
**Dependencies:** None.

### `runner/components/VerdictCard.tsx`
**Role:** Displays the final AI assessment results, including the merit score, legal summary, and citations.
**Key Exports:**
- `VerdictCard(props)` - Visualizes the `confidence` score and lists `missingElements` and `citations`.
**Dependencies:** `lucide-react`.

### `runner/logic/schemaIterator.ts`
**Role:** Pure logic utility for traversing the form schema, evaluating conditional rules (`show`/`hide`), and determining the next field.
**Key Exports:**
- `getNextFieldKey(schema, currentData)` - Returns the key of the next visible, unfilled field.
**Dependencies:** None.

---

### `ui/aurora-background.tsx`
**Role:** Renders an animated, multi-color gradient background effect used on landing pages.
**Key Exports:**
- `AuroraBackground({ children })` - Container with CSS-based aurora animations.
**Dependencies:** Tailwind CSS.

### `ui/voice-orb.tsx`
**Role:** An interactive microphone button that visualizes audio volume and captures speech input using the Web Speech API.
**Key Exports:**
- `VoiceOrb({ onTranscript })` - Manages audio context, analysis, and speech recognition.
**Dependencies:** `framer-motion`, Web Audio API.