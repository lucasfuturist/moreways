/**
 * intake.api.createFormFromPromptRoute
 *
 * HTTP Handler: POST /api/intake/forms/from-prompt
 *
 * Updates (v1.6):
 * - Extracts `scopedFieldKey`.
 * - Injects scoping instructions into the prompt if a field key is present.
 *
 * Related docs:
 * - 04-data-and-api-spec.md
 *
 * Guarantees:
 * - [SECURITY] Enforces org membership.
 * - [LLM] Prepends context for micro-edits to prevent global hallucinations.
 */

import { logger as defaultLogger } from "@/infra/logging/infra.svc.logger";
import type { ErrorResponse } from "@/intake/schema/intake.schema.IntakeRequestTypes";
import {
  type CreateFormFromPromptRequest,
  type CreateFormFromPromptResponse,
} from "@/intake/schema/intake.schema.IntakeRequestTypes";
import {
  IntakeCreateFormFromPromptAsync,
  type AuthUserLike,
} from "@/intake/svc/intake.svc.IntakeCreateFormFromPromptAsync";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

type LoggerLike = {
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error?: (message: string, meta?: Record<string, unknown>) => void;
};

export interface CreateFormFromPromptRouteDeps {
  getCurrentUser: (req: Request) => Promise<AuthUserLike | null>;
  intakeCreateFormFromPrompt?: (
    request: CreateFormFromPromptRequest,
    user: AuthUserLike
  ) => Promise<CreateFormFromPromptResponse>;
  logger?: LoggerLike;
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function buildErrorResponse(code: string, message: string, status: number): Response {
  const payload: ErrorResponse = { error: { code, message } };
  return jsonResponse(payload, status);
}

export async function createFormFromPromptRoute(
  req: Request,
  deps: CreateFormFromPromptRouteDeps
): Promise<Response> {
  const {
    getCurrentUser,
    intakeCreateFormFromPrompt = IntakeCreateFormFromPromptAsync,
    logger = defaultLogger,
  } = deps;

  try {
    const rawBody = await req.json().catch(() => null);
    if (!rawBody || typeof rawBody !== "object") {
      return buildErrorResponse("invalid_request", "Body must be JSON object.", 400);
    }

    const body = rawBody as Partial<CreateFormFromPromptRequest>;

    if (!body.prompt || typeof body.prompt !== "string") {
      return buildErrorResponse("invalid_request", "Field 'prompt' is required.", 400);
    }
    if (!body.organizationId || typeof body.organizationId !== "string") {
      return buildErrorResponse("invalid_request", "Field 'organizationId' is required.", 400);
    }

    // [SECURITY] Auth Check
    const user = await getCurrentUser(req);
    if (!user) {
      return buildErrorResponse("unauthenticated", "Authentication required.", 401);
    }

    // [SECURITY] Org Scope Check
    if (user.organizationId !== body.organizationId) {
      return buildErrorResponse("forbidden_org_mismatch", "Access denied.", 403);
    }

    // [MICRO-EDIT Logic]
    // If scoped to a field, we prepend strict instructions to the prompt
    // so the Architect knows to focus ONLY on that field.
    let finalPrompt = body.prompt;
    if (body.scopedFieldKey) {
      finalPrompt = `[FOCUS: Modifying ONLY the field with key '${body.scopedFieldKey}'] ${body.prompt}`;
    }

    const request: CreateFormFromPromptRequest = {
      prompt: finalPrompt,
      organizationId: body.organizationId,
      formName: typeof body.formName === "string" ? body.formName : undefined,
      currentSchema: body.currentSchema as FormSchemaJsonShape | undefined,
      history: Array.isArray(body.history) ? body.history : undefined,
      scopedFieldKey: body.scopedFieldKey, // Pass through for tracing
    };

    const result = await intakeCreateFormFromPrompt(request, user);

    return jsonResponse(result, 200);
  } catch (err) {
    logger.error?.("[API] Error in createFormFromPromptRoute.", { error: String(err) });
    
    const anyErr = err as { code?: string; message?: string; statusCode?: number };
    const status = anyErr.statusCode && anyErr.statusCode >= 400 ? anyErr.statusCode : 500;
    const code = anyErr.code ?? "internal_error";

    return buildErrorResponse(code, anyErr.message ?? "Internal Error", status);
  }
}