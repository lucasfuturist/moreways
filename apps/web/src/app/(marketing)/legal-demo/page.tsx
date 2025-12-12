"use client";

import React from "react";
import { LegalResearchBot } from "@/components/LegalResearchBot";

export default function LegalDemoPage() {
  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col">
      {/* 
        Full Screen Container 
        No padding on mobile, standard padding on desktop for "App" feel 
      */}
      <div className="flex-1 flex overflow-hidden">
        <LegalResearchBot />
      </div>
    </div>
  );
}