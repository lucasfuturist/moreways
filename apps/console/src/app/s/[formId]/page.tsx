import { db } from "@/infra/db/infra.repo.dbClient";
import { UnifiedRunner } from "@/forms/ui/runner/UnifiedRunner"; // [NEW]
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";
import { notFound } from "next/navigation";

interface PageProps {
  params: { formId: string };
}

export default async function PublicFormPage({ params }: PageProps) {
  const form = await db.formSchema.findUnique({
    where: { id: params.formId }
  });

  if (!form) return notFound();

  const schema = normalizeFormSchemaJsonShape(form.schemaJson);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col">
      <main className="flex-1 relative z-10 w-full h-full">
        {/* Render the Unified Runner which handles Chat/Form switching internally */}
        <UnifiedRunner 
            formId={form.id} 
            formName={form.name} 
            schema={schema} 
        />
      </main>
    </div>
  );
}