import { describe, it, expect, vi, beforeEach } from "vitest";
import { FormSubmissionRepo } from "@/crm/repo/crm.repo.FormSubmissionRepo";
import { EncryptionService } from "@/infra/security/security.svc.encryption";

// 1. Hoist DB Mock
const mockDb = vi.hoisted(() => ({
  client: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  formSchema: {
    findUnique: vi.fn(),
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

describe("Integration: Field-Level Encryption (Repo Layer)", () => {
  const SENSITIVE_VALUE = "My Secret SSN: 999-00-1111";
  const PUBLIC_VALUE = "John Public";

  // Mock Schema with PII flag
  const mockSchema = {
    type: "object",
    properties: {
      fullName: { kind: "text", title: "Name" },
      ssn: { kind: "text", title: "SSN", metadata: { isPII: true } }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // [FIX] Mock client.create for the anonymous fallback path
    mockDb.client.create.mockResolvedValue({ id: "client_anon" });
    
    // Setup: Schema lookup
    mockDb.formSchema.findUnique.mockResolvedValue({
      id: "form_1",
      schemaJson: mockSchema
    });
  });

  it("encrypts PII fields before writing to DB", async () => {
    // Setup: Mock successful DB insert return
    mockDb.formSubmission.create.mockResolvedValue({
      id: "sub_1",
      organizationId: "org_1",
      createdAt: new Date()
    });

    await FormSubmissionRepo.create({
      organizationId: "org_1",
      formSchemaId: "form_1",
      submissionData: {
        fullName: PUBLIC_VALUE,
        ssn: SENSITIVE_VALUE
        // No email -> triggers anonymous flow -> calls client.create -> returns client_anon
      }
    });

    // ASSERTION
    const createCall = mockDb.formSubmission.create.mock.calls[0][0];
    const storedData = createCall.data.submissionData;

    // 1. Public field should be plain text
    expect(storedData.fullName).toBe(PUBLIC_VALUE);

    // 2. Sensitive field should NOT be plain text
    expect(storedData.ssn).not.toBe(SENSITIVE_VALUE);
    
    // 3. Sensitive field should be encrypted format (iv:tag:content)
    expect(storedData.ssn).toMatch(/^[a-f0-9]+:[a-f0-9]+:[a-f0-9]+$/);
  });

  it("decrypts PII fields when reading from DB", async () => {
    const encryptedSSN = EncryptionService.encrypt(SENSITIVE_VALUE);
    
    mockDb.formSubmission.findMany.mockResolvedValue([
      {
        id: "sub_1",
        organizationId: "org_1",
        formSchemaId: "form_1",
        submissionData: {
          fullName: PUBLIC_VALUE,
          ssn: encryptedSSN 
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        flags: [],
        formSchema: { version: 1, schemaJson: mockSchema }
      }
    ]);

    const results = await FormSubmissionRepo.findMany("org_1");

    expect(results[0].submissionData.fullName).toBe(PUBLIC_VALUE);
    expect(results[0].submissionData.ssn).toBe(SENSITIVE_VALUE);
  });
});