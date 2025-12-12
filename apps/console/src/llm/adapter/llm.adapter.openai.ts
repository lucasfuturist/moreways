// src/llm/adapter/llm.adapter.openai.ts

import OpenAI from "openai";
import { env } from "@/infra/config/infra.svc.envConfig";
import { logger } from "@/infra/logging/infra.svc.logger";

/**
 * Singleton instance of OpenAI client.
 */
let _openai: OpenAI | null = null;

function getOpenAiInstance(): OpenAI {
  if (_openai) return _openai;

  if (!env.llmApiKey) {
    throw new Error("Missing OPENAI_API_KEY in environment variables.");
  }

  _openai = new OpenAI({
    apiKey: env.llmApiKey,
  });

  return _openai;
}

export interface LlmClientOptions {
  temperature?: number;
  /**
   * If true, forces { type: "json_object" }.
   * If false, uses { type: "text" }.
   * Default: true (for backward compatibility with v1)
   */
  jsonMode?: boolean;
}

/**
 * Adapter function that matches the signature expected by domain services.
 */
export async function openaiClient(
  fullPrompt: string,
  options: LlmClientOptions = {}
): Promise<string> {
  const openai = getOpenAiInstance();

  // Default options
  const { temperature = 0.2, jsonMode = true } = options;
  const MODEL = "gpt-4o";

  logger.debug(`[OpenAI] Sending request to model: ${MODEL} (jsonMode: ${jsonMode})`);

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: fullPrompt }],
      model: MODEL,
      temperature,
      // [FIX] Conditionally apply JSON mode
      response_format: jsonMode ? { type: "json_object" } : { type: "text" },
    });

    const content = completion.choices[0]?.message?.content || "";

    if (!content) {
      throw new Error("OpenAI returned empty content.");
    }

    return content;
  } catch (error) {
    logger.error("[OpenAI] API call failed.", { error });
    throw error;
  }
}