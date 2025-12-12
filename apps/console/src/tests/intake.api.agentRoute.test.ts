import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/intake/agent/route";
import { NextResponse } from "next/server";

// 1. Hoist Mocks
const mocks = vi.hoisted(() => ({
  LlmIntakeAgentAsync: vi.fn(),
}));

// 2. Mock Service
vi.mock("@/llm/svc/llm.svc.LlmIntakeAgentAsync", () => ({
  LlmIntakeAgentAsync: mocks.LlmIntakeAgentAsync,
}));

describe("POST /api/intake/agent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createRequest(body: any) {
    return new Request("http://localhost/api/intake/agent", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  it("Passes fieldKey and data correctly to Deep Listening service", async () => {
    // Setup Mock Return
    mocks.LlmIntakeAgentAsync.mockResolvedValue({
      type: "answer",
      extractedValue: "TestVal",
      replyMessage: "OK",
      updates: { sideLoaded: true }
    });

    // Request Payload
    const payload = {
      field: { title: "Test Field", kind: "text", key: "field_1" },
      fieldKey: "field_1", // Explicit Key
      userMessage: "My Answer",
      formName: "Unit Test Form",
      history: [],
      schemaSummary: "field_1 (text)",
      formData: { existing: "data" }
    };

    const req = createRequest(payload);
    const res = await POST(req as any); // Cast for NextRequest compat
    const json = await res.json();

    expect(res.status).toBe(200);
    
    // Check Result pass-through
    expect(json.extractedValue).toBe("TestVal");
    expect(json.updates.sideLoaded).toBe(true);

    // Check Service Call Arguments
    expect(mocks.LlmIntakeAgentAsync).toHaveBeenCalledWith(expect.objectContaining({
      fieldTitle: "Test Field",
      fieldKey: "field_1", // Critical Check
      userMessage: "My Answer",
      formDataSummary: expect.stringContaining("existing: data") // Formatter check
    }));
  });

  it("Falls back to field.key if fieldKey is missing", async () => {
    mocks.LlmIntakeAgentAsync.mockResolvedValue({});

    const payload = {
      field: { title: "Test Field", kind: "text", key: "fallback_key" },
      // fieldKey is MISSING
      userMessage: "Msg",
    };

    await POST(createRequest(payload) as any);

    expect(mocks.LlmIntakeAgentAsync).toHaveBeenCalledWith(expect.objectContaining({
      fieldKey: "fallback_key"
    }));
  });

  it("Returns 400 if required inputs are missing", async () => {
    const req = createRequest({}); // Empty body
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  it("Handles service failures gracefully", async () => {
    mocks.LlmIntakeAgentAsync.mockRejectedValue(new Error("Service Crash"));

    const payload = { field: { title: "T" }, userMessage: "M" };
    const req = createRequest(payload);
    const res = await POST(req as any);
    const json = await res.json();

    // Should return the safe fallback JSON, not 500 crash
    expect(json.type).toBe("question");
    expect(json.replyMessage).toContain("System is busy");
  });
});