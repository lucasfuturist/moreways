import { defineConfig } from 'drizzle-kit';
import 'dotenv-safe/config';

// Logic to prefer the Pixel Database URL
const connectionString = process.env.PIXEL_DATABASE_URL

if (!connectionString) {
  throw new Error("❌ Missing PIXEL_DATABASE_URL");
}

export default defineConfig({
  schema: './src/core/db/core.db.schema.ts',
  out: './migrations',
  
  // [FIX] Updated for Drizzle Kit v0.21+
  dialect: 'postgresql', 
  
  dbCredentials: {
    // [FIX] 'connectionString' was renamed to 'url'
    url: connectionString,
  },
  
  // Optional: print SQL during migration gen
  verbose: true,
  strict: true,
});