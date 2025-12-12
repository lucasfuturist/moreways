// src/app/(intake)/start/page.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatInterface from "@/components/ChatInterface";
import { UnifiedRunner } from "@/components/runner/UnifiedRunner";
import { PublicFormResponse } from "@/lib/types/argueos-types";

export default function StartClaim() {
  const [form, setForm] = useState<PublicFormResponse | null>(null);

  const handleFormRouted = (routedForm: PublicFormResponse) => {
    setForm(routedForm);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {!form && (
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-4 font-heading text-slate-900 dark:text-white">
                Free Claim Assessment
              </h1>
              <p className="text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
                Our Intake Assistant will ask you a few questions to see if your situation meets the criteria for legal action. This is confidential and free.
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!form ? (
              <motion.div
                key="router"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ChatInterface onFormRouted={handleFormRouted} />
              </motion.div>
            ) : (
              <motion.div
                key="agent"
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-[85dvh] md:h-auto"
              >
                <UnifiedRunner
                  formId={form.id}
                  organizationId={form.organizationId}
                  schema={form.schema}
                  intent={form.title}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!form && (
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground dark:text-slate-500">
                💡 <strong>Tip:</strong> Be specific about dates, dollar amounts, and what was promised vs. delivered.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}