import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Use the environment variable you created for Supabase
const connectionString = process.env.WEB_DATABASE_URL;

if (!connectionString) {
  // This error will now correctly tell you if the variable is missing on Vercel
  throw new Error("WEB_DATABASE_URL is not set in environment variables.");
}

// Disable prefetch in serverless environments to manage connections efficiently
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });