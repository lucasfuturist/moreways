import { pgTable, text, timestamp, uuid, jsonb, pgEnum, boolean } from 'drizzle-orm/pg-core';

// [FIX] Shim the shared Enum so Drizzle doesn't try to delete it.
// This is used by the Attribution Engine, but shares the same DB 'public' schema.
export const eventTypeEnum = pgEnum('event_type', [
  'pageview', 'lead', 'purchase', 'custom', 'view_content', 'add_to_cart', 'initiate_checkout', 'offline_conversion'
]);

// ----------------------------------------------------------------------
// Website Tables
// ----------------------------------------------------------------------

// CHANGE 1: Rename the table in DB to 'portal_users'
export const users = pgTable('portal_users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  // Add the new phone number field here
  phoneNumber: text('phone_number'), // Drizzle maps camelCase `phoneNumber` to snake_case `phone_number`
  role: text('role').default('client'),
  createdAt: timestamp('created_at').defaultNow(),
});

// CHANGE 2: Rename the table in DB to 'portal_claims'
export const claims = pgTable('portal_claims', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  type: text('type').notNull(),
  status: text('status').default('draft'),
  summary: text('summary'),
  formData: jsonb('form_data'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});


export const formSchemas = pgTable('form_schemas', {
  id: uuid('id').primaryKey(),
  // Note: Drizzle uses camelCase for keys, mapped to snake_case columns
  organizationId: text('organization_id').notNull(), 
  name: text('name').notNull(),
  slug: text('slug'), // Nullable in DB
  schemaJson: jsonb('schema_json'),
  isPublished: boolean('is_published').default(false),
  isDeprecated: boolean('is_deprecated').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
