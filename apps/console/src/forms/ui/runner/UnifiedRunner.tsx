"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Bug, Gavel } from "lucide-react";
import { ChatRunner, type ChatMessage, type SimpleMessage } from "./ChatRunner";
import { VerdictCard } from "./components/VerdictCard"; // [NEW] Import Verdict Card
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { Button } from "@/components/ui/Button";

interface UnifiedRunnerProps {
  formId: string;
  formName: string;
  schema: FormSchemaJsonShape;
}

export function UnifiedRunner({ formId, formName, schema }: UnifiedRunnerProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null); // [NEW] Store result

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [textHistory, setTextHistory] = useState<SimpleMessage[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = async () => {
    try {
        const res = await fetch(`/api/submit/${formId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: formData })
        });
        
        const json = await res.json();
        setSubmissionResult(json); // [NEW] Capture the response
        setIsSubmitted(true);

        // [NEW] Trigger Assessment if not included in submission
        if (json.submissionId && !json.verdict) {
             // Optional: Call /api/submit/[id]/assess here if we want async assessment
        }

    } catch (e) {
        alert("Something went wrong. Please try again.");
    }
  };

  // --- SUBMISSION SUCCESS VIEW ---
  if (isSubmitted) {
      return (
          <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 p-6 animate-in fade-in duration-500 overflow-y-auto">
              
              {/* [NEW] Show Verdict if available, else standard success */}
              {submissionResult?.verdict ? (
                  <div className="w-full max-w-2xl py-10">
                      <VerdictCard 
                        verdict={submissionResult.verdict} 
                        onReset={() => window.location.reload()} 
                      />
                  </div>
              ) : (
                  <div className="bg-slate-900 border border-white/10 p-10 rounded-3xl max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 blur-3xl pointer-events-none" />
                      <div className="relative z-10">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-500/20">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Submission Received</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">Thank you. Your information has been securely recorded.</p>
                        <Button variant="secondary" onClick={() => window.location.reload()} className="w-full h-12 text-sm">
                            Start New Form
                        </Button>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden">
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
  );
}