import { z } from "zod";

// 1. Schema for External CRM pushing a status update to Client Site
export const StatusWebhookSchema = z.object({
  claimId: z.string(),
  newStatus: z.enum(['draft', 'submitted', 'reviewing', 'action_required', 'accepted', 'rejected', 'closed']),
  message: z.string().optional(), // "Lawyer Smith is reviewing your file"
  updatedAt: z.string().datetime(),
});

// 2. Schema for External CRM requesting claim data
export const ClaimExportSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  status: z.string(),
  formData: z.record(z.any()), // The raw intake answers
  createdAt: z.date(),
});

export type StatusWebhookPayload = z.infer<typeof StatusWebhookSchema>;