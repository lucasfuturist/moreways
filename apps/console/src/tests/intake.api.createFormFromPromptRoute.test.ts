// src/tests/intake.api.createFormFromPromptRoute.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFormFromPromptRoute } from "@/intake/api/intake.api.createFormFromPromptRoute";
import type {
  CreateFormFromPromptRequest,
  CreateFormFromPromptResponse,
  ErrorResponse,
} from "@/intake/schema/intake.schema.IntakeRequestTypes";
import type { AuthUserLike } from "@/intake/svc/intake.svc.IntakeCreateFormFromPromptAsync";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/intake/forms/from-prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("createFormFromPromptRoute", () => {
  const ORG_ID = "org123";

  let getCurrentUser: (req: Request) => Promise<AuthUserLike | null>;
  let intakeCreateFormFromPrompt: (
    req: CreateFormFromPromptRequest,
    user: AuthUserLike
  ) => Promise<CreateFormFromPromptResponse>;

  const logger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    getCurrentUser = vi.fn();
    intakeCreateFormFromPrompt = vi.fn();
  });

  it("returns 200 with normalized schema on success", async () => {
    // user is authenticated and belongs to ORG_ID
    (getCurrentUser as any).mockResolvedValue({
      organizationId: ORG_ID,
    });

    // pipeline returns a schema – we don't need full typing here, just runtime shape
    (intakeCreateFormFromPrompt as any).mockResolvedValue({
      formSchemaId: "schema_321",
      version: 1,
      schema: {
        type: "object",
        properties: {
          fullName: {
            kind: "text",
          },
        },
        required: ["fullName"],
      },
    } as any);

    const body: CreateFormFromPromptRequest = {
      prompt: "build an intake form for new PI clients",
      organizationId: ORG_ID,
      formName: "PI Intake",
    };

    const req = makeRequest(body);

    const res = await createFormFromPromptRoute(req, {
      getCurrentUser,
      intakeCreateFormFromPrompt,
      logger,
    });

    expect(res.status).toBe(200);

    const payload = (await res.json()) as CreateFormFromPromptResponse;
    expect(payload.formSchemaId).toBe("schema_321");
    expect(payload.schema.properties.fullName.kind).toBe("text");
    expect(payload.schema.required).toContain("fullName");

    expect(intakeCreateFormFromPrompt).toHaveBeenCalledWith(
      body,
      expect.objectContaining({ organizationId: ORG_ID })
    );
  });

  it("returns 401 when user is unauthenticated", async () => {
    (getCurrentUser as any).mockResolvedValue(null);

    const req = makeRequest({
      prompt: "test prompt",
      organizationId: ORG_ID,
    });

    const res = await createFormFromPromptRoute(req, {
      getCurrentUser,
      intakeCreateFormFromPrompt,
      logger,
    });

    expect(res.status).toBe(401);

    const payload = (await res.json()) as ErrorResponse;
    expect(payload.error.code).toBe("unauthenticated");
  });

  it("returns 403 when organizationId does not match", async () => {
    (getCurrentUser as any).mockResolvedValue({
      organizationId: "other_org",
    });

    const req = makeRequest({
      prompt: "test",
      organizationId: ORG_ID,
    });

    const res = await createFormFromPromptRoute(req, {
      getCurrentUser,
      intakeCreateFormFromPrompt,
      logger,
    });

    expect(res.status).toBe(403);

    const payload = (await res.json()) as ErrorResponse;
    expect(payload.error.code).toBe("forbidden_org_mismatch");
  });

  it("maps known pipeline errors to 4xx responses", async () => {
    (getCurrentUser as any).mockResolvedValue({
      organizationId: ORG_ID,
    });

    (intakeCreateFormFromPrompt as any).mockRejectedValue({
      code: "llm_invalid_output",
      message: "LLM returned malformed JSON",
      statusCode: 400,
    } as any);

    const req = makeRequest({
      prompt: "bad prompt that yields invalid JSON",
      organizationId: ORG_ID,
    });

    const res = await createFormFromPromptRoute(req, {
      getCurrentUser,
      intakeCreateFormFromPrompt,
      logger,
    });

    expect(res.status).toBe(400);

    const payload = (await res.json()) as ErrorResponse;
    expect(payload.error.code).toBe("llm_invalid_output");
  });
});
