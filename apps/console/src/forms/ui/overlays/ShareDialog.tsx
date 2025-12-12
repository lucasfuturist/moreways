"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string | null;
}

export function ShareDialog({ isOpen, onClose, formId }: ShareDialogProps) {
  const [activeTab, setActiveTab] = useState<"link" | "embed">("link");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !formId) return null;

  const publicUrl = `${window.location.origin}/s/${formId}`;
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150" onClick={onClose}>
      <div className="w-full max-w-lg bg-white dark:bg-violet-950 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
        
        <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-violet-900/20">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Share Form</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Publish your form to start collecting submissions immediately.</p>
        </div>

        <div className="flex border-b border-slate-200 dark:border-white/10">
            <button onClick={() => setActiveTab("link")} className={clsx("flex-1 py-3 text-xs font-medium transition-colors", activeTab === "link" ? "text-indigo-600 dark:text-emerald-400 border-b-2 border-indigo-600 dark:border-emerald-500 bg-slate-50 dark:bg-white/5" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}>Public Link</button>
            <button onClick={() => setActiveTab("embed")} className={clsx("flex-1 py-3 text-xs font-medium transition-colors", activeTab === "embed" ? "text-indigo-600 dark:text-emerald-400 border-b-2 border-indigo-600 dark:border-emerald-500 bg-slate-50 dark:bg-white/5" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}>Embed Code</button>
        </div>

        <div className="p-6 space-y-4">
            {activeTab === "link" ? (
                <div className="space-y-3">
                    <div className="flex items-center justify-center p-6 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20 rounded-lg mb-4">
                        <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-sm">
                            <div className="w-full h-full bg-slate-900 pattern-grid-lg opacity-90" /> 
                        </div>
                    </div>
                    <label className="text-[10px] uppercase font-bold text-slate-500">Direct Link</label>
                    <div className="flex gap-2">
                        <input readOnly value={publicUrl} className="flex-1 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded px-3 text-sm text-slate-600 dark:text-slate-300 focus:ring-0" />
                        <Button onClick={() => handleCopy(publicUrl)}>{copied ? "Copied!" : "Copy"}</Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-slate-500">HTML Snippet</label>
                    <textarea readOnly value={embedCode} className="w-full h-32 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded p-3 text-xs font-mono text-indigo-600 dark:text-emerald-400/80 focus:ring-0 resize-none" />
                    <Button onClick={() => handleCopy(embedCode)} className="w-full">Copy Snippet</Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}