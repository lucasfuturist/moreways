"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ShieldAlert, Loader2 } from "lucide-react";
// [FIX] Capitalize 'Button' to match existing project imports
import { Button } from "@/components/ui/Button";

// Access the env vars exposed to the client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase configuration.");
      }

      // 1. Init Client
      const supabase = createClient(supabaseUrl, supabaseKey);

      // 2. Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // 3. Store Session
      if (data.session) {
          document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=3600; SameSite=Lax`;
      }
      
      // 4. Redirect
      router.push("/admin");
      
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-slate-200 p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] mb-6">
             <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operations Center</h1>
          <p className="text-sm text-slate-500">Restricted access for authorized staff only.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <input
              type="email"
              placeholder="admin@moreways.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
              required
            />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* [FIX] Changed variant='primary' to 'default' */}
          <Button 
            variant="default" 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold h-11"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isLoading ? "Authenticating..." : "Sign In to Console"}
          </Button>
        </form>

        <div className="text-center">
            <p className="text-xs text-slate-600">
                Unauthorized access is logged and monitored.<br />
                System ID: <span className="font-mono text-slate-500">MW-OPS-V1</span>
            </p>
        </div>
      </div>
    </div>
  );
}