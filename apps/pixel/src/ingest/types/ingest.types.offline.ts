// File: src/ingest/types/ingest.types.offline.ts
// Domain: Ingest
// Role: Schema for Server-to-Server CRM Updates
// FIX: This file now ONLY contains types, no logic.

import { z } from 'zod';

export const OfflineConversionSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  external_id: z.string().optional(),
  
  event_name: z.string().default('offline_conversion'),
  value: z.number().optional(),
  currency: z.string().default('USD'),
  occurred_at: z.string().datetime().optional(),
});

export type OfflineConversionPayload = z.infer<typeof OfflineConversionSchema>;