"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Briefcase, User, Wrench, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResponse = async (res: Response) => {
    const data = await res.json();
    
    if (res.ok && data.success) {
      
      // [TRACKING] Fire Login Event
      // Note: We don't send PII here, just the signal that a user logged in.
      // The browser cookie (fbp/fbc) handles the matching on the server.
      if (typeof window !== 'undefined' && window.moreways) {
          window.moreways.track('custom', { 
              event: 'login', 
              method: 'email',
              login_status: 'success'
          });
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl; 
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } else {
      setError(data.error || 'Login failed');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; 
    
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      await handleResponse(res);
    } catch (e) {
      setError('Network error occurred');
      setLoading(false);
    }
  };

  const handleDevLogin = async (role: string) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/dev-login', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      await handleResponse(res);
    } catch (e) {
      setError('Dev login failed');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email</label>
          <Input 
            name="email" 
            type="email" 
            required 
            disabled={loading} 
            placeholder="name@example.com" 
            className="bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Password</label>
          <Input 
            name="password" 
            type="password" 
            required 
            disabled={loading} 
            placeholder="••••••••" 
            className="bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
          />
        </div>
        
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-900/50 flex items-center gap-2 text-sm animate-in fade-in">
            <Shield className="w-4 h-4" /> {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors text-base font-medium shadow-lg" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      {process.env.NODE_ENV === 'development' && (
        <div className="pt-6 border-t border-slate-200/50 dark:border-white/10">
          <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500">
            <Wrench className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Developer Mode</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button 
                variant="outline" 
                className="text-[10px] sm:text-xs h-9 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:bg-transparent" 
                onClick={() => handleDevLogin('client')} 
                disabled={loading}
            >
              <User className="w-3 h-3 mr-1.5" /> Client
            </Button>
            <Button 
                variant="outline" 
                className="text-[10px] sm:text-xs h-9 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:bg-transparent" 
                onClick={() => handleDevLogin('lawyer')} 
                disabled={loading}
            >
              <Briefcase className="w-3 h-3 mr-1.5" /> Lawyer
            </Button>
            <Button 
                variant="outline" 
                className="text-[10px] sm:text-xs h-9 text-indigo-700 dark:text-indigo-300 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20" 
                onClick={() => handleDevLogin('admin')} 
                disabled={loading}
            >
              <LayoutDashboard className="w-3 h-3 mr-1.5" /> Admin
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}