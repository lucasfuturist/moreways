"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, useDragControls, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import type { FormFieldDefinition, FieldOption, FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { addOptionToField, updateOptionInField, removeOptionFromField } from "./field-actions";
import { DataSettings } from "@/forms/ui/inspector/forms.ui.inspector.DataSettings";
import { LogicEditor } from "@/forms/ui/inspector/forms.ui.inspector.LogicEditor";

interface FloatingEditorProps {
  field: { def: FormFieldDefinition; isRequired: boolean };
  allFields?: any[];
  onChange: (updates: any) => void;
  onDelete: () => void;
  onClose: () => void;
  onAiRequest: (prompt: string) => Promise<void>;
  containerRef: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
}

function OptionsEditor({ fieldDef, onChange }: { fieldDef: FormFieldDefinition; onChange: (newDef: FormFieldDefinition) => void; }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const selectionTypes = ["select", "multiselect", "radio", "checkbox_group"];
  
  if (!selectionTypes.includes(fieldDef.kind)) return null;

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    try {
        const res = await fetch("/api/ai/generate-options", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: fieldDef.title })
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.options && Array.isArray(data.options)) {
            const newOptions = data.options.map((o: any) => ({ ...o, id: crypto.randomUUID() }));
            onChange({ ...fieldDef, options: newOptions });
        }
    } catch (err) {
        alert("Could not auto-generate options.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="mt-4 border-t border-slate-200 dark:border-white/10 pt-4">
      <div className="flex justify-between items-center mb-3">
        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Options List</label>
        <div className="flex gap-2">
            <button 
                onClick={handleAutoGenerate} 
                disabled={isGenerating}
                className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-2 py-1 rounded transition-colors font-medium disabled:opacity-50 flex items-center gap-1"
            >
                {isGenerating ? "..." : "✨ Auto-Fill"}
            </button>
            <button onClick={() => onChange(addOptionToField(fieldDef))} className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 px-2 py-1 rounded transition-colors font-medium">+ Add</button>
        </div>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
        {(fieldDef.options || []).map((opt: FieldOption) => (
            <div key={opt.id} className="flex items-center gap-2 group animate-fade-in">
                <div className="text-slate-400 cursor-grab active:cursor-grabbing p-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="9" cy="19" r="2" /><circle cx="15" cy="5" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="15" cy="19" r="2" /></svg></div>
                <input type="text" value={opt.label} onChange={(e) => onChange(updateOptionInField(fieldDef, opt.id, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s/g, '_') }))} className="flex-1 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded h-8 text-xs px-2 text-slate-900 dark:text-slate-100 focus:ring-0 transition-colors" placeholder="Option Label" />
                <button onClick={() => onChange(removeOptionFromField(fieldDef, opt.id))} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1" title="Remove Option"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>
        ))}
        {(!fieldDef.options || fieldDef.options.length === 0) && (
            <div className="text-center py-4 border border-dashed border-slate-200 dark:border-white/10 rounded-lg">
                <p className="text-[10px] text-slate-400">No options yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}

type Tab = "settings" | "logic" | "data";

export function FloatingFieldEditor({ field, allFields = [], onChange, onDelete, onClose, onAiRequest, containerRef, style }: FloatingEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("settings");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const dragControls = useDragControls();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const fullSchemaContext = useMemo((): FormSchemaJsonShape => {
    return {
      type: "object",
      properties: allFields.reduce((acc: any, f: any) => {
        acc[f.key] = f.def;
        return acc;
      }, {}),
      order: allFields.map((f: any) => f.key),
      required: allFields.filter((f: any) => f.isRequired).map((f: any) => f.key)
    };
  }, [allFields]);

  if (!field) return null;

  const handleAiSubmit = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try { await onAiRequest(aiPrompt); setAiPrompt(""); setIsAiOpen(false); } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <AnimatePresence>
        <motion.div
        drag dragListener={false} dragControls={dragControls} dragMomentum={false} dragConstraints={containerRef}
        initial={{ opacity: 0, scale: 0.95, x: 10 }} 
        animate={{ opacity: 1, scale: 1, x: 0 }} 
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        style={style}
        className="absolute right-4 z-50 w-80 max-w-[calc(100%-2rem)] glass-panel rounded-xl flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5"
        >
        {/* Header */}
        <div onPointerDown={(e) => dragControls.start(e)} className="bg-slate-100 dark:bg-slate-900 p-3 border-b border-slate-200 dark:border-white/10 flex justify-between items-center cursor-grab active:cursor-grabbing touch-none select-none">
            <div className="flex items-center gap-2">
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 border border-white/10 transition-colors flex items-center justify-center group"><svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-0 group-hover:opacity-100 text-white"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">Field Inspector</span>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20">
            {(['settings', 'logic', 'data'] as Tab[]).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={clsx("flex-1 py-2 text-[10px] font-medium uppercase tracking-wider transition-colors border-b-2", activeTab === tab ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-white/5" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5")}>
                    {tab}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="p-4 space-y-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl min-h-[300px]" onPointerDown={(e) => e.stopPropagation()}>
            
            {activeTab === 'settings' && (
              <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-200 dark:border-indigo-500/20 overflow-hidden mb-4">
                  <button onClick={() => setIsAiOpen(!isAiOpen)} className="w-full flex items-center justify-between p-2.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                      <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> Refine with AI</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={clsx("transition-transform", isAiOpen ? "rotate-180" : "")}><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {isAiOpen && (
                      <div className="p-2.5 pt-0 space-y-2 animate-slide-down">
                      <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g. Make this optional and change label..." className="w-full bg-white dark:bg-black/30 border border-indigo-200 dark:border-white/10 rounded-md p-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 resize-none" rows={2} />
                      <Button size="sm" className="w-full h-7 text-xs bg-indigo-600 hover:bg-indigo-500 text-white" onClick={handleAiSubmit} isLoading={isAiLoading} disabled={!aiPrompt.trim()}>Apply</Button>
                      </div>
                  )}
              </div>
            )}

            {activeTab === 'settings' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-200 space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Field Label</label>
                        <input type="text" value={field.def.title} onChange={(e) => onChange({ title: e.target.value })} className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Input Type</label>
                        <div className="relative">
                            <select value={field.def.kind} onChange={(e) => onChange({ kind: e.target.value })} className="w-full appearance-none bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                                <option value="text">Short Text</option>
                                <option value="textarea">Long Text</option>
                                <option value="date">Date Picker</option>
                                <option value="select">Dropdown</option>
                                <option value="radio">Radio Group</option>
                                <option value="checkbox">Checkbox (Yes/No)</option>
                                <option value="checkbox_group">Checkbox Group</option>
                                <option value="header">Header</option>
                                <option value="info">Info Block</option>
                                <option value="slider">Range Slider</option>
                                <option value="consent">Legal Consent</option>
                                <option value="signature">Signature Pad</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                        </div>
                     </div>

                     {/* SLIDER SETTINGS */}
                     {field.def.kind === "slider" && (
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Min</label>
                                <input 
                                    type="number" 
                                    value={field.def.min ?? 0} 
                                    onChange={(e) => onChange({ min: Number(e.target.value) })}
                                    className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1.5 text-xs text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Max</label>
                                <input 
                                    type="number" 
                                    value={field.def.max ?? 10} 
                                    onChange={(e) => onChange({ max: Number(e.target.value) })}
                                    className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1.5 text-xs text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                     )}

                     {/* CONSENT SETTINGS */}
                     {field.def.kind === "consent" && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/10">
                            <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Legal Text</label>
                            <textarea 
                                value={field.def.placeholder || ""} 
                                onChange={(e) => onChange({ placeholder: e.target.value })}
                                className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-2 text-xs text-slate-900 dark:text-white min-h-[80px]"
                                placeholder="Paste full terms here..."
                            />
                        </div>
                     )}

                     <OptionsEditor fieldDef={field.def} onChange={(newDef) => onChange(newDef)} />
                     
                     <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
                        <label className="flex items-center gap-2 cursor-pointer group select-none">
                            <div className={clsx("w-4 h-4 rounded border flex items-center justify-center transition-all duration-200", field.isRequired ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent group-hover:border-indigo-400")}>
                            {field.isRequired && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>}
                            </div>
                            <input type="checkbox" className="hidden" checked={field.isRequired} onChange={(e) => onChange({ isRequired: e.target.checked })} />
                            <span className={clsx("text-xs font-medium transition-colors", field.isRequired ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white")}>Required</span>
                        </label>
                        <button onClick={onDelete} className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-md transition-colors">Delete</button>
                    </div>
                </div>
            )}

            {activeTab === 'logic' && (
              <LogicEditor 
                def={field.def} 
                allFields={allFields} 
                fullSchema={fullSchemaContext} 
                onChange={onChange} 
              />
            )}
            {activeTab === 'data' && <DataSettings def={field.def} onChange={onChange} />}
        </div>
        </motion.div>
    </AnimatePresence>
  );
}