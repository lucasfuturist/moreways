import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 font-heading text-slate-900 dark:text-white">The Moreways Mission</h1>
      
      <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          <strong>Consumer protection laws exist, but accessing them is too hard.</strong>
        </p>
        <p>
          Most people don't know that "Unfair and Deceptive Acts" are illegal under state law. Even if they do, finding a lawyer who will listen to a specific case is daunting. Phone tag, consultation fees, and confusing jargon stop justice before it starts.
        </p>
        <p>
          Moreways was built to fix the "intake problem." 
        </p>
        <p>
          By using technology to structure claims <em>before</em> they reach a lawyer, we make it profitable for firms to review more cases, faster. This means more people get their day in court (or a settlement), and fewer businesses get away with unfair practices.
        </p>
      </div>

      <Card className="p-8 mt-12 bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-500/20">
        <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">We are on your side.</h3>
        <p className="text-indigo-800 dark:text-indigo-200">
          Our success is defined by how many legitimate claims we can successfully route to counsel. If you have been wronged, we want to help you prove it.
        </p>
      </Card>
    </div>
  );
}