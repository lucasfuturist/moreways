"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowRight, CheckCircle, Scale, Search, BookOpen, Shield, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 

import { ChatRunner, type ChatMessage, type SimpleMessage } from "./components/ChatRunner"; 
import { SectionSidebar } from "./components/SectionSidebar"; 
import { VerdictCard } from "./components/VerdictCard";
// Ensure LegalChatInterface is available or remove if not ported yet
import { LegalChatInterface } from "../LegalChatInterface"; 

// Use the type exported by apps/web
import type { FormSchemaJson } from "@/lib/types/argueos-types";

interface UnifiedRunnerProps {
  formId: string;
  initialSchema?: FormSchemaJson;
  initialData?: Record<string, any>;
  intent?: string; 
}

// --- REASONING STEPPER ---
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
  initialSchema,
  initialData = {},
  intent = "General Consumer Issue" 
}: UnifiedRunnerProps) {
  const router = useRouter();
  
  // -- DATA STATE --
  const [schema, setSchema] = useState<FormSchemaJson | null>(initialSchema || null);
  const [loadingSchema, setLoadingSchema] = useState(!initialSchema);
  const [loadError, setLoadError] = useState<string | null>(null);

  // -- RUNNER STATE --
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [textHistory, setTextHistory] = useState<SimpleMessage[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasoningStep, setReasoningStep] = useState(0); 
  const [verdict, setVerdict] = useState<any>(null);

  // 1. FETCH SCHEMA (If not provided)
  useEffect(() => {
      if (initialSchema) return;

      async function load() {
          try {
              // Use the PROXY route
              const res = await fetch(`/api/console/public/v1/forms/${formId}`);
              if (!res.ok) throw new Error("Form lookup failed");
              const data = await res.json();
              setSchema(data.schema);
          } catch (e) {
              setLoadError("Could not load intake form.");
          } finally {
              setLoadingSchema(false);
          }
      }
      load();
  }, [formId, initialSchema]);

  // 2. PERSISTENCE
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

  // 3. SUBMISSION HANDLER
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setReasoningStep(1);
    
    try {
        // STEP 1: Submit (via Proxy)
        const submitRes = await fetch(`/api/console/submit/${formId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: formData })
        });

        if (!submitRes.ok) throw new Error("Submission failed");
        
        const { submissionId } = await submitRes.json();
        localStorage.removeItem(STORAGE_KEY);
        setReasoningStep(2);

        // [NEW] SMART INTENT EXTRACTION
        // We look for the user's description to guide the Magistrate
        const userStory = formData["descriptionOfIncident"] || formData["description"] || formData["what_happened"];
        
        // Use the user's story as the intent context if available
        const effectiveIntent = userStory 
            ? `Client Situation: ${userStory}` 
            : intent;

        // STEP 2: Assess (via Proxy)
        const stepInterval = setInterval(() => {
            setReasoningStep(prev => prev < 3 ? prev + 1 : prev);
        }, 2000);

        const assessRes = await fetch(`/api/console/submit/${formId}/assess`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                submissionId, 
                intent: effectiveIntent // <--- Passing the real facts now
            })
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
        alert("System busy. Your claim has been saved for manual review.");
    }
  };

  // --- VIEWS ---

  if (loadingSchema) {
      return (
          <div className="h-full w-full flex items-center justify-center bg-slate-950">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
      );
  }

  if (loadError || !schema) {
      return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-slate-950 text-center p-8">
              <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-white">System Unavailable</h2>
              <p className="text-slate-400 mt-2">Please try again later.</p>
          </div>
      );
  }

  if (verdict) {
    return (
      <div className="h-full w-full bg-slate-950 overflow-y-auto">
         <div className="max-w-4xl mx-auto p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">Assessment Complete</h1>
                <button onClick={() => router.push('/register')} className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold text-sm">
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
            {/* Optional: Add LegalChatInterface here if ported to Web */}
         </div>
      </div>
    );
  }

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

  return (
    <div className="flex flex-col md:flex-row h-[85vh] w-full bg-slate-950 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl relative">
      <div className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950 flex-none z-20">
         <div className="p-6 border-b border-slate-800 flex items-center gap-2">
             <Shield className="w-4 h-4 text-indigo-500" />
             <h3 className="text-xs font-bold text-white uppercase tracking-wider">Secure Intake</h3>
         </div>
         <div className="flex-1 overflow-y-auto">
             <SectionSidebar schema={schema} currentFieldKey={activeFieldKey} />
         </div>
      </div>

      <div className="flex-1 relative flex flex-col h-full overflow-hidden">
          <ChatRunner 
              formId={formId}
              formName="Intake Assistant"
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