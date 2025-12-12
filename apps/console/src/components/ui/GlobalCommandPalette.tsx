"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, FilePlus, Layout, Users, Settings } from "lucide-react";

export function GlobalCommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] animate-in fade-in duration-200">
      <Command className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
        
        {/* Input */}
        <div className="flex items-center border-b border-slate-200 dark:border-white/10 px-4">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-slate-500 dark:text-slate-400" />
          <Command.Input 
            placeholder="Type a command or search..." 
            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
          />
        </div>
        
        {/* List */}
        <Command.List className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
          <Command.Empty className="py-6 text-center text-sm text-slate-500">No results found.</Command.Empty>
          
          <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <CommandItem onSelect={() => run(() => router.push('/forms/new-from-prompt'))}>
              <FilePlus className="mr-2 h-4 w-4" /> Create New Form
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push('/crm'))}>
              <Users className="mr-2 h-4 w-4" /> Go to CRM
            </CommandItem>
          </Command.Group>

          <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-2">
            <CommandItem onSelect={() => run(() => router.push('/dashboard'))}>
              <Layout className="mr-2 h-4 w-4" /> Dashboard
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push('/settings'))}>
              <Settings className="mr-2 h-4 w-4" /> Organization Settings
            </CommandItem>
          </Command.Group>
        </Command.List>
        
        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-white/10 px-4 py-2 text-[10px] text-slate-400 flex justify-between bg-slate-50/50 dark:bg-black/20">
          <span>Open</span>
          <span className="font-mono bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">Cmd + K</span>
        </div>
      </Command>
    </div>
  );
}

function CommandItem({ children, onSelect }: { children: React.ReactNode, onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none data-[selected=true]:bg-indigo-600 data-[selected=true]:text-white text-slate-700 dark:text-slate-300 transition-colors"
    >
      {children}
    </Command.Item>
  );
}