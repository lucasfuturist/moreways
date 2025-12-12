/**
 * forms.ui.guardrails.PiiWarning
 *
 * UI Component: Wrapper that detects potential PII (Personally Identifiable Information)
 * in field labels and highlights them with a warning style.
 *
 * Related docs:
 * - 03-security-and-data-handling.md
 * - 12-ui-implementation-steps.md (Section 5.1)
 *
 * Guarantees:
 * - [SECURITY] Visual feedback only; does not alter data storage logic directly.
 */

import React from "react";

interface PiiWarningProps {
  label: string;
  isFlaggedExplicitly?: boolean;
  children: React.ReactNode;
}

// [SECURITY] Regex heuristics to sniff out sensitive data patterns
const SENSITIVE_REGEX = /ssn|social security|dob|date of birth|credit card|bank|account number|driver'?s? licen[sc]e|passport/i;

export function PiiWarning({ label, isFlaggedExplicitly, children }: PiiWarningProps) {
  // Check if metadata flag is set OR if the label triggers the heuristic
  const isSensitive = isFlaggedExplicitly || SENSITIVE_REGEX.test(label);

  if (!isSensitive) {
    return <>{children}</>;
  }

  return (
    <div className="relative group/pii">
      {/* The Warning Border - Indicates caution */}
      <div className="absolute -inset-2 rounded-lg border border-amber-500/30 bg-amber-500/5 pointer-events-none animate-in fade-in duration-500" />
      
      {/* The Warning Badge - Appears on hover to explain why */}
      <div className="absolute -top-5 right-0 bg-amber-950 border border-amber-500/50 text-amber-500 text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/pii:opacity-100 transition-opacity flex items-center gap-1 z-10 pointer-events-none">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        SENSITIVE DATA
      </div>

      {children}
    </div>
  );
}