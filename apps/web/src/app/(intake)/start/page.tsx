"use client";

import { UnifiedRunner } from "@/components/runner/UnifiedRunner";

export default function StartClaim() {
  const DEMO_FORM_ID = "mizl5m2m000113pquu2rfqjp";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <UnifiedRunner 
            formId={DEMO_FORM_ID} 
            // [CHANGE] Generic intent. The Runner will now upgrade this 
            // using the user's actual answers before asking the Magistrate.
            intent="General Legal Complaint"
        />
      </div>
    </div>
  );
}