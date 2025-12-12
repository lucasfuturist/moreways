"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { consumerIssues } from "@/content/data/consumerIssues";
import { Scale, X } from "lucide-react";

export function StandardComplaintsFab() {
  const [open, setOpen] = useState(false);

  const handleOpen = (newState: boolean) => {
    setOpen(newState);
    if (newState && typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('custom', { event: 'fab_opened', location: 'global_footer' });
    }
  };

  const handleSelectIssue = (issueId: string) => {
    setOpen(false);
    if (typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('view_content', { 
            content_type: 'legal_issue_direct_select',
            content_id: issueId,
            location: 'fab_menu'
        });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in duration-300">
      <Popover open={open} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>
          <Button 
            className="rounded-full h-14 w-14 shadow-2xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white border border-slate-700/50 p-0 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            {open ? (
              <X className="w-6 h-6" />
            ) : (
              <Scale className="w-6 h-6" />
            )}
            <span className="sr-only">Standard Complaints</span>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          side="top" 
          align="end" 
          sideOffset={16} 
          className="w-80 p-0 rounded-xl overflow-hidden shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <div className="bg-slate-50 dark:bg-slate-950/50 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-heading font-semibold text-sm text-slate-700 dark:text-slate-200">
              Select an Issue
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose a category to start your claim immediately.
            </p>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto p-2">
            <div className="grid gap-1">
              {consumerIssues.map((issue) => {
                const Icon = issue.icon;
                return (
                  <Link 
                    key={issue.id} 
                    href={`/issue/${issue.id}`}
                    onClick={() => handleSelectIssue(issue.id)}
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                      <div className="mt-1 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {issue.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {issue.shortDescription}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link href="/start" onClick={() => setOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full text-xs h-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Or verify with Intake Assistant &rarr;
              </Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}