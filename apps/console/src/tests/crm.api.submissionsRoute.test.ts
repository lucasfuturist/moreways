import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/crm/submissions/route";

// [FIX] Hoist mocks
const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
  getCurrentUser: vi.fn(),
}));

// [FIX] Mock the PascalCase export 'FormSubmissionRepo' and the correct method 'findMany'
vi.mock("@/crm/repo/crm.repo.FormSubmissionRepo", () => ({
  FormSubmissionRepo: {
    findMany: mocks.findMany,
  },
}));

vi.mock("@/auth/svc/auth.svc.GetCurrentUserAsync", () => ({
  GetCurrentUserAsync: mocks.getCurrentUser,
}));

describe("GET /api/crm/submissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if user is not authenticated", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);
    const req = new Request("http://localhost/api/crm/submissions?formId=123");
    
    const res = await GET(req as any);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 200 and calls findMany with undefined formId if param is missing", async () => {
    // [FIX] The API treats formId as optional, so it returns 200, not 400.
    mocks.getCurrentUser.mockResolvedValue({ organizationId: "org_1" });
    mocks.findMany.mockResolvedValue([]);

    const req = new Request("http://localhost/api/crm/submissions"); 

    const res = await GET(req as any);
    expect(res.status).toBe(200);
    
    // Verify it called with undefined
    expect(mocks.findMany).toHaveBeenCalledWith("org_1", undefined);
  });

  it("returns a list of submissions when authorized and formId provided", async () => {
    mocks.getCurrentUser.mockResolvedValue({ organizationId: "org_1" });
    
    const mockSubmissions = [
      { id: "sub_1", submissionData: { name: "Alice" }, createdAt: new Date() }
    ];
    mocks.findMany.mockResolvedValue(mockSubmissions);

    const req = new Request("http://localhost/api/crm/submissions?formId=form_abc");
    
    const res = await GET(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    expect(json[0].id).toBe("sub_1");
    
    // [FIX] Verify correct arguments passed to repo
    expect(mocks.findMany).toHaveBeenCalledWith("org_1", "form_abc");
  });
});