/**
 * Module: MatterModel
 * 
 * Represents a specific legal case or engagement.
 * A Client can have multiple Matters.
 */

import { z } from "zod";

// Aligned with Portal Status but with internal granularity
export const MatterStatusSchema = z.enum([
  "intake_pending",   // Client is filling form
  "intake_submitted", // Ready for review
  "in_review",        // Lawyer is looking
  "info_requested",   // Need more docs
  "accepted",         // Case opened
  "rejected",         // No case
  "closed"            // Archive
]);

export type MatterStatus = z.infer<typeof MatterStatusSchema>;

export const MatterSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string(), // [MULTI-TENANT]
  clientId: z.string(),
  
  title: z.string(), // e.g. "Smith v. Landlord"
  description: z.string().optional(),
  
  status: MatterStatusSchema.default("intake_submitted"),
  
  // Workflow tracking
  assignedUserId: z.string().optional(), // Lawyer assigned
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Matter = z.infer<typeof MatterSchema>;