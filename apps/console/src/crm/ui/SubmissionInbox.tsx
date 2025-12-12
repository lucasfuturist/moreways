"use client";

import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { 
  Mail, ChevronRight, User, 
  Send, Phone
} from "lucide-react";
import type { FormSchema } from "@/forms/schema/forms.schema.FormSchemaModel";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { MemoExportButton } from "@/crm/ui/MemoExportButton"; 
import { ClaimAnalysisCard } from "@/crm/ui/ClaimAnalysisCard"; // [NEW]

// --- Types ---
interface SubmissionSummary { 
  id: string; 
  createdAt: string; 
  submissionData: Record<string, any>; 
  formSchemaId: string; 
}

interface SubmissionDetail extends SubmissionSummary { 
  schemaSnapshot: { 
    properties: Record<string, FormFieldDefinition>; 
    order?: string[]; 
  }; 
}

// [NEW] Local state for the analysis result
interface ClaimAssessment {
  meritScore: number;
  category: "high_merit" | "potential" | "low_merit" | "frivolous" | "insufficient_data";
  primaFacieAnalysis: {
    duty: string;
    breach: string;
    causation: string;
    damages: string;
  };
  credibilityFlags: string[];
  summary: string;
}

type TabView = "messages" | "details" | "analysis"; // Added "analysis"
type FilterType = "new" | "talking" | "done";

const MOCK_MESSAGES = [
    { id: 1, sender: 'client', text: 'I submitted the info. Did you get it?', time: '10:30 AM' },
    { id: 2, sender: 'agent', text: 'Yes, I have it right here. I am reviewing it now.', time: '10:32 AM' },
];

function inferColumns(data: Record<string, any>) {
  const keys = Object.keys(data);
  const nameKey = keys.find(k => /name|full/i.test(k)) || keys[0];
  const emailKey = keys.find(k => /email|mail/i.test(k));
  const phoneKey = keys.find(k => /phone|mobile|cell/i.test(k));
  return {
    name: data[nameKey] || "Unknown Client",
    email: emailKey ? data[emailKey] : "—",
    phone: phoneKey ? data[phoneKey] : "—",
  };
}

export default function InboxPage() {
  // Data State
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<SubmissionSummary[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [forms, setForms] = useState<FormSchema[]>([]);
  
  // [NEW] Assessment State
  const [assessment, setAssessment] = useState<ClaimAssessment | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  // Loading State
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState<TabView>("messages");
  const [activeFilter, setActiveFilter] = useState<FilterType>("new");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState(MOCK_MESSAGES);

  useEffect(() => {
    async function loadData() {
        try {
            const formsRes = await fetch("/api/forms");
            const formsData = await formsRes.json();
            setForms(formsData);

            if (formsData.length > 0) {
                const subRes = await fetch(`/api/crm/submissions?formId=${formsData[0].id}`);
                const subData = await subRes.json();
                const subs = Array.isArray(subData) ? subData : [];
                setSubmissions(subs);
                setFilteredSubmissions(subs);
            }
        } catch (e) {
            console.error("Failed to load inbox", e);
        } finally {
            setIsLoadingList(false);
        }
    }
    loadData();
  }, []);

  useEffect(() => {
      setFilteredSubmissions(submissions);
  }, [activeFilter, submissions]);

  useEffect(() => {
    if (!selectedSubmissionId) { 
        setDetail(null); 
        setAssessment(null); // Reset assessment on switch
        return; 
    }
    setIsLoadingDetail(true);
    setAssessment(null);
    
    fetch(`/api/crm/submissions/${selectedSubmissionId}`)
      .then(res => res.json())
      .then(data => { setDetail(data); setIsLoadingDetail(false); });
  }, [selectedSubmissionId]);

  // [NEW] Action to trigger AI analysis
  const handleRunAssessment = async () => {
      if (!detail) return;
      setIsAssessing(true);
      try {
          const formName = forms.find(f => f.id === detail.formSchemaId)?.name;
          const res = await fetch("/api/ai/assess-claim", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                  submissionData: detail.submissionData,
                  formName 
              })
          });
          const result = await res.json();
          if (result.error) throw new Error(result.error);
          setAssessment(result);
      } catch (err) {
          alert("Assessment failed. Check console.");
          console.error(err);
      } finally {
          setIsAssessing(false);
      }
  };

  const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      const newMsg = { 
          id: Date.now(), 
          sender: 'agent', 
          text: chatInput, 
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      };
      setChatHistory([...chatHistory, newMsg]);
      setChatInput("");
  };

  const currentFormName = forms.find(f => f.id === detail?.formSchemaId)?.name;

  const renderDetailContent = () => {
    if (!selectedSubmissionId) return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-60">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 shadow-inner border border-slate-200 dark:border-white/5">
                <User className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Selection</h3>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2 max-w-xs">Select a person from the inbox to start communicating.</p>
        </div>
    );

    if (isLoadingDetail || !detail) return (
        <div className="h-full flex items-center justify-center gap-2 text-sm text-indigo-500 font-medium animate-pulse">
            <div className="w-2 h-2 bg-current rounded-full" /> Loading client info...
        </div>
    );

    const { schemaSnapshot, submissionData } = detail;
    const fieldOrder = schemaSnapshot.order || Object.keys(schemaSnapshot.properties || {});
    const cols = inferColumns(submissionData);

    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* HEADER */}
        <div className="flex-none px-6 py-5 border-b border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-none border border-indigo-200 dark:border-white/10 shadow-sm">
                    <User className="w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate font-heading">{cols.name}</h2>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {cols.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {cols.phone}</span>
                    </div>
                </div>
            </div>

            {/* TABS SWITCHER */}
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/10">
                <button 
                    onClick={() => setActiveTab("messages")} 
                    className={clsx("px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all", activeTab === 'messages' ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300")}
                >
                    Chat
                </button>
                <button 
                    onClick={() => setActiveTab("details")} 
                    className={clsx("px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all", activeTab === 'details' ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300")}
                >
                    Info
                </button>
                {/* [NEW] Analysis Tab */}
                <button 
                    onClick={() => setActiveTab("analysis")} 
                    className={clsx("px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all", activeTab === 'analysis' ? "bg-white dark:bg-slate-800 text-rose-500 dark:text-rose-400 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300")}
                >
                    AI Assess
                </button>
            </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-transparent relative">
           
           {/* TAB: MESSAGES */}
           {activeTab === 'messages' && (
               <div className="flex flex-col h-full animate-in slide-in-from-bottom-2 fade-in duration-300">
                   <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                       <div className="text-center text-xs text-slate-400 my-4 uppercase tracking-widest font-bold opacity-50">Today</div>
                       {chatHistory.map((msg) => (
                           <div key={msg.id} className={clsx("flex flex-col max-w-[80%]", msg.sender === 'agent' ? "self-end items-end" : "self-start items-start")}>
                               <div className={clsx("px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed", 
                                   msg.sender === 'agent' ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-bl-sm"
                               )}>
                                   {msg.text}
                               </div>
                               <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                           </div>
                       ))}
                   </div>
                   
                   <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex gap-2 items-center">
                       <input 
                           className="flex-1 bg-slate-100 dark:bg-slate-950 border-transparent rounded-full px-4 h-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-black transition-colors outline-none placeholder:text-slate-400"
                           placeholder="Type a message (SMS)..."
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                       />
                       <Button size="icon" onClick={handleSendMessage} className="rounded-full bg-indigo-600 hover:bg-indigo-500 h-10 w-10">
                           <Send className="w-4 h-4" />
                       </Button>
                   </div>
               </div>
           )}

           {/* TAB: INFO (Data View) */}
           {activeTab === 'details' && (
               <div className="p-8 space-y-6 max-w-2xl mx-auto animate-in slide-in-from-bottom-2 fade-in duration-300">
                   <div className="flex justify-end border-b border-slate-200 dark:border-white/5 pb-4 mb-4">
                        <MemoExportButton 
                            schema={{...schemaSnapshot, type: "object"}} 
                            submissionData={submissionData}
                            clientName={cols.name}
                            formName={currentFormName}
                            submissionDate={detail.createdAt}
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                        />
                   </div>
                   {fieldOrder.map(key => {
                     const def = schemaSnapshot.properties[key];
                     if (!def || def.kind === 'info' || def.kind === 'divider') return null;
                     
                     if (def.kind === 'header') return (
                        <div key={key} className="pt-6 pb-2 border-b border-slate-200 dark:border-white/5">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{def.title}</h4>
                        </div>
                     );

                     return (
                       <div key={key} className="group">
                         <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{def.title}</label>
                         <div className="text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm leading-relaxed">
                            {submissionData[key] ? String(submissionData[key]) : <span className="text-slate-400 italic">No response</span>}
                         </div>
                       </div>
                     )
                   })}
                   <div className="h-12" />
               </div>
           )}

           {/* [NEW] TAB: ANALYSIS (AI Judge) */}
           {activeTab === 'analysis' && (
               <div className="p-8 max-w-2xl mx-auto">
                   <ClaimAnalysisCard 
                       assessment={assessment} 
                       isLoading={isAssessing} 
                       onRunAssessment={handleRunAssessment} 
                   />
               </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full p-4 lg:p-6 overflow-hidden flex gap-6 relative">
        
        {/* LEFT PANEL: Inbox List */}
        <div className="w-[380px] xl:w-[420px] flex-none flex flex-col glass-panel rounded-[2rem] overflow-hidden shadow-2xl relative bg-white/90 dark:bg-slate-900/60 border-white/50 dark:border-white/10 backdrop-blur-2xl transition-all duration-500">
            <div className="flex-none px-6 py-5 border-b border-slate-200 dark:border-white/5 flex flex-col gap-4 bg-white/50 dark:bg-white/5">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">Inbox</h1>
                </div>
                <div className="flex gap-2">
                    {[{ id: 'new', label: 'New' }, { id: 'talking', label: 'Talking' }, { id: 'done', label: 'Done' }].map((f) => (
                        <button key={f.id} onClick={() => setActiveFilter(f.id as FilterType)} className={clsx("flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all", activeFilter === f.id ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm" : "bg-white/50 dark:bg-white/5 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10")}>{f.label}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/30 dark:bg-transparent">
                {isLoadingList ? (
                    <div className="p-4 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />)}</div>
                ) : filteredSubmissions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center"><Mail className="w-8 h-8 text-slate-300 mb-2" /><p className="text-xs text-slate-500">No messages.</p></div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredSubmissions.map(sub => {
                            const cols = inferColumns(sub.submissionData);
                            const isSelected = selectedSubmissionId === sub.id;
                            return (
                                <div key={sub.id} onClick={() => setSelectedSubmissionId(sub.id)} className={clsx("flex flex-col gap-1 p-4 cursor-pointer transition-all border-l-4 hover:bg-slate-50 dark:hover:bg-white/5 relative", isSelected ? "bg-indigo-50/50 dark:bg-white/5 border-indigo-500" : "border-transparent")}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={clsx("font-bold text-sm", isSelected ? "text-indigo-900 dark:text-white" : "text-slate-700 dark:text-slate-200")}>{cols.name}</span>
                                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded">{new Date(sub.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                        <span className="truncate max-w-[180px] flex items-center gap-1">{activeFilter === 'new' ? "New Inquiry" : "Latest message..."}</span>
                                        {isSelected && <ChevronRight className="w-3 h-3" />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT PANEL: Chat & Info */}
        <div className="flex-1 flex flex-col glass-panel rounded-[2rem] overflow-hidden shadow-2xl relative bg-white/80 dark:bg-slate-900/40 border-white/50 dark:border-white/10 backdrop-blur-2xl transition-all duration-500">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
             {renderDetailContent()}
        </div>
    </div>
  );
}