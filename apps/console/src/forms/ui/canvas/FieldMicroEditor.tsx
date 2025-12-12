import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";

interface MicroEditorProps {
  field: any;
  onChange: (updates: any) => void;
  onDelete: () => void;
}

export function FieldMicroEditor({ field, onChange, onDelete }: MicroEditorProps) {
  return (
    <GlassCard noPadding className="absolute -right-4 top-0 translate-x-full w-64 z-20 animate-fade-in">
      <div className="p-3 space-y-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Field Settings</span>
          <button onClick={onDelete} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xs">
            Delete
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400">Label</label>
          <input
            type="text"
            value={field.def.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-0"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400">Type</label>
          <select
            value={field.def.kind}
            onChange={(e) => onChange({ kind: e.target.value })}
            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-0"
          >
            <option value="text">Short Text</option>
            <option value="textarea">Long Text</option>
            <option value="date">Date Picker</option>
            <option value="select">Dropdown</option>
            <option value="checkbox">Checkbox</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            checked={field.isRequired}
            onChange={(e) => onChange({ isRequired: e.target.checked })}
            className="rounded border-slate-300 dark:border-white/20 bg-transparent text-indigo-600 dark:text-teal-500 focus:ring-0"
          />
          <span className="text-xs text-slate-600 dark:text-slate-300">Required Field</span>
        </div>
      </div>
    </GlassCard>
  );
}