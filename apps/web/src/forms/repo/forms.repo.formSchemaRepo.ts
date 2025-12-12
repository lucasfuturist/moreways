/**
 * forms.repo.formSchemaRepo
 *
 * Persistence layer for FormSchemas.
 * Related docs: 03-security-and-data-handling.md (Section 3.3)
 */
import { FormEntity, FormSchemaData } from "../schema/forms.schema.formEntity";

// Mock DB interface for scaffolding
interface DbClient { insert(table: string, data: any): Promise<any>; }

export class FormSchemaRepo {
  constructor(private readonly db: DbClient) {}

  async createVersionAsync(organizationId: string, schemaData: FormSchemaData): Promise<FormEntity> {
    // [SECURITY] Ensure data belongs to org
    const record = {
      id: crypto.randomUUID(),
      organization_id: organizationId,
      version: 1,
      schema: schemaData,
      created_at: new Date(),
    };

    // In real app: await this.db.insert("form_schemas", record);
    console.log("[MOCK DB] Inserted form", record.id);

    return {
      id: record.id,
      organizationId: record.organization_id,
      version: record.version,
      schema: record.schema,
      createdAt: record.created_at,
    };
  }
}
