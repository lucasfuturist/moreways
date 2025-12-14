# File Scan

**Roots:**

- `C:\projects\moreways-ecosystem\apps\web\src\app\(intake)`


## Tree: C:\projects\moreways-ecosystem\apps\web\src\app\(intake)

```
(intake)/

├── issue/
│   ├── [slug]/
│   │   ├── page.tsx
├── start/
│   ├── [id]/
│   │   ├── page.tsx
│   ├── page.tsx

```

## Files

### `C:/projects/moreways-ecosystem/apps/web/src/app/(intake)/issue/[slug]/page.tsx`

```tsx
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
```

### `C:/projects/moreways-ecosystem/apps/web/src/app/(intake)/start/page.tsx`

```tsx
// src/app/(intake)/start/page.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatInterface from "@/components/ChatInterface";
import { UnifiedRunner } from "@/components/runner/UnifiedRunner";
import { PublicFormResponse } from "@/lib/types/argueos-types";

export default function StartClaim() {
  const [form, setForm] = useState<PublicFormResponse | null>(null);

  const handleFormRouted = (routedForm: PublicFormResponse) => {
    setForm(routedForm);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {!form && (
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-4 font-heading text-slate-900 dark:text-white">
                Free Claim Assessment
              </h1>
              <p className="text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
                Our Intake Assistant will ask you a few questions to see if your situation meets the criteria for legal action. This is confidential and free.
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!form ? (
              <motion.div
                key="router"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ChatInterface onFormRouted={handleFormRouted} />
              </motion.div>
            ) : (
              <motion.div
                key="agent"
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-[85dvh] md:h-auto"
              >
                <UnifiedRunner
                  formId={form.id}
                  organizationId={form.organizationId}
                  schema={form.schema}
                  intent={form.title}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!form && (
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground dark:text-slate-500">
                💡 <strong>Tip:</strong> Be specific about dates, dollar amounts, and what was promised vs. delivered.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
```

### `C:/projects/moreways-ecosystem/apps/web/src/app/(intake)/start/[id]/page.tsx`

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { UnifiedRunner } from "@/components/runner/UnifiedRunner";
import { Loader2, AlertCircle } from "lucide-react";

export default function DynamicIntakePage({ params }: { params: { id: string } }) {
  const [schema, setSchema] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch schema from our local proxy
    fetch(`/api/intake/form/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Form not found");
        return res.json();
      })
      .then((data) => {
        // Factory returns { id, title, schema: { ... } }
        setSchema(data.schema);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium uppercase tracking-wider">Loading Intake...</p>
      </div>
    );
  }

  if (error || !schema) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-red-400 gap-4">
        <AlertCircle className="w-10 h-10" />
        <p className="text-lg font-bold">Unable to load form</p>
        <p className="text-sm text-slate-500">ID: {params.id}</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-950">
      <UnifiedRunner 
        formId={params.id}
        organizationId="org_default_local" // Default org for public link
        schema={schema}
        intent={schema.title || "General Intake"} // Pass the Form Title as Intent to the Brain
      />
    </div>
  );
}
```

