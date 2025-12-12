import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

export async function GET(req: NextRequest, context: RouteContext) {
  // [SECURITY] Auth Check
  const user = await GetCurrentUserAsync(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Get the current form to determine the 'name' grouping
  const currentForm = await formSchemaRepo.getById({
    organizationId: user.organizationId,
    id: context.params.id,
  });

  if (!currentForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  // 2. Fetch all versions for this form name
  const versions = await formSchemaRepo.listVersionsByName({
    organizationId: user.organizationId,
    name: currentForm.name,
  });

  return NextResponse.json(versions);
}