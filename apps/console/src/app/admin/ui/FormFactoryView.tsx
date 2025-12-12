"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation"; // Used for navigation
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import Fuse from "fuse.js";
import { FormCard } from "@/forms/ui/dashboard/FormCard";

interface FormFactoryViewProps {
  forms: any[];
  isLoading: boolean;
}

export function FormFactoryView({ forms, isLoading }: FormFactoryViewProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredForms = useMemo(() => {
    if (!search.trim()) return forms;
    const fuse = new Fuse(forms, { keys: ["name", "id"], threshold: 0.3 });
    return fuse.search(search).map(r => r.item);
  }, [forms, search]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Master Templates</h2>
        <div className="relative group w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
          <input 
            type="text" placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-rose-500 transition-all outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1,2].map(i => <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* [NEW] The Create Card is now the first item in the grid */}
          <button 
                onClick={() => router.push('/forms/new-from-prompt')}
                className="group relative h-full min-h-[200px] rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-rose-500/30 transition-all duration-300 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95"
            >
                <div className="w-14 h-14 rounded-full bg-white/5 group-hover:bg-rose-600 group-hover:scale-110 group-hover:text-white text-slate-500 flex items-center justify-center transition-all duration-300 shadow-lg border border-white/5">
                    <Plus className="w-7 h-7" />
                </div>
                <div className="text-center">
                    <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">Create New Template</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-[150px] mx-auto">Use AI to generate a master intake form.</p>
                </div>
          </button>

          {/* Existing Forms */}
          {filteredForms.map(form => (
            <motion.div layout key={form.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <FormCard form={form} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}