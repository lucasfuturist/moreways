"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForLawFirms() {
  
  useEffect(() => {
    // [TRACKING] Fire B2B View Content
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.track('view_content', {
        content_type: 'b2b_landing',
        audience: 'attorney',
        content_name: 'Partner Program Info'
      });
    }
  }, []);

  return (
    <div className="py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 font-heading text-slate-900 dark:text-white">
          Receive fully briefed,<br />verified case files.
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Stop chasing unverified leads. Moreways handles the intake, document collection, and identity verification before the file ever hits your desk.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
        {[
          { title: "Standardized Briefs", text: "Every submission arrives as a structured legal memo with timeline, damages, and key facts extracted." },
          { title: "Identity Verified", text: "We require phone verification and account creation, filtering out spam and low-intent inquiries." },
          { title: "Document Collection", text: "Users upload contracts, invoices, and photos directly into the secure portal before you review." },
          { title: "Custom Criteria", text: "We tailor the intake questions to match your firm’s specific qualification requirements." },
          { title: "Secure Handoff", text: "Encrypted transfer of client data directly into your case management workflow." }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{item.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/contact">
          <Button size="lg" className="px-8">Become a Partner Firm</Button>
        </Link>
      </div>
    </div>
  );
}