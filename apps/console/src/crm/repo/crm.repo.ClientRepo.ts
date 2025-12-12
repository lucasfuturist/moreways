import { db } from "@/infra/db/infra.repo.dbClient";
import type { Client } from "@/crm/schema/crm.schema.ClientModel";

export const ClientRepo = {
  /**
   * Create a new Client. 
   * Maps Domain Model (First/Last) -> DB Model (FullName).
   */
  async create(data: Omit<Client, "id" | "createdAt" | "updatedAt">) {
    return await db.client.create({
      data: {
        organizationId: data.organizationId,
        email: data.email,
        phone: data.phone,
        // [FIX] DB expects 'fullName', Domain has First/Last
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        
        // Optional: Link to portal user if provided
        userId: data.externalPortalUserId,
      }
    });
  },

  async findByEmail(organizationId: string, email: string) {
    const record = await db.client.findFirst({
      where: { organizationId, email }
    });

    if (!record) return null;

    // [FIX] Split fullName back to First/Last for domain model
    const [firstName, ...rest] = record.fullName.split(" ");
    const lastName = rest.join(" ");

    return {
        id: record.id,
        organizationId: record.organizationId,
        firstName,
        lastName: lastName || "",
        email: record.email || "",
        phone: record.phone || undefined,
        externalPortalUserId: record.userId || undefined,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        status: 'lead' as const // DB doesn't track client status, defaulting
    };
  }
};