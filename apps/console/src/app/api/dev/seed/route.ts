import { NextResponse } from "next/server";
import { db } from "@/infra/db/infra.repo.dbClient";

// [CRITICAL FIX] Prevent Next.js from running this during 'npm run build'
export const dynamic = 'force-dynamic';

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  try {
    // 1. Ensure the Dev Organization exists (matches auth.svc.GetCurrentUserAsync.ts)
    const ORG_ID = "org_default_local";
    
    await db.organization.upsert({
      where: { id: ORG_ID },
      update: {},
      create: {
        id: ORG_ID,
        name: "Acme Law Partners (Dev)",
        slug: "acme-law-dev"
      }
    });

    // 2. Create a Form Schema
    const schema = await db.formSchema.create({
      data: {
        organizationId: ORG_ID,
        name: "Auto Accident Intake",
        version: 1,
        slug: "auto-accident-v1",
        isPublished: true,
        schemaJson: {
          type: "object",
          properties: {
            fullName: { title: "Full Name", kind: "text" },
            email: { title: "Email Address", kind: "email" },
            incidentDate: { title: "Date of Incident", kind: "date" },
            description: { title: "What happened?", kind: "textarea" }
          },
          order: ["fullName", "email", "incidentDate", "description"]
        }
      }
    });

    // 3. Create a Client
    const client = await db.client.create({
      data: {
        organizationId: ORG_ID,
        fullName: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "555-0123"
      }
    });

    // 4. Create a Submission linked to them
    await db.formSubmission.create({
      data: {
        organizationId: ORG_ID,
        formSchemaId: schema.id,
        clientId: client.id,
        submissionData: {
          fullName: "Jane Doe",
          email: "jane.doe@example.com",
          incidentDate: "2023-10-25",
          description: "I was rear-ended at a stop light on Main St."
        },
        flags: ["potential_high_value"]
      }
    });

    // 5. Create a Matter (Case)
    await db.matter.create({
      data: {
        organizationId: ORG_ID,
        clientId: client.id,
        name: "Doe v. Driver - Rear End Collision",
        status: "OPEN"
      }
    });

    return NextResponse.json({ success: true, message: "Seed data created for org_default_local" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seed failed", details: String(error) }, { status: 500 });
  }
}