"use client";

import { useEffect } from "react";

interface IssueTrackerProps {
  slug: string;
  title: string;
}

export function IssueTracker({ slug, title }: IssueTrackerProps) {
  useEffect(() => {
    // [TRACKING] Fire Product View (ViewContent)
    // This tells ad algos: "User is interested in [Lemon Law], but hasn't converted yet."
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.track('view_content', {
        content_type: 'product', // Standard e-commerce type
        content_ids: [slug],     // The ID of the "Product"
        content_name: title,     // Human readable name
        content_category: 'legal_claim'
      });
      console.log(`[Pixel] Tracked ViewContent: ${title}`);
    }
  }, [slug, title]);

  return null; // Invisible component
}