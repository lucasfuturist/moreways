import { describe, it, expect, vi, beforeEach } from "vitest";
import { FormSubmissionRepo } from "@/crm/repo/crm.repo.FormSubmissionRepo";

// [FIX] Updated mock structure to include formSchema.findUnique
const mockDb = vi.hoisted(() => ({
  client: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  formSchema: {
    findUnique: vi.fn(), // Needed for encryption lookup
  },
  formSubmission: {
    create: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
  },
}));

vi.mock("@/infra/db/infra.repo.dbClient", () => ({
  db: mockDb,
}));

// Mock encryption to be a pass-through for unit testing logic
vi.mock("@/infra/security/security.svc.encryption", () => ({
  EncryptionService: {
    encrypt: (val: string) => `ENC:${val}`,
    decrypt: (val: string) => val.replace("ENC:", ""),
  }
}));

describe("FormSubmissionRepo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // [FIX] Default schema mock to prevent crashes during create()
    mockDb.formSchema.findUnique.mockResolvedValue({
      schemaJson: { properties: {} } 
    });
  });

  describe("create", () => {
    it("creates a new client if email is not found", async () => {
      // Setup: No existing client found
      mockDb.client.findFirst.mockResolvedValue(null);
      // Setup: Create new client
      mockDb.client.create.mockResolvedValue({ id: "client_new" });
      // Setup: Create submission
      mockDb.formSubmission.create.mockResolvedValue({
        id: "sub_1",
        organizationId: "org_1",
        createdAt: new Date(),
      });

      const result = await FormSubmissionRepo.create({
        organizationId: "org_1",
        formSchemaId: "form_1",
        submissionData: { email: "new@example.com", fullName: "New User" },
      });

      expect(mockDb.client.create).toHaveBeenCalled();
      expect(mockDb.formSubmission.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            clientId: "client_new",
          }),
        })
      );
      expect(result.id).toBe("sub_1");
    });

    it("links to existing client if email is found", async () => {
      // Setup: Existing client found
      mockDb.client.findFirst.mockResolvedValue({ id: "client_existing" });
      
      mockDb.formSubmission.create.mockResolvedValue({
        id: "sub_2",
        organizationId: "org_1",
        createdAt: new Date(),
      });

      await FormSubmissionRepo.create({
        organizationId: "org_1",
        formSchemaId: "form_1",
        submissionData: { email: "existing@example.com" },
      });

      // Should NOT create a new client
      expect(mockDb.client.create).not.toHaveBeenCalled();
      
      // Should link to existing ID
      expect(mockDb.formSubmission.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            clientId: "client_existing",
          }),
        })
      );
    });
  });

  describe("findMany", () => {
    it("returns mapped submissions", async () => {
      const mockDate = new Date();
      mockDb.formSubmission.findMany.mockResolvedValue([
        {
          id: "sub_1",
          organizationId: "org_1",
          formSchemaId: "form_1",
          submissionData: { foo: "bar" },
          createdAt: mockDate,
          updatedAt: mockDate,
          flags: ["RISK"],
          formSchema: { version: 1, schemaJson: {} },
        },
      ]);

      const result = await FormSubmissionRepo.findMany("org_1");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("sub_1");
      expect(result[0].formVersionId).toBe("1");
      expect(result[0].flags).toEqual(["RISK"]);
    });
  });
});