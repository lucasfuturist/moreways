"use client";

import React from "react";
import { clsx } from "clsx";
import { PenTool, Calendar, Hash, DollarSign, Mail, Phone, Type, AlignLeft } from "lucide-react";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { PiiWarning } from "@/forms/ui/guardrails/PiiWarning";

interface FieldRendererProps {
  def: FormFieldDefinition;
}

// --- INTELLIGENT PLACEHOLDER ENGINE ---
function getSmartPlaceholder(kind: string, label: string): string {
  const lower = label.toLowerCase();

  // 1. Precise Matches
  if (lower.includes("zip") || lower.includes("postal")) return "90210";
  if (lower.includes("credit score")) return "720";
  if (lower.includes("ssn") || lower.includes("social")) return "XXX-XX-6789";
  if (lower.includes("docket") || lower.includes("case num")) return "CV-2024-00123";
  
  // 2. Identity
  if (lower.includes("email")) return "alex.smith@example.com";
  if (lower.includes("phone")) return "(555) 019-2834";
  if (lower.includes("age")) return "35";
  if (lower.includes("name")) return "Jane Doe";

  // 3. Financial
  if (kind === "currency") {
    if (lower.includes("income") || lower.includes("salary")) return "75,000.00";
    if (lower.includes("rent")) return "2,500.00";
    return "0.00";
  }

  // 4. Text
  if (kind === "textarea") {
    if (lower.includes("injury") || lower.includes("describe")) return "I was stopped at a red light when...";
    return "Please provide details...";
  }

  // 5. Fallbacks
  switch (kind) {
    case "date": return "MM / DD / YYYY";
    case "time": return "-- : -- --";
    case "number": return "0";
    default: return "Input...";
  }
}

// Visual Type Hint
function getTypeIcon(kind: string) {
  const iconClass = "w-3 h-3 text-slate-400 dark:text-slate-500";
  switch (kind) {
    case "date": return <Calendar className={iconClass} />;
    case "number": return <Hash className={iconClass} />;
    case "currency": return <DollarSign className={iconClass} />;
    case "email": return <Mail className={iconClass} />;
    case "phone": return <Phone className={iconClass} />;
    case "text": return <Type className={iconClass} />;
    case "textarea": return <AlignLeft className={iconClass} />;
    default: return null;
  }
}

export function FieldRenderer({ def }: FieldRendererProps) {
  const { kind, options, placeholder, title, description, metadata, min, max } = def;

  const displayPlaceholder = placeholder || getSmartPlaceholder(kind, title);

  const commonInputStyles = "w-full bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-teal-500/50 transition-colors shadow-sm";
  const labelStyles = "block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5";
  const descStyles = "text-xs text-slate-500 dark:text-slate-400 mb-2 block";

  if (kind === "header") {
    return (
      <div className="mt-2 mb-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
        {description && <p className={descStyles}>{description}</p>}
      </div>
    );
  }

  if (kind === "info") {
    return (
      <div className="bg-indigo-50 dark:bg-violet-900/20 border border-indigo-100 dark:border-verdigris-500/20 rounded p-3 my-2">
        <p className="text-sm text-indigo-900 dark:text-slate-100 font-medium">{title}</p>
        {description && <p className="text-xs text-indigo-700 dark:text-slate-400 mt-1">{description}</p>}
      </div>
    );
  }

  if (kind === "divider") {
    return <hr className="border-t border-slate-200 dark:border-white/10 my-6" />;
  }

  return (
    <PiiWarning label={title} isFlaggedExplicitly={metadata?.isPII}>
      <div className="w-full relative">
        <div className="flex justify-between items-baseline">
            <label className={labelStyles}>
            {title}
            {def.isRequired && <span className="text-red-500 ml-1 font-bold">*</span>}
            </label>
            <div className="opacity-50" title={`Type: ${kind}`}>
                {getTypeIcon(kind)}
            </div>
        </div>
        
        {description && <span className={descStyles}>{description}</span>}

        {(() => {
          switch (kind) {
            case "text": case "email": case "phone": 
              return <input type="text" className={commonInputStyles} placeholder={displayPlaceholder} readOnly />;
            
            case "number": case "currency":
              return (
                <div className="relative">
                    <input type="text" className={commonInputStyles} placeholder={displayPlaceholder} readOnly />
                    {kind === 'currency' && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">$</div>
                    )}
                </div>
              );

            case "date": case "time":
              return (
                <div className="relative">
                    <input type={kind} className={clsx(commonInputStyles, "text-slate-400")} readOnly />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 pointer-events-none text-sm opacity-60">
                        {displayPlaceholder}
                    </div>
                </div>
              );
            
            case "textarea":
              return <textarea className={clsx(commonInputStyles, "resize-none h-24")} placeholder={displayPlaceholder} readOnly />;
            
            case "select": case "multiselect":
              return (
                <div className="relative">
                  <select className={clsx(commonInputStyles, "appearance-none bg-white dark:bg-black/20 text-slate-500 dark:text-slate-400")} disabled>
                    <option>{displayPlaceholder}</option>
                    {options?.map((opt: any, idx: number) => {
                       const label = typeof opt === 'string' ? opt : opt.label;
                       const key = (typeof opt === 'string' ? opt : opt.id) || `opt-${idx}`;
                       return <option key={key}>{label}</option>
                    })}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9L12 15L18 9"/></svg></div>
                </div>
              );
            
            case "radio":
            case "checkbox_group":
              return (
                <div className="space-y-2">
                  {options?.map((opt: any, idx: number) => {
                      const label = typeof opt === 'string' ? opt : opt.label;
                      const key = (typeof opt === 'string' ? opt : opt.id) || `opt-${idx}`;
                      return (
                        <label key={key} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer opacity-80">
                          <div className={clsx("rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-black/20", kind === "radio" ? "w-4 h-4 rounded-full" : "w-4 h-4")} /> {label}
                        </label>
                      )
                  }) || <span className="text-xs text-slate-400 italic">No options defined</span>}
                </div>
              );
            
            case "checkbox":
              return <div className="flex items-center gap-2 mt-1"><div className="w-5 h-5 rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-black/20 flex items-center justify-center" /><span className="text-sm text-slate-700 dark:text-slate-200">Yes / Confirm</span></div>;
            
            case "switch":
               return <div className="w-10 h-5 rounded-full bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 relative"><div className="absolute left-0.5 top-0.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-400 shadow-sm" /></div>;
            
            case "slider":
              return (
                <div className="pt-2 px-1">
                   <input type="range" min={min || 0} max={max || 10} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-teal-500" disabled />
                   <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono uppercase">
                      <span>Min: {min || 0}</span>
                      <span>Max: {max || 10}</span>
                   </div>
                </div>
              );

            case "consent":
              return (
                <div className="space-y-3">
                   <div className="h-24 overflow-y-auto bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-md p-3 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                      {placeholder ? (
                        <span className="text-slate-600 dark:text-slate-300">{placeholder}</span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic">Enter your Terms of Service, Retainer Agreement, or Legal Disclaimer text here...</span>
                      )}
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-black/20" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">I Agree</span>
                   </div>
                </div>
              );

            case "signature":
              return (
                <div className="h-32 w-full border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-black/20 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500 group-hover:border-indigo-400/50 transition-colors">
                   <PenTool className="w-6 h-6 opacity-50" />
                   <span className="text-xs uppercase tracking-widest font-medium">Client Signature Pad</span>
                </div>
              );

            default:
              return <div className="h-9 w-full bg-red-500/10 border border-red-500/30 rounded flex items-center px-3 text-xs text-red-500 dark:text-red-300">Unsupported field kind: {kind}</div>;
          }
        })()}
      </div>
    </PiiWarning>
  );
}