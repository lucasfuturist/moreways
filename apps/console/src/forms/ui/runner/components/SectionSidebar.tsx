import React, { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface SectionSidebarProps {
  schema: FormSchemaJsonShape;
  currentFieldKey: string | null;
}

// [FIX] Define interface to prevent narrowing of 'status' to string literal
interface SectionItem {
  title: string;
  startKey: string;
  status: 'done' | 'active' | 'pending';
}

export function SectionSidebar({ schema, currentFieldKey }: SectionSidebarProps) {
  const fieldKeys = schema.order || Object.keys(schema.properties);
  const sections: SectionItem[] = [];
  
  // [FIX] Explicitly type the variable
  let currentSection: SectionItem = { 
    title: "Start", 
    startKey: fieldKeys[0] || "unknown", 
    status: 'pending' 
  };

  // Determine active section index
  let activeSectionIndex = 0;

  fieldKeys.forEach((key) => {
    const def = schema.properties[key];
    if (def.kind === 'header') {
        sections.push(currentSection);
        currentSection = { title: def.title, startKey: key, status: 'pending' };
    }
    if (key === currentFieldKey) {
        currentSection.status = 'active';
        // Mark previous as done
        sections.forEach(s => s.status = 'done');
        activeSectionIndex = sections.length;
    }
  });
  sections.push(currentSection);

  if (!currentFieldKey && sections.length > 0) {
      sections.forEach(s => s.status = 'done');
      activeSectionIndex = sections.length - 1;
  }

  // Auto-scroll mobile pills
  const pillsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pillsRef.current) {
        const activeEl = pillsRef.current.children[activeSectionIndex] as HTMLElement;
        if (activeEl) {
            pillsRef.current.scrollTo({ left: activeEl.offsetLeft - 20, behavior: 'smooth' });
        }
    }
  }, [activeSectionIndex]);

  return (
    <>
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:flex flex-col w-64 py-8 pr-6 pl-4 h-full border-r border-white/5 space-y-6 bg-slate-950/30">
            <div>
                <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 pl-1">Progress</h4>
                <div className="space-y-0 relative">
                    {/* Thinner Line */}
                    <div className="absolute left-[9px] top-2 bottom-2 w-[1px] bg-white/5 -z-10" />

                    {sections.map((s, i) => (
                        <div key={i} className={clsx("flex items-center gap-3 py-2 transition-all duration-500", s.status === 'active' ? "opacity-100" : s.status === 'done' ? "opacity-50" : "opacity-20")}>
                            <div className={clsx("w-5 h-5 rounded-full border flex items-center justify-center transition-colors bg-slate-950 z-10", 
                                s.status === 'active' ? "border-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : 
                                s.status === 'done' ? "border-emerald-500/30 text-emerald-500/50 bg-emerald-500/10" : "border-slate-800 text-slate-800"
                            )}>
                                {s.status === 'done' ? <Check className="w-3 h-3" /> : <div className={clsx("rounded-full bg-current", s.status === 'active' ? "w-1.5 h-1.5" : "w-1 h-1")} />}
                            </div>
                            <div>
                                <div className={clsx("text-xs font-medium leading-none", s.status === 'active' ? "text-emerald-400" : "text-slate-300")}>{s.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* MOBILE TOP PILLS */}
        <div className="lg:hidden h-12 border-b border-white/5 flex items-center overflow-x-auto no-scrollbar px-4 gap-2 bg-slate-950/80 backdrop-blur-xl z-20" ref={pillsRef}>
            {sections.map((s, i) => (
                <div key={i} className={clsx("flex-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors whitespace-nowrap", 
                    s.status === 'active' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : 
                    s.status === 'done' ? "bg-slate-800/50 border-white/5 text-slate-500" : "border-transparent text-slate-600"
                )}>
                    {s.title}
                </div>
            ))}
        </div>
    </>
  );
}