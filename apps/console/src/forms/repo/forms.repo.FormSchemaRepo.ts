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

// Extended Type for Dashboard
export interface FormSchemaWithStats extends FormSchema {
  _count: {
    formSubmissions: number;
  };
}

// Lightweight summary for history sliders
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
  // [NEW] Added this method to the Interface
  getBySlug(slug: string): Promise<FormSchema | null>;
  listByOrg(orgId: string): Promise<FormSchemaWithStats[]>;
  listVersionsByName(params: { organizationId: string; name: string }): Promise<FormVersionSummary[]>;
}

class PrismaFormSchemaRepo implements FormSchemaRepo {
  async createVersion(input: FormSchemaCreateInput): Promise<FormSchema> {
    const { organizationId, name, schemaJson } = input;

    const latest = await db.formSchema.findFirst({
      where: { organizationId, name },
      orderBy: { version: "desc" },
    });

    const nextVersion = (latest?.version ?? 0) + 1;

    // Ensure we are persisting a clean schema
    const cleanSchema = migrateSchemaToV15(schemaJson);

    try {
      const created = await db.formSchema.create({
        data: {
          organizationId,
          name,
          version: nextVersion,
          schemaJson: cleanSchema as unknown as Prisma.InputJsonValue,
          isDeprecated: false,
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
              create: {
                id: organizationId,
                name: "Local Dev Org",
                slug: "local-dev"
              }
            });

            // Retry the create
            const retry = await db.formSchema.create({
              data: {
                organizationId,
                name,
                version: nextVersion,
                schemaJson: cleanSchema as unknown as Prisma.InputJsonValue,
                isDeprecated: false,
              },
            });
            
            logger.info("[FormSchemaRepo] Auto-heal successful. Schema created.");
            
            const domain = mapDbFormSchemaRowToDomain(retry);
            domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
            return domain;

        } catch (innerErr) {
            logger.error("[FormSchemaRepo] Auto-heal failed.", { error: innerErr });
        }
      }
      
      throw e;
    }
  }

  async getLatestByName(params: { organizationId: string; name: string }): Promise<FormSchema | null> {
    const { organizationId, name } = params;
    const row = await db.formSchema.findFirst({
      where: { organizationId, name },
      orderBy: { version: "desc" },
    });
    if (!row) return null;
    const domain = mapDbFormSchemaRowToDomain(row);
    domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
    return domain;
  }

  async getById(params: { organizationId: string; id: string }): Promise<FormSchema | null> {
    const { organizationId, id } = params;
    const row = await db.formSchema.findFirst({
      where: { id, organizationId },
    });
    if (!row) return null;
    const domain = mapDbFormSchemaRowToDomain(row);
    domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
    return domain;
  }

  // [NEW] Implementation for Fetching by Slug
  async getBySlug(slug: string): Promise<FormSchema | null> {
    const row = await db.formSchema.findFirst({
      where: { 
        slug: slug,
        isPublished: true 
      },
      orderBy: { version: 'desc' }, // Get latest published version
    });

    if (!row) return null;

    const domain = mapDbFormSchemaRowToDomain(row);
    domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
    return domain;
  }

  async listByOrg(orgId: string): Promise<FormSchemaWithStats[]> {
    const rows = await db.formSchema.findMany({
      where: { organizationId: orgId },
      orderBy: { updatedAt: 'desc' },
      distinct: ['name'],
      include: {
        _count: {
          select: { formSubmissions: true }
        }
      }
    });
    
    return rows.map(row => {
      const domain = mapDbFormSchemaRowToDomain(row);
      domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
      return {
        ...domain,
        _count: { formSubmissions: row._count.formSubmissions }
      };
    });
  }

  async listVersionsByName(params: { organizationId: string; name: string }): Promise<FormVersionSummary[]> {
    const rows = await db.formSchema.findMany({
      where: { 
        organizationId: params.organizationId,
        name: params.name 
      },
      orderBy: { version: 'asc' },
      select: {
        id: true,
        version: true,
        createdAt: true
      }
    });
    return rows;
  }

  async getPublicById(id: string): Promise<FormSchema | null> {
    const row = await db.formSchema.findUnique({
      where: { id },
    });
    
    if (!row) return null;

    const domain = mapDbFormSchemaRowToDomain(row);
    domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
    return domain;
  }
}

export const formSchemaRepo: FormSchemaRepo = new PrismaFormSchemaRepo();