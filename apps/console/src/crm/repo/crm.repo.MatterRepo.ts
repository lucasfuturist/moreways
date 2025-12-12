import { db } from "@/infra/db/infra.repo.dbClient";
import { MatterStatus } from "@prisma/client"; 

export const MatterRepo = {
  /**
   * Find matters for an org, optionally filtered by client.
   */
  async findMany(organizationId: string, clientId?: string) {
    const where: any = { organizationId };
    if (clientId) where.clientId = clientId;

    return await db.matter.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        client: true
      }
    });
  },

  /**
   * Create a new Matter from a Lead/Submission.
   */
  async create(data: { 
    organizationId: string; 
    clientId: string; 
    name: string; 
    status?: MatterStatus 
  }) {
    return await db.matter.create({
      data: {
        organizationId: data.organizationId,
        clientId: data.clientId,
        name: data.name,
        status: data.status || 'LEAD'
      }
    });
  },

  /**
   * Update matter status.
   */
  async updateStatus(organizationId: string, matterId: string, status: MatterStatus) {
    return await db.matter.update({
      where: { id: matterId, organizationId }, // [SECURITY]
      data: { status }
    });
  }
};