import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const issueCategories = [
  { title: "Used Car Defects", desc: "Undisclosed accidents, odometer rollback, or safety defects." },
  { title: "Contractor Disputes", desc: "Incomplete work, code violations, or abandonment of project." },
  { title: "Online Purchases", desc: "Items never delivered, wrong items sent, or refusal to refund." },
  { title: "Subscription Fraud", desc: "Hidden fees, unauthorized renewals, or impossible cancellation." },
  { title: "Illegal Towing", desc: "Excessive fees, predatory towing, or damage to vehicle." },
  { title: "Debt Harassment", desc: "Repeated calls, threats, or contacting your employer." },
  { title: "Insurance Bad Faith", desc: "Unreasonable delays or denial of legitimate claims." },
  { title: "Warranty Issues", desc: "Products that fail immediately or ignored warranty obligations." },
];

export default function Issues() {
  return (
    <div className="flex-1 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 font-heading text-slate-900 dark:text-white">Know Your Rights.</h1>
          <p className="text-xl text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
            Consumer protection laws are powerful, but only if you know when they apply. Here are the most common ways we help consumers win.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {issueCategories.map((cat, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{cat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground dark:text-slate-400">{cat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center bg-slate-50 dark:bg-slate-900/50 p-12 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Don't see your issue listed?</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            If a business treated you unfairly, it might still qualify. 
          </p>
          <Link href="/start">
            <Button>Check Eligibility for Free &rarr;</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}