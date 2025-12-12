"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { FormSchema } from "@/forms/schema/forms.schema.FormSchemaModel";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

// --- Types ---
interface SubmissionSummary { id: string; createdAt: string; submissionData: Record<string, any>; }
interface SubmissionDetail extends SubmissionSummary { schemaSnapshot: { properties: Record<string, FormFieldDefinition>; order?: string[]; }; }

// --- Custom Form Selector (Dark Theme) ---
function FormSelector({ forms, selectedId, onChange }: { forms: FormSchema[], selectedId: string, onChange: (id: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedForm = forms.find(f => f.id === selectedId);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-[240px] px-3 py-2 text-sm bg-slate-950 border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-400/70 transition-all hover:border-slate-500"
      >
        <span className="truncate">{selectedForm ? selectedForm.name : "Select Form..."}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={clsx("ml-2 text-slate-400 transition-transform", isOpen && "rotate-180")}><path d="M6 9l6 6 6-6"/></svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[240px] bg-slate-950 border border-slate-700 rounded-md shadow-xl shadow-black/60 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-[300px] overflow-y-auto py-1">
            <div className="px-3 py-2 text-xs uppercase tracking-wide text-slate-500 font-semibold select-none">
              Available Forms
            </div>
            {forms.map(f => (
              <button
                key={f.id}
                onClick={() => { onChange(f.id); setIsOpen(false); }}
                className={clsx(
                  "w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between group",
                  f.id === selectedId 
                    ? "bg-emerald-500/10 text-emerald-100" 
                    : "text-slate-200 hover:bg-slate-800 hover:text-white"
                )}
              >
                <span className="truncate">{f.name}</span>
                {f.id === selectedId && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            ))}
            {forms.length === 0 && <div className="px-3 py-2 text-xs text-slate-500 italic">No forms found</div>}
          </div>
          <div className="border-t border-slate-800 p-1 bg-slate-900/50">
             <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                Create New Form
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper: Column Extractor ---
function inferColumns(data: Record<string, any>) {
  const keys = Object.keys(data);
  const nameKey = keys.find(k => /name|full/i.test(k)) || keys[0];
  const emailKey = keys.find(k => /email|mail/i.test(k));
  const phoneKey = keys.find(k => /phone|mobile|cell/i.test(k));
  return {
    name: data[nameKey] || "—",
    email: emailKey ? data[emailKey] : "—",
    phone: phoneKey ? data[phoneKey] : "—",
  };
}

export default function CrmDashboard() {
  const router = useRouter();
  const [forms, setForms] = useState<FormSchema[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>("");
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    fetch("/api/forms").then(res => res.json()).then(data => {
        setForms(data);
        if (data.length > 0) setSelectedFormId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedFormId) return;
    setIsLoadingList(true);
    setSelectedSubmissionId(null);
    fetch(`/api/crm/submissions?formId=${selectedFormId}`)
      .then(res => res.json())
      .then(data => {
        setSubmissions(Array.isArray(data) ? data : []);
        setIsLoadingList(false);
      });
  }, [selectedFormId]);

  useEffect(() => {
    if (!selectedSubmissionId) { setDetail(null); return; }
    setIsLoadingDetail(true);
    fetch(`/api/crm/submissions/${selectedSubmissionId}`)
      .then(res => res.json()).then(data => { setDetail(data); setIsLoadingDetail(false); });
  }, [selectedSubmissionId]);

  const handleCopyLink = () => {
    if (!selectedFormId) return;
    const url = `${window.location.origin}/s/${selectedFormId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  const renderDetailContent = () => {
    if (!selectedSubmissionId) return <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-40"><div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div><p className="text-sm font-medium text-slate-300">Select a submission</p></div>;
    if (isLoadingDetail || !detail) return <div className="h-full flex items-center justify-center text-xs text-slate-500 animate-pulse">Loading details...</div>;

    const { schemaSnapshot, submissionData } = detail;
    const fieldOrder = schemaSnapshot.order || Object.keys(schemaSnapshot.properties || {});
    const cols = inferColumns(submissionData);

    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex-none p-6 border-b border-white/10 bg-slate-900/50">
            <h2 className="text-xl font-bold text-slate-100">{cols.name}</h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">New</span>
                <span>{new Date(detail.createdAt).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6">
                 <a href={`mailto:${cols.email}`} className="flex items-center justify-center gap-2 py-2 bg-white/5 rounded-md text-xs font-medium hover:bg-white/10 hover:text-white transition-colors border border-white/5 text-slate-300">Email Client</a>
                 <button className="flex items-center justify-center gap-2 py-2 bg-white/5 rounded-md text-xs font-medium hover:bg-white/10 hover:text-white transition-colors border border-white/5 text-slate-300">Copy Data</button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {fieldOrder.map(key => {
             const def = schemaSnapshot.properties[key];
             if (!def || def.kind === 'info' || def.kind === 'divider') return null;
             if (def.kind === 'header') return <div key={key} className="pt-4 pb-1 border-b border-white/5"><h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{def.title}</h4></div>;
             return (
               <div key={key} className="space-y-1.5">
                 <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">{def.title}</label>
                 <div className="text-sm text-slate-200 bg-slate-950 p-3 rounded border border-slate-800 min-h-[42px] flex items-center">
                    {submissionData[key] ? String(submissionData[key]) : <span className="text-slate-700 italic text-xs">Empty</span>}
                 </div>
               </div>
             )
           })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-950 text-slate-200">
      {/* Compact Header */}
      <div className="flex-none px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950 z-20">
        <div className="flex items-center gap-4">
            <h1 className="text-base font-semibold text-slate-100">Inbox</h1>
            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/50">Beta</span>
        </div>
        <div className="flex items-center gap-3">
             <FormSelector forms={forms} selectedId={selectedFormId} onChange={setSelectedFormId} />
             <div className="h-5 w-px bg-slate-800" />
             <Button size="sm" variant="ghost" disabled={submissions.length === 0} className={clsx("h-9 text-xs", submissions.length === 0 && "opacity-40")}>Export CSV</Button>
             <button onClick={() => router.push('/forms/new-from-prompt')} className="h-9 text-xs font-medium text-slate-400 hover:text-white px-3 rounded hover:bg-white/5 transition-colors">+ New Form</button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="h-8 border-b border-slate-800 bg-slate-900/50 flex items-center px-6 gap-4 text-[11px] font-medium text-slate-500 flex-none">
          <span>{submissions.length} submissions</span>
          <span className="text-slate-700">|</span>
          <span>Last updated: {submissions.length > 0 ? "Just now" : "—"}</span>
      </div>

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: List */}
        <div className="w-[55%] border-r border-slate-800 flex flex-col bg-slate-900/20">
           <div className="flex items-center h-9 border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase font-bold text-slate-500 px-4 flex-none">
               <div className="w-[30%] pl-2">Client</div><div className="w-[30%]">Email</div><div className="w-[20%]">Phone</div><div className="w-[20%] text-right pr-2">Date</div>
           </div>
           <div className="flex-1 overflow-y-auto">
               {isLoadingList ? <div className="p-4 space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-slate-800/50 rounded animate-pulse" />)}</div> : 
               submissions.length === 0 ? (
                   <div className="h-full flex items-center justify-center p-8">
                       <GlassCard className="max-w-sm w-full text-center p-8 flex flex-col items-center border-dashed border-slate-700 bg-slate-900/50">
                           <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                           <h3 className="text-sm font-bold text-slate-200 mb-1">No submissions yet</h3>
                           <p className="text-xs text-slate-500 mb-4">Share your form to collect data.</p>
                           <Button onClick={handleCopyLink} className="h-8 text-xs w-full justify-center">Copy Link</Button>
                       </GlassCard>
                   </div>
               ) : (
                   <div className="divide-y divide-slate-800/50">
                       {submissions.map(sub => {
                           const cols = inferColumns(sub.submissionData);
                           const isSelected = selectedSubmissionId === sub.id;
                           return (
                               <div key={sub.id} onClick={() => setSelectedSubmissionId(sub.id)} className={clsx("flex items-center h-12 px-4 cursor-pointer transition-colors text-sm group", isSelected ? "bg-slate-800 border-l-2 border-emerald-500" : "hover:bg-slate-800/50 border-l-2 border-transparent")}>
                                   <div className={clsx("w-[30%] pl-2 truncate font-medium", isSelected ? "text-white" : "text-slate-300 group-hover:text-white")}>{cols.name}</div>
                                   <div className="w-[30%] truncate text-slate-500 text-xs">{cols.email}</div>
                                   <div className="w-[20%] truncate text-slate-600 text-xs">{cols.phone}</div>
                                   <div className="w-[20%] text-right pr-2 text-slate-600 text-[10px]">{new Date(sub.createdAt).toLocaleDateString()}</div>
                               </div>
                           )
                       })}
                   </div>
               )}
           </div>
        </div>
        {/* RIGHT: Detail */}
        <div className="flex-1 bg-black/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
            {renderDetailContent()}
        </div>
      </div>
    </div>
  );
}