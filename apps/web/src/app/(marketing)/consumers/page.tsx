import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Lock, Scale, Eye } from "lucide-react";

export default function ForConsumers() {
  return (
    <div className="flex flex-col">
      <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 font-heading text-slate-900 dark:text-white">Our Promise to Consumers</h1>
        <p className="text-xl text-muted-foreground dark:text-slate-400 leading-relaxed mb-8">
          The legal system is opaque. We built Moreways to be transparent. Here is exactly how we handle your data and your claim.
        </p>
      </div>

      <div className="py-16 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { icon: Eye, title: "100% transparent", desc: "We are not a law firm. We are a technology company that organizes data for law firms. We will never give you legal advice." },
            { icon: Lock, title: "No Data Selling", desc: "We are NOT a lead gen farm. We do not sell your data to marketers. Your data goes to one place: the attorney evaluating your case." },
            { icon: ShieldCheck, title: "Secure Handoff", desc: "Your claim details are encrypted. Only you and the reviewing attorney have access to the full file." },
            { icon: Scale, title: "No Obligation", desc: "Submitting a claim through Moreways creates no attorney-client relationship. You are free to walk away at any time." }
          ].map((item, i) => (
            <Card key={i} className="p-8 border-none shadow-md">
              <div className="w-12 h-12 bg-primary/10 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="py-20 text-center">
        <Link href="/start">
          <Button size="lg" className="px-8 py-6 text-lg">Check Your Eligibility</Button>
        </Link>
      </div>
    </div>
  );
}