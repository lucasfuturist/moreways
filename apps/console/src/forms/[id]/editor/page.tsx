import FormEditor from "@/forms/ui/forms.ui.FormEditor";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditorPage({ params }: PageProps) {
  return <FormEditor formId={params.id} />;
}