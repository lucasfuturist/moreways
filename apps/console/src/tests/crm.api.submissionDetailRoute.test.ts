import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/crm/submissions/[id]/route";

const mocks = vi.hoisted(() => ({
  getWithSchema: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock("@/crm/repo/crm.repo.FormSubmissionRepo", () => ({
  formSubmissionRepo: {
    getWithSchema: mocks.getWithSchema,
  },
}));

vi.mock("@/auth/svc/auth.svc.GetCurrentUserAsync", () => ({
  GetCurrentUserAsync: mocks.getCurrentUser,
}));

describe("GET /api/crm/submissions/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 if submission not found", async () => {
    mocks.getCurrentUser.mockResolvedValue({ organizationId: "org_1" });
    mocks.getWithSchema.mockResolvedValue(null); 

    const req = new Request("http://localhost/api/crm/submissions/sub_999");
    const res = await GET(req as any, { params: { id: "sub_999" } });

    expect(res.status).toBe(404);
  });

  it("returns submission detail with schema snapshot", async () => {
    mocks.getCurrentUser.mockResolvedValue({ organizationId: "org_1" });
    mocks.getWithSchema.mockResolvedValue({
      id: "sub_1",
      submissionData: { foo: "bar" },
      schemaSnapshot: { properties: { foo: { kind: "text", title: "Foo" } } }
    });

    const req = new Request("http://localhost/api/crm/submissions/sub_1");
    const res = await GET(req as any, { params: { id: "sub_1" } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.submissionData.foo).toBe("bar");
  });
});