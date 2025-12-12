/**
 * Module: FormSchemaModel
 *
 * - Mirrors the `form_schemas` table as defined in 04-data-and-api-spec.md.
 * - Used by FormSchemaRepo and any services that work with form definitions.
 * - JSON column (`schemaJson`) is strongly typed as FormSchemaJsonShape.
 *
 * Critical guarantees:
 * - [MULTI-TENANT] All access must be scoped by organizationId.
 * - [SECURITY] No PII is stored here beyond what belongs in schema metadata.
 */

import type { FormSchema as PrismaFormSchema } from "@prisma/client";
import type { FormSchemaJsonShape } from "./forms.schema.FormSchemaJsonShape";

/**
 * Domain-level representation of a form schema.
 *
 * This is what services and UI-facing mappers should use.
 */
export interface FormSchema {
  id: string;
  organizationId: string;
  name: string;
  version: number;

  /**
   * The normalized, JSON-Schema-like definition for this form.
   * See FormSchemaJsonShape for details.
   */
  schemaJson: FormSchemaJsonShape;

  /**
   * When true, this version should not be used for new intakes,
   * but may still be referenced historically by submissions.
   */
  isDeprecated: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input shape when creating a new versioned form schema.
 *
 * Note:
 * - `version` is assigned by the repo (FormSchemaRepo.createVersion).
 * - `id` is assigned by the DB / Prisma.
 */
export interface FormSchemaCreateInput {
  organizationId: string;
  name: string;
  schemaJson: FormSchemaJsonShape;
}

/**
 * Thin alias for the raw Prisma row type.
 *
 * This keeps infra details (Prisma) separate from domain types while still
 * allowing repos to work with the generated client.
 */
export type DbFormSchemaRow = PrismaFormSchema;

/**
 * Map a raw Prisma row into the domain-level FormSchema type.
 * This keeps casting of JSON confined to one place.
 */
export function mapDbFormSchemaRowToDomain(row: DbFormSchemaRow): FormSchema {
  return {
    id: row.id,
    organizationId: row.organizationId,
    name: row.name,
    version: row.version,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    schemaJson: row.schemaJson as unknown as FormSchemaJsonShape,
    isDeprecated: row.isDeprecated,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
