import React, { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { ELEMENT_CATALOG, type ElementCatalogItem } from "@/forms/schema/forms.schema.ElementCatalog";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, payload?: any) => void;
}

type CommandItem = 
  | { id: string; label: string; type: "action"; shortcut: string; payload?: never }
  | { id: string; label: string; type: "element"; payload: ElementCatalogItem; shortcut: string };

export function CommandPalette({ isOpen, onClose, onAction }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: CommandItem[] = [
    { id: "undo", label: "Undo", type: "action", shortcut: "⌘Z" },
    { id: "redo", label: "Redo", type: "action", shortcut: "⌘⇧Z" },
    { id: "save", label: "Save Version", type: "action", shortcut: "⌘S" },
    ...ELEMENT_CATALOG.map(item => ({
      id: `add:${item.id}`,
      label: `Add ${item.label}`,
      type: "element" as const,
      payload: item,
      shortcut: "⏎"
    }))
  ];

  const filtered = actions.filter(a => 
    a.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIndex]) {
          const item = filtered[activeIndex];
          if (item.type === "element") {
            onAction("addElement", item.payload);
          } else {
            onAction(item.id);
          }
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, activeIndex, onAction, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-white/90 dark:bg-violet-950/90 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 backdrop-blur-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Search */}
        <div className="flex items-center border-b border-slate-200 dark:border-white/10 px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-slate-500 mr-3"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
          <input
            ref={inputRef}
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveIndex(0); }}
            placeholder="What do you need?"
            className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 flex-1 h-6"
          />
          <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/5">ESC</span>
        </div>

        {/* List */}
        <div className="max-h-[300px] overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
          {filtered.map((action, idx) => (
            <button
              key={action.id}
              onClick={() => {
                if (action.type === "element") onAction("addElement", action.payload);
                else onAction(action.id);
                onClose();
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={clsx(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors",
                idx === activeIndex 
                  ? "bg-indigo-50 dark:bg-teal-500/20 text-indigo-700 dark:text-teal-100" 
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
              )}
            >
              <span className="flex items-center gap-2">
                 {action.type === "element" && <div className={clsx("w-1.5 h-1.5 rounded-full", idx === activeIndex ? "bg-indigo-500 dark:bg-teal-400" : "bg-slate-300 dark:bg-slate-600")} />}
                 {action.label}
              </span>
              {action.shortcut && (
                <span className="text-[10px] opacity-50 font-mono">{action.shortcut}</span>
              )}
            </button>
          ))}
          
          {filtered.length === 0 && (
             <div className="p-8 text-center text-xs text-slate-500 italic">
               No commands found.
             </div>
          )}
        </div>
        
        <div className="bg-slate-50 dark:bg-black/20 px-4 py-2 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 flex justify-between">
           <span>Insert Element</span>
           <span>Cmd + J</span>
        </div>
      </div>
    </div>
  );
}