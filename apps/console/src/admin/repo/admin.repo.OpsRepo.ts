import { db } from "@/infra/db/infra.repo.dbClient";

/**
 * admin.repo.OpsRepo.ts
 * Repository for Platform Operations (Super Admin View).
 * 
 * Guarantees:
 * - Accesses cross-organization data (Super Admin only)
 * - Read-only for dashboard metrics
 */

export const OpsRepo = {
  // [MULTI-TENANT] Fetches all orgs for the platform admin
  async getAllCustomersAsync() {
    const orgs = await db.organization.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orgs.map(org => ({
      id: org.id,
      name: org.name,
      // @ts-expect-error - Requires `prisma generate` to recognize new schema fields
      tier: org.subscriptionTier ?? "STARTER",
      seats: org._count.users,
      // @ts-expect-error - Requires `prisma generate` to recognize new schema fields
      status: org.subscriptionStatus ?? "ACTIVE",
      // @ts-expect-error - Requires `prisma generate` to recognize new schema fields
      mrr: org.mrr ? `$${org.mrr.toString()}` : "$0",
    }));
  },

  async getRecentTicketsAsync() {
    // @ts-expect-error - Requires `prisma generate` to recognize 'supportTicket' model
    const tickets = await db.supportTicket.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        organization: {
          select: { name: true }
        }
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return tickets.map((t: any) => ({
      id: t.id,
      subject: t.subject,
      firm: t.organization.name,
      priority: t.priority,
      status: t.status,
      time: t.createdAt.toLocaleString(),
    }));
  },

  async getAllFormTemplatesAsync() {
    return await db.formSchema.findMany({
      where: {
        isDeprecated: false,
        // In a real app, we might filter by 'isTemplate: true'
      },
      orderBy: { updatedAt: 'desc' },
      // Distinct on name to get latest versions only
      distinct: ['name'], 
    });
  }
};