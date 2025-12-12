"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormSchema } from "@/forms/schema/forms.schema.FormSchemaModel";
import type { FormSchemaJsonShape, FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import type { FormVersionSummary } from "@/forms/repo/forms.repo.FormSchemaRepo";
import { ReactiveCanvas } from "./canvas/ReactiveCanvas";
import { Button } from "@/components/ui/Button";
import { VersionHistorySlider } from "./editor/VersionHistorySlider";
import { useDebounce } from "@/infra/ui/hooks/useDebounce";
import { ShieldAlert, ArrowLeft, Settings, Save } from "lucide-react"; 

// Internal state representation
interface FieldEntry {
  key: string;
  def: FormFieldDefinition;
  isRequired: boolean;
}

interface FormEditorProps {
  formId: string;
}

export default function FormEditor({ formId }: FormEditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  // [INTEGRATION] Context Awareness
  const context = searchParams.get("context");
  const isAdmin = context === "admin";
  
  // [UX] Default to "saved" so it's visible immediately
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "error">("saved");
  
  const [formMeta, setFormMeta] = useState<FormSchema | null>(null);
  const [fields, setFields] = useState<FieldEntry[]>([]);
  
  // [AUTOSAVE] Track changes to trigger save
  const debouncedFields = useDebounce(fields, 1000); 
  
  const lastSavedState = useRef<string>(""); 

  // History State
  const [versions, setVersions] = useState<FormVersionSummary[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState(formId);

  // 1. Fetch Form + Versions
  useEffect(() => {
    loadFormAndVersions(formId);
  }, [formId]);

  async function loadFormAndVersions(id: string) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/forms/${id}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as FormSchema;
        setFormMeta(data);
        setCurrentVersionId(data.id);

        const schema = data.schemaJson;
        const requiredSet = new Set(schema.required || []);
        const entries: FieldEntry[] = (schema.order || Object.keys(schema.properties)).map((key) => {
            const def = schema.properties[key];
            if (!def) return null;
            return {
                key,
                def,
                isRequired: requiredSet.has(key),
            };
        }).filter((x): x is FieldEntry => x !== null);
        
        setFields(entries);
        
        lastSavedState.current = JSON.stringify(entries);

        const vRes = await fetch(`/api/forms/${id}/versions`);
        if (vRes.ok) {
            const vData = await vRes.json();
            setVersions(vData);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
  }

  // [AUTOSAVE] Effect
  useEffect(() => {
    if (isLoading) return;
    handleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFields]);

  const handleSave = async () => {
    const currentJson = JSON.stringify(fields);
    if (currentJson === lastSavedState.current) {
        return; 
    }

    setSaveStatus("saving");
    try {
      const properties: Record<string, FormFieldDefinition> = {};
      const required: string[] = [];
      const order: string[] = [];

      fields.forEach((f) => {
        properties[f.key] = f.def;
        order.push(f.key);
        if (f.isRequired) required.push(f.key);
      });

      const newSchema: FormSchemaJsonShape = { type: "object", properties, required, order };
      
      await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schema: newSchema }),
      });
      
      const vRes = await fetch(`/api/forms/${formId}/versions`);
      if (vRes.ok) {
          const vData = await vRes.json();
          setVersions(vData);
          if (formMeta) setFormMeta({ ...formMeta, version: (formMeta.version || 0) + 1 });
      }
      
      lastSavedState.current = currentJson;
      setSaveStatus("saved");
      
    } catch (error) {
      console.error("Autosave failed", error);
      setSaveStatus("error");
    }
  };

  const handleVersionChange = async (targetId: string) => {
      if (targetId === currentVersionId) return;
      await loadFormAndVersions(targetId);
  };

  const addField = () => {
    const newKey = `field_${Date.now()}`;
    const newEntry: FieldEntry = {
      key: newKey,
      isRequired: false,
      def: { id: newKey, key: newKey, kind: "text", title: "New Field" },
    };
    setFields([...fields, newEntry]);
  };

  // [INTEGRATION] Dynamic Close
  const handleClose = () => {
      if (isAdmin) router.push("/admin");
      else router.push("/forms");
  };

  if (isLoading) return <div className="p-8 text-slate-400 bg-slate-950 h-screen flex items-center justify-center font-mono">Loading editor context...</div>;

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200">
      
      {/* --- HEADER (Matched to Admin Dashboard) --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6 px-8 pt-8 bg-slate-950/50 backdrop-blur-md z-10">
        
        {/* Left: Branding & Breadcrumb */}
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <button 
                    onClick={handleClose}
                    className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    title={isAdmin ? "Back to Ops Center" : "Back to Dashboard"}
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                
                {/* [INTEGRATION] Dynamic Badge */}
                {isAdmin ? (
                    <div className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Ops Center
                    </div>
                ) : (
                    <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        Form Builder
                    </div>
                )}
                
                <span className="text-slate-500 text-xs font-mono">
                    {isAdmin ? "/ Form Factory / Builder" : "/ My Forms / Editor"}
                </span>
            </div>
            
            <div className="flex items-baseline gap-4 ml-1">
                <h1 className="text-2xl font-bold tracking-tight text-white">{formMeta?.name}</h1>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono font-bold uppercase">
                        v{formMeta?.version}
                    </span>
                    {versions.length > 0 && formMeta?.version !== versions[versions.length - 1].version && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 rounded border border-amber-500/30">
                            Viewing History
                        </span>
                    )}
                </div>
            </div>
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-6">
           
           {/* Autosave Status */}
           <div className="text-[10px] font-bold uppercase tracking-wider transition-all duration-300 min-w-[120px] text-right flex justify-end">
              {saveStatus === "saving" && (
                  <span className="text-amber-400 animate-pulse flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Saving...
                  </span>
              )}
              {saveStatus === "saved" && (
                  <span className="text-emerald-400 flex items-center gap-2 opacity-60">
                    <Save className="w-3 h-3" /> Saved
                  </span>
              )}
              {saveStatus === "error" && (
                  <span className="text-red-400 flex items-center gap-2">
                    Save Failed
                  </span>
              )}
           </div>

           <div className="h-6 w-px bg-white/10" />

           <button className="p-2.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5">
                <Settings className="w-5 h-5" />
           </button>
           
           <Button variant="secondary" onClick={handleClose}>
                {isAdmin ? "Close Template" : "Done"}
           </Button>
        </div>
      </div>

      {/* --- CANVAS --- */}
      <div className="flex-1 relative overflow-hidden bg-slate-900/30">
        <ReactiveCanvas fields={fields} setFields={setFields} />
      </div>

      {/* --- TIME TRAVEL SLIDER --- */}
      <div className="flex-none z-20 bg-slate-950 border-t border-white/5 pb-2">
         <VersionHistorySlider 
            versions={versions} 
            currentVersionId={currentVersionId} 
            onSelectVersion={handleVersionChange}
         />
      </div>

      {/* --- FLOATING FAB --- */}
      <div className="fixed bottom-24 right-8 z-30">
        <Button size="lg" onClick={addField} className="rounded-full shadow-2xl shadow-rose-500/20 bg-rose-600 hover:bg-rose-500 text-white border-none">
           + Add Field
        </Button>
      </div>
    </div>
  );
}