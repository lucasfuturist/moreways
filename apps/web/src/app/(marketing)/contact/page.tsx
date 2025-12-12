"use client";

import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function Contact() {
  
  const handleContactClick = (type: string) => {
    if (typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('contact', { 
            method: 'email', 
            contact_type: type 
        });
    }
  };

  return (
    <div className="py-20 px-4 sm:px-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 font-heading text-slate-900 dark:text-white">Contact Us</h1>
      <div className="space-y-4">
        {[
          { title: "General Inquiries", email: "info@moreways.io", type: "general" },
          { title: "Partnerships (Law Firms)", email: "partners@moreways.io", type: "partnership" },
          { title: "Support", email: "support@moreways.io", type: "support" }
        ].map((c, i) => (
          <Card key={i} className="p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Mail className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{c.title}</h3>
              <a 
                href={`mailto:${c.email}`} 
                className="text-primary hover:underline"
                onClick={() => handleContactClick(c.type)}
              >
                {c.email}
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}