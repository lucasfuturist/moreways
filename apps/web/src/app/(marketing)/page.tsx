"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, FileText, Lock, Scale } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrappers";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    // [TRACKING] Fire Initiate Checkout
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.track('initiate_checkout', { 
        content_name: 'Intake Assessment',
        location: 'Homepage Hero',
        currency: 'USD',
        value: 0
      });
    }
    // Navigate Programmatically
    router.push('/start');
  };

  return (
    <div className="flex flex-col">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-10 relative z-20">
            <h1 className="text-6xl sm:text-8xl font-bold text-slate-900 dark:text-white font-heading tracking-tighter leading-[0.9]">
              <motion.span
                initial={{ opacity: 0, y: 70, filter: "blur(20px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                className="inline-block"
              >
                More ways
              </motion.span>
              <br className="sm:hidden" />
              <span className="hidden sm:inline">&nbsp;</span>
              <motion.span
                initial={{ opacity: 0, y: 70, filter: "blur(20px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
              >
                to win.
              </motion.span>
            </h1>
          </div>
          
          <FadeIn delay={1.0} className="flex justify-center mb-10">
            <div className="relative inline-flex h-8 overflow-hidden rounded-full p-[1px] shadow-lg shadow-indigo-500/20">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-default items-center justify-center rounded-full bg-slate-950/90 px-4 py-1 text-xs font-medium text-slate-300 backdrop-blur-3xl">
                Consumer protection for the modern era
              </span>
            </div>
          </FadeIn>
          
          <FadeIn delay={1.2}>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              We evaluate your case and route you to trusted attorneys who fight back when businesses treat you unfairly.
              <br/><span className="font-medium text-slate-900 dark:text-white">Totally free. 100% transparent.</span>
            </p>
          </FadeIn>
          
          <StaggerContainer delay={1.4} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <StaggerItem>
              <ShimmerButton className="shadow-2xl shadow-blue-900/20" onClick={handleStart}>
                Start Free Assessment <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </ShimmerButton>
            </StaggerItem>
            <StaggerItem>
              <Link href="/how-it-works">
                <MagneticButton variant="outline" className="border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-white/5 backdrop-blur-sm dark:text-white dark:hover:bg-white/10">
                  Our Process
                </MagneticButton>
              </Link>
            </StaggerItem>
          </StaggerContainer>
          
          <FadeIn delay={1.8}>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-medium opacity-60">
              Your data is never sold. Shared only with legal partners.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 relative z-10">
         <StaggerContainer className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Standardized Intake", text: "We ask the specific questions attorneys need answered to evaluate your case." },
            { title: "Document Organization", text: "Upload evidence securely so your file is ready for professional review." },
            { title: "Licensed Partners", text: "We work exclusively with vetted consumer protection law firms." },
            { title: "Zero Cost to You", text: "Our platform is free for consumers. Attorneys pay us for organized files." }
          ].map((item, i) => (
            <StaggerItem key={i} className="h-full">
              <SpotlightCard className="p-8 h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-white/60 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-none">
                <div className="w-12 h-12 bg-indigo-50/80 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100/50 dark:border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{item.text}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="py-32 bg-slate-950 text-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[400px] md:h-[600px] bg-indigo-600/10 md:bg-indigo-600/20 rounded-full blur-[60px] md:blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 font-heading text-white">Cases We Help With</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                We focus on documented financial harm and specific consumer-protection violations.
              </p>
            </div>
          </FadeIn>
          
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
            {[
              "Used Car Defects", "Contractor Disputes",
              "Undelivered Goods", "Subscription Fraud",
              "Illegal Towing", "Debt Harassment",
              "Warranty Denials", "Insurance Bad Faith"
            ].map((issue, i) => (
              <StaggerItem key={i}>
                <div className="flex items-center gap-4 p-5 bg-slate-900/80 md:bg-slate-900/40 md:backdrop-blur-sm transition-all duration-300 rounded-2xl border border-slate-800 md:hover:bg-slate-800/80 md:hover:border-indigo-500/50 group cursor-default md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:shadow-indigo-500/10">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 group-hover:shadow-[0_0_12px_rgba(99,102,241,1)] transition-all flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{issue}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          <FadeIn delay={0.4} className="text-center">
            <Link href="/issues">
              <Button variant="outline" className="text-slate-300 border-slate-800 bg-transparent hover:bg-white hover:text-slate-900 rounded-full px-8 h-12 transition-all duration-300">
                See Qualification Criteria <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="py-32 px-4 sm:px-6">
         <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-5xl font-bold text-center mb-20 font-heading text-slate-900 dark:text-white">How It Works</h2>
          </FadeIn>
          
          <StaggerContainer className="grid gap-8">
            {[
              { step: 1, icon: Lock, title: "1. Secure Intake", desc: "Describe your situation in our secure portal. We determine if it meets legal criteria." },
              { step: 2, icon: FileText, title: "2. Prepare File", desc: "Our system structures your claim into a legal format that attorneys can review quickly." },
              { step: 3, icon: Scale, title: "3. Attorney Review", desc: "We submit your organized file to a partner firm. If accepted, they contact you directly." }
            ].map((s, i) => (
              <StaggerItem key={i}>
                <div className="flex gap-8 items-start md:items-center group p-8 rounded-3xl hover:bg-white/60 dark:hover:bg-slate-900/60 hover:backdrop-blur-xl hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-white/50 dark:hover:border-white/10 border border-transparent transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center flex-shrink-0 font-bold text-2xl text-slate-900 dark:text-white border border-slate-50 dark:border-slate-700 group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
                     <span className="relative z-10">{s.step}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.title}</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">{s.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.4} className="mt-20 text-center">
            <MagneticButton variant="primary" className="shadow-xl" onClick={handleStart}>
              Start Free Assessment
            </MagneticButton>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border-t border-white/20 dark:border-white/5">
        <FadeIn className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 font-heading text-slate-900 dark:text-white">Not a law firm. Better access.</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-lg">
            Moreways is a legal technology platform. We do not provide legal advice. We provide the infrastructure to connect consumers with rights to attorneys who can enforce them.
          </p>
          <Link href="/about">
            <Button variant="link" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 text-lg">Read our Transparency Pledge &rarr;</Button>
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}