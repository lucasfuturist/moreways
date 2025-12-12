import { NextResponse } from "next/server";
import { db } from "@/infra/db/infra.repo.dbClient";

// [CRITICAL FIX] Prevent Next.js from running this during 'npm run build'
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // [CRITICAL FIX] Match the ID from src/auth/svc/auth.svc.GetCurrentUserAsync.ts
    const TARGET_ORG_ID = "org_default_local"; 

    // 1. Upsert the Organization so it definitely exists
    const org = await db.organization.upsert({
      where: { id: TARGET_ORG_ID },
      update: {},
      create: { 
        id: TARGET_ORG_ID, 
        name: "Local Dev Firm",
        slug: "local-dev"
      }
    });

    // 2. Upsert the Form linked to THIS organization
    const form = await db.formSchema.upsert({
      where: { slug: "auto-dealer-dispute" },
      update: { 
        organizationId: org.id, // Move form to the correct Org if it exists elsewhere
        isPublished: true 
      },
      create: {
        organizationId: org.id,
        name: "Auto Dealer Dispute",
        slug: "auto-dealer-dispute", 
        version: 1,
        isPublished: true,
        schemaJson: {
          type: "object",
          properties: {
            intro: { 
              id: "f1", key: "intro", kind: "header", title: "Tell us what happened" 
            },
            description: { 
              id: "f2", key: "description", kind: "textarea", title: "Description of Issue" 
            },
            purchase_date: { 
              id: "f3", key: "purchase_date", kind: "date", title: "Date of Purchase" 
            }
          },
          order: ["intro", "description", "purchase_date"]
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      msg: "Form synced to Auth User Org",
      slug: form.slug, 
      orgId: org.id 
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}