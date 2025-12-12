import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="relative mt-auto z-10 bg-slate-950 text-slate-200 border-t border-white/5 dark:border-white/10">
      
      {/* Top Glow Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(56,58,161,0.15),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white font-heading tracking-tight">Moreways</h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed max-w-xs">
                Organizing the world's consumer claims. We connect people who have been wronged with attorneys who can help.
              </p>
            </div>
            
            {/* UPDATED: Prominent CTA under description */}
            <Link href="/start" className="inline-block">
              <Button className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-8 py-6 font-bold shadow-lg shadow-white/5 transition-all hover:scale-105 hover:shadow-white/20">
                Start Free Assessment
              </Button>
            </Link>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/consumers" className="hover:text-indigo-400 transition-colors">For Consumers</Link></li>
              <li><Link href="/how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</Link></li>
              <li><Link href="/start" className="hover:text-indigo-400 transition-colors">Check Eligibility</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/for-law-firms" className="hover:text-indigo-400 transition-colors">Partner Program</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-mono">
            SECURE ENCRYPTED CONNECTION
          </p>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Moreways Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}