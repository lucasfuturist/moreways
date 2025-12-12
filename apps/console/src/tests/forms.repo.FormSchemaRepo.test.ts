// src/tests/forms.repo.FormSchemaRepo.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as dbModule from "@/infra/db/infra.repo.dbClient";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";

// IMPORTANT: vi.mock calls are hoisted, so the factory must be self-contained.
vi.mock("@/infra/db/infra.repo.dbClient", () => {
  const mockDbLocal = {
    formSchema: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  };

  return {
    // what production code uses
    db: mockDbLocal,
    // test-only handle so we can inspect and configure calls
    __mockDb: mockDbLocal,
  };
});

vi.mock("@/infra/logging/infra.svc.logger", () => {
  return {
    logger: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  };
});

type MockDbType = {
  formSchema: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
};

describe("FormSchemaRepo", () => {
  const ORG = "org_abc";
  const NAME = "intakeForm";

  let mockDb: MockDbType;

  beforeEach(() => {
    vi.clearAllMocks();

    // grab the mock db instance that the mocked module exported
    mockDb = (dbModule as any).__mockDb as MockDbType;
  });

  it("creates a new versioned schema for an org + name", async () => {
    mockDb.formSchema.create.mockResolvedValue({
      id: "schema123",
      organizationId: ORG,
      name: NAME,
      version: 3,
      schemaJson: {
        type: "object",
        properties: {},
        required: [],
      },
      isDeprecated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await formSchemaRepo.createVersion({
      organizationId: ORG,
      name: NAME,
      schemaJson: { type: "object", properties: {}, required: [] },
    });

    expect(mockDb.formSchema.create).toHaveBeenCalledTimes(1);
    // [FIX] Match strict object structure produced by normalizer
    expect(mockDb.formSchema.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        organizationId: ORG,
        name: NAME,
        schemaJson: {
          type: "object",
          properties: {},
          required: [],
          order: [] // Normalizer adds this
        },
        version: 1 // Mocked version return
      }),
    });

    expect(result.organizationId).toBe(ORG);
    expect(result.name).toBe(NAME);
    expect(typeof result.version).toBe("number");
  });

  it("returns latest version for getLatestByName", async () => {
    mockDb.formSchema.findFirst.mockResolvedValue({
      id: "schema999",
      organizationId: ORG,
      name: NAME,
      version: 7,
      schemaJson: {
        type: "object",
        properties: {},
        required: [],
      },
      isDeprecated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await formSchemaRepo.getLatestByName({
      organizationId: ORG,
      name: NAME,
    });

    expect(mockDb.formSchema.findFirst).toHaveBeenCalledWith({
      where: { organizationId: ORG, name: NAME },
      orderBy: { version: "desc" },
    });

    expect(result?.version).toBe(7);
    expect(result?.organizationId).toBe(ORG);
  });

  it("does not leak schemas across organizations", async () => {
    // for a different org, repo should not return the ORG row
    mockDb.formSchema.findFirst.mockResolvedValue(null);

    const result = await formSchemaRepo.getLatestByName({
      organizationId: "other_org_xyz",
      name: NAME,
    });

    expect(result).toBeNull();
  });
});
