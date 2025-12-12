import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  AZURE_DOC_INTEL_ENDPOINT: z.string().url(),
  AZURE_DOC_INTEL_KEY: z.string().min(1),
  GOOGLE_DRIVE_KEY_FILE: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

// Validate immediately on import. Crashes app if .env is bad.
export const env = EnvSchema.parse(process.env);