import LoginForm from '@/auth/ui/LoginForm';
import { AuroraBackground } from '@/components/ui/aurora-background';
import Link from 'next/link';
import { authService } from '@/auth/svc/auth.service';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
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
          {/* UPDATED: Removed Link wrapper and hover effects */}
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white cursor-default select-none">
            Moreways
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-light">Client & Attorney Portal</p>
        </div>
        
        <div className="bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl shadow-indigo-500/10 dark:shadow-none rounded-3xl p-8 animate-in zoom-in-95 fade-in duration-500 delay-150">
          <LoginForm />
        </div>

        <div className="mt-8 text-center animate-in slide-in-from-bottom-2 fade-in duration-700 delay-300">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-slate-900 dark:text-white font-medium hover:text-indigo-600 hover:underline underline-offset-4 decoration-2">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}