"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  
  useEffect(() => {
    // [TRACKING] Log the Crash
    console.error("Global Error Boundary caught:", error);
    
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.track('custom', {
        event: 'app_crash',
        error_message: error.message,
        error_digest: error.digest || 'unknown',
        location: window.location.pathname
      });
    }
  }, [error]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Something went wrong.
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
        We encountered an unexpected error. Our engineering team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Go Home
        </Button>
        <Button onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}