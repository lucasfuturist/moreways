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

  // [DEV] Allow mock mode to bypass key check if strictly needed, 
  // though usually we want to fail fast if no key.
  if (!env.llmApiKey && !env.llmMockMode) {
    throw new Error("Missing OPENAI_API_KEY in environment variables.");
  }

  _openai = new OpenAI({
    apiKey: env.llmApiKey || "mock-key", // Fallback for mock mode
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
  /**
   * Override the default model (gpt-4o).
   * Useful for using faster models (gpt-3.5-turbo) or reasoning models (o1).
   */
  model?: string;
}

/**
 * Adapter function that matches the signature expected by domain services.
 */
export async function openaiClient(
  fullPrompt: string,
  options: LlmClientOptions = {}
): Promise<string> {
  // [DEV] Mock Mode Interceptor
  if (env.llmMockMode) {
    logger.info("[LLM] Mock mode active. Returning dummy response.");
    return options.jsonMode 
      ? JSON.stringify({ mock: true, analysis: "Mock analysis result" }) 
      : "This is a mock response from llm.adapter.openai.ts";
  }

  const openai = getOpenAiInstance();

  // Default options
  // [FIX] Added 'model' destructuring with default
  const { temperature = 0.2, jsonMode = true, model = "gpt-4o" } = options;

  logger.debug(`[OpenAI] Sending request to model: ${model} (jsonMode: ${jsonMode})`);

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: fullPrompt }],
      model: model, // [FIX] Use the dynamic model
      temperature,
      // [FIX] Conditionally apply JSON mode
      response_format: jsonMode ? { type: "json_object" } : { type: "text" },
    });

    const content = completion.choices[0]?.message?.content || "";

    if (!content) {
      throw new Error("OpenAI returned empty content.");
    }

    return content;
  } catch (error: any) {
    logger.error("[OpenAI] API call failed.", { error: error.message });
    throw error;
  }
}