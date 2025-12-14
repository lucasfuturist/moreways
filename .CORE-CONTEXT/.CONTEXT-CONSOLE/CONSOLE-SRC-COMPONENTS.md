# High-Resolution Interface Map: `apps/console/src/components`

## Tree: `apps/console/src/components`

```
components/
├── AdminNavbar.tsx
├── AmbientLight.tsx
├── Footer.tsx
├── FrozenRoute.tsx
├── Navbar.tsx
├── PageTransition.tsx
├── SmoothScroll.tsx
├── ThemeToggle.tsx
├── legal/
│   ├── ChatInterface.tsx
│   ├── ChatMessage.tsx
│   ├── CitationCard.tsx
│   ├── DefinitionPanel.tsx
│   ├── LegalChatInterface.tsx
│   ├── LegalResearchBot.tsx
│   ├── ResponsiveDefinition.tsx
├── theme-provider.tsx
├── ui/
│   ├── GlassCard.tsx
│   ├── GlassMenu.tsx
│   ├── GlobalCommandPalette.tsx
│   ├── UserMenu.tsx
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
│   ├── runner/
│   │   ├── ChatRunner.tsx
│   │   ├── FieldAssistantBubble.tsx
│   │   ├── IntakeChatMessage.tsx
│   │   ├── LiveFormView.tsx
│   │   ├── ReviewOverlay.tsx
│   │   ├── SectionSidebar.tsx
│   │   ├── UnifiedRunner.tsx
│   │   ├── VerdictCard.tsx
│   ├── shimmer-button.tsx
│   ├── spotlight-card.tsx
│   ├── text-reveal.tsx
│   ├── textarea.tsx
│   ├── voice-orb.tsx
├── viz/
│   ├── Sparkline.tsx
```

## File Summaries

### `AdminNavbar.tsx`
**Role:** Fixed top navigation bar for the Admin/Ops Console.
**Key Exports:**
- `AdminNavbar()` - Renders brand, admin navigation links (`/admin`, `/crm`), and the `UserMenu`.
**Dependencies:** `UserMenu`, `lucide-react`, `framer-motion`.

### `AmbientLight.tsx`
**Role:** Renders a radial gradient background effect that follows the mouse cursor.
**Key Exports:**
- `AmbientLight()` - Manages a fixed `div` with dynamic CSS variables for `x` and `y` coordinates.
**Dependencies:** None (Native DOM events).

### `Footer.tsx`
**Role:** Application-wide footer containing site links and branding.
**Key Exports:**
- `Footer()` - Renders the sitemap and a CTA for the assessment.
**Dependencies:** `Link`, `Button`.

### `FrozenRoute.tsx`
**Role:** Freezes the React context for the previous route to allow exit animations during page transitions.
**Key Exports:**
- `FrozenRoute({ children })` - Wraps content in a `LayoutRouterContext.Provider` using a ref.
**Dependencies:** `next/dist/shared/lib/app-router-context.shared-runtime`.

### `Navbar.tsx`
**Role:** The main public navigation bar; handles scroll states, mobile menus, and user auth states.
**Key Exports:**
- `Navbar({ user })` - Renders the "pill" nav, conditionally showing "Dashboard" or "Sign In" based on the `user` prop.
**Dependencies:** `ClientUserMenu`, `ThemeToggle`, `usePathname`.

### `PageTransition.tsx`
**Role:** Wraps page content to provide fade/scale transitions and initializes smooth scrolling on desktop.
**Key Exports:**
- `PageTransition({ children })` - Mounts `Lenis` for smooth scroll and wraps children in `AnimatePresence`.
**Dependencies:** `Lenis`, `framer-motion`, `FrozenRoute`.

### `SmoothScroll.tsx`
**Role:** Headless component that initializes the Lenis smooth scrolling instance (desktop only).
**Key Exports:**
- `SmoothScroll()` - Sets up the global scroll container listener.
**Dependencies:** `Lenis`.

### `ThemeToggle.tsx`
**Role:** Button to toggle between Light and Dark modes.
**Key Exports:**
- `ThemeToggle()` - Uses `next-themes` to switch the active theme.
**Dependencies:** `next-themes`, `lucide-react`.

### `theme-provider.tsx`
**Role:** Context provider wrapper for `next-themes`.
**Key Exports:**
- `ThemeProvider(props)` - Wraps the app in `NextThemesProvider`.
**Dependencies:** `next-themes`.

---

### `legal/ChatInterface.tsx`
**Role:** The primary "Assistant" chat UI found on public pages (not the intake runner).
**Key Exports:**
- `ChatInterface()` - Manages chat history state, handles voice input via `VoiceOrb`, and POSTs to `/api/chat`.
**Dependencies:** `VoiceOrb`, `ChatMessage`, `fetch`.

### `legal/ChatMessage.tsx`
**Role:** Presentational component for individual chat bubbles (User vs AI).
**Key Exports:**
- `ChatMessage({ message, isUser })` - Renders styled text bubbles with avatars.
**Dependencies:** `framer-motion`, `lucide-react`.

### `legal/CitationCard.tsx`
**Role:** Interactive link that fetches and displays a legal citation preview on hover.
**Key Exports:**
- `CitationCard({ idOrUrn })` - Fetches node data from the law engine API on hover.
**Dependencies:** `fetch`.

### `legal/DefinitionPanel.tsx`
**Role:** A slide-out drawer that displays full legal definitions or texts when a citation is clicked.
**Key Exports:**
- `DefinitionPanel({ urn, onClose })` - Fetches and renders legal text, supporting "drill-down" navigation into sub-citations.
**Dependencies:** `framer-motion`, `fetch`.

### `legal/LegalChatInterface.tsx`
**Role:** A specialized chat component specifically for querying the legal database with citations.
**Key Exports:**
- `LegalChatInterface()` - Renders a chat input and displays responses containing `citations`.
**Dependencies:** `CitationCard`.

### `legal/LegalResearchBot.tsx`
**Role:** A complex split-screen UI combining a chat interface with a document reader for legal research.
**Key Exports:**
- `LegalResearchBot()` - Manages chat history and a side-drawer "Reader" that renders full law text when a citation is clicked.
**Dependencies:** `framer-motion`, `fetch`.

### `legal/ResponsiveDefinition.tsx`
**Role:** Shows a term definition in a HoverCard (Desktop) or Drawer (Mobile).
**Key Exports:**
- `ResponsiveDefinition({ term, definition })` - Responsive wrapper for definitions.
**Dependencies:** `HoverCard`, `Drawer`, `useIsMobile`.

---

### `ui/GlassCard.tsx`
**Role:** Container component with a frosted glass effect and mouse-tracking spotlight.
**Key Exports:**
- `GlassCard({ children })` - Renders a `motion.div` with spotlight gradients.
**Dependencies:** `framer-motion`.

### `ui/GlassMenu.tsx`
**Role:** A dropdown menu with glassmorphism styling.
**Key Exports:**
- `GlassMenu({ items })` - Renders a list of actions in an `AnimatePresence` dropdown.
**Dependencies:** `framer-motion`.

### `ui/GlobalCommandPalette.tsx`
**Role:** System-wide command menu (Cmd+K) for navigation and actions.
**Key Exports:**
- `GlobalCommandPalette()` - Renders a modal overlay with searchable actions.
**Dependencies:** `cmdk`, `useRouter`.

### `ui/UserMenu.tsx`
**Role:** Dropdown menu for authenticated users (Sign Out, Profile).
**Key Exports:**
- `UserMenu({ user })` - Renders user avatar and menu options.
**Dependencies:** `fetch` (signout), `framer-motion`.

### `ui/voice-orb.tsx`
**Role:** interactive microphone button that visualizes audio volume and captures speech.
**Key Exports:**
- `VoiceOrb({ onTranscript })` - Uses the Web Audio API and Web Speech API to capture input.
**Dependencies:** `framer-motion`.

*(Note: Standard UI components like `button.tsx`, `input.tsx`, etc., are omitted for brevity as they are implementation details of the design system).*

---

### `ui/runner/ChatRunner.tsx`
**Role:** The logic core for the Chat-based Form Runner. Manages the conversation flow based on the schema and handles client-side input validation.
**Key Exports:**
- `ChatRunner(props)` - Orchestrates the loop: Ask Question -> Receive Input -> Validate (mock) -> Next Field.
**Dependencies:** `IntakeChatMessage`, `ReviewOverlay`, `VerdictCard`, `getNextFieldKey`.

### `ui/runner/FieldAssistantBubble.tsx`
**Role:** A helper popup that allows users to ask questions about a specific form field (e.g., "Why do you need this?").
**Key Exports:**
- `FieldAssistantBubble({ field })` - Simulates or fetches AI explanations for a specific field.
**Dependencies:** None (Internal state).

### `ui/runner/IntakeChatMessage.tsx`
**Role:** Renders specialized message types for the Intake Runner (e.g., Warnings, Section Dividers, Summaries).
**Key Exports:**
- `IntakeChatMessage({ variant, content })` - Handles layout for `system`, `agent`, `user`, and `completion_options` variants.
**Dependencies:** `framer-motion`.

### `ui/runner/LiveFormView.tsx`
**Role:** Alternative view that renders the schema as a standard long-scrolling HTML form.
**Key Exports:**
- `LiveFormView({ schema, formData })` - Maps schema properties to standard inputs (`textarea`, `select`, `input`).
**Dependencies:** `FieldAssistantBubble`.

### `ui/runner/ReviewOverlay.tsx`
**Role:** Modal that allows users to review and edit all their answers before final submission.
**Key Exports:**
- `ReviewOverlay({ schema, data })` - Renders a summary form for quick edits.
**Dependencies:** `framer-motion`.

### `ui/runner/SectionSidebar.tsx`
**Role:** Visual progress tracker showing form sections.
**Key Exports:**
- `SectionSidebar({ schema, currentFieldKey })` - Highlights the active section based on the current field.
**Dependencies:** None.

### `ui/runner/UnifiedRunner.tsx`
**Role:** The top-level container for the Form execution. Handles Schema Fetching, Persistence, Layout Switching, and Final Submission/Assessment.
**Key Exports:**
- `UnifiedRunner(props)` - Fetches the schema from API, manages `formData` state, auto-saves to `localStorage`, submits to backend, and triggers the AI assessment loop.
**Dependencies:** `ChatRunner`, `SectionSidebar`, `VerdictCard`, `LegalChatInterface`, `fetch`.

### `ui/runner/VerdictCard.tsx`
**Role:** Displays the final analysis results (Score, Status, Citations) after form submission.
**Key Exports:**
- `VerdictCard(props)` - Visualizes the `confidence` score and lists `missingElements` and filtered `citations`.
**Dependencies:** `lucide-react`.

---

### `viz/Sparkline.tsx`
**Role:** A simple SVG-based line chart for visualizing data trends.
**Key Exports:**
- `Sparkline({ data })` - Renders an SVG path based on an array of numbers.
**Dependencies:** `framer-motion`.