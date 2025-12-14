"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowRight, CheckCircle, Scale, Search, BookOpen, Shield, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 

import { ChatRunner, type ChatMessage, type SimpleMessage } from "./ChatRunner"; 
import { SectionSidebar } from "./SectionSidebar"; 
import { VerdictCard } from "./VerdictCard";
import { LegalChatInterface } from "../../legal/LegalChatInterface"; 

import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface UnifiedRunnerProps {
  formId: string;
  // organizationId & schema are now OPTIONAL because we fetch them
  organizationId?: string;
  schema?: FormSchemaJsonShape;
  initialData?: Record<string, any>;
}

// ... (ReasoningStepper component remains the same) ...
// (Omitting ReasoningStepper code block for brevity - keep existing)
const STEPS = [
    { id: 1, label: "Securing data...", icon: Save },
    { id: 2, label: "Analyzing facts...", icon: Search },
    { id: 3, label: "Checking laws...", icon: BookOpen },
    { id: 4, label: "Verdict...", icon: Scale },
];

function ReasoningStepper({ currentStep }: { currentStep: number }) {
    return (
        <div className="w-full max-w-sm mx-auto space-y-4">
            {STEPS.map((step, idx) => {
                const isActive = step.id === currentStep;
                const isDone = step.id < currentStep;
                return (
                    <div key={step.id} className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-300 ${isActive ? "bg-indigo-500/10 border-indigo-500/50" : "border-transparent opacity-50"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isActive ? "border-indigo-500 text-indigo-400" : isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-600"}`}>
                            {isDone ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                        </div>
                        <span className="text-white text-sm">{step.label}</span>
                    </div>
                )
            })}
        </div>
    );
}

export function UnifiedRunner({ 
  formId, 
  initialData = {},
}: UnifiedRunnerProps) {
  const router = useRouter();
  
  // -- DATA STATE --
  // We now hold the schema in state because it's fetched async
  const [schema, setSchema] = useState<FormSchemaJsonShape | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [formName, setFormName] = useState("Intake");
  const [isLoadingSchema, setIsLoadingSchema] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // -- RUNNER STATE --
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [textHistory, setTextHistory] = useState<SimpleMessage[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasoningStep, setReasoningStep] = useState(0); 
  const [verdict, setVerdict] = useState<any>(null);

  // 1. FETCH SCHEMA ON MOUNT
  useEffect(() => {
      async function loadForm() {
          try {
              const res = await fetch(`/api/public/v1/forms/${formId}`);
              if (!res.ok) throw new Error("Form not found");
              
              const data = await res.json();
              setSchema(data.schema);
              setOrgId(data.organizationId);
              setFormName(data.name);
          } catch (e) {
              setLoadError("Unable to load this form.");
          } finally {
              setIsLoadingSchema(false);
          }
      }
      loadForm();
  }, [formId]);

  // Persistence (Auto-Save)
  const STORAGE_KEY = `intake_draft_${formId}`;
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setFormData({ ...initialData, ...JSON.parse(saved) }); } catch (e) {}
    }
  }, [formId]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Submission Logic
  const handleSubmit = async () => {
    if (!orgId) return; // Guard

    setIsSubmitting(true);
    setReasoningStep(1);
    
    try {
        // 1. Submit
        const submitRes = await fetch(`/api/submit/${formId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: formData })
        });
        if (!submitRes.ok) throw new Error("Submission failed");
        
        const { submissionId } = await submitRes.json();
        localStorage.removeItem(STORAGE_KEY);
        setReasoningStep(2);

        // 2. Assess
        const stepInterval = setInterval(() => {
            setReasoningStep(prev => prev < 3 ? prev + 1 : prev);
        }, 2000);

        const assessRes = await fetch(`/api/submit/${formId}/assess`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ submissionId, intent: formName })
        });

        clearInterval(stepInterval);
        
        if (!assessRes.ok) throw new Error("Assessment failed");
        const { verdict } = await assessRes.json();
        
        setReasoningStep(4);
        await new Promise(r => setTimeout(r, 800));
        
        setVerdict(verdict);
        setIsSubmitting(false);

    } catch (e) {
        setIsSubmitting(false);
        setReasoningStep(0);
        console.error(e);
        alert("Submission saved. Analysis unavailable.");
    }
  };

  // --- VIEW: LOADING STATE (Schema Fetch) ---
  if (isLoadingSchema) {
      return (
          <div className="h-full w-full bg-slate-950 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
      );
  }

  // --- VIEW: ERROR STATE ---
  if (loadError || !schema) {
      return (
          <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-red-500/10 p-4 rounded-full mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Form Not Found</h2>
              <p className="text-slate-400 mt-2">This form may have been deleted or is currently unavailable.</p>
          </div>
      );
  }

  // --- VIEW: VERDICT ---
  if (verdict) {
    return (
      <div className="h-full w-full bg-slate-950 overflow-y-auto">
         <div className="max-w-4xl mx-auto p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">Assessment Complete</h1>
                <button onClick={() => router.push('/register?intent=claim')} className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold text-sm">
                    Create Account
                </button>
            </div>
            <VerdictCard 
                status={verdict.status}
                confidence={verdict.confidence_score} 
                summary={verdict.analysis.summary}
                missingElements={verdict.analysis.missing_elements}
                citations={verdict.relevant_citations}
            />
            <LegalChatInterface />
         </div>
      </div>
    );
  }

  // --- VIEW: LOADING (Submission) ---
  if (isSubmitting) {
      return (
        <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center p-8">
             <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Analyzing</h2>
                <p className="text-slate-400">Please wait while we review your case.</p>
             </div>
             <ReasoningStepper currentStep={reasoningStep} />
        </div>
      );
  }

  // --- VIEW: RUNNER (Chat) ---
  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-slate-950 overflow-hidden">
      
      {/* Sidebar (Progress) */}
      <div className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950 flex-none z-20">
         <div className="p-6 border-b border-slate-800 flex items-center gap-2">
             <Shield className="w-4 h-4 text-indigo-500" />
             <h3 className="text-xs font-bold text-white uppercase tracking-wider">Secure Intake</h3>
         </div>
         <div className="flex-1 overflow-y-auto">
             <SectionSidebar schema={schema} currentFieldKey={activeFieldKey} />
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden flex-none bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between z-30">
              <span className="text-sm font-bold text-white">Assessment</span>
              <Save className="w-4 h-4 text-slate-500" />
          </div>

          <ChatRunner 
              formId={formId}
              formName={formName}
              schema={schema}
              formData={formData}
              onDataChange={setFormData}
              activeFieldKey={activeFieldKey}
              onFieldFocus={setActiveFieldKey}
              onFinished={handleSubmit}
              history={history}
              setHistory={setHistory}
              textHistory={textHistory}
              setTextHistory={setTextHistory}
          />
      </div>
    </div>
  );
}