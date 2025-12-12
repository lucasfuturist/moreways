"use client";

import React from "react";

const MOCK_CUSTOMERS = [
    { id: 1, name: "Morgan & Morgan", tier: "Enterprise", seats: 124, status: "active", mrr: "$12,000" },
    { id: 2, name: "Davis Law Group", tier: "Pro", seats: 12, status: "active", mrr: "$2,500" },
    { id: 3, name: "Better Call Saul", tier: "Starter", seats: 1, status: "churned", mrr: "$0" },
    { id: 4, name: "Hamlin Hamlin McGill", tier: "Enterprise", seats: 45, status: "active", mrr: "$8,000" },
];

export function CustomersView() {
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
            {MOCK_CUSTOMERS.map((firm) => (
              <tr key={firm.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {firm.name[0]}
                  </div>
                  {firm.name}
                </td>
                <td className="px-6 py-4"><span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5">{firm.tier}</span></td>
                <td className="px-6 py-4">{firm.seats}</td>
                <td className="px-6 py-4 text-emerald-400 font-mono">{firm.mrr}</td>
                <td className="px-6 py-4">
                  {firm.status === 'active' 
                    ? <span className="text-emerald-400 text-xs flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> Active</span>
                    : <span className="text-red-400 text-xs">Churned</span>
                  }
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-rose-400 hover:text-white transition-colors text-xs font-bold opacity-0 group-hover:opacity-100">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}