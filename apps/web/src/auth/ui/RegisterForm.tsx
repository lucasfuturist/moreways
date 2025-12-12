"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, ArrowRight, User, Mail, Lock, Phone, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- NEW HELPER FUNCTION ---
// This function takes a raw string and formats it into (XXX) XXX-XXXX
const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- NEW STATE MANAGEMENT FOR CONTROLLED INPUTS ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    
    // --- NEW VALIDATION: Check if passwords match ---
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    
    const payload = {
      name,
      email,
      phoneNumber: phoneNumber.replace(/[^\d]/g, ''), // Send the clean, unformatted number
      password,
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (typeof window !== 'undefined' && window.moreways) {
            window.moreways.track('custom', {
                event: 'complete_registration',
                method: 'email',
                email: payload.email, 
                content_name: 'portal_account'
            });
        }
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Registration failed');
        setLoading(false);
      }
    } catch (e) {
      setError('Network error occurred');
      setLoading(false);
    }
  };
  
  // --- NEW HANDLER for the phone number input ---
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedPhoneNumber);
  };


  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <Input 
              name="name" 
              type="text" 
              required 
              disabled={loading}
              placeholder="Jane Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email</label>
          <div className="relative">
             <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
             <Input 
              name="email" 
              type="email" 
              required 
              disabled={loading}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
            />
          </div>
        </div>
        
        {/* Phone Number Input (Now Controlled) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Phone Number (Optional)</label>
          <div className="relative">
             <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
             <Input 
              name="phoneNumber" 
              type="tel"
              disabled={loading}
              placeholder="(555) 123-4567"
              value={phoneNumber}
              onChange={handlePhoneInputChange}
              className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
            />
          </div>
        </div>

        {/* --- MODIFIED PASSWORD LOGIC --- */}
        {/* First Password Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <Input 
              name="password" 
              type="password" 
              required 
              disabled={loading}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
            />
          </div>
        </div>
        
        {/* --- NEW: Conditional "Confirm Password" Field --- */}
        <AnimatePresence>
          {password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-2 overflow-hidden"
            >
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <Input 
                  name="confirmPassword" 
                  type="password" 
                  required 
                  disabled={loading}
                  placeholder="Type your password again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
                />
              </div>
              {/* --- NEW: Real-time password match feedback --- */}
              {confirmPassword.length > 0 && (
                password === confirmPassword ? (
                  <p className="text-xs flex items-center gap-1 text-emerald-600 dark:text-emerald-400 ml-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match!
                  </p>
                ) : (
                  <p className="text-xs text-red-600 dark:text-red-400 ml-1 mt-1">
                    Passwords do not match.
                  </p>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-900/50 flex items-center gap-2 text-sm animate-in fade-in">
            <Shield className="w-4 h-4" /> {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors text-base font-medium shadow-lg" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400 px-4 leading-relaxed">
        By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
      </p>
    </div>
  );
}