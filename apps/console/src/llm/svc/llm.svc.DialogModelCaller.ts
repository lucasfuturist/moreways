// src/llm/svc/llm.svc.DialogModelCaller.ts

/**
 * llm.svc.DialogModelCaller
 *
 * Centralized entrypoints for LLM calls used by the dialog/intake system.
 *
 * - callDialogModel: generic text/json call wrapper.
 * - callExtractionModel: specialized intake-extraction call that returns ExtractionResult.
 */

import { openaiClient } from "@/llm/adapter/llm.adapter.openai";
import { jsonParseSafe } from "@/llm/util/llm.util.jsonParseSafe";
import { logger } from "@/infra/logging/infra.svc.logger";
import {
  logLlmInteraction,
  type PromptLogEntry,
} from "@/infra/logging/infra.svc.promptLogger";
import {
  ExtractionResultSchema,
  type ExtractionResult,
} from "@/llm/schema/llm.schema.ExtractionResult";
import {
  buildExtractionPromptFromTemplate,
  type ExtractionPromptBuilderInput,
} from "@/llm/svc/llm.svc.ExtractionPromptBuilder";

// --- GENERIC CALLER ---

export interface DialogModelCallOptions {
  /**
   * Optional prompt template label for logging.
   * e.g. "intake-extraction-v1"
   */
  template?: string;
  /**
   * User-facing "prompt" used to seed this call (for logging).
   * For extraction, this is usually the latest user message.
   */
  userPrompt?: string;
  /**
   * LLM temperature; defaults to 0.2.
   */
  temperature?: number;
  /**
   * Whether to force JSON mode; defaults to true, but can be disabled
   * if you just want free-form text.
   */
  jsonMode?: boolean;
}

/**
 * Low-level wrapper around openaiClient with logging.
 */
export async function callDialogModel(
  fullPrompt: string,
  options: DialogModelCallOptions = {}
): Promise<string> {
  const { template = "dialog-generic", userPrompt = "", temperature, jsonMode } = options;

  const jsonModeFinal = jsonMode ?? true;

  logger.debug("[DialogModelCaller] Sending prompt", {
    template,
    jsonMode: jsonModeFinal,
  });

  const rawResponse = await openaiClient(fullPrompt, {
    temperature: temperature ?? 0.2,
    jsonMode: jsonModeFinal,
  });

  const logEntry: PromptLogEntry = {
    template,
    mode: "EDIT",
    userPrompt,
    fullPrompt,
    rawResponse,
  };

  // Fire-and-forget log to JSONL
  logLlmInteraction(logEntry);

  return rawResponse;
}

// --- EXTRACTION MODEL CALLER ---

export interface ExtractionModelInput extends ExtractionPromptBuilderInput {
  /**
   * Optional template label for logging.
   */
  templateName?: string;
}

/**
 * High-level helper focused on the intake extraction use case.
 *
 * Pipeline:
 * 1. buildExtractionPromptFromTemplate(input)
 * 2. callDialogModel(prompt, { jsonMode: true })
 * 3. jsonParseSafe(raw)
 * 4. ExtractionResultSchema.safeParse(parsed)
 */
export async function callExtractionModel(
  input: ExtractionModelInput
): Promise<ExtractionResult> {
  const fullPrompt = buildExtractionPromptFromTemplate(input);

  const rawResponse = await callDialogModel(fullPrompt, {
    template: input.templateName ?? "intake-extraction-v1",
    userPrompt: input.userMessage,
    jsonMode: true,
  });

  const parsed = jsonParseSafe<unknown>(rawResponse);

  if (!parsed.success) {
    logger.error("[ExtractionModel] Failed to parse JSON from LLM", {
      error: parsed.error?.message,
    });
    throw new Error("Failed to parse ExtractionResult JSON from LLM response.");
  }

  const validation = ExtractionResultSchema.safeParse(parsed.value);

  if (!validation.success) {
    logger.error("[ExtractionModel] ExtractionResult validation failed", {
      issues: validation.error.issues,
    });
    throw new Error("ExtractionResult failed schema validation.");
  }

  return validation.data;
}
