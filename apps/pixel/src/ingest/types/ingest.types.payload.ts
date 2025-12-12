// File: src/ingest/types/ingest.types.payload.ts
// Update: Added 'title' and 'company' to UserSchema for LinkedIn B2B

import { z } from 'zod';

const ConsentSchema = z.object({
  ad_storage: z.enum(['granted', 'denied']),
  analytics_storage: z.enum(['granted', 'denied']),
});

const UserSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  external_id: z.string().optional(),
  
  // [NEW] B2B Fields for LinkedIn Matching
  title: z.string().optional(),
  company: z.string().optional(),
});

const ContextSchema = z.object({
  url: z.string().url(),
  user_agent: z.string(),
  ip_address: z.string().ip().optional(), 
  referrer: z.string().optional(),
  title: z.string().optional(),
  session_id: z.string().optional(),
  screen_width: z.number().optional(),
  screen_height: z.number().optional(),
  connection_type: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional()
});

const CookieSchema = z.object({
  _fbp: z.string().nullable().optional(),
  _fbc: z.string().nullable().optional(),
  _gcl_au: z.string().nullable().optional(),
  li_fat_id: z.string().nullable().optional(),
  ttclid: z.string().nullable().optional(),
});

const ClickDataSchema = z.object({
  gclid: z.string().optional(),
  wbraid: z.string().optional(),
  gbraid: z.string().optional(),
  fbclid: z.string().optional(),
  ttclid: z.string().optional(),
  msclkid: z.string().optional(),
  li_fat_id: z.string().optional(),
  mw_ref: z.string().optional(), 
});

const QualitySchema = z.object({
  is_bot: z.boolean(),
  reason: z.enum(['honeypot', 'user_agent', 'velocity']).optional(),
  score: z.number(),
});

export const EventPayloadSchema = z.object({
  type: z.enum(['pageview', 'lead', 'purchase', 'custom', 'view_content', 'add_to_cart', 'initiate_checkout', 'offline_conversion']),
  timestamp: z.string().datetime().default(() => new Date().toISOString()),
  anonymousId: z.string().uuid(),
  
  consent: ConsentSchema,
  
  user: UserSchema.optional(),
  context: ContextSchema,
  cookies: CookieSchema.optional(),
  click: ClickDataSchema.optional(),
  
  data: z.record(z.unknown()).optional(),
  _hp: z.string().optional(),
  _quality: QualitySchema.optional(),
});

export type EventPayload = z.infer<typeof EventPayloadSchema>;