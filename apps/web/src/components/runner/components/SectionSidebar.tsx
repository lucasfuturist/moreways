"use client";

import React from "react";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionSidebarProps {
  schema: any; // Relaxed type to handle both JSON Schema and Intake Schema
  currentFieldKey: string | null;
}

export function SectionSidebar({ schema, currentFieldKey }: SectionSidebarProps) {
  if (!schema) return null;

  // [FIX] Robust extraction of fields regardless of schema shape
  const fields = schema.fields || (schema.properties ? Object.values(schema.properties) : []);
  
  if (!Array.isArray(fields) || fields.length === 0) {
      return null;
  }

  // 1. Identify Sections from fields
  // Group consecutive fields with the same 'section' property, or default to "Intake"
  const sections: { id: string; title: string; fieldKeys: string[] }[] = [];
  
  let currentSection = { id: "default", title: "General Info", fieldKeys: [] as string[] };
  
  fields.forEach((field: any) => {
      const sectionTitle = field.section || "General Info";
      
      if (sectionTitle !== currentSection.title && currentSection.fieldKeys.length > 0) {
          sections.push(currentSection);
          currentSection = { id: sectionTitle, title: sectionTitle, fieldKeys: [] };
      }
      
      // Update title if it changed (first item case)
      currentSection.title = sectionTitle;
      
      // Use 'key' or 'id' or 'name'
      const key = field.key || field.id || field.name;
      if (key) currentSection.fieldKeys.push(key);
  });
  
  // Push the last section
  if (currentSection.fieldKeys.length > 0) {
      sections.push(currentSection);
  }

  // If no explicit sections were found, create steps based on field chunks
  if (sections.length === 1 && sections[0].fieldKeys.length > 5) {
      // Optional: split long forms? For now, stick to logic.
  }

  // 2. Determine Progress
  const currentFieldIndex = fields.findIndex((f: any) => (f.key || f.id) === currentFieldKey);
  
  return (
    <div className="py-4 space-y-6">
      <div className="px-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Progress
          </div>
          <div className="relative space-y-0">
              {sections.map((section, idx) => {
                  // Check if this section is active, past, or future
                  const sectionStartIndex = fields.findIndex((f: any) => (f.key || f.id) === section.fieldKeys[0]);
                  const sectionEndIndex = sectionStartIndex + section.fieldKeys.length;
                  
                  const isPast = currentFieldIndex > sectionEndIndex;
                  const isActive = currentFieldIndex >= sectionStartIndex && currentFieldIndex < sectionEndIndex;
                  
                  return (
                      <div key={idx} className="relative pl-6 pb-6 last:pb-0 group">
                          {/* Vertical Line */}
                          {idx !== sections.length - 1 && (
                              <div className={cn(
                                  "absolute left-[9px] top-2 bottom-0 w-px transition-colors duration-500",
                                  isPast ? "bg-indigo-500" : "bg-slate-800"
                              )} />
                          )}
                          
                          {/* Dot */}
                          <div className={cn(
                              "absolute left-0 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10",
                              isActive 
                                ? "border-indigo-500 bg-slate-900 scale-110" 
                                : isPast 
                                    ? "border-indigo-500 bg-indigo-500" 
                                    : "border-slate-700 bg-slate-950"
                          )}>
                              {isPast && <CheckCircle2 className="w-3 h-3 text-white" />}
                              {isActive && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
                          </div>

                          {/* Label */}
                          <div className={cn(
                              "text-sm font-medium transition-colors duration-300 -mt-0.5",
                              isActive ? "text-white" : isPast ? "text-slate-400" : "text-slate-600"
                          )}>
                              {section.title}
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
      
      {/* Security Badge */}
      <div className="mx-6 p-3 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center gap-3">
          <Lock className="w-4 h-4 text-emerald-500" />
          <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Encrypted Session</div>
              <div className="text-xs text-slate-500">Your data is secure.</div>
          </div>
      </div>
    </div>
  );
}