import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),
  
  // Database
  CONSOLE_DATABASE_URL: z.string().min(1, "CONSOLE_DATABASE_URL is required"),
  
  // LLM
  OPENAI_API_KEY: z.string().optional(),
  LLM_MOCK_MODE: z.string().transform((s) => s === "true").default("false"),
  
  // Security
  ENCRYPTION_KEY: z.string().length(64, "ENCRYPTION_KEY must be 64 hex characters (32 bytes)").optional(),
  
  // Auth (NextAuth standard)
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
});

// [INTERNAL] Parser
function parseEnv() {
  // 1. Gather raw env
  const raw = {
    NODE_ENV: process.env.NODE_ENV,
    APP_BASE_URL: process.env.APP_BASE_URL,
    CONSOLE_DATABASE_URL: process.env.CONSOLE_DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    LLM_MOCK_MODE: process.env.LLM_MOCK_MODE,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  };

  // 2. Validate
  const parsed = EnvSchema.safeParse(raw);

  if (!parsed.success) {
    console.error("❌ Invalid Environment Configuration:");
    parsed.error.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    });
    
    // In Test mode, we don't want to crash the runner if config is partial
    if (process.env.NODE_ENV !== "test") {
        throw new Error("Environment validation failed. See logs.");
    }
    // Fallback for test runner if needed (mock values)
    return {} as any; 
  }

  // 3. Map to CamelCase (The Fix)
  // The rest of the app expects env.databaseUrl, env.llmApiKey, etc.
  return {
    nodeEnv: parsed.data.NODE_ENV,
    appBaseUrl: parsed.data.APP_BASE_URL,
    databaseUrl: parsed.data.CONSOLE_DATABASE_URL,
    llmApiKey: parsed.data.OPENAI_API_KEY,
    llmMockMode: parsed.data.LLM_MOCK_MODE,
    encryptionKey: parsed.data.ENCRYPTION_KEY,
    nextAuthUrl: parsed.data.NEXTAUTH_URL,
    nextAuthSecret: parsed.data.NEXTAUTH_SECRET,
  };
}

export const env = parseEnv();