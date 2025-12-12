/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react"; 
// Note: You might need 'npm install -D @testing-library/react-hooks' or similar depending on your react version
// But for pure logic we can just test the logic class/function if we refactor, 
// OR simpler: just verify the state logic without rendering if we extract the reducer.
// Since we don't have the library installed in the prompt setup, 
// I will write this as a pure logic test simulating the hook behavior manually 
// (or you can install @testing-library/react).

// Let's use a pure functional approach for the test to avoid dependency issues:
import { useHistory } from "@/forms/ui/hooks/forms.ui.hooks.useHistory";

// Mocking React useState for a pure logic test (Mocking the Hook environment)
// In a real repo, you'd use renderHook from @testing-library/react.
// Below assumes standard Vitest + React Testing Library setup.

import { useState, useCallback, useEffect } from "react";

// We'll mock the react internals to test the logic flow if RTL isn't available,
// but assuming you can install it, here is the standard RTL test:

/*
  PREREQUISITE: pnpm add -D @testing-library/react @testing-library/user-event jsdom
  And add `environment: "jsdom"` to vitest.config.ts
*/

import { renderHook as renderHookRTL, act as actRTL } from "@testing-library/react";

describe("useHistory", () => {
  it("initializes with state", () => {
    const { result } = renderHook(() => useHistory(0));
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("tracks history on set", () => {
    const { result } = renderHookRTL(() => useHistory(0));

    actRTL(() => result.current.set(1));
    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(true);

    actRTL(() => result.current.set(2));
    expect(result.current.state).toBe(2);
  });

  it("performs undo and redo", () => {
    const { result } = renderHookRTL(() => useHistory("A"));

    actRTL(() => result.current.set("B"));
    actRTL(() => result.current.set("C"));

    expect(result.current.state).toBe("C");

    // Undo to B
    actRTL(() => result.current.undo());
    expect(result.current.state).toBe("B");
    expect(result.current.canRedo).toBe(true);

    // Undo to A
    actRTL(() => result.current.undo());
    expect(result.current.state).toBe("A");
    expect(result.current.canUndo).toBe(false);

    // Redo to B
    actRTL(() => result.current.redo());
    expect(result.current.state).toBe("B");
  });

  it("clears future on new change (branching history)", () => {
    const { result } = renderHookRTL(() => useHistory(0));

    actRTL(() => result.current.set(1));
    actRTL(() => result.current.undo()); // Back to 0
    
    // New change while in the past
    actRTL(() => result.current.set(5)); // 0 -> 5

    expect(result.current.state).toBe(5);
    expect(result.current.canRedo).toBe(false); // '1' is lost
  });
});