import { authService } from "@/auth/svc/auth.service";
import { portalRepo } from "@/portal/repo/portal.repo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, ArrowRight, ClipboardCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrappers";
import { getStatusUI } from "@/portal/config/status.config";

// Configuration for the external Lawyer App
const LAWYER_APP_URL = process.env.LAWYER_APP_URL || 'http://localhost:3001/crm';

export default async function DashboardPage() {
  const session = await authService.getSession();
  if (!session) redirect("/login");

  // 1. ROLE CHECK: Automatic Redirect
  // If a lawyer/admin tries to view the client portal, send them to the CRM.
  if (session.role === 'admin' || session.role === 'lawyer') {
    redirect(LAWYER_APP_URL);
  }

  // 2. CLIENT VIEW
  return <ClientDashboard session={session} />;
}

async function ClientDashboard({ session }: { session: { userId: string } }) {
  const userClaims = await portalRepo.getClaimsForUser(session.userId);
  const user = await authService.getUserById(session.userId); 
  const userName = user?.name?.split(' ')[0] || "there";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AuroraBackground showRadialGradient={false} className="opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto pt-12 px-6 pb-20">
        
        <FadeIn delay={0.1} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2 flex-1">
            <h1 className="text-4xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
              Case Status
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Tracking {userClaims.length} active legal matters.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             {userClaims.length > 0 && (
                <Link href="/start" className="flex-1 md:flex-none">
                  <Button size="lg" className="w-full md:w-auto rounded-full shadow-xl shadow-indigo-500/20 bg-slate-900 text-white hover:bg-indigo-600 dark:bg-white dark:text-slate-900 transition-all">
                    <Plus className="w-4 h-4 mr-2" /> New Assessment
                  </Button>
                </Link>
             )}
          </div>
        </FadeIn>

        {userClaims.length === 0 ? (
           <FadeIn delay={0.2}>
             <div className="flex flex-col items-center justify-center py-24 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 group cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                   <ClipboardCheck className="w-10 h-10 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Active Cases</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-center">
                  You haven't submitted any claims yet. Check your eligibility for free in about 2 minutes.
                </p>
                <Link href="/start">
                  <Button size="lg" className="rounded-full px-8 shadow-lg shadow-indigo-500/20">
                    Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
             </div>
           </FadeIn>
        ) : (
          <StaggerContainer className="grid gap-6 md:grid-cols-2">
            {userClaims.map((claim) => {
              const status = getStatusUI(claim.status || 'draft');
              const StatusIcon = status.icon;

              return (
                <StaggerItem key={claim.id}>
                  <Link href={`/dashboard/claim/${claim.id}`} className="block h-full group">
                    <SpotlightCard className="h-full p-8 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors bg-white/80 dark:bg-slate-900/80">
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.color} border ${status.border}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {new Date(claim.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                        {claim.type}
                      </h3>
                      
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                         {claim.summary || "Pending attorney review..."}
                      </p>
                      
                    </SpotlightCard>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}