// File: src/core/db/index.ts

import 'dotenv-safe/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './core.db.schema';

// [CHANGE] Look for PIXELX_DATABASE_URL first
const connectionString = process.env.PIXEL_DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ Missing PIXEL_DATABASE_URL environment variable");
}

// Log masked URL for debugging
const maskedUrl = connectionString.replace(/:([^@]+)@/, ':****@');
console.log(`🔌 DB Connecting to: ${maskedUrl}`);

const client = postgres(connectionString, { 
  prepare: false,
  connect_timeout: 10
});

export const db = drizzle(client, { schema });