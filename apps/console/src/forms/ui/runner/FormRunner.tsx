"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { Button } from "@/components/ui/Button";

interface FormRunnerProps {
  formId: string;
  formName: string;
  schema: FormSchemaJsonShape;
}

type FormValues = Record<string, any>;

export function FormRunner({ formId, formName, schema }: FormRunnerProps) {
  const [step, setStep] = useState<"welcome" | "form" | "success">("welcome");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    
    // [SECURITY] Extract the honeypot value separately
    const honeypot = data._hp_trap;
    // Remove it from the actual submission data so it doesn't pollute the CRM
    delete data._hp_trap;

    try {
        const res = await fetch(`/api/submit/${formId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // [SECURITY] Send payload matching API expectation
            body: JSON.stringify({ 
                data, 
                _hp: honeypot // The trap value
            }),
        });
        
        if (!res.ok) throw new Error("Submission failed");
        
        setStep("success");
    } catch (err) {
        alert("Error submitting form. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderField = (key: string, field: any) => {
    // ... existing render logic ...
    // (copy your existing renderField implementation here)
    const inputClass = "block w-full rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition-all text-slate-900 placeholder-slate-400";
    const isRequired = (schema.required || []).includes(key);

    return (
      <div key={key} className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500">
         {field.kind !== 'header' && field.kind !== 'info' && (
             <label htmlFor={key} className="block text-sm font-semibold text-slate-700">
               {field.title} {isRequired && <span className="text-red-500">*</span>}
             </label>
         )}
         
         {field.kind === 'header' && <h2 className="text-xl font-bold text-slate-800 mt-6 mb-2">{field.title}</h2>}
         {field.kind === 'info' && <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-md border border-slate-100">{field.description}</p>}
         
         {/* Simplified renderer for brevity - assume full logic is here */}
         {(field.kind === 'text' || field.kind === 'email' || field.kind === 'phone') && (
             <input {...register(key, { required: isRequired })} className={inputClass} placeholder={field.placeholder || "Your answer..."} />
         )}
         {/* ... other types ... */}
      </div>
    );
  };

  const fieldKeys = schema.order || Object.keys(schema.properties);

  if (step === "welcome") {
    // ... existing welcome ...
    return <div className="p-10 text-center"><Button onClick={() => setStep("form")}>Start</Button></div>;
  }

  if (step === "success") {
    // ... existing success ...
    return <div className="p-10 text-center">Success</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen sm:min-h-0 sm:rounded-2xl sm:shadow-2xl sm:my-10 overflow-hidden flex flex-col">
       <div className="h-2 bg-blue-600 w-full" />
       <div className="p-6 sm:p-10 space-y-8 flex-1">
          <div>
             <h1 className="text-xl font-bold text-slate-900">{formName}</h1>
             <p className="text-sm text-slate-400 uppercase tracking-wider font-medium mt-1">Secure Intake</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
             {fieldKeys.map(key => renderField(key, schema.properties[key]))}
             
             {/* [SECURITY] The Honeypot Trap 
                 - opacity-0 and absolute positioning removes it from visual flow
                 - tabIndex=-1 prevents keyboard users from accidentally focusing it
                 - autoComplete="off" prevents browser autofill
             */}
             <div className="opacity-0 absolute top-0 left-0 h-0 w-0 overflow-hidden -z-10">
                <label htmlFor="_hp_trap">Do not fill this field</label>
                <input 
                    id="_hp_trap"
                    {...register("_hp_trap")} 
                    tabIndex={-1} 
                    autoComplete="off" 
                />
             </div>

             <div className="pt-8 border-t border-slate-100">
                <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 text-base" isLoading={isSubmitting}>
                    Submit Information
                </Button>
             </div>
          </form>
       </div>
    </div>
  );
}