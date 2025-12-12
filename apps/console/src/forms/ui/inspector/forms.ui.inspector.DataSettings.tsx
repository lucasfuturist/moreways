"use client";

import React from "react";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface DataSettingsProps {
  def: FormFieldDefinition;
  onChange: (updates: Partial<FormFieldDefinition>) => void;
}

export function DataSettings({ def, onChange }: DataSettingsProps) {
  const metadata = def.metadata || {};

  const updateMeta = (key: string, value: any) => {
    onChange({
      metadata: { ...metadata, [key]: value }
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Database Key</label>
        <input 
          type="text" 
          value={def.key} 
          readOnly 
          className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-500 dark:text-slate-400 font-mono cursor-not-allowed" 
        />
        <p className="text-[10px] text-slate-400 dark:text-slate-500">Unique identifier for this field.</p>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={metadata.isPII || false} 
            onChange={(e) => updateMeta("isPII", e.target.checked)}
            className="rounded border-slate-300 dark:border-white/20 bg-transparent text-indigo-600 dark:text-teal-500 focus:ring-0" 
          />
          <span className="text-xs text-slate-700 dark:text-slate-200">Contains PII (Sensitive)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={metadata.isLocked || false} 
            onChange={(e) => updateMeta("isLocked", e.target.checked)}
            className="rounded border-slate-300 dark:border-white/20 bg-transparent text-indigo-600 dark:text-teal-500 focus:ring-0" 
          />
          <span className="text-xs text-slate-700 dark:text-slate-200">Lock Field (Prevent Edits)</span>
        </label>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Compliance Note</label>
        <input 
          type="text" 
          value={metadata.complianceNote || ""}
          onChange={(e) => updateMeta("complianceNote", e.target.value)}
          placeholder="e.g. HIPAA Protected"
          className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}