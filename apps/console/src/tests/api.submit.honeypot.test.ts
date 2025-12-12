import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/submit/[formId]/route";
import { NextResponse } from "next/server";

// 1. Hoist Mocks
const mocks = vi.hoisted(() => ({
  checkRateLimit: vi.fn(),
  getPublicById: vi.fn(),
  createSubmission: vi.fn(),
}));

// 2. Mock Modules
vi.mock("@/infra/security/security.svc.rateLimiter", () => ({
  RateLimiter: { check: mocks.checkRateLimit }
}));

vi.mock("@/forms/repo/forms.repo.FormSchemaRepo", () => ({
  formSchemaRepo: { getPublicById: mocks.getPublicById }
}));

vi.mock("@/crm/repo/crm.repo.FormSubmissionRepo", () => ({
  formSubmissionRepo: { create: mocks.createSubmission }
}));

describe("POST /api/submit/[formId] (Security)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const FORM_ID = "form_123";

  function createRequest(body: any) {
    return new Request(`http://localhost/api/submit/${FORM_ID}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  it("detects honeypot and rejects silently (Fake Success)", async () => {
    // BOT Payload: contains _hp
    const payload = {
      data: { some: "data" },
      _hp: "I am a bot filling this invisible field" 
    };

    const res = await POST(createRequest(payload) as any, { params: { formId: FORM_ID } });
    const json = await res.json();

    // 1. Returns 200 OK (Trick the bot)
    // In our implementation we return success: true
    expect(json.success).toBe(true);

    // 2. Returns specific rejection ID
    expect(json.submissionId).toBe("bot-rejected");

    // 3. CRITICAL: Database was NEVER called
    expect(mocks.createSubmission).not.toHaveBeenCalled();
  });

  it("processes valid human submissions (Empty Honeypot)", async () => {
    // HUMAN Payload: _hp is missing or empty
    const payload = {
      data: { name: "Human" },
      _hp: "" 
    };

    // Setup success mocks
    mocks.getPublicById.mockResolvedValue({ 
      id: FORM_ID, 
      organizationId: "org_1",
      schemaJson: { properties: { name: { kind: "text" } } } 
    });
    
    mocks.createSubmission.mockResolvedValue({ id: "sub_new" });

    const res = await POST(createRequest(payload) as any, { params: { formId: FORM_ID } });
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.submissionId).toBe("sub_new");
    expect(mocks.createSubmission).toHaveBeenCalled();
  });
});