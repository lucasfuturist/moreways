/**
 * crm.repo.FormSubmissionRepo.ts
 *
 * Repository for handling Form Submissions.
 * Bridges the gap between the raw DB schema (Prisma) and the Domain Model.
 *
 * Capabilities:
 * - fetching submissions scoped by Organization
 * - creating new submissions (with auto-client creation/linking)
 * - mapping DB JSON types to TypeScript interfaces
 * - [SECURITY] Handles Field-Level Encryption (FLE) for PII fields
 * - [AUDIT] Logs PII access events
 *
 * Related docs:
 * - 04-data-and-api-spec.md
 * - 03-security-and-data-handling.md (Encryption Policy)
 */

import { db } from "@/infra/db/infra.repo.dbClient";
import type { FormSubmission, Verdict } from "@/crm/schema/crm.schema.FormSubmissionModel";
import { Prisma } from "@prisma/client";
import { EncryptionService } from "@/infra/security/security.svc.encryption";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { AuditService } from "@/infra/audit/infra.svc.audit"; 

/**
 * [INTERNAL] Helper to identify which keys in a schema require encryption.
 */
function getSensitiveKeys(schema: FormSchemaJsonShape): Set<string> {
  const sensitive = new Set<string>();
  if (!schema?.properties) return sensitive;

  for (const [key, def] of Object.entries(schema.properties)) {
    if (def.metadata?.isPII) {
      sensitive.add(key);
    }
  }
  return sensitive;
}

/**
 * [INTERNAL] Helper to decrypt data object based on schema.
 */
function decryptSubmissionData(data: Record<string, any>, schema: FormSchemaJsonShape): Record<string, any> {
  const sensitiveKeys = getSensitiveKeys(schema);
  const cleanData = { ...data };

  for (const key of sensitiveKeys) {
    const value = cleanData[key];
    // Only attempt decrypt if it looks like our packed format (iv:tag:content)
    if (typeof value === 'string' && value.includes(':')) {
      const decrypted = EncryptionService.decrypt(value);
      // If decryption succeeds, replace; otherwise keep raw (or handle error)
      if (decrypted !== null) {
        cleanData[key] = decrypted;
      }
    }
  }
  return cleanData;
}

export const FormSubmissionRepo = {
  /**
   * Create a new submission.
   * 
   * [SECURITY] Automatically encrypts fields marked as `isPII` in the schema.
   * Automatically handles Client linking logic.
   */
  async create(input: {
    organizationId: string;
    formSchemaId: string;
    submissionData: Record<string, any>;
    flags?: any[]; 
    clientId?: string;
  }) {
    // 1. Determine Client ID (Auto-Linking Logic)
    let clientId = input.clientId;
    
    if (!clientId) {
       // Heuristic: Try to find by email in the form data
       const emailKey = Object.keys(input.submissionData).find(k => /email/i.test(k));
       const email = emailKey ? input.submissionData[emailKey] : null;

       const nameKey = Object.keys(input.submissionData).find(k => /name|full/i.test(k));
       const name = nameKey ? input.submissionData[nameKey] : "Anonymous User";
       
       if (email) {
           const existing = await db.client.findFirst({
               where: { organizationId: input.organizationId, email: String(email) }
           });
           
           if (existing) {
               clientId = existing.id;
           } else {
               const newClient = await db.client.create({
                   data: {
                       organizationId: input.organizationId,
                       email: String(email),
                       fullName: String(name),
                   }
               });
               clientId = newClient.id;
           }
       } else {
           const anon = await db.client.create({
               data: {
                   organizationId: input.organizationId,
                   fullName: "Anonymous Web User",
               }
           });
           clientId = anon.id;
       }
    }

    // 2. [SECURITY] Encrypt Sensitive Data
    // We must fetch the schema definition to know which fields are PII.
    const formDef = await db.formSchema.findUnique({
      where: { id: input.formSchemaId },
      select: { schemaJson: true }
    });

    const securedData = { ...input.submissionData };

    if (formDef) {
      const schema = formDef.schemaJson as unknown as FormSchemaJsonShape;
      const sensitiveKeys = getSensitiveKeys(schema);

      for (const key of sensitiveKeys) {
        const val = securedData[key];
        if (typeof val === 'string' && val.length > 0) {
          securedData[key] = EncryptionService.encrypt(val);
        }
      }
    }

    // 3. Persist Submission
    const record = await db.formSubmission.create({
      data: {
        organizationId: input.organizationId,
        formSchemaId: input.formSchemaId,
        clientId: clientId!, 
        submissionData: securedData as Prisma.InputJsonValue,
        flags: (input.flags || []) as Prisma.InputJsonValue,
        verdict: Prisma.JsonNull // Explicitly null on create
      }
    });

    return {
        id: record.id,
        organizationId: record.organizationId,
        createdAt: record.createdAt
    };
  },

  /**
   * [NEW] Update a submission with the Magistrate's Verdict.
   * This is typically called async after the main submission.
   */
  async updateVerdict(submissionId: string, verdict: Verdict) {
    return db.formSubmission.update({
        where: { id: submissionId },
        data: {
            verdict: verdict as Prisma.InputJsonValue
        }
    });
  },

  /**
   * Get all submissions for an organization.
   * [SECURITY] Decrypts data on-the-fly for authorized viewers.
   */
  async findMany(organizationId: string, formId?: string) {
    const whereClause: any = { organizationId };
    
    if (formId) {
      whereClause.formSchemaId = formId;
    }

    const records = await db.formSubmission.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        formSchema: {
            select: { schemaJson: true, version: true }
        }
      }
    });

    return records.map(r => {
      const schema = r.formSchema.schemaJson as unknown as FormSchemaJsonShape;
      const rawData = r.submissionData as Record<string, any>;
      
      // [SECURITY] Decrypt PII for display
      const cleanData = decryptSubmissionData(rawData, schema);

      return {
        id: r.id,
        organizationId: r.organizationId,
        formSchemaId: r.formSchemaId,
        formVersionId: r.formSchema.version.toString(),
        submissionData: cleanData, 
        schemaSnapshot: (schema as any) || {},
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        isDraft: false, 
        flags: (r.flags as any[]) || [],
        verdict: (r.verdict as Verdict | null)
      };
    });
  },

  /**
   * Get a single detailed submission.
   * [SECURITY] Decrypts data on-the-fly.
   * [AUDIT] Logs access event.
   */
  async findById(organizationId: string, submissionId: string, actorId: string = "unknown") {
    const record = await db.formSubmission.findFirst({
      where: { id: submissionId, organizationId }, // [SECURITY] Scope by Org
      include: {
        formSchema: {
            select: { schemaJson: true, version: true }
        }
      }
    });

    if (!record) return null;

    const schema = record.formSchema?.schemaJson as unknown as FormSchemaJsonShape;
    const rawData = record.submissionData as Record<string, any>;
    
    // [SECURITY] Decrypt
    const cleanData = decryptSubmissionData(rawData, schema);

    // [AUDIT] Log PII Access
    AuditService.log({
        actorId: actorId,
        action: "PII_ACCESS",
        targetId: submissionId,
        metadata: {
            organizationId,
            schemaId: record.formSchemaId
        }
    });

    return {
      id: record.id,
      organizationId: record.organizationId,
      formSchemaId: record.formSchemaId,
      formVersionId: record.formSchema.version.toString(),
      submissionData: cleanData,
      schemaSnapshot: (schema as any) || {},
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      isDraft: false,
      flags: (record.flags as any[]) || [],
      verdict: (record.verdict as Verdict | null)
    };
  }
};

export const formSubmissionRepo = FormSubmissionRepo;