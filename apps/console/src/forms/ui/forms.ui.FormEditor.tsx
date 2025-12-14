"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import type { FormSchema } from "@/forms/schema/forms.schema.FormSchemaModel";
import type { FormSchemaJsonShape, FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import type { FormVersionSummary } from "@/forms/repo/forms.repo.FormSchemaRepo";
import { ReactiveCanvas } from "./canvas/ReactiveCanvas";
import { Button } from "@/components/ui/Button";
import { VersionHistorySlider } from "./editor/VersionHistorySlider";
import { useDebounce } from "@/infra/ui/hooks/useDebounce";
import { ShieldAlert, ArrowLeft, Settings, Save, Globe, Loader2, Rocket, X, Check } from "lucide-react"; 

// Internal state representation
interface FieldEntry {
  key: string;
  def: FormFieldDefinition;
  isRequired: boolean;
}

interface FormEditorProps {
  formId: string;
}

interface ExtendedFormSchema extends FormSchema {
    isPublished?: boolean;
}

export default function FormEditor({ formId }: FormEditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  const context = searchParams.get("context");
  const isAdmin = context === "admin";
  
  // Save Status
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showPublishPrompt, setShowPublishPrompt] = useState(false);
  
  const [formMeta, setFormMeta] = useState<ExtendedFormSchema | null>(null);
  const [fields, setFields] = useState<FieldEntry[]>([]);
  
  // Autosave tracking
  const debouncedFields = useDebounce(fields, 1000); 
  const lastSavedState = useRef<string>(""); 

  const [versions, setVersions] = useState<FormVersionSummary[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState(formId);

  const [isPublishing, setIsPublishing] = useState(false);

  // 1. Fetch Form + Versions
  useEffect(() => {
    loadFormAndVersions(formId);
  }, [formId]);

  async function loadFormAndVersions(id: string) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/forms/${id}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as ExtendedFormSchema;
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
    // Only autosave if we aren't manually saving/publishing to avoid conflicts
    if (!showPublishPrompt && saveStatus !== 'saving') {
        performSave(true); // silent=true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFields]);

  // Core Save Logic
  const performSave = async (silent: boolean = false) => {
    const currentJson = JSON.stringify(fields);
    if (currentJson === lastSavedState.current) return; 

    if (!silent) setSaveStatus("saving");
    
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
      
      const res = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schema: newSchema }),
      });

      if(res.ok) {
          const newForm = await res.json();
          // Update version number in UI without full reload
          setFormMeta(prev => prev ? { ...prev, version: newForm.version } : null);
          
          const vRes = await fetch(`/api/forms/${formId}/versions`);
          if (vRes.ok) {
              const vData = await vRes.json();
              setVersions(vData);
          }
      }
      
      lastSavedState.current = currentJson;
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
      
      return true; // Success
    } catch (error) {
      console.error("Save failed", error);
      setSaveStatus("error");
      return false;
    }
  };

  // Handler for the Manual Save Button
  const handleManualSave = async () => {
      const success = await performSave(false);
      if (success) {
          // Trigger the "Do you want to publish?" prompt
          setShowPublishPrompt(true);
      }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
        // Force save first to ensure we publish latest state
        await performSave(true);
        
        const res = await fetch(`/api/forms/${formMeta?.id}/publish`, { method: "POST" });
        if (!res.ok) throw new Error("Publish failed");
        
        // Optimistic update
        setFormMeta(prev => prev ? { ...prev, isPublished: true } : null);
        setShowPublishPrompt(false); // Close prompt if open
        alert("Form Published Successfully!");
    } catch (e) {
        alert("Failed to publish.");
    } finally {
        setIsPublishing(false);
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

  const handleClose = () => {
      if (isAdmin) router.push("/admin");
      else router.push("/forms");
  };

  if (isLoading) return <div className="p-8 text-slate-400 bg-slate-950 h-screen flex items-center justify-center font-mono">Loading editor context...</div>;

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 relative">
      
      {/* --- PUBLISH PROMPT OVERLAY --- */}
      {showPublishPrompt && (
        <div className="absolute top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl shadow-2xl p-4 w-80 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
                
                <div className="flex justify-between items-start z-10">
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500" /> Version Saved
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">This version is safe. Do you want to publish it live to clients now?</p>
                    </div>
                    <button onClick={() => setShowPublishPrompt(false)} className="text-slate-500 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex gap-2 mt-2 z-10">
                    <button 
                        onClick={() => setShowPublishPrompt(false)}
                        className="flex-1 py-2 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        Keep Draft
                    </button>
                    <button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                        {isPublishing ? <Loader2 className="w-3 h-3 animate-spin"/> : <Rocket className="w-3 h-3" />}
                        Publish Live
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6 px-8 pt-8 bg-slate-950/50 backdrop-blur-md z-10">
        
        {/* Left: Branding */}
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <button onClick={handleClose} className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Ops Center
                </div>
                <span className="text-slate-500 text-xs font-mono">/ Form Factory / Builder</span>
            </div>
            
            <div className="flex items-baseline gap-4 ml-1">
                <h1 className="text-2xl font-bold tracking-tight text-white">{formMeta?.name}</h1>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono font-bold uppercase">
                        v{formMeta?.version}
                    </span>
                    {formMeta?.isPublished && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Live
                        </span>
                    )}
                </div>
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
           
           {/* Autosave Status */}
           <div className="text-[10px] font-bold uppercase tracking-wider transition-all duration-300 min-w-[80px] text-right flex justify-end mr-2">
              {saveStatus === "saving" && <span className="text-amber-400 animate-pulse">Saving...</span>}
              {saveStatus === "saved" && <span className="text-emerald-400 opacity-60">All Saved</span>}
              {saveStatus === "error" && <span className="text-red-400">Error</span>}
           </div>

           {/* Manual Save Button */}
           <button 
                onClick={handleManualSave}
                className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all active:scale-95"
                title="Save Version"
           >
               <Save className="w-4 h-4" />
           </button>

           {/* Publish Button (Prominent) */}
           <Button 
                variant="default" 
                onClick={handlePublish}
                className={clsx(
                    "h-9 text-xs min-w-[100px] border transition-all shadow-lg", 
                    formMeta?.isPublished 
                        ? "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700" 
                        : "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 shadow-emerald-500/20"
                )}
                disabled={isPublishing}
           >
                {isPublishing ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Publishing...</span>
                ) : (
                    <span className="flex items-center gap-2"><Rocket className="w-3 h-3" /> {formMeta?.isPublished ? "Published" : "Publish"}</span>
                )}
           </Button>

           <div className="h-6 w-px bg-white/10 mx-2" />

           <button className="p-2.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5">
                <Settings className="w-5 h-5" />
           </button>
           
           <Button variant="secondary" onClick={handleClose}>
                Done
           </Button>
        </div>
      </div>

      {/* --- CANVAS --- */}
      <div className="flex-1 relative overflow-hidden bg-slate-900/30">
        <ReactiveCanvas fields={fields} setFields={setFields} />
      </div>

      {/* --- TIME TRAVEL --- */}
      <div className="flex-none z-20 bg-slate-950 border-t border-white/5 pb-2">
         <VersionHistorySlider 
            versions={versions} 
            currentVersionId={currentVersionId} 
            onSelectVersion={handleVersionChange}
         />
      </div>

      {/* --- FAB --- */}
      <div className="fixed bottom-24 right-8 z-30">
        <Button size="lg" onClick={addField} className="rounded-full shadow-2xl shadow-rose-500/20 bg-rose-600 hover:bg-rose-500 text-white border-none">
           + Add Field
        </Button>
      </div>
    </div>
  );
}