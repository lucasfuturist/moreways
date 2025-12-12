"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Check, ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "number";
  required?: boolean;
}

interface AutoFormProps {
  issueId: string;
  fields: FormField[];
}

export function AutoForm({ issueId, fields }: AutoFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for back
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const currentField = fields[step];
  const isLastStep = step === fields.length - 1;
  const progress = ((step + 1) / fields.length) * 100;

  // Auto-focus input on step change
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, [step]);

  const handleNext = () => {
    const val = formData[currentField.id];
    if (currentField.required && !val) {
        // Shake animation logic could go here
        return;
    }
    
    if (isLastStep) {
      submitForm();
    } else {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/intake/submit", {
        method: "POST",
        body: JSON.stringify({ issueId, data: formData }),
      });
      if (res.ok) router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (val: string) => {
    setFormData(prev => ({ ...prev, [currentField.id]: val }));
  };

  return (
    <div className="w-full max-w-lg mx-auto min-h-[400px] flex flex-col">
      
      {/* Progress Bar (The "Pulse") */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <span>Question {step + 1} of {fields.length}</span>
            <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "circOut" }}
            />
        </div>
      </div>

      {/* The Question Card */}
      <div className="relative flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction > 0 ? 50 : -50, opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ x: direction > 0 ? -50 : 50, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-6"
          >
            {/* Label */}
            {/* UPDATED: Dark mode text */}
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
              {currentField.label}
              {currentField.required && <span className="text-indigo-400 ml-1">*</span>}
            </h2>

            {/* Input Area */}
            <div className="group relative">
                {currentField.type === "textarea" ? (
                    <Textarea
                        ref={inputRef as any}
                        value={formData[currentField.id] || ""}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={(e) => {
                            // Allow Shift+Enter for newlines, Enter for submit
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleNext();
                            }
                        }}
                        placeholder="Type your answer here..."
                        // UPDATED: Added dark:text-white and dark:border-slate-700
                        className="min-h-[150px] text-xl bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-700 rounded-none px-0 py-4 focus-visible:ring-0 focus-visible:border-indigo-600 placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none transition-colors text-slate-900 dark:text-white"
                    />
                ) : (
                    <Input
                        ref={inputRef as any}
                        type={currentField.type}
                        value={formData[currentField.id] || ""}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type here..."
                        // UPDATED: Added dark:text-white and dark:border-slate-700
                        className="text-2xl bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-700 rounded-none px-0 py-4 h-auto focus-visible:ring-0 focus-visible:border-indigo-600 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors text-slate-900 dark:text-white"
                    />
                )}
                
                {/* Enter Hint */}
                <div className="absolute right-0 bottom-4 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity flex items-center gap-2 text-xs font-bold text-slate-300 dark:text-slate-500 uppercase tracking-widest">
                    Press Enter <span className="border border-slate-300 dark:border-slate-600 rounded px-1 py-0.5">↵</span>
                </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center justify-between">
        <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0 || loading}
            // UPDATED: Dark mode hover text
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Button 
            onClick={handleNext} 
            disabled={loading}
            className={cn(
                "rounded-full px-8 h-12 text-base shadow-xl transition-all",
                isLastStep 
                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30" 
                    : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            )}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLastStep ? (
                <>Submit Claim <Check className="w-4 h-4 ml-2" /></>
            ) : (
                <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
        </Button>
      </div>
    </div>
  );
}