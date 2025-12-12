import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/ai/generate-options/route";

// [FIX] Hoist the mock function so it exists before vi.mock runs
const mocks = vi.hoisted(() => ({
  openaiClient: vi.fn(),
}));

vi.mock("@/llm/adapter/llm.adapter.openai", () => ({
  openaiClient: mocks.openaiClient,
}));

describe("POST /api/ai/generate-options", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if label is missing", async () => {
    const req = new Request("http://localhost/api/ai/generate-options", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  it("returns generated options on success", async () => {
    mocks.openaiClient.mockResolvedValue(JSON.stringify({
      options: [{ label: "A", value: "a" }, { label: "B", value: "b" }]
    }));

    const req = new Request("http://localhost/api/ai/generate-options", {
      method: "POST",
      body: JSON.stringify({ label: "States" }),
    });

    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.options).toHaveLength(2);
    expect(mocks.openaiClient).toHaveBeenCalledWith(expect.stringContaining("States"));
  });

  it("handles 500 if LLM fails or returns garbage", async () => {
    mocks.openaiClient.mockResolvedValue("NOT JSON");

    const req = new Request("http://localhost/api/ai/generate-options", {
      method: "POST",
      body: JSON.stringify({ label: "States" }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(500);
  });
});