/**
 * infra.svc.promptLogger
 *
 * specialized logger for LLM interactions.
 * writes raw prompts and responses to a local JSONL file for auditing/debugging.
 *
 * Related docs:
 * - 05-llm-prompt-spec.md
 *
 * Guarantees:
 * - Appends to /logs/llm-interactions.jsonl
 * - [SECURITY] WARNING: This log file WILL contain raw user input (potentially PII).
 *   It must be gitignored and restricted in production.
 */

import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "llm-interactions.jsonl");

/**
 * Ensure the log directory exists on boot/first write.
 */
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    try {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    } catch (err) {
      console.error("Failed to create log directory", err);
    }
  }
}

export interface PromptLogEntry {
  template: string;
  mode: "CREATE" | "EDIT";
  userPrompt: string;
  fullPrompt: string; // The interpolated string sent to vendor
  rawResponse: string; // The raw text back from vendor
}

/**
 * Write an interaction to the local file system.
 * Fire-and-forget (non-blocking).
 */
export function logLlmInteraction(entry: PromptLogEntry): void {
  // Don't block the main thread for logging
  setImmediate(() => {
    try {
      ensureLogDir();
      
      const payload = {
        timestamp: new Date().toISOString(),
        ...entry,
      };

      const line = JSON.stringify(payload) + "\n";
      
      fs.appendFile(LOG_FILE, line, { encoding: "utf8" }, (err) => {
        if (err) console.error("Failed to write to prompt log:", err);
      });
    } catch (err) {
      console.error("Error in prompt logger:", err);
    }
  });
}