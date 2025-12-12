/**
 * infra.ui.hooks.useLocalStorage
 *
 * Persists UI state to browser storage.
 * Updates state when key changes to ensure context switching works.
 */

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize with function to avoid SSR reads
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        // [FIX] Explicitly reset to initialValue if key is empty/new
        // This fixes "History staying constant" when switching forms
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      // Fallback to initial on error
      setStoredValue(initialValue);
    }
    setIsHydrated(true);
  }, [key]); // Re-run when key changes

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isHydrated] as const;
}