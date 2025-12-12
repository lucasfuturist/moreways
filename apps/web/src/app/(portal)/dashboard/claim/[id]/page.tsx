import { notFound, redirect } from "next/navigation";
import { authService } from "@/auth/svc/auth.service";
import { portalRepo } from "@/portal/repo/portal.repo";
import { getStatusUI } from "@/portal/config/status.config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Download, Lock, FileText } from "lucide-react";

export default async function ClaimDetailPage({ params }: { params: { id: string } }) {
  const session = await authService.getSession();
  if (!session) redirect("/login");

  const claim = await portalRepo.getClaimDetail(session.userId, params.id);
  if (!claim) return notFound();

  const statusUI = getStatusUI(claim.status || 'draft');
  const StatusIcon = statusUI.icon;

  // FIX: Cast the jsonb data (unknown) to a usable object type
  // This prevents the "Type 'unknown' is not assignable to type 'ReactNode'" error
  const formData = (claim.formData as Record<string, any>) || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 pt-24">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-2 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cases
        </Link>

        {/* Header Card */}
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">{claim.type}</h1>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusUI.bg} ${statusUI.color} ${statusUI.border} border`}>
                <StatusIcon className="w-3 h-3" />
                <span className="uppercase tracking-wider">{statusUI.label}</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                Submitted on {new Date(claim.createdAt!).toLocaleDateString()} • ID: <span className="font-mono">{claim.id.slice(0,8)}</span>
            </p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
             {/* Mock Export Action */}
            <Button variant="outline" className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 flex-1 md:flex-none">
                <Download className="w-4 h-4 mr-2" /> Save PDF
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          
          {/* Main Content: Details */}
          <div className="space-y-6">
            
            {/* Status Context Card */}
            <div className={`p-6 rounded-xl border ${statusUI.bg} ${statusUI.border}`}>
                <h3 className={`font-semibold mb-1 ${statusUI.color}`}>Current Status: {statusUI.label}</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                    {statusUI.description}
                </p>
            </div>

            <Card className="p-8 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" /> Case Details
              </h3>
              
              <dl className="space-y-6">
                {/* FIX: Use the safely casted variable 'formData' */}
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="group">
                    <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                        {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm leading-relaxed">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>

          {/* Sidebar: Communication Hub (Future) */}
          <div className="space-y-6">
            <Card className="p-6 bg-slate-900 dark:bg-indigo-950/30 text-white border-slate-800 dark:border-indigo-500/20 relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none" />
               
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Attorney Comms
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Secure messaging will unlock once an attorney accepts your case.
              </p>
              
              <Button disabled className="w-full bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed">
                  <Lock className="w-3 h-3 mr-2" /> Messaging Locked
              </Button>
            </Card>

            <Card className="p-6 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="font-semibold mb-4 text-sm text-slate-900 dark:text-white">Evidence Locker</h3>
              
              <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Drag and drop files here<br/>or click to upload
                </p>
                <Button variant="outline" size="sm" className="h-8 text-xs dark:bg-slate-800 dark:text-white dark:border-slate-700">
                  Upload Documents
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}