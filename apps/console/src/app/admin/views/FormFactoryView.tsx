"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import { FormCard } from "@/forms/ui/dashboard/FormCard";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

// This component is the one actually being used by the /admin page.
// We are now adding the delete logic here.

interface FormFactoryViewProps {
  forms: any[];
  isLoading: boolean;
}

export function FormFactoryView({ forms: initialForms, isLoading }: FormFactoryViewProps) {
  const [forms, setForms] = useState(initialForms);
  const [query, setQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    setForms(initialForms);
  }, [initialForms]);

  const fuse = useMemo(() => new Fuse(forms, {
    keys: ["name"],
    threshold: 0.3,
  }), [forms]);

  const filteredForms = useMemo(() => {
    if (!query.trim()) return forms;
    return fuse.search(query).map((result) => result.item);
  }, [query, forms, fuse]);

  // This is the function that does the actual work
  const handleDeleteForm = async (formId: string, formName: string) => {
    if (!window.confirm(`Are you sure you want to delete the form "${formName}"? This action cannot be undone.`)) {
      return;
    }

    setForms(currentForms => currentForms.filter(form => form.id !== formId));

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to delete the form: ${errorData.error || 'Server error'}`);
        setForms(initialForms);
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      alert("An error occurred while deleting the form. Rolling back.");
      setForms(initialForms);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-slate-400">Loading forms...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search forms..."
          className="w-full max-w-sm bg-slate-800/50 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <AnimatePresence>
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {/* --- THIS IS THE NEW CARD --- */}
        <button
          onClick={() => router.push('/forms/new-from-prompt?context=admin')}
          className="group relative flex flex-col items-center justify-center text-center p-6 h-full min-h-[260px] rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500 hover:bg-indigo-950/30 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 rounded-full bg-slate-800 group-hover:bg-indigo-500 flex items-center justify-center transition-colors text-slate-500 group-hover:text-white mb-4">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-white">Create New Form</h3>
          <p className="text-xs text-slate-500 mt-1">Use the AI Architect to start a new intake form from scratch.</p>
        </button>

        {/* The existing map of forms comes after */}
        {filteredForms.map((form) => (
          <FormCard
            key={form.id}
            form={form}
            onDelete={() => handleDeleteForm(form.id, form.name)}
          />
        ))}
      </motion.div>
      </AnimatePresence>

      {!isLoading && filteredForms.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl mt-6">
          <p className="text-slate-500">
            {query ? "No forms match your search." : "You haven't created any forms yet."}
          </p>
        </div>
      )}
    </div>
  );
}