/**
 * Module: ClientModel
 * 
 * Represents a person seeking legal services.
 * Linked to an Organization (Tenant).
 * Can optionally link back to an external Portal User ID (from Moreways Site).
 */

import { z } from "zod";

export const ClientSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string(), // [MULTI-TENANT]
  
  // Link to external auth/portal system (optional)
  externalPortalUserId: z.string().optional(),
  
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  
  // Basic CRM Metadata
  status: z.enum(["lead", "active", "churned", "archived"]).default("lead"),
  source: z.string().optional(), // e.g., "AI Intake", "Referral"
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Client = z.infer<typeof ClientSchema>;