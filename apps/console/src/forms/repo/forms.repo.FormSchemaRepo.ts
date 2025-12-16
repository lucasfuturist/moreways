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

/** Public catalog summary used by Web router */
export interface PublicFormSummary {
  id: string;
  slug: string | null;
  name: string;
  updatedAt: Date;
}

export interface FormSchemaRepo {
  createVersion(input: FormSchemaCreateInput): Promise<FormSchema>;
  getLatestByName(params: { organizationId: string; name: string }): Promise<FormSchema | null>;
  getById(params: { organizationId: string; id: string }): Promise<FormSchema | null>;
  getPublicById(id: string): Promise<FormSchema | null>;
  getBySlug(slug: string): Promise<FormSchema | null>;
  listByOrg(orgId: string): Promise<FormSchemaWithStats[]>;
  listVersionsByName(params: { organizationId: string; name: string }): Promise<FormVersionSummary[]>;

  /** 🔹 GLOBAL public catalog */
  listPublishedPublic(): Promise<PublicFormSummary[]>;

  softDelete(params: { organizationId: string; id: string }): Promise<void>;
  publishVersion(params: { organizationId: string; id: string }): Promise<void>;
}

class PrismaFormSchemaRepo implements FormSchemaRepo {
  async createVersion(input: FormSchemaCreateInput): Promise<FormSchema> {
    const { organizationId, name, schemaJson } = input;

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
          isPublished: false,
        },
      });

      logger.info(
        "Created new form schema version",
        { id: created.id, version: nextVersion },
        { organizationId }
      );

      const domain = mapDbFormSchemaRowToDomain(created);
      domain.schemaJson = migrateSchemaToV15(domain.schemaJson);
      return domain;
    } catch (e: any) {
      const isFkError =
        e.code === "P2003" ||
        (typeof e.message === "string" &&
          e.message.includes("Foreign key constraint failed"));
      const isDev = process.env.NODE_ENV !== "production";

      if (isFkError && isDev) {
        logger.warn(
          "[FormSchemaRepo] FK Error in DEV. Attempting org auto-seed...",
          { organizationId }
        );

        await db.organization.upsert({
          where: { id: organizationId },
          update: {},
          create: { id: organizationId, name: "Local Dev Org", slug: "local-dev" },
        });

        const retry = await db.formSchema.create({
          data: {
            organizationId,
            name,
            version: nextVersion,
            schemaJson: cleanSchema as unknown as Prisma.InputJsonValue,
            isDeprecated: false,
            isPublished: false,
          },
        });

        return mapDbFormSchemaRowToDomain(retry);
      }

      throw e;
    }
  }

  async getLatestByName(params: {
    organizationId: string;
    name: string;
  }): Promise<FormSchema | null> {
    const row = await db.formSchema.findFirst({
      where: {
        organizationId: params.organizationId,
        name: params.name,
        isDeprecated: false,
      },
      orderBy: { version: "desc" },
    });
    return row ? mapDbFormSchemaRowToDomain(row) : null;
  }

  async getById(params: {
    organizationId: string;
    id: string;
  }): Promise<FormSchema | null> {
    const row = await db.formSchema.findFirst({
      where: params,
    });
    return row ? mapDbFormSchemaRowToDomain(row) : null;
  }

  async getPublicById(id: string): Promise<FormSchema | null> {
    const row = await db.formSchema.findUnique({ where: { id } });
    if (!row || row.isDeprecated || !row.isPublished) return null;
    return mapDbFormSchemaRowToDomain(row);
  }

  async getBySlug(slug: string): Promise<FormSchema | null> {
    const row = await db.formSchema.findFirst({
      where: { slug, isPublished: true, isDeprecated: false },
      orderBy: { version: "desc" },
    });
    return row ? mapDbFormSchemaRowToDomain(row) : null;
  }

  async listPublishedPublic(): Promise<PublicFormSummary[]> {
    return db.formSchema.findMany({
      where: {
        isPublished: true,
        isDeprecated: false,
      },
      distinct: ["name"],
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        updatedAt: true,
      },
    });
  }

  async listByOrg(orgId: string): Promise<FormSchemaWithStats[]> {
    const rows = await db.formSchema.findMany({
      where: { organizationId: orgId, isDeprecated: false },
      orderBy: { updatedAt: "desc" },
      distinct: ["name"],
      include: {
        _count: { select: { formSubmissions: true } },
      },
    });

    return rows.map((r) => ({
      ...mapDbFormSchemaRowToDomain(r),
      _count: { formSubmissions: r._count.formSubmissions },
    }));
  }

  async listVersionsByName(params: {
    organizationId: string;
    name: string;
  }): Promise<FormVersionSummary[]> {
    return db.formSchema.findMany({
      where: {
        organizationId: params.organizationId,
        name: params.name,
        isDeprecated: false,
      },
      orderBy: { version: "asc" },
      select: { id: true, version: true, createdAt: true },
    });
  }

  async softDelete(params: {
    organizationId: string;
    id: string;
  }): Promise<void> {
    const target = await db.formSchema.findFirst({
      where: params,
    });
    if (!target) return;

    await db.formSchema.updateMany({
      where: {
        organizationId: params.organizationId,
        name: target.name,
      },
      data: { isDeprecated: true, isPublished: false },
    });

    logger.info("Soft deleted form family", { name: target.name });
  }

async publishVersion(params: { organizationId: string; id: string }): Promise<void> {
  const target = await db.formSchema.findFirst({
    where: { id: params.id, organizationId: params.organizationId }
  });

  if (!target) throw new Error("Form not found");

  // Find currently published sibling (if any) to inherit slug
  const currentPublished = await db.formSchema.findFirst({
    where: {
      organizationId: params.organizationId,
      name: target.name,
      isPublished: true,
      isDeprecated: false,
      id: { not: target.id }
    },
    orderBy: { version: "desc" }
  });

  const inheritedSlug = target.slug ?? currentPublished?.slug ?? null;

  // Unpublish all siblings
  await db.formSchema.updateMany({
    where: {
      organizationId: params.organizationId,
      name: target.name
    },
    data: { isPublished: false }
  });

  // Publish target + enforce slug
  await db.formSchema.update({
    where: { id: params.id },
    data: {
      isPublished: true,
      slug: inheritedSlug
    }
  });

  logger.info("Published form version", {
    name: target.name,
    version: target.version,
    slug: inheritedSlug
  });
}

}

export const formSchemaRepo: FormSchemaRepo = new PrismaFormSchemaRepo();
