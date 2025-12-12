/**
 * infra.svc.audit
 *
 * Implements an immutable audit trail for compliance.
 *
 * Events tracked:
 * - PII_ACCESS (Decryption)
 * - SUBMISSION_EXPORT (Memo generation)
 * - FORM_MODIFICATION (Schema changes)
 * - LOGIN_FAILURE
 */

import { logger } from "@/infra/logging/infra.svc.logger";

export type AuditAction = 
  | "PII_ACCESS" 
  | "SUBMISSION_EXPORT" 
  | "FORM_MODIFICATION" 
  | "LOGIN_FAILURE";

export interface AuditEntry {
  actorId: string; // User ID or "system" or "public_user"
  action: AuditAction;
  targetId: string; // The resource being accessed (Submission ID, Form ID)
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// In a real app, this would write to a dedicated table or external service (e.g. Datadog/Splunk)
// For V1, we log structured JSON which can be ingested by CloudWatch.

export const AuditService = {
  log(entry: AuditEntry) {
    // 1. Structural Logging
    logger.info(`[AUDIT] ${entry.action} by ${entry.actorId}`, {
        audit: true,
        ...entry,
        timestamp: new Date().toISOString()
    });

    // 2. (Optional) Future DB Insert
    // await db.auditLog.create({ ... })
  }
};