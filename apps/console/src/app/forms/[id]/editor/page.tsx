import FormFromPromptPage from "@/intake/ui/intake.ui.FormFromPromptPage";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditorPage({ params }: PageProps) {
  return <FormFromPromptPage initialFormId={params.id} />;
}