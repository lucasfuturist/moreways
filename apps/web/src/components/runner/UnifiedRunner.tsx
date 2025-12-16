"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, CheckCircle, Scale, Search, BookOpen, Shield, AlertTriangle } from "lucide-react";

import { ChatRunner, type ChatMessage, type SimpleMessage } from "./components/ChatRunner"; 
import { SectionSidebar } from "./components/SectionSidebar"; 
import { VerdictCard, type Verdict } from "./components/VerdictCard";
import type { FormSchemaJson } from "@/lib/types/argueos-types";

interface UnifiedRunnerProps {
  formId: string;
  initialSchema?: FormSchemaJson;
  initialData?: Record<string, any>;
  intent?: string; 
  initialHistory?: ChatMessage[];
  organizationId?: string; 
}

const STEPS = [
    { id: 1, label: "Securing data...", icon: Save },
    { id: 2, label: "Analyzing facts...", icon: Search },
    { id: 3, label: "Checking laws...", icon: BookOpen },
    { id: 4, label: "Verdict...", icon: Scale },
];

function ReasoningStepper({ currentStep }: { currentStep: number }) {
    return (
        <div className="w-full max-w-sm mx-auto space-y-4 animate-in fade-in duration-700">
            {STEPS.map((step) => {
                const isActive = step.id === currentStep;
                const isDone = step.id < currentStep;
                return (
                    <div key={step.id} className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-500 ${isActive ? "bg-indigo-500/10 border-indigo-500/50 scale-105" : "border-transparent opacity-40"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${isActive ? "border-indigo-500 text-indigo-400" : isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-600"}`}>
                            {isDone ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                        </div>
                        <span className="text-white text-sm font-medium">{step.label}</span>
                    </div>
                )
            })}
        </div>
    );
}

// [FIX] Improved Normalizer: Ensures BOTH 'fields' (array) and 'properties' (map) exist
function normalizeSchema(raw: any): any {
    // 1. Unwrap potentially nested schema objects
    if (typeof raw === "string") {
        try { raw = JSON.parse(raw); } catch (e) { return { fields: [], properties: {} }; }
    }
    if (raw && raw.schema) raw = raw.schema;
    if (raw && raw.schemaJson) raw = raw.schemaJson;

    // 2. Prepare Base Result
    const result = {
        ...raw,
        fields: [] as any[],
        properties: raw.properties || {}
    };

    // 3. CASE A: Standard ArgueOS Schema (has 'fields')
    if (Array.isArray(raw.fields)) {
        result.fields = raw.fields;
        // If properties map is missing, generate it from the fields array
        if (Object.keys(result.properties).length === 0) {
            result.fields.forEach((f: any) => {
                if(f.key) result.properties[f.key] = f;
            });
        }
    } 
    // 4. CASE B: JSON Schema (has 'properties' object)
    else if (raw.properties && typeof raw.properties === 'object') {
        const requiredSet = new Set(Array.isArray(raw.required) ? raw.required : []);
        
        // Determine field order: Use 'order' array if present, otherwise keys
        const keys = (Array.isArray(raw.order) && raw.order.length > 0) 
            ? raw.order 
            : Object.keys(raw.properties);

        for (const key of keys) {
            const prop = raw.properties[key];
            if (!prop) continue;
            
            // Normalize field definition
            const fieldDef = {
                key: key,
                label: prop.title || prop.description || key,
                // Default kind to 'text' if not specified
                kind: prop.kind || (prop.type === 'boolean' ? 'boolean' 
                     : prop.enum ? 'select'
                     : prop.format === 'date' ? 'date'
                     : 'text'),
                required: requiredSet.has(key),
                options: prop.enum ? prop.enum.map((v: string) => ({ label: v, value: v })) : undefined,
                ...prop // Preserve original props
            };
            
            result.fields.push(fieldDef);
            
            // Backfill the properties map with our normalized 'kind'
            if (!result.properties[key].kind) {
                result.properties[key] = { ...result.properties[key], kind: fieldDef.kind };
            }
        }
    }
    // 5. CASE C: Root Array (Legacy/Simple format)
    else if (Array.isArray(raw)) {
        result.fields = raw;
        result.fields.forEach((f: any) => {
            if(f.key) result.properties[f.key] = f;
        });
    }

    return result;
}


export function UnifiedRunner({ 
  formId, 
  initialSchema,
  initialData = {},
  intent = "General Consumer Issue",
  initialHistory = [], 
  organizationId
}: UnifiedRunnerProps) {
  const router = useRouter();
  
  const [schema, setSchema] = useState<any>(initialSchema || null);
  const [formTitle, setFormTitle] = useState<string>("Intake Assistant");
  const [loadingSchema, setLoadingSchema] = useState(!initialSchema);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  
  // Use a ref to track if we've initialized history to prevent strict mode dupes
  const historyInitialized = React.useRef(false);
  const [history, setHistory] = useState<ChatMessage[]>(initialHistory);
  const [textHistory, setTextHistory] = useState<SimpleMessage[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasoningStep, setReasoningStep] = useState(0); 
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  useEffect(() => {
      if (initialSchema) return;

      async function load() {
          try {
              const res = await fetch(`/api/intake/form/${formId}`);
              if (!res.ok) throw new Error(res.status === 404 ? "Form not found" : "Network error");
              
              const data = await res.json();
              if (data.name) setFormTitle(data.name);

              const normalized = normalizeSchema(data);
              
              if (!normalized.fields || normalized.fields.length === 0) {
                 throw new Error("Form has no fields.");
              }

              setSchema(normalized);
          } catch (e: any) {
              console.error("Load Error:", e);
              setLoadError(e.message || "Could not load intake form.");
          } finally {
              setLoadingSchema(false);
          }
      }
      load();
  }, [formId, initialSchema]);

  const STORAGE_KEY = `intake_draft_${formId}`;
  useEffect(() => {
    if (Object.keys(initialData).length === 0) {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { setFormData({ ...initialData, ...JSON.parse(saved) }); } catch (e) {}
        }
    }
  }, [formId, initialData]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setReasoningStep(1);
    
    try {
        const submitRes = await fetch(`/api/console/submit/${formId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: formData })
        });

        if (!submitRes.ok) throw new Error("Submission failed");
        const { submissionId } = await submitRes.json();
        
        localStorage.removeItem(STORAGE_KEY);
        setReasoningStep(2);

        const userStory = formData["descriptionOfIncident"] || 
                          formData["description"] || 
                          formData["what_happened"] || 
                          formData["details"];
        
        let effectiveIntent = "";
        if (userStory) {
            effectiveIntent = `Topic: ${formTitle || intent}. Client Situation: ${userStory}`;
        } else {
            effectiveIntent = `Legal Topic: ${formTitle || intent}`;
        }

        const stepInterval = setInterval(() => {
            setReasoningStep(prev => prev < 3 ? prev + 1 : prev);
        }, 2000);

        const assessRes = await fetch(`/api/console/submit/${formId}/assess`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                submissionId, 
                intent: effectiveIntent 
            })
        });

        clearInterval(stepInterval);
        
        if (!assessRes.ok) throw new Error("Assessment failed");
        const { verdict } = await assessRes.json();
        
        setReasoningStep(4);
        await new Promise(r => setTimeout(r, 800));
        setVerdict({
        ...verdict,
        analysis: { findings: [], ...verdict.analysis },
        });

        setVerdict(verdict);
        setIsSubmitting(false);

    } catch (e) {
        setIsSubmitting(false);
        setReasoningStep(0);
        console.error(e);
        alert("We saved your claim, but the AI analysis is busy. A lawyer will review it manually.");
    }
  };

  if (loadingSchema) {
      return (
          <div className="h-full w-full flex flex-col gap-4 items-center justify-center bg-slate-950">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-slate-400 text-sm animate-pulse">Loading Secure Form...</p>
          </div>
      );
  }

  if (loadError || !schema) {
      return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-slate-950 text-center p-8">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Form Unavailable</h2>
              <p className="text-slate-400 max-w-md mx-auto">{loadError}</p>
              <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-medium transition-colors">
                  Refresh Page
              </button>
          </div>
      );
  }

  if (verdict) {
    return (
      <div className="h-full w-full bg-slate-950 overflow-y-auto">
         <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    Assessment Complete
                </h1>
                <button onClick={() => router.push('/register')} className="px-5 py-2 bg-white text-slate-900 hover:bg-slate-200 rounded-lg font-bold text-sm transition-colors shadow-lg">
                    Create Account
                </button>
            </div>
                <VerdictCard
                verdict={verdict}
                title="Assessment Complete"
                onUrnClick={(urn) => {
                    // TODO: wire to your law viewer / modal
                    console.log("URN:", urn);
                }}
                />
         </div>
      </div>
    );
  }

  if (isSubmitting) {
      return (
        <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
             <div className="mb-10 text-center relative z-10">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 animate-pulse">
                    <Scale className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Case</h2>
                <p className="text-slate-400">Our AI Magistrate is reviewing your details against current laws.</p>
             </div>
             <ReasoningStepper currentStep={reasoningStep} />
        </div>
      );
  }

  return (
    <div className="flex flex-col md:flex-row h-[85vh] w-full bg-slate-950 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl relative">
      <div className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950 flex-none z-20">
         <div className="p-6 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50">
             <Shield className="w-4 h-4 text-indigo-500" />
             <h3 className="text-xs font-bold text-white uppercase tracking-wider">Secure Intake</h3>
         </div>
         {/* Sidebar safety check */}
         <div className="flex-1 overflow-y-auto custom-scrollbar">
             {schema && <SectionSidebar schema={schema} currentFieldKey={activeFieldKey} />}
         </div>
      </div>

      <div className="flex-1 relative flex flex-col h-full overflow-hidden bg-slate-950">
          <ChatRunner 
              formId={formId}
              formName={formTitle} 
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