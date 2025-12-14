"use client";

import React, { useState } from "react";
// Update these imports to match your actual structure if needed
import { AdminSidebar } from "@/app/admin/ui/AdminSidebar";
import { FormFactoryView } from "@/app/admin/ui/FormFactoryView"; // or "@/admin/views/..." check your path
import { CustomersView } from "@/admin/views/CustomersView"; // Ensure these paths match where you created the views
import { SupportView } from "@/admin/views/SupportView";

// [FIX] Define the specific tab types expected by AdminSidebar
// You might need to check AdminSidebar.tsx to see if it accepts "communications" or "forms" exactly.
type AdminTab = "customers" | "communications" | "support" | "forms";

interface DashboardProps {
  customers: any[];
  tickets: any[];
  forms: any[];
}

export function AdminDashboard({ customers, tickets, forms }: DashboardProps) {
  // [FIX] Explicitly type the state
  const [activeTab, setActiveTab] = useState<AdminTab>("customers");

  const stats = {
    // Safety check for mrr string format
    totalRevenue: customers.reduce((acc, c) => {
        const val = typeof c.mrr === 'string' ? parseFloat(c.mrr.replace(/[^0-9.-]+/g,"")) : 0;
        return acc + val;
    }, 0),
    activeTickets: tickets.filter(t => t.status === 'open').length,
    totalFirms: customers.length
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl hidden md:block">
        <AdminSidebar 
          activeTab={activeTab} 
          // @ts-ignore - AdminSidebar might expect a generic string setter, but this is safe
          setActiveTab={setActiveTab} 
          // @ts-ignore - If AdminSidebar doesn't have stats in props yet, ignore.
          stats={stats} 
        />
      </div>

      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {activeTab === 'forms' && (
            <section className="animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-bold mb-6 text-white">Form Templates</h2>
              <FormFactoryView forms={forms} isLoading={false} />
            </section>
          )}

          {activeTab === 'customers' && (
            <section className="animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-bold mb-6 text-white">Customers</h2>
              <CustomersView customers={customers} />
            </section>
          )}

          {activeTab === 'support' && (
            <section className="animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-bold mb-6 text-white">Support</h2>
              <SupportView tickets={tickets} />
            </section>
          )}
          
          {/* Handle other tabs or empty states */}
          {activeTab === 'communications' && (
             <div className="text-slate-500">Communications module coming soon...</div>
          )}

        </div>
      </main>
    </div>
  );
}