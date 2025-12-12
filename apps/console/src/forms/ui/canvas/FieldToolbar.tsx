"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Languages, Trash2, Copy } from "lucide-react";
import { clsx } from "clsx";

interface FieldToolbarProps {
  field: any;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function FieldToolbar({ field, onUpdate, onDelete, onDuplicate }: FieldToolbarProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleMagic = async (operation: "polish" | "translate") => {
    setIsLoading(true);
    try {
        // Simulation for Night Ops Demo
        await new Promise(r => setTimeout(r, 600)); 
        
        if (operation === "polish") {
            onUpdate({ 
                title: "Please describe the incident details", 
                placeholder: "e.g., I was driving north on Main St..." 
            });
        } else if (operation === "translate") {
            onUpdate({ 
                description: `(Español: ${field.def.title}...)` 
            });
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      className="absolute -top-12 left-0 z-50 flex items-center gap-1 p-1 bg-white/90 dark:bg-violet-950/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-lg shadow-xl ring-1 ring-black/5 dark:ring-black/50"
      onClick={(e) => e.stopPropagation()} // Prevent selecting parent
    >
      <div className="flex items-center gap-1">
        <ToolbarButton 
            icon={<Wand2 className={clsx("w-3.5 h-3.5", isLoading && "animate-spin")} />} 
            label="Polish" 
            onClick={() => handleMagic("polish")} 
            active={isLoading}
        />
        <ToolbarButton 
            icon={<Languages className="w-3.5 h-3.5" />} 
            label="Translate" 
            onClick={() => handleMagic("translate")} 
        />
      </div>
      
      <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
      
      <div className="flex items-center gap-1">
        <ToolbarButton icon={<Copy className="w-3.5 h-3.5" />} onClick={onDuplicate} tooltip="Duplicate" />
        <ToolbarButton icon={<Trash2 className="w-3.5 h-3.5" />} onClick={onDelete} variant="danger" tooltip="Delete" />
      </div>
    </motion.div>
  );
}

function ToolbarButton({ icon, label, onClick, variant = "default", active, tooltip }: any) {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            title={tooltip}
            className={clsx(
                "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all",
                variant === "danger" 
                    ? "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" 
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10",
                active && "text-indigo-600 dark:text-teal-400 bg-indigo-50 dark:bg-teal-500/10"
            )}
        >
            {icon}
            {label && <span>{label}</span>}
        </button>
    )
}