import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <div className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center font-heading text-slate-900 dark:text-white">
          From Incident to Attorney Review.
        </h1>
        <p className="text-xl text-center text-slate-500 dark:text-slate-400 mb-16">
          We bridge the gap between "I think I was wronged" and "I have a legal case."
        </p>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
          {[
            { 
              title: "1. Structured Intake", 
              text: "You chat with our Intake Assistant. It's designed to ask the exact questions a paralegal would ask during a consultation—without the hourly rate." 
            },
            { 
              title: "2. Claim Organization", 
              text: "Our system compiles your answers into a standardized legal brief. We flag key details like dates, contract violations, and monetary damages." 
            },
            { 
              title: "3. Verification & Handoff", 
              text: "You create a secure account to verify your identity. This ensures we only send legitimate, verified claims to our partners." 
            },
            { 
              title: "4. Attorney Decision", 
              text: "Your organized file is securely routed to a partner firm specializing in your issue. They review it and contact you directly if they can help." 
            }
          ].map((step, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="font-bold text-slate-600 dark:text-slate-300">{i + 1}</span>
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white dark:bg-slate-900/50 border dark:border-slate-800 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-2">Why is this free?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">
            Law firms spend huge amounts of time filtering through unorganized emails. They pay Moreways to receive clean, organized, and verified files. You never pay us a dime.
          </p>
          <Link href="/start">
            <Button size="lg" className="px-8 py-6 text-lg">Start Free Assessment</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}