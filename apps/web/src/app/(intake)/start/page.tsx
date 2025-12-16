"use client";

import { IntakeOrchestrator } from "@/components/runner/IntakeOrchestrator";

export default function StartClaimPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <IntakeOrchestrator 
            initialMessage="I can help you file a formal consumer complaint. Select a topic below, or briefly describe what happened." 
        />
      </div>
    </div>
  );
}