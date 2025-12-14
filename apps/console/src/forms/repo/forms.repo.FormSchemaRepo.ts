/**
 * Module: FormSchemaRepo
 *
 * - Mirrors the `form_schemas` table.
 * - Handles persistence of form schemas.
 * - Auto-migrates legacy schemas to v1.5/v1.6 on read.
 */

import type { Prisma } from "@prisma/client";
import { db } from "@/infra/db/infra.repo.dbClient";
import { logger } from "@/infra/logging/infra.svc.logger";
import {
  FormSchema,
  FormSchemaCreateInput,
  mapDbFormSchemaRowToDomain,
} from "../schema/forms.schema.FormSchemaModel";
import { migrateSchemaToV15 } from "@/forms/util/forms.util.migrateSchema";

export interface FormSchemaWithStats extends FormSchema {
  _count: {
    formSubmissions: number;
  };
}

export interface FormVersionSummary {
  id: string;
  version: number;
  createdAt: Date;
}

export interface FormSchemaRepo {
  createVersion(input: FormSchemaCreateInput): Promise<FormSchema>;
  getLatestByName(params: { organizationId: string; name: string }): Promise<FormSchema | null>;
  getById(params: { organizationId: string; id: string }): Promise<FormSchema | null>;
  getPublicById(id: string): Promise<FormSchema | null>;
  getBySlug(slug: string): Promise<FormSchema | null>;
  listByOrg(orgId: string): Promise<FormSchemaWithStats[]>;
  listVersionsByName(params: { organizationId: string; name: string }): Promise<FormVersionSummary[]>;
  
  // [NEW] Soft Delete & Publish
  softDelete(params: { organizationId: string; id: string }): Promise<void>;
  publishVersion(params: { organizationId: string; id: string }): Promise<void>;
}

class PrismaFormSchemaRepo implements FormSchemaRepo {
  async createVersion(input: FormSchemaCreateInput): Promise<FormSchema> {
    const { organizationId, name, schemaJson } = input;

    // Find the absolute latest version number (even if deprecated) to ensure uniqueness
    const latest = await db.formSchema.findFirst({
      where: { organizationId, name },
      orderBy: { version: "desc" },
    });

    const nextVersion = (latest?.version ?? 0) + 1;
    const cleanSchema = migrateSchemaToV15(schemaJson);

    try {
      const created = await db.formSchema.create({
        data: {
          organizationId,
          name,
          version: nextVersion,
          schemaJson: cleanSchema as unknown as Prisma.InputJsonValue,
          isDeprecated: false,
          // [FIX] Default to Draft (false). Only explicit publish sets true.
          isPublished: false 
        },
      });

      logger.info("Created new form schema version", { id: created.id, version: nextVersion }, { organizationId });

      const domain = mapDbFormSchemaRowToDomain(created);
      domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
      return domain;

    } catch (e: any) {
      // Auto-heal missing organization in development environment
      const isFkError = e.code === 'P2003' || (typeof e.message === 'string' && e.message.includes('Foreign key constraint failed'));
      const isDev = process.env.NODE_ENV !== 'production';

      if (isFkError && isDev) {
        logger.warn("[FormSchemaRepo] FK Error detected in DEV. Attempting to seed missing organization...", { organizationId });
        try {
            await db.organization.upsert({
              where: { id: organizationId },
              update: {},
              create: { id: organizationId, name: "Local Dev Org", slug: "local-dev" }
            });
            // Retry
            const retry = await db.formSchema.create({
              data: {
                organizationId, name, version: nextVersion,
                schemaJson: cleanSchema as unknown as Prisma.InputJsonValue,
                isDeprecated: false, isPublished: false
              },
            });
            return mapDbFormSchemaRowToDomain(retry);
        } catch (innerErr) {
            logger.error("[FormSchemaRepo] Auto-heal failed.", { error: innerErr });
        }
      }
      throw e;
    }
  }

  async getLatestByName(params: { organizationId: string; name: string }): Promise<FormSchema | null> {
    const { organizationId, name } = params;
    // Get latest non-deprecated version (regardless of publish status for internal use)
    const row = await db.formSchema.findFirst({
      where: { organizationId, name, isDeprecated: false },
      orderBy: { version: "desc" },
    });
    if (!row) return null;
    return mapDbFormSchemaRowToDomain(row);
  }

  async getById(params: { organizationId: string; id: string }): Promise<FormSchema | null> {
    const { organizationId, id } = params;
    const row = await db.formSchema.findFirst({
      where: { id, organizationId },
    });
    if (!row) return null;
    return mapDbFormSchemaRowToDomain(row);
  }

  // Used by Public Runner
  async getPublicById(id: string): Promise<FormSchema | null> {
    const row = await db.formSchema.findUnique({
      where: { id },
    });
    // Strict check: Must exist, not be deprecated, and be PUBLISHED
    if (!row || row.isDeprecated || !row.isPublished) return null;
    return mapDbFormSchemaRowToDomain(row);
  }

  // Used by Marketing Site / Router
  async getBySlug(slug: string): Promise<FormSchema | null> {
    const row = await db.formSchema.findFirst({
      where: { slug, isPublished: true, isDeprecated: false },
      orderBy: { version: 'desc' },
    });
    if (!row) return null;
    return mapDbFormSchemaRowToDomain(row);
  }

  // Used by Admin Dashboard
  async listByOrg(orgId: string): Promise<FormSchemaWithStats[]> {
    const rows = await db.formSchema.findMany({
      where: { organizationId: orgId, isDeprecated: false },
      orderBy: { updatedAt: 'desc' },
      distinct: ['name'], 
      include: {
        _count: {
          select: { formSubmissions: true }
        }
      }
    });
    
    return rows.map(row => ({
        ...mapDbFormSchemaRowToDomain(row),
        _count: { formSubmissions: row._count.formSubmissions }
    }));
  }

  async listVersionsByName(params: { organizationId: string; name: string }): Promise<FormVersionSummary[]> {
    const rows = await db.formSchema.findMany({
      where: { 
        organizationId: params.organizationId,
        name: params.name,
        isDeprecated: false
      },
      orderBy: { version: 'asc' },
      select: { id: true, version: true, createdAt: true }
    });
    return rows;
  }

  // [NEW] Soft Delete
  async softDelete(params: { organizationId: string; id: string }): Promise<void> {
    const target = await db.formSchema.findFirst({
        where: { id: params.id, organizationId: params.organizationId }
    });
    if (!target) return;

    await db.formSchema.updateMany({
        where: { organizationId: params.organizationId, name: target.name },
        data: { isDeprecated: true, isPublished: false }
    });
    logger.info("Soft deleted form family", { name: target.name });
  }

  // [NEW] Publish Version
  async publishVersion(params: { organizationId: string; id: string }): Promise<void> {
    const target = await db.formSchema.findFirst({
        where: { id: params.id, organizationId: params.organizationId }
    });
    if (!target) throw new Error("Form not found");

    // Unpublish siblings
    await db.formSchema.updateMany({
        where: { 
            organizationId: params.organizationId, 
            name: target.name,
            id: { not: params.id } 
        },
        data: { isPublished: false }
    });

    // Publish target
    await db.formSchema.update({
        where: { id: params.id },
        data: { isPublished: true }
    });
    
    logger.info("Published form version", { name: target.name, version: target.version });
  }
}

export const formSchemaRepo: FormSchemaRepo = new PrismaFormSchemaRepo();