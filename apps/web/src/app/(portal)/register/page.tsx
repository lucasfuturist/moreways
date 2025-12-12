import { authService } from '@/auth/svc/auth.service';
import { redirect } from 'next/navigation';
import { AuroraBackground } from '@/components/ui/aurora-background';
import RegisterForm from '@/auth/ui/RegisterForm';
import Link from 'next/link';

export default async function RegisterPage() {
  const session = await authService.getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <AuroraBackground className="fixed inset-0 z-0" children={null} />
      
      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-20 w-full max-w-md">
        <div className="mb-8 text-center animate-in slide-in-from-bottom-4 fade-in duration-700">
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white cursor-default select-none">
            Final Step: Verification
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-light">
            Create a secure account to submit your claim file to our partner attorneys.
          </p>
        </div>
        
        <div className="bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl rounded-3xl p-8 animate-in zoom-in-95 fade-in duration-500 delay-150">
          <RegisterForm />
        </div>

        <div className="mt-8 text-center animate-in slide-in-from-bottom-2 fade-in duration-700 delay-300">
           <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
             <p className="text-xs text-indigo-800 dark:text-indigo-200">
               <strong>Why do we need this?</strong><br/>
               Attorneys require verified contact info to prevent spam and conflict checks.
             </p>
           </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-slate-900 dark:text-white font-medium hover:text-indigo-600 hover:underline underline-offset-4 decoration-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}