// File: src/core/db/migrate.ts
// Role: Run migrations in Production without Drizzle Kit CLI

import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './index';

export async function runMigrations() {
  console.log('📦 Running Database Migrations...');
  try {
    // This points to the 'migrations' folder we copied in the Dockerfile
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('✅ Migrations applied successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    // Propagate error to main thread to stop server startup
    throw err;
  }
}