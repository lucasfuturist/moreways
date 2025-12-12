/**
 * llm.util.promptLoader.test
 *
 * Tests for loading prompt templates from the /prompts directory.
 */

import { afterAll, describe, expect, it } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import { loadPrompt } from "../llm/util/llm.util.promptLoader";

const PROMPTS_ROOT_DIR = path.join(process.cwd(), "prompts");
const TEST_PROMPT_DIR = path.join(PROMPTS_ROOT_DIR, "v1");
const TEST_PROMPT_PATH = path.join(TEST_PROMPT_DIR, "test-prompt-loader.txt");

describe("loadPrompt", () => {
  // Create a test prompt file before the first test.
  it("loads an existing prompt file from /prompts", async () => {
    await fs.mkdir(TEST_PROMPT_DIR, { recursive: true });
    const content = "You are a test prompt.\nOnly for unit tests.";
    await fs.writeFile(TEST_PROMPT_PATH, content, "utf8");

    const loaded = await loadPrompt("v1/test-prompt-loader.txt");

    expect(loaded).toContain("You are a test prompt.");
    expect(loaded).toContain("Only for unit tests.");
  });

  it("throws a clear error when the prompt file is missing", async () => {
    const missingPath = "v1/does-not-exist.txt";

    await expect(loadPrompt(missingPath)).rejects.toThrow(
      /Failed to load prompt "v1\/does-not-exist\.txt" from \/prompts/
    );
  });
});

// clean up after all tests in this file
afterAll(async () => {
  try {
    // Remove the test file; leave the prompts dir in place in case you add real prompts later.
    await fs.rm(TEST_PROMPT_PATH, { force: true });
  } catch {
    // ignore
  }
});
