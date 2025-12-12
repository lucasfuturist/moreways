/**
 * llm.util.promptLoader
 *
 * Helper to load LLM prompt templates from the project-level /prompts directory.
 *
 * Related docs:
 * - 05-llm-prompt-spec.md
 * - 06-fat-v1-prompt-to-preview.md
 *
 * Guarantees:
 * - Reads prompt files from `<projectRoot>/prompts/<relativePath>`.
 * - Throws a clear error if the prompt file is missing or unreadable.
 */

import { promises as fs } from "fs";
import path from "path";

const PROMPTS_ROOT_DIR = "prompts";

/**
 * Load a prompt file from the /prompts directory.
 *
 * Example:
 *   loadPrompt("v1/generate-form-schema.txt")
 */
export async function loadPrompt(relativePath: string): Promise<string> {
  // Normalize the path under the prompts root.
  const absolutePath = path.join(process.cwd(), PROMPTS_ROOT_DIR, relativePath);

  try {
    const buffer = await fs.readFile(absolutePath);
    return buffer.toString("utf8");
  } catch (err) {
    const error = err as NodeJS.ErrnoException;
    const reason = error.code === "ENOENT" ? "not found" : "unreadable";

    throw new Error(
      `Failed to load prompt "${relativePath}" from /${PROMPTS_ROOT_DIR} (${reason} at ${absolutePath}).`
    );
  }
}
