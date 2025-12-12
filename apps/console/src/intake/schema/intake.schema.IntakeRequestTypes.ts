/**
 * IntakeRequestTypes
 *
 * Shared API contracts for the AI Form Generation workflow.
 *
 * Updates (v1.6 Micro-Edits):
 * - Added `scopedFieldKey` to request for targeting specific fields.
 *
 * Related docs:
 * - 04-data-and-api-spec.md
 * - 06-fat-v1-prompt-to-preview.md
 */

import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

/**
 * Represents a single turn in the conversation history.
 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Payload for generating or updating a form via AI.
 */
export interface CreateFormFromPromptRequest {
  /**
   * [LLM] Natural language instruction (e.g. "Add a waiver field").
   */
  prompt: string;

  /**
   * [MULTI-TENANT] Must match the authenticated user's organization.
   */
  organizationId: string;

  formName?: string;

  /**
   * [LLM] Optional context for "Edit Mode".
   */
  currentSchema?: FormSchemaJsonShape;

  /**
   * [LLM] Conversational history.
   */
  history?: ChatMessage[];

  /**
   * [MICRO-EDIT] If present, tells the Architect to focus ONLY on this field.
   * The backend will prepend context to the prompt to enforce this scope.
   */
  scopedFieldKey?: string;
}

/**
 * Success payload returning the persisted schema AND the architect's explanation.
 */
export interface CreateFormFromPromptResponse {
  formSchemaId: string;
  version: number;
  schema: FormSchemaJsonShape;
  /**
   * [UX] The "Talk" part of the "Talk + Do" architecture.
   */
  message: string;
}

/**
 * Standard error envelope.
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

/**
 * Utility: narrow type guard for error responses.
 */
export function isErrorResponse(payload: unknown): payload is ErrorResponse {
  if (!payload || typeof payload !== "object") return false;

  const maybe = payload as Record<string, unknown>;
  const error = maybe["error"];

  if (!error || typeof error !== "object") return false;

  const errObj = error as Record<string, unknown>;
  return typeof errObj["code"] === "string" && typeof errObj["message"] === "string";
}