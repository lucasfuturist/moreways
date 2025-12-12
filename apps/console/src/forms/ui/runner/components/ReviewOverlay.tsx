"use client";

import React, { useState } from "react";
import { X, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface ReviewOverlayProps {
  schema: FormSchemaJsonShape;
  data: Record<string, any>;
  onClose: () => void;
  onSubmit: (updatedData: Record<string, any>) => void;
}

export function ReviewOverlay({ schema, data, onClose, onSubmit }: ReviewOverlayProps) {
  // Local state for edits before saving
  const [localData, setLocalData] = useState(data);

  const handleChange = (key: string, val: any) => {
    setLocalData((prev) => ({ ...prev, [key]: val }));
  };

  // Determine order
  const keys = schema.order || Object.keys(schema.properties);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl h-[85vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/50">
          <div>
            <h2 className="text-lg font-bold text-white">Review & Edit</h2>
            <p className="text-xs text-slate-400">Make final corrections before submitting.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900">
          {keys.map((key) => {
            const def = schema.properties[key];
            if (!def || def.kind === "header" || def.kind === "info" || def.kind === "divider") return null;

            return (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {def.title}
                </label>
                
                {/* Input Rendering Logic */}
                {def.kind === "textarea" ? (
                  <textarea
                    value={localData[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                    rows={3}
                  />
                ) : (def.kind === "select" || def.kind === "radio") ? (
                   <select 
                      value={localData[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none appearance-none"
                   >
                      <option value="" disabled>Select...</option>
                      {def.options?.map((opt: any) => {
                          const val = typeof opt === 'string' ? opt : opt.value;
                          const label = typeof opt === 'string' ? opt : opt.label;
                          return <option key={val} value={val}>{label}</option>;
                      })}
                   </select>
                ) : (
                  <input
                    type={def.kind === "number" || def.kind === "currency" ? "number" : "text"}
                    value={localData[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 bg-slate-950/30 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => onSubmit(localData)} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
          >
            <Send className="w-4 h-4 mr-2" /> Submit Form
          </Button>
        </div>
      </div>
    </div>
  );
}