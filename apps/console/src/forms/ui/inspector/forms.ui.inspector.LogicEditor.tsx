"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { Wand2, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { FormFieldDefinition, FieldLogicRule } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { generateId } from "@/forms/ui/canvas/field-actions";

interface LogicEditorProps {
  def: FormFieldDefinition;
  allFields: any[]; 
  fullSchema?: any; 
  onChange: (updates: Partial<FormFieldDefinition>) => void;
}

export function LogicEditor({ def, allFields, fullSchema, onChange }: LogicEditorProps) {
  const rules = def.logic || [];
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const potentialTriggers = allFields.filter(f => f.key !== def.key);

  const addRule = (action: "show" | "flag" = "show") => {
    const newRule: FieldLogicRule = {
      id: generateId(),
      when: { fieldKey: potentialTriggers[0]?.key || "", operator: "equals", value: "" },
      action: action,
      flagCode: action === "flag" ? "RISK" : undefined,
      flagMessage: action === "flag" ? "Risk Detected" : undefined
    };
    onChange({ logic: [...rules, newRule] });
  };

  const updateRule = (id: string, updates: any) => {
    const newRules = rules.map(r => r.id === id ? { ...r, ...updates } : r);
    onChange({ logic: newRules });
  };

  const updateWhen = (id: string, updates: any) => {
    const newRules = rules.map(r => r.id === id ? { ...r, when: { ...r.when, ...updates } } : r);
    onChange({ logic: newRules });
  };

  const removeRule = (id: string) => {
    onChange({ logic: rules.filter(r => r.id !== id) });
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt || !fullSchema) return;
    setIsGenerating(true);
    try {
        const res = await fetch("/api/ai/generate-rules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ schema: fullSchema, prompt: aiPrompt })
        });
        
        if (!res.ok) throw new Error("AI failed");
        
        const data = await res.json();
        const relevantRules = data.rules
            .filter((r: any) => r.targetFieldKey === def.key)
            .map((r: any) => ({ ...r.rule, id: generateId() }));

        if (relevantRules.length > 0) {
            onChange({ logic: [...rules, ...relevantRules] });
            setAiPrompt("");
        } else {
            alert("AI generated rules for other fields, but none for this one.");
        }

    } catch (e) {
        console.error(e);
        alert("Failed to generate rules.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* AI Generator Section */}
      <div className="bg-indigo-50 dark:bg-violet-900/20 border border-indigo-100 dark:border-violet-500/20 rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-violet-300">
            <Wand2 className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Rule Architect</span>
        </div>
        <textarea 
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="e.g., Flag if date is more than 3 years ago..."
            className="w-full bg-white dark:bg-black/30 border border-indigo-200 dark:border-white/10 rounded-md p-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:border-indigo-500 dark:focus:border-violet-500/50 transition-colors"
            rows={2}
        />
        <Button size="sm" className="w-full h-7 text-xs" onClick={handleAiGenerate} isLoading={isGenerating} disabled={!aiPrompt.trim()}>
            Generate Guardrails
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-bold uppercase text-slate-500">Active Rules</h4>
            <div className="flex gap-2">
                <button onClick={() => addRule("show")} className="text-[10px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-2 py-1 rounded text-slate-600 dark:text-slate-300 transition-colors">+ Logic</button>
                <button onClick={() => addRule("flag")} className="text-[10px] bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 px-2 py-1 rounded transition-colors">+ Guardrail</button>
            </div>
        </div>

        {rules.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-white/10 rounded-lg opacity-50">
                <p className="text-xs text-slate-400">No rules defined.</p>
            </div>
        ) : (
            rules.map((rule, idx) => (
                <div key={rule.id} className={clsx("p-3 rounded-lg border space-y-2 group relative", rule.action === "flag" ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30" : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/10")}>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                            {rule.action === "flag" ? <AlertTriangle className="w-3 h-3 text-amber-500" /> : <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                            <select 
                                value={rule.action}
                                onChange={e => updateRule(rule.id, { action: e.target.value })}
                                className={clsx(
                                    "bg-transparent border-none p-0 text-xs font-bold uppercase focus:ring-0 cursor-pointer",
                                    rule.action === "flag" ? "text-amber-700 dark:text-amber-400" : "text-slate-900 dark:text-white"
                                )}
                            >
                                <option value="show">Show Field</option>
                                <option value="hide">Hide Field</option>
                                <option value="require">Require</option>
                                <option value="flag">Red Flag</option>
                            </select>
                        </div>
                        <button onClick={() => removeRule(rule.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Condition */}
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">If</span>
                        <select 
                            value={rule.when.fieldKey}
                            onChange={e => updateWhen(rule.id, { fieldKey: e.target.value })}
                            className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded px-2 py-1 max-w-[100px] truncate text-slate-700 dark:text-slate-200"
                        >
                            <option value="">(Select)</option>
                            <option value={def.key}>[Self]</option>
                            {potentialTriggers.map(t => <option key={t.key} value={t.key}>{t.def.title}</option>)}
                        </select>
                        <select
                            value={rule.when.operator}
                            onChange={e => updateWhen(rule.id, { operator: e.target.value })}
                            className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded px-2 py-1 w-24 text-slate-700 dark:text-slate-200"
                        >
                            <option value="equals">is</option>
                            <option value="not_equals">is not</option>
                            <option value="contains">contains</option>
                            <option value="greater_than">&gt;</option>
                            <option value="less_than">&lt;</option>
                            <option value="older_than_years">older (yrs)</option>
                        </select>
                        <input 
                            type="text" 
                            value={rule.when.value}
                            onChange={e => updateWhen(rule.id, { value: e.target.value })}
                            className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded px-2 py-1 flex-1 w-full text-slate-700 dark:text-slate-200 placeholder-slate-400"
                            placeholder="Value"
                        />
                    </div>

                    {/* Guardrail Details */}
                    {rule.action === "flag" && (
                        <div className="pt-2 mt-2 border-t border-amber-200 dark:border-amber-500/10 space-y-2">
                            <input 
                                value={rule.flagMessage || ""}
                                onChange={e => updateRule(rule.id, { flagMessage: e.target.value })}
                                placeholder="Warning Message (e.g. Statute Risk)"
                                className="w-full bg-white dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded px-2 py-1 text-xs text-amber-700 dark:text-amber-200 placeholder:text-amber-400 focus:border-amber-500"
                            />
                        </div>
                    )}
                </div>
            ))
        )}
      </div>
    </div>
  );
}