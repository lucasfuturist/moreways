# 00-implementation-steps-phase2-ui.md

## 1. Aesthetic & Foundation Layer

### 1.1 Design System Tokens
* [ ] **`tailwind.config.ts` updates**
  * [ ] Define `slate-950` (midnight) as the new background base.
  * [ ] Add `glass` utility classes (`backdrop-filter`, `bg-opacity`, `border-opacity`).
  * [ ] Configure fonts: `Geist` (or Inter) for UI, `JetBrains Mono` for schema views.
  * [ ] Define animation tokens (slow fade, slide up) for "smooth" feel.

### 1.2 Global Layout Refactor
* [ ] **`src/app/layout.tsx`**
  * [ ] Switch to full-height, no-scroll body (app-like feel).
  * [ ] Implement the "floating glass" sidebar or navbar.
* [ ] **`src/components/ui/` (New Shared Folder)**
  * [ ] Create `GlassCard.tsx` (reusable container with blur).
  * [ ] Create `Badge.tsx` (for version/status).
  * [ ] Create `Button.tsx` (variants: `ghost`, `solid`, `danger`).

---

## 2. The "Magic Input" (Command Center)

### 2.1 Floating Command Component
* [ ] **`src/intake/ui/magic-input/CommandPalette.tsx`**
  * [ ] Implement a fixed-position bottom input bar (Cmd+K style).
  * [ ] Add "Voice" icon toggle (visual only for now).
  * [ ] Support "Chips" rendering above the input (e.g., `+ Add Medical History`).

### 2.2 Suggestion Logic
* [ ] **`src/intake/ui/magic-input/SuggestionEngine.ts`**
  * [ ] Create a heuristic helper that looks at the current schema and suggests next steps (e.g., if `kind: date` exists, suggest `+ Add Date Validation`).

---

## 3. The Reactive Canvas (Editor 2.0)

### 3.1 Visual Interactions
* [ ] **`src/forms/ui/canvas/ReactiveCanvas.tsx`**
  * [ ] Replace the standard `FormSchemaPreview` with this new wrapper.
  * [ ] Implement **Hover States**: Hovering a field reveals "Edit" and "Delete" micro-actions floating to the right.
  * [ ] Implement **Field Focus**: Clicking a field "spotlights" it (dimming the rest of the form).

### 3.2 Point-and-Speak UI
* [ ] **`src/forms/ui/canvas/FieldMicroEditor.tsx`**
  * [ ] Create a popover that appears when clicking "Edit" on a field.
  * [ ] Inputs: `Label`, `Description`, `Required`.
  * [ ] "Magic Wand" button: Allows typing "Make this friendlier" to send *just this field* to the LLM (stub function for now).

### 3.3 Animations (Framer Motion)
* [ ] **`src/forms/ui/canvas/DraggableFieldList.tsx`**
  * [ ] Install `framer-motion`.
  * [ ] Wrap fields in `<Reorder.Group>` for fluid drag-and-drop sorting.
  * [ ] Add `layout` prop to animate fields moving out of the way automatically.

---

## 4. The "Simulator" (AI Persona Test)

### 4.1 Simulator Overlay
* [ ] **`src/forms/ui/simulator/SimulatorOverlay.tsx`**
  * [ ] Create a slide-over panel or picture-in-picture chat window.
  * [ ] UI toggle: "Persona: Anxious Client" / "Persona: Busy Professional".

### 4.2 Auto-Fill Engine
* [ ] **`src/forms/ui/simulator/AutoFillEngine.ts`**
  * [ ] Implement a function that takes the schema and the persona, and "types" answers into the form inputs one by one with a delay.
  * [ ] Visuals: Highlight the active field being filled in Blue.

---

## 5. The Legal Brain (Guardrails)

### 5.1 Compliance Visuals
* [ ] **`src/forms/ui/guardrails/PiiWarning.tsx`**
  * [ ] Regex helper to detect sensitivity keywords (`ssn`, `social security`, `credit card`, `bank`).
  * [ ] Render a yellow/orange warning border around fields matching these keys.
  * [ ] Add Tooltip: "Sensitive Data Detected".

### 5.2 Jurisdiction Toggle
* [ ] **`src/forms/ui/guardrails/JurisdictionSwitch.tsx`**
  * [ ] Simple pill selector (`CA`, `NY`, `TX`).
  * [ ] On change, trigger a toast notification: "Jurisdiction context updated."

---

## 6. Dashboard & Versioning

### 6.1 Card View
* [ ] **`src/forms/ui/dashboard/FormCard.tsx`**
  * [ ] Replace table row with a "Card" design.
  * [ ] Show metadata: `Version`, `Created`, `Fields Count`.
  * [ ] Add "Sparkline" placeholder (SVG) for submissions activity.

### 6.2 Time Travel Slider
* [ ] **`src/forms/ui/editor/VersionHistorySlider.tsx`**
  * [ ] A horizontal range slider at the bottom of the editor.
  * [ ] Tick marks representing versions (`v1`, `v2`, `v3`).
  * [ ] Sliding updates the visible form to that snapshot (Read-only mode).

---

## 7. Verification & Polish

### 7.1 Manual QA Pass
* [ ] **Transition Check:** Does switching from "Prompt" to "Editor" feel seamless?
* [ ] **Theme Check:** Does Dark Mode look professional (not just inverted colors)?
* [ ] **Performance:** Does the Drag-and-Drop lag with >20 fields?

### 7.2 Demo Prep
* [ ] Create a "Demo Script" document ensuring the presenter hits the "Wow" moments (Simulator, Voice Command, Drag-and-Drop) in order.

---