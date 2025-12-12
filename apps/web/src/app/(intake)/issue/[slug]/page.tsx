import { notFound } from "next/navigation";
import { argueosClient } from "@/lib/argueos-client";
import { UnifiedRunner } from "@/components/runner/UnifiedRunner"; 
import { consumerIssues } from "@/content/data/consumerIssues"; 
import { IssueTracker } from "@/components/IssueTracker"; // [NEW] Import

// Force dynamic rendering 
export const dynamic = "force-dynamic";

export default async function IssuePage({ params }: { params: { slug: string } }) {
  // 1. Try to fetch from Real Backend
  let form = await argueosClient.getFormBySlug(params.slug);
  const staticMeta = consumerIssues.find((i) => i.id === params.slug);

  // 2. FALLBACK LOGIC (The Safety Net)
  if (!form) {
    // If we have static metadata for this issue, generate a temporary form schema
    if (staticMeta) {
        console.warn(`[IssuePage] Backend unreachable or 404 for ${params.slug}. Generating fallback schema.`);
        
        form = {
            id: "fallback-form-id",
            organizationId: "fallback-org",
            title: staticMeta.title,
            schema: {
                type: "object",
                properties: {
                    "q1_description": {
                        id: "1",
                        key: "q1_description",
                        title: "What happened?",
                        kind: "textarea",
                        description: "Please describe the issue in detail so we can evaluate your claim.",
                        isRequired: true
                    },
                    "q2_date": {
                        id: "2",
                        key: "q2_date",
                        title: "When did this occur?",
                        kind: "date",
                        isRequired: true
                    }
                },
                order: ["q1_description", "q2_date"]
            }
        };
    } else {
        // Truly 404
        return notFound();
    }
  }

  // Determine title for tracking
  const pageTitle = staticMeta?.title || form.title || "Unknown Issue";

  return (
    <div className="min-h-screen flex flex-col relative z-10">
       <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />

       {/* [TRACKING] Inject the tracker to fire 'view_content' on mount */}
       <IssueTracker slug={params.slug} title={pageTitle} />

       <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
          
          <UnifiedRunner 
             formId={form.id}
             organizationId={form.organizationId}
             schema={form.schema}
             initialData={{
                meta_issue_type: pageTitle
             }}
          />

       </main>
    </div>
  );
}