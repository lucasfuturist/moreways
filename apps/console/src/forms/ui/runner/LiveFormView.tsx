"use client";

import React, { useState } from "react";
import { MessageCircle, Shield } from "lucide-react";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { Button } from "@/components/ui/Button";
import { FieldAssistantBubble } from "./components/FieldAssistantBubble";

interface LiveFormViewProps {
  formName: string;
  schema: FormSchemaJsonShape;
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSubmit: () => void;
}

export function LiveFormView({ formName, schema, formData, onChange, onSubmit }: LiveFormViewProps) {
  const keys = schema.order || Object.keys(schema.properties);
  const [assistantFieldKey, setAssistantFieldKey] = useState<string | null>(null);

  const handleChange = (key: string, val: any) => {
    onChange({ ...formData, [key]: val });
  };

  return (
    // [FIX] Added dark:bg-slate-950 to match the global theme
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 relative transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-8 py-12 space-y-8 min-h-screen">
        
        <div className="border-b border-slate-200 dark:border-white/10 pb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{formName}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 text-sm">
                <Shield className="w-3.5 h-3.5" /> Secure & Confidential
            </p>
        </div>

        <div className="space-y-8">
            {keys.map((key) => {
                const def = schema.properties[key];
                if (!def) return null;

                if (def.kind === "header") {
                    return <h3 key={key} className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-white/10 pb-2 mt-8">{def.title}</h3>;
                }
                if (def.kind === "info") {
                    return <div key={key} className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-lg text-sm leading-relaxed">{def.description}</div>;
                }

                const val = formData[key] || "";

                return (
                    <div key={key} className="group relative">
                        <div className="flex justify-between items-baseline mb-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {def.title} {def.isRequired && <span className="text-red-500">*</span>}
                            </label>
                            
                            <button 
                                onClick={() => setAssistantFieldKey(assistantFieldKey === key ? null : key)}
                                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                            >
                                <MessageCircle className="w-3 h-3" /> Ask AI
                            </button>
                        </div>

                        {/* AI BUBBLE */}
                        {assistantFieldKey === key && (
                            <FieldAssistantBubble 
                                field={def} 
                                formName={formName} 
                                schema={schema} 
                                formData={formData} 
                                onClose={() => setAssistantFieldKey(null)}
                                onUpdateField={(v) => handleChange(key, v)}
                            />
                        )}
                        
                        {def.description && <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{def.description}</p>}

                        {/* INPUT RENDERING - [FIX] Explicit styling for dark mode inputs */}
                        {def.kind === "textarea" ? (
                            <textarea 
                                value={val} 
                                onChange={e => handleChange(key, e.target.value)} 
                                className="w-full rounded-lg border-slate-300 dark:border-white/20 bg-white dark:bg-black/40 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                                rows={4} 
                            />
                        ) : (def.kind === "select" || def.kind === "radio") ? (
                            <select 
                                value={val} 
                                onChange={e => handleChange(key, e.target.value)} 
                                className="w-full rounded-lg border-slate-300 dark:border-white/20 bg-white dark:bg-black/40 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
                            >
                                <option value="" disabled>Select...</option>
                                {def.options?.map((opt: any) => {
                                    const oVal = typeof opt === 'string' ? opt : opt.value;
                                    const oLbl = typeof opt === 'string' ? opt : opt.label;
                                    return <option key={oVal} value={oVal}>{oLbl}</option>
                                })}
                            </select>
                        ) : def.kind === "checkbox" ? (
                            <div className="flex items-center gap-2 h-10">
                                <input 
                                    type="checkbox" 
                                    checked={!!val} 
                                    onChange={e => handleChange(key, e.target.checked)} 
                                    className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-black/40"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-300">Yes / Confirm</span>
                            </div>
                        ) : (
                            <input 
                                type={def.kind === "date" ? "date" : "text"} 
                                value={val} 
                                onChange={e => handleChange(key, e.target.value)} 
                                className="w-full rounded-lg border-slate-300 dark:border-white/20 bg-white dark:bg-black/40 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 h-11"
                            />
                        )}
                    </div>
                );
            })}
        </div>

        <div className="pt-10 border-t border-slate-200 dark:border-white/10">
            <Button onClick={onSubmit} size="lg" className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-xl">
                Submit Form
            </Button>
        </div>
      </div>
    </div>
  );
}