import { UnifiedRunner } from "@/components/ui/runner/UnifiedRunner"; 

interface PageProps {
  params: { formId: string };
}

// "Dumb" wrapper component
// Its only job is to provide the ID and layout context
export default function PublicFormPage({ params }: PageProps) {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">
      <main className="flex-1 w-full h-full relative z-10">
        <UnifiedRunner formId={params.formId} />
      </main>
    </div>
  );
}