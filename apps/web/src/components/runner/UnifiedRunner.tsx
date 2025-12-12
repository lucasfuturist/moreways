"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { ChatRunner, type ChatMessage, type SimpleMessage } from "./components/ChatRunner"; 
import { SectionSidebar } from "./components/SectionSidebar"; 
import { VerdictCard } from "./components/VerdictCard";
import { LegalChatInterface } from "../LegalChatInterface"; 
import type { FormSchemaJson } from "@/lib/types/argueos-types";
import { argueosClient } from "@/lib/argueos-client";

interface UnifiedRunnerProps {
  formId: string;
  organizationId: string;
  schema: FormSchemaJson;
  initialData?: Record<string, any>;
  intent?: string;
}

export function UnifiedRunner({ 
  formId, 
  organizationId, 
  schema, 
  initialData = {},
  intent = "General Consumer Issue"
}: UnifiedRunnerProps) {
  const router = useRouter();
  
  // -- STATE --
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const [formName] = useState("Intake Assessment"); 

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [textHistory, setTextHistory] = useState<SimpleMessage[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New State for Intelligence Layer
  const [verdict, setVerdict] = useState<any>(null);

  // -- 1. PERSISTENCE (Auto-Save) --
  const STORAGE_KEY = `intake_draft_${formId}`;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) { console.error("Failed to load draft", e); }
    }
  }, [formId]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, STORAGE_KEY]);

  // -- 2. TAB PROTECTION --
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(formData).length > 1 && !verdict) {
        e.preventDefault();
        e.returnValue = ""; 
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, verdict]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
        // 1. Submit to CRM (Persistence)
        await argueosClient.submitForm({
            formId,
            orgId: organizationId,
            data: formData
        });

        localStorage.removeItem(STORAGE_KEY);

        // ---------------------------------------------------------
        // [TRACKING] Fire Lead Event
        // ---------------------------------------------------------
        if (typeof window !== 'undefined' && window.moreways) {
            // Helper: Try to find PII fields in dynamic schema keys
            // Looks for keys containing "email", "phone", "name" case-insensitive
            const findValue = (substr: string) => {
                const key = Object.keys(formData).find(k => k.toLowerCase().includes(substr));
                return key ? formData[key] : undefined;
            };

            const email = findValue('email');
            const phone = findValue('phone');
            const fullName = findValue('name') || findValue('full_name');
            let firstName, lastName;

            if (typeof fullName === 'string') {
                const parts = fullName.trim().split(' ');
                firstName = parts[0];
                lastName = parts.slice(1).join(' ');
            }

            window.moreways.track('lead', {
                // Primary Conversion Value
                value: 50, // Estimated value for ad optimization
                currency: 'USD',
                content_name: formName,
                
                // Identity Signals (Hashed by Attribution Engine)
                email: email,
                phone: phone,
                first_name: firstName,
                last_name: lastName,
                
                // Context
                form_id: formId,
                intent: intent
            });
            console.log("[Pixel] Lead event tracked with identity signals");
        }
        // ---------------------------------------------------------

        // 2. Validate with The Brain (Intelligence)
        const res = await fetch("/api/intake/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                formData: formData,
                intent: intent
            })
        });

        if (!res.ok) throw new Error("Validation failed");
        
        const json = await res.json();
        
        // 3. Show Results
        setVerdict(json.data);
        setIsSubmitting(false);

    } catch (e) {
        setIsSubmitting(false);
        console.error(e);
        alert("Submission failed. Please try again.");
    }
  };

  const handleProceedToAccount = () => {
      router.push('/register?intent=claim_submission');
  };

  // --- RENDER: VERDICT VIEW (Post-Submission) ---
  if (verdict) {
    return (
      <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative flex flex-col">
         <div className="flex-none p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
            <h1 className="font-bold text-lg dark:text-white">Assessment Complete</h1>
            <button 
                onClick={handleProceedToAccount}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
                Create Account <ArrowRight className="w-4 h-4" />
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <VerdictCard 
                        status={verdict.status}
                        confidence={verdict.confidence_score} 
                        summary={verdict.analysis.summary}
                        missingElements={verdict.analysis.missing_elements}
                        citations={verdict.relevant_citations}
                    />
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-1">
                        <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Have Questions?</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Based on your situation, you can ask our legal AI specific questions about the laws cited above.
                        </p>
                    </div>
                    <div className="lg:col-span-2">
                        <LegalChatInterface />
                    </div>
                </motion.div>
            </div>
         </div>
      </div>
    );
  }

  // --- RENDER: RUNNER VIEW (Intake) ---
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-950 overflow-hidden rounded-none md:rounded-2xl border-0 md:border border-slate-800 shadow-2xl relative">
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-4"
          >
             <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
             <div className="text-center">
                <h3 className="text-xl font-bold text-white">Analyzing Claim...</h3>
                <p className="text-slate-400 text-sm mt-1">Consulting legal database</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="md:hidden flex-none bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between z-30">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Assessment</span>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase">
             <Save className="w-3 h-3" /> Auto-Saving
          </div>
      </div>

      <div className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950 flex-none">
         <div className="p-6 border-b border-slate-800">
             <h3 className="text-sm font-bold text-white uppercase tracking-wider">Assessment Progress</h3>
         </div>
         <div className="flex-1 overflow-y-auto">
             <SectionSidebar schema={schema} currentFieldKey={activeFieldKey} />
         </div>
      </div>

      <div className="flex-1 relative flex flex-col min-h-0">
        <div className="md:hidden flex-none border-b border-slate-800 bg-slate-950/50">
             <SectionSidebar schema={schema} currentFieldKey={activeFieldKey} />
        </div>

        <div className="flex-1 relative overflow-hidden">
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
    </div>
  );
}