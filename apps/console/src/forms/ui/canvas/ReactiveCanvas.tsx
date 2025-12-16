// src/forms/ui/canvas/ReactiveCanvas.tsx

import React, { useState, useRef } from "react";
import { DraggableFieldList } from "./DraggableFieldList";
import { FloatingFieldEditor } from "./FloatingFieldEditor";
import { clsx } from "clsx";
import { useLocalStorage } from "@/infra/ui/hooks/useLocalStorage";
import { generateId } from "@/forms/ui/canvas/field-actions";
import { Smartphone, Tablet, Monitor, MessageSquare, LayoutTemplate } from "lucide-react";

interface ReactiveCanvasProps {
  fields: any[];
  setFields: (f: any[]) => void;
  onFieldAiRequest?: (key: string, prompt: string) => Promise<void>;
  isBlueprintMode?: boolean;
  onToggleChat?: () => void;
  onToggleElements?: () => void;
}

type ViewMode = "mobile" | "tablet" | "desktop";

export function ReactiveCanvas({ fields, setFields, onFieldAiRequest, isBlueprintMode = false, onToggleChat, onToggleElements }: ReactiveCanvasProps) {
  const [activeFieldIdx, setActiveFieldIdx] = useState<number | null>(null);
  const [activeFieldTop, setActiveFieldTop] = useState<number>(0);
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>("argueos_canvas_view", "desktop");
  const containerRef = useRef<HTMLDivElement>(null);

  // Hover Zone State
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    // [FIX] Use getBoundingClientRect for stable coordinates relative to the viewport/container,
    // avoiding issues where offsetX acts relative to child elements (causing the 'left' trigger to fire on right-side children).
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Threshold: 100px from edges for a slightly easier hit target
    if (x < 100) setHoverSide("left");
    else if (x > width - 100) setHoverSide("right");
    else setHoverSide(null);
  };

  const handleSelectField = (idx: number | null, e?: React.MouseEvent<HTMLDivElement>) => {
    setActiveFieldIdx(idx);
    if (idx !== null && e && containerRef.current) {
      const itemRect = e.currentTarget.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setActiveFieldTop(itemRect.top - containerRect.top + containerRef.current.scrollTop); 
    }
  };

  const updateField = (index: number, updates: any) => {
    const newFields = [...fields];
    if (updates.isRequired !== undefined) {
        newFields[index] = { ...newFields[index], isRequired: updates.isRequired, def: { ...newFields[index].def, isRequired: updates.isRequired } };
    } else {
        newFields[index].def = { ...newFields[index].def, ...updates };
    }
    setFields(newFields);
  };

  const deleteField = (index: number) => { setFields(fields.filter((_, i) => i !== index)); setActiveFieldIdx(null); };

  const duplicateField = (index: number) => {
    const original = fields[index];
    const newKey = `${original.key}_copy_${Date.now().toString().slice(-4)}`;
    const newItem = { ...original, key: newKey, def: { ...original.def, id: generateId(), key: newKey, title: `${original.def.title} (Copy)` } };
    const newFields = [...fields];
    newFields.splice(index + 1, 0, newItem);
    setFields(newFields);
    setActiveFieldIdx(index + 1);
  };

  const activeField = activeFieldIdx !== null ? fields[activeFieldIdx] : null;
  const widthClass = { mobile: "max-w-[375px]", tablet: "max-w-[768px]", desktop: "max-w-3xl" };

  return (
    <div 
        className={clsx(
            "w-full h-full relative transition-colors duration-500",
            isBlueprintMode 
                ? "bg-cyan-50/50 dark:bg-cyan-950/10" 
                : "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px]"
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverSide(null)}
    >
      
      {/* --- EDGE TRIGGERS --- */}
      
      {/* Left Trigger (Chat) */}
      <div className={clsx(
          "absolute left-0 top-0 bottom-0 w-32 z-30 flex items-center justify-start pl-6 pointer-events-none transition-opacity duration-300",
          hoverSide === "left" ? "opacity-100" : "opacity-0"
      )}>
         <button 
            onClick={onToggleChat}
            className="pointer-events-auto p-3.5 rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 transform transition-all duration-300 hover:scale-110 hover:bg-indigo-500 active:scale-95 opacity-65 hover:opacity-100"
         >
            <MessageSquare className="w-5 h-5" />
         </button>
      </div>

      {/* Right Trigger (Elements) */}
      <div className={clsx(
          "absolute right-0 top-0 bottom-0 w-32 z-30 flex items-center justify-end pr-6 pointer-events-none transition-opacity duration-300",
          hoverSide === "right" ? "opacity-100" : "opacity-0"
      )}>
         <button 
            onClick={onToggleElements}
            className="pointer-events-auto p-3.5 rounded-full bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-xl transform transition-all duration-300 hover:scale-110 active:scale-95 opacity-65 hover:opacity-100"
         >
            <LayoutTemplate className="w-5 h-5" />
         </button>
      </div>


      {/* Scrollable Canvas Area */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto scroll-smooth px-6 pt-24"
        onClick={() => setActiveFieldIdx(null)}
      >
        {/* Floating Toolbar - Placed inside scroll container so it scrolls away */}
        <div className="absolute top-6 left-6 z-20 pointer-events-none">
           <div className="flex items-center gap-1 bg-white/40 dark:bg-black/20 p-1 rounded-full border border-white/20 dark:border-white/5 backdrop-blur-md transition-all duration-300 opacity-50 hover:opacity-100 hover:bg-white/90 dark:hover:bg-slate-900/90 hover:shadow-lg pointer-events-auto">
              {(['mobile', 'tablet', 'desktop'] as const).map(mode => (
                 <button
                   key={mode}
                   onClick={() => setViewMode(mode)}
                   className={clsx(
                     "p-2 rounded-full transition-all duration-300 group relative",
                     viewMode === mode 
                       ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm" 
                       : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
                   )}
                   title={`${mode} view`}
                 >
                   {mode === 'mobile' && <Smartphone className="w-3.5 h-3.5" />}
                   {mode === 'tablet' && <Tablet className="w-3.5 h-3.5" />}
                   {mode === 'desktop' && <Monitor className="w-3.5 h-3.5" />}
                 </button>
              ))}
           </div>
        </div>

        <div 
           className={clsx(
             "mx-auto pb-40 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top", 
             widthClass[viewMode],
             isBlueprintMode ? "bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:24px_24px] border-x border-cyan-500/20 shadow-[0_0_50px_rgba(8,145,178,0.1)] min-h-full" : ""
           )}
           onClick={(e) => e.stopPropagation()}
        >
          {fields.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 py-20 min-h-[50vh]">
                {/* Animated Empty State Ring */}
                <div 
                    onClick={onToggleChat}
                    className="relative group/button cursor-pointer"
                    title="Toggle AI Architect"
                >
                    <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/20 rounded-full blur-xl group-hover/button:blur-2xl transition-all duration-1000 animate-pulse-slow" />
                    
                    <div className="w-24 h-24 rounded-[2rem] border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-white/50 dark:bg-white/5 backdrop-blur-sm relative z-10 shadow-sm transition-transform duration-300 group-hover/button:scale-110 group-hover/button:border-indigo-400 group-active/button:scale-95">
                        <MessageSquare className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover/button:text-indigo-500 transition-colors" />
                    </div>
                </div>
                
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Start Building</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                        Use the <button onClick={onToggleChat} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">AI Architect</button> on the left or press <span className="font-mono text-xs bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">⌘J</span> to browse elements.
                    </p>
                </div>
            </div>
          ) : (
            <>
                <DraggableFieldList fields={fields} setFields={setFields} activeFieldIdx={activeFieldIdx} onSelectField={handleSelectField} onUpdateField={updateField} onDuplicateField={duplicateField} onDeleteField={deleteField} isBlueprintMode={isBlueprintMode} />
                
                {activeFieldIdx !== null && activeField && (
                    <FloatingFieldEditor
                        containerRef={containerRef}
                        field={activeField}
                        allFields={fields}
                        onChange={(updates) => updateField(activeFieldIdx, updates)}
                        onDelete={() => deleteField(activeFieldIdx)}
                        onClose={() => setActiveFieldIdx(null)}
                        onAiRequest={(prompt) => onFieldAiRequest ? onFieldAiRequest(activeField.key, prompt) : Promise.resolve()}
                        style={{ top: activeFieldTop }}
                    />
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}