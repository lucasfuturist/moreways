"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface SaveFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  currentName?: string;
}

export function SaveFormDialog({ isOpen, onClose, onSave, currentName = "" }: SaveFormDialogProps) {
  const [name, setName] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setName(currentName || "Untitled Form");
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onSave(name);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-violet-950 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
        
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Save Form</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Give this form a name to access it later in your dashboard.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wide">Form Name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 placeholder:text-slate-400"
            placeholder="e.g. Personal Injury Intake v1"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} isLoading={isSaving} disabled={!name.trim()}>
            Save Form
          </Button>
        </div>

      </div>
    </div>
  );
}