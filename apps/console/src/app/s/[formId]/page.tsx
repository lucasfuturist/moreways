import React from "react";
import { notFound } from "next/navigation";
import { UnifiedRunner } from "@/forms/ui/runner/UnifiedRunner";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";

interface PageProps {
  params: { formId: string };
}

// [SERVER COMPONENT]
export default async function PublicFormPage({ params }: PageProps) {
  // 1. Fetch form
  const form = await formSchemaRepo.getPublicById(params.formId);

  // 2. Handle 404
  if (!form) {
    return notFound();
  }

  // 3. Normalize schema
  const safeSchema = normalizeFormSchemaJsonShape(form.schemaJson);

  return (
    // [FIX] Force full viewport height and width with 'fixed inset-0'
    // This creates a stable stacking context for the runner.
    <div className="fixed inset-0 w-screen h-screen bg-slate-950 flex flex-col overflow-hidden">
      <main className="flex-1 w-full h-full relative z-10">
        <UnifiedRunner 
            formId={form.id} 
            formName={form.name} 
            schema={safeSchema} 
        />
      </main>
    </div>
  );
}