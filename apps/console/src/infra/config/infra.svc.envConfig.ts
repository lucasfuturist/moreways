/**
 * infra.svc.envConfig
 *
 * Centralized configuration loader.
 * Validates environment variables against Zod schema on startup.
 *
 * Related docs:
 * - 03-security-and-data-handling.md (Section 3.5)
 */

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
  
  // Supabase (Auth)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // [NEW] Law Service Connection
  LAW_SERVICE_URL: z.string().url().default("http://localhost:3004"),
});

function parseEnv() {
  const raw = {
    NODE_ENV: process.env.NODE_ENV,
    APP_BASE_URL: process.env.APP_BASE_URL,
    CONSOLE_DATABASE_URL: process.env.CONSOLE_DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    LLM_MOCK_MODE: process.env.LLM_MOCK_MODE,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    LAW_SERVICE_URL: process.env.LAW_SERVICE_URL,
  };

  const parsed = EnvSchema.safeParse(raw);

  if (!parsed.success) {
    console.error("❌ Invalid Environment Configuration:");
    parsed.error.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    });
    // [SECURITY] Fail fast in production if config is invalid
    if (process.env.NODE_ENV === "production") {
      throw new Error("Environment validation failed.");
    }
    // Allow partial config in test/dev for build steps
    return {} as any; 
  }

  return {
    nodeEnv: parsed.data.NODE_ENV,
    appBaseUrl: parsed.data.APP_BASE_URL,
    databaseUrl: parsed.data.CONSOLE_DATABASE_URL,
    llmApiKey: parsed.data.OPENAI_API_KEY,
    llmMockMode: parsed.data.LLM_MOCK_MODE,
    encryptionKey: parsed.data.ENCRYPTION_KEY,
    supabaseUrl: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceKey: parsed.data.SUPABASE_SERVICE_ROLE_KEY,
    lawServiceUrl: parsed.data.LAW_SERVICE_URL,
  };
}

export const env = parseEnv();