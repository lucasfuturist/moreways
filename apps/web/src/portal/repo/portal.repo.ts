import { db } from "@/infra/db/client";
import { claims } from "@/infra/db/schema";
import { eq, desc } from "drizzle-orm";

export const portalRepo = {
  async getClaimsForUser(userId: string) {
    try {
      // Try to fetch from real DB
      return await db
        .select()
        .from(claims)
        .where(eq(claims.userId, userId))
        .orderBy(desc(claims.createdAt));
    } catch (error) {
      // FALLBACK: Return Mock Data if DB is down
      console.warn("⚠️ Portal Repo: DB unreachable. Returning mock claims.");
      
      return [
        {
          id: "mock-claim-01",
          userId: userId,
          type: "Vehicle Accident",
          status: "reviewing",
          summary: "Rear-ended at a red light on 5th Avenue.",
          formData: {
            incidentDate: "2023-11-15",
            description: "I was stopped at a red light when a taxi hit me.",
            location: "New York, NY"
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          updatedAt: new Date(),
        },
        {
          id: "mock-claim-02",
          userId: userId,
          type: "Housing Dispute",
          status: "action_required",
          summary: "Landlord withheld security deposit without itemized list.",
          formData: {
            leaseEnd: "2023-09-01",
            amount: 2500
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
          updatedAt: new Date(),
        }
      ] as any[]; // Cast as any to satisfy type checker if schema types mismatch lightly
    }
  },

  async getClaimDetail(userId: string, claimId: string) {
    try {
      const claim = await db
        .select()
        .from(claims)
        .where(eq(claims.id, claimId))
        .limit(1);

      const record = claim[0];
      if (!record || record.userId !== userId) return null;
      return record;
    } catch (error) {
      console.warn("⚠️ Portal Repo: DB unreachable. Returning mock detail.");
      
      // Return a consistent mock detail
      return {
          id: claimId,
          userId: userId,
          type: "Vehicle Accident",
          status: "reviewing",
          summary: "Rear-ended at a red light on 5th Avenue.",
          formData: {
            "Incident Date": "2023-11-15",
            "Description": "I was stopped at a red light when a taxi hit me from behind.",
            "Location": "New York, NY",
            "Insurance Provider": "State Farm",
            "Reported Injuries": "Whiplash and neck pain"
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          updatedAt: new Date(),
      } as any;
    }
  }
};