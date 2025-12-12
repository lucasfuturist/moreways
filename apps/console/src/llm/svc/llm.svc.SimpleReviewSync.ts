// src/llm/svc/llm.svc.SimpleReviewSync.ts
import type { SimpleIntakeSnapshot } from "@/intake/logic/SimpleIntakeEngine";

/**
 * Build a safe, deterministic reply from the snapshot.
 * This NEVER calls an LLM and never invents values.
 */
export function buildDeterministicReviewReply(snapshot: SimpleIntakeSnapshot, userMessage: string): string {
  const { schema, filled, unfilled, allFields } = snapshot;

  const titleFor = (key: string) => {
    const def = schema?.properties?.[key];
    return (def && def.title) ? def.title : key;
  };

  const isAskingWhatLearned =
    /what (have|do) (you|u) (know|learned)|what (have i|do i) have so far|show my answers|show my info|what do i have so far|what have i told/i
      .test(userMessage);

  const isAskingWhatsLeft =
    /what (else )?(is )?(in )?(this )?form|what (is )?left|what does the rest of the form|what else is in this form|what does this form include/i
      .test(userMessage);

  const answeredEntries = Object.keys(filled || {}).map(k => {
    const title = titleFor(k);
    const val = formatDisplayValue(filled[k], schema.properties?.[k]?.kind);
    return `• ${title}: ${val}`;
  });

  const remainingTitles = (unfilled && unfilled.length > 0)
    ? unfilled.map(k => `• ${titleFor(k)}`)
    : [];

  const parts: string[] = [];

  if (isAskingWhatLearned) {
    if (answeredEntries.length === 0) {
      parts.push("I haven't collected any answers yet.");
    } else {
      parts.push("Here's what you've shared so far:");
      parts.push(answeredEntries.join("\n"));
    }
  }

  if (isAskingWhatsLeft) {
    if (remainingTitles.length === 0) {
      parts.push("There are no remaining fields — the form appears complete.");
    } else {
      parts.push("The rest of the form asks for:");
      parts.push(remainingTitles.join("\n"));
    }
  }

  if (parts.length === 0) {
    const answeredCount = Object.keys(filled || {}).length;
    const total = (allFields && allFields.length) || (answeredCount + remainingTitles.length);
    parts.push(`I currently have ${answeredCount} of ${total} fields filled. Ask "what have you told me so far" to see details, or "what else is in this form" to see what's left.`);
  }

  return parts.join("\n\n");
}

function formatDisplayValue(value: any, kind?: string): string {
  if (value === undefined || value === null) return "(blank)";
  if (kind === "date") {
    try { return new Date(value).toLocaleDateString(); } catch {}
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
