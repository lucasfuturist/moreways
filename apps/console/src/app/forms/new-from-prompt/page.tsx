"use client";

import React, { Suspense } from "react";
import FormFromPromptPage from "@/intake/ui/intake.ui.FormFromPromptPage";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    // [CRITICAL FIX] Wrap in Suspense to handle useSearchParams() during build
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Editor...
      </div>
    }>
      <FormFromPromptPage />
    </Suspense>
  );
}