// src/intake/ui/intake.ui.FormSchemaPreview.tsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { clsx } from "clsx";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { SimulatorOverlay } from "@/forms/ui/simulator/SimulatorOverlay";
import { Button } from "@/components/ui/Button";

interface FormSchemaPreviewProps {
  schema: FormSchemaJsonShape | null;
  formId?: string | null;
}

type FormValues = Record<string, any>;

// --- Custom Glass Select Component ---
function GlassSelect({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select...", 
  error 
}: { 
  value: any; 
  onChange: (val: any) => void; 
  options: any[]; 
  placeholder?: string; 
  error?: boolean; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedOption = options.find(o => (typeof o === 'string' ? o : o.value) === value);
  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label) 
    : null;

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full cursor-pointer flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all duration-200 select-none",
          "bg-white dark:bg-black/20",
          error 
            ? "border-red-300 focus:border-red-500 ring-1 ring-red-500/20" 
            : isOpen 
              ? "border-indigo-500 ring-1 ring-indigo-500 shadow-sm" 
              : "border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-white/20 shadow-sm",
          "text-sm"
        )}
      >
        <span className={clsx(displayLabel ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500")}>
          {displayLabel || placeholder}
        </span>
        <ChevronDown 
          className={clsx(
            "w-4 h-4 text-slate-400 transition-transform duration-300", 
            isOpen && "rotate-180 text-indigo-500"
          )} 
        />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 z-50 max-h-64 overflow-y-auto rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl custom-scrollbar p-1.5 origin-top"
          >
            {options.length === 0 ? (
                <div className="px-3 py-8 text-center text-xs text-slate-400 italic">No options available</div>
            ) : (
                options.map((opt, idx) => {
                    const val = typeof opt === 'string' ? opt : opt.value;
                    const label = typeof opt === 'string' ? opt : opt.label;
                    const isSelected = val === value;
                    const key = val || `opt-${idx}`;

                    return (
                        <div
                            key={key}
                            onClick={() => { onChange(val); setIsOpen(false); }}
                            className={clsx(
                                "px-3 py-2.5 rounded-lg text-sm cursor-pointer flex items-center justify-between transition-all",
                                isSelected
                                    ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-medium"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                            )}
                        >
                            {label}
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                        </div>
                    );
                })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FormSchemaPreview({ schema, formId }: FormSchemaPreviewProps) {
  // [FIX] Added 'watch' to useForm so we can control the custom select
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { if (schema) reset(); }, [schema, reset]);

  if (!schema) {
    return <div className="flex items-center justify-center h-64 border border-dashed border-slate-300 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-500">Form preview will appear here</div>;
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!formId) {
        alert("Simulation Only: Form ID not found (Save the form to submit real data).");
        return;
    }

    setIsSubmitting(true);
    try {
        const res = await fetch(`/api/submit/${formId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
        });

        if (!res.ok) throw new Error("Submission failed");
        
        alert("Success! Submission saved to CRM.");
        reset();
    } catch (err) {
        console.error(err);
        alert("Error submitting form.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const fields = schema.order && schema.order.length > 0 
    ? schema.order.map((k: string) => ({ key: k, def: schema.properties[k] })).filter((f: any) => f.def)
    : Object.entries(schema.properties).map(([key, def]) => ({ key, def }));
  
  const requiredFields = new Set(schema.required || []);
  
  // Base Input Styles
  const inputClass = "block w-full rounded-lg border-slate-200 dark:border-white/10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all text-slate-900 dark:text-white bg-white dark:bg-black/20 placeholder-slate-400 dark:placeholder-slate-500 px-4 py-2.5";

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden h-full flex flex-col transition-colors duration-500">
      
      {/* Header */}
      <div className="bg-slate-50 dark:bg-white/5 px-8 py-6 border-b border-slate-200 dark:border-white/5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Intake Form</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Please complete all required fields.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-900 transition-colors duration-500">
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields.map(({ key, def: field }: any) => {
                const isRequired = requiredFields.has(key);

                if (field.kind === 'header') {
                    return <h3 key={key} className="text-lg font-bold text-slate-900 dark:text-white pt-4 border-b border-slate-200 dark:border-white/10 pb-2">{field.title}</h3>;
                }

                return (
                <div key={key} className="flex flex-col gap-1.5 group">
                    <label htmlFor={key} className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    {field.title}
                    {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    {field.description && <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">{field.description}</span>}

                    {field.kind === "textarea" ? (
                        <textarea id={key} rows={3} className={clsx(inputClass, errors[key] && "border-red-300 focus:border-red-500 focus:ring-red-500")} {...register(key, { required: isRequired })} />
                    ) : field.kind === "select" ? (
                        // [FIX] Replaced native <select> with <GlassSelect>
                        // We use a hidden input to maintain React Hook Form registration requirements
                        <>
                            <input type="hidden" {...register(key, { required: isRequired })} />
                            <GlassSelect 
                                value={watch(key)} // Watch current value for controlled state
                                onChange={(val) => setValue(key, val, { shouldValidate: true })}
                                options={field.options || []}
                                placeholder={field.placeholder || "Select an option..."}
                                error={!!errors[key]}
                            />
                        </>
                    ) : field.kind === "checkbox" ? (
                        <div className="flex items-center h-6 mt-2">
                            <input id={key} type="checkbox" className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-black/20" {...register(key, { required: isRequired })} />
                            <span className="ml-3 text-sm text-slate-600 dark:text-slate-300">Yes / Confirm</span>
                        </div>
                    ) : (
                        <input id={key} type={field.kind === "date" ? "date" : "text"} className={inputClass} {...register(key, { required: isRequired })} />
                    )}
                </div>
                );
            })}
            <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-8">
                <Button type="submit" isLoading={isSubmitting} className="w-full rounded-xl bg-slate-900 dark:bg-white py-4 px-4 text-sm font-bold text-white dark:text-slate-900 shadow-lg hover:shadow-xl focus:outline-none transition-transform active:scale-[0.98]">
                    Submit Form
                </Button>
            </div>
            </form>

            <SimulatorOverlay schema={schema} onReset={() => reset()} onSimulateField={(key: string, val: any) => setValue(key, val, { shouldValidate: true })} />
        </div>
      </div>
    </div>
  );
}