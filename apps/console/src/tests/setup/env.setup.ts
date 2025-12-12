import { vi } from "vitest";

// Mock the environment config module globally
vi.mock("@/infra/config/infra.svc.envConfig", () => ({
  env: {
    nodeEnv: "test",
    databaseUrl: "postgresql://mock:5432/mockdb",
    llmApiKey: "mock-key",
    llmMockMode: true,
    appBaseUrl: "http://localhost:3000",
    // 64 hex chars = 32 bytes
    encryptionKey: "a".repeat(64), 
    nextAuthUrl: "http://localhost:3000",
    nextAuthSecret: "mock-secret"
  },
}));