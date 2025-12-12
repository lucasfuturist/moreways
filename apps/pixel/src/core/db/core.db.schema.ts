// File: src/core/db/core.db.schema.ts
// Update: Added 'quarantine' table for Zero-Loss Guarantee

import { relations } from 'drizzle-orm';
import { 
  pgTable, uuid, text, timestamp, jsonb, pgEnum, index, boolean
} from 'drizzle-orm/pg-core';

export const eventTypeEnum = pgEnum('event_type', [
  'pageview', 'lead', 'purchase', 'custom', 'view_content', 'add_to_cart', 'initiate_checkout', 'offline_conversion'
]);

export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  publicKey: text('public_key').notNull().unique(),
  secretKey: text('secret_key').notNull(),
  adConfig: jsonb('ad_config').$type<any>(),
  geoConfig: jsonb('geo_config').$type<any>(),
  webhookUrl: text('webhook_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const identities = pgTable('identities', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  anonymousId: text('anonymous_id').notNull(),
  userId: text('user_id'),
  emailHash: text('email_hash'),
  phoneHash: text('phone_hash'),
  mergedInto: uuid('merged_into'), 
  createdAt: timestamp('created_at').defaultNow(),
  lastSeenAt: timestamp('last_seen_at').defaultNow(),
}, (t) => ({
  lookupIdx: index('identity_lookup_idx').on(t.tenantId, t.anonymousId),
  emailIdx: index('identity_email_idx').on(t.tenantId, t.emailHash),
}));

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  identityId: uuid('identity_id').references(() => identities.id),
  type: eventTypeEnum('event_type').notNull(),
  consentPolicy: jsonb('consent_policy').notNull().$type<any>(),
  contextClient: jsonb('context_client').$type<any>(),
  contextCookies: jsonb('context_cookies').$type<any>(),
  clickData: jsonb('click_data').$type<any>(),
  derivedGeo: jsonb('derived_geo').$type<any>(),
  qualityScore: jsonb('quality_score').$type<any>(),
  attributionStats: jsonb('attribution_stats').$type<any>(),
  metadata: jsonb('metadata'),
  processingStatus: jsonb('processing_status').default({}).$type<Record<string, string>>(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const complianceLogs = pgTable('compliance_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  eventId: uuid('event_id'),
  action: text('action').notNull(),
  reason: text('reason').notNull(),
  metadata: jsonb('metadata'),
  timestamp: timestamp('created_at').defaultNow(),
});

// [DIVINE UPGRADE] The Safety Net
export const quarantine = pgTable('quarantine', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id), // Nullable if auth failed completely
  rawBody: jsonb('raw_body').notNull(),
  headers: jsonb('headers').notNull(),
  errorReason: text('error_reason').notNull(),
  ipAddress: text('ip_address'),
  retryStatus: text('retry_status').default('pending'), // pending, fixed, ignored
  createdAt: timestamp('created_at').defaultNow(),
});

export const tenantRelations = relations(tenants, ({ many }) => ({
  events: many(events),
  identities: many(identities),
  complianceLogs: many(complianceLogs),
  quarantine: many(quarantine),
}));

export const identityRelations = relations(identities, ({ one, many }) => ({
  tenant: one(tenants, { fields: [identities.tenantId], references: [tenants.id] }),
  events: many(events),
}));

export const eventRelations = relations(events, ({ one }) => ({
  tenant: one(tenants, { fields: [events.tenantId], references: [tenants.id] }),
  identity: one(identities, { fields: [events.identityId], references: [identities.id] }),
}));