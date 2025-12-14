"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Access client-side env keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface Customer {
  id: string;
  name: string;
  plan: string;
  seats: number;
  seatLimit: number;
  status: string;
  mrr: number;
}

export function CustomersView() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
        try {
            // [AUTH] Attach token to request
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || "";

            const res = await fetch("/api/admin/customers", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (!res.ok) throw new Error("Failed to fetch");
            
            const data = await res.json();
            if (Array.isArray(data)) setCustomers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    load();
  }, []);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Customers...</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-panel rounded-2xl overflow-hidden border-white/10">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-white/5 text-slate-200 font-bold uppercase tracking-wider text-xs border-b border-white/10">
            <tr>
              <th className="px-6 py-4">Firm Name</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Users</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((firm) => (
              <tr key={firm.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {firm.name[0]}
                  </div>
                  {firm.name}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5">{firm.plan}</span>
                </td>
                <td className="px-6 py-4">{firm.seats} / {firm.seatLimit}</td>
                <td className="px-6 py-4 text-emerald-400 font-mono">{formatCurrency(firm.mrr)}</td>
                <td className="px-6 py-4">
                  {firm.status === 'active' 
                    ? <span className="text-emerald-400 text-xs flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> Active</span>
                    : <span className="text-red-400 text-xs capitalize">{firm.status}</span>
                  }
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-rose-400 hover:text-white transition-colors text-xs font-bold opacity-0 group-hover:opacity-100">Manage</button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No customers found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}