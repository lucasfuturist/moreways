"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function NotFound() {
  
  useEffect(() => {
    // [TRACKING] Fire 404 Event
    if (typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('custom', {
            event: 'error_404',
            path: window.location.pathname,
            referrer: document.referrer
        });
    }
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <h1 className="text-9xl font-bold text-slate-200 dark:text-slate-800">404</h1>
      <div className="absolute flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-8">The legal path you are looking for doesn't exist.</p>
        <Link href="/">
          <Button size="lg">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}