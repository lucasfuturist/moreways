import React, { useState, useMemo } from "react";
import { clsx } from "clsx";
import { LayoutGrid, Type, ListChecks, Calendar, Box, X, Search } from "lucide-react";
import { ELEMENT_CATALOG, type ElementCatalogItem, type ElementCategory } from "@/forms/schema/forms.schema.ElementCatalog";

interface ElementInventoryProps {
  onAdd: (item: ElementCatalogItem) => void;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<ElementCategory, string> = {
  basic_input: "Inputs", 
  selection: "Selection", 
  temporal: "Date/Time", 
  structural: "Layout", 
  smart_block: "Smart",
};

export function ElementInventory({ onAdd, onClose }: ElementInventoryProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    const lowerSearch = search.toLowerCase().trim();
    return ELEMENT_CATALOG.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) return false;
      if (lowerSearch) {
        return item.label.toLowerCase().includes(lowerSearch) || item.tags.some(t => t.includes(lowerSearch));
      }
      return true;
    });
  }, [search, activeCategory]);

  const groupedItems = useMemo(() => {
    const groups: Partial<Record<ElementCategory, ElementCatalogItem[]>> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category]?.push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <div className="flex flex-col h-full bg-transparent transition-colors duration-300">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-200/50 dark:border-white/5 space-y-4 flex-none bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 tracking-widest uppercase flex items-center gap-2">
                <Box className="w-4 h-4" /> Elements
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full">
                <X className="w-4 h-4" />
            </button>
        </div>
        
        {/* Search */}
        <div className="relative group">
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search elements..." 
            className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none shadow-sm" 
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>

        {/* Categories (Pill Selectors) */}
        {/* [FIX] Added custom-scrollbar, removed no-scrollbar, increased pb-3, added mb-1 for spacing */}
        <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-3 mb-1">
          {["all", "basic_input", "selection", "structural"].map(cat => (
            <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={clsx(
                    "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap transition-all border",
                    activeCategory === cat 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20" 
                        : "bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                )}
            >
              {cat === "all" ? "All" : CATEGORY_LABELS[cat as ElementCategory] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 custom-scrollbar">
        {Object.entries(groupedItems).map(([cat, items]) => (
          <div key={cat} className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 pl-1 flex items-center gap-2">
                {cat === 'basic_input' && <Type className="w-3 h-3" />}
                {cat === 'selection' && <ListChecks className="w-3 h-3" />}
                {cat === 'temporal' && <Calendar className="w-3 h-3" />}
                {cat === 'structural' && <LayoutGrid className="w-3 h-3" />}
                {CATEGORY_LABELS[cat as ElementCategory]}
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {items?.map((item) => (
                <button 
                    key={item.id} 
                    onClick={() => onAdd(item)} 
                    className="flex flex-col items-start p-3.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-indigo-500/30 hover:shadow-lg transition-all group text-left relative overflow-hidden"
                >
                   {/* Hover Gradient */}
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                   
                   <div className="flex justify-between w-full relative z-10">
                       <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.label}</span>
                       <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 -translate-x-2 group-hover:translate-x-0 duration-300">
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                       </span>
                   </div>
                   <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 relative z-10">{item.description}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {filteredItems.length === 0 && (
            <div className="text-center py-12 opacity-50">
                <p className="text-sm text-slate-500 font-medium">No matching elements</p>
            </div>
        )}
      </div>
    </div>
  );
}