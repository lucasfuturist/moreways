/**
 * api.admin.customers
 *
 * Returns a list of all tenant organizations and their stats.
 *
 * Related docs:
 * - 04-data-and-api-spec.md
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/infra/db/infra.repo.dbClient";
import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";

export async function GET(req: NextRequest) {
  const user = await GetCurrentUserAsync(req);
  
  // [SECURITY] Only Super Admins can see the Customer List
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all organizations with user counts
  const orgs = await db.organization.findMany({
    include: {
      _count: {
        select: { users: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Transform for UI
  const payload = orgs.map(org => ({
    id: org.id,
    name: org.name,
    plan: org.plan, 
    seats: org._count.users,
    seatLimit: org.seatLimit,
    status: org.status,
    mrr: Number(org.mrr), // Decimal to Number
    createdAt: org.createdAt
  }));

  return NextResponse.json(payload);
}