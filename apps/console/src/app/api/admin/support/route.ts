/**
 * api.admin.support
 *
 * Returns a list of all support tickets across organizations.
 *
 * Related docs:
 * - 04-data-and-api-spec.md
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/infra/db/infra.repo.dbClient";
import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";

export async function GET(req: NextRequest) {
  const user = await GetCurrentUserAsync(req);
  
  // [SECURITY] Only Super Admins can see Tickets
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tickets = await db.supportTicket.findMany({
    include: {
      organization: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Map to UI format
  const payload = tickets.map(t => ({
    id: t.id,
    subject: t.subject,
    firm: t.organization.name,
    priority: t.priority.toLowerCase(),
    status: t.status.toLowerCase(),
    time: t.createdAt.toISOString()
  }));

  return NextResponse.json(payload);
}