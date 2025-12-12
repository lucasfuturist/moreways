"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RouteObserver() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track last URL to prevent React strict mode double-firing
  const lastUrl = useRef("");

  useEffect(() => {
    // Wait for window to be available
    if (typeof window === "undefined") return;

    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    if (url === lastUrl.current) return;
    lastUrl.current = url;

    // Fire the event
    // We use a small timeout to ensure the Pixel has initialized
    setTimeout(() => {
      if (window.moreways) {
        window.moreways.track('pageview', {
          path: pathname,
          title: document.title,
          url: window.location.href
        });
      }
    }, 100);
    
  }, [pathname, searchParams]);

  return null;
}