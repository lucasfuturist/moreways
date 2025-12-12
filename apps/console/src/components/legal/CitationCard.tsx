"use client";

import React, { useState } from "react";
import { BookOpen, Scale, AlertTriangle, Loader2, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitationCardProps {
  idOrUrn: string;
  triggerText?: string;
  className?: string;
  // [NEW] Callback for parent
  onClick?: (urn: string) => void;
}

interface LegalNode {
  id: string;
  urn: string;
  structure_type: string;
  content_text: string;
  citation_path: string;
}

export function CitationCard({ idOrUrn, triggerText, className, onClick }: CitationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<LegalNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_LAW_ENGINE_URL || "http://localhost:3000/api/v1";

  const fetchNode = async () => {
    if (data || loading) return; 
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/node/${encodeURIComponent(idOrUrn)}`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json.data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
    fetchNode();
  };

  // [NEW] Click handler
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling
    setIsOpen(false); // Close the hover tooltip so it doesn't obstruct
    if (onClick) onClick(idOrUrn);
  };

  return (
    <span 
      className={cn("relative inline-block group", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsOpen(false)}
      onClick={handleClick}
    >
      <span className={cn(
        "cursor-pointer font-medium underline decoration-dotted decoration-2 underline-offset-4 transition-colors",
        "text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 rounded px-0.5 -mx-0.5"
      )}>
        {triggerText || idOrUrn}
      </span>

      {/* Hover Tooltip (Only shows if NOT clicked recently, managed by parent usually, but here we just rely on mouseLeave) */}
      {isOpen && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 z-50 origin-bottom animate-in zoom-in-95 fade-in duration-200 block pointer-events-none">
          <span className="block bg-slate-900 text-white rounded-lg shadow-xl overflow-hidden p-3">
            {loading ? (
               <span className="flex items-center gap-2 text-xs">
                 <Loader2 className="w-3 h-3 animate-spin" /> Loading preview...
               </span>
            ) : data ? (
                <span className="block">
                    <span className="flex items-center gap-2 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <MousePointerClick className="w-3 h-3" /> Click to Pin
                    </span>
                    <span className="block text-xs leading-relaxed line-clamp-3 opacity-90">
                        {data.content_text}
                    </span>
                </span>
            ) : null}
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-slate-900 transform rotate-45 block" />
        </span>
      )}
    </span>
  );
}