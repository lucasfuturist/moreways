import { NextRequest, NextResponse } from "next/server";
import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";

interface Context {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Context) {
  const user = await GetCurrentUserAsync(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await formSchemaRepo.publishVersion({
        organizationId: user.organizationId,
        id: params.id
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Publish Error:", err);
    return NextResponse.json({ error: "Failed to publish" }, { status: 500 });
  }
}