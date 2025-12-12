"use client";

import React from "react";
import { OpsNavbar } from "./ui/OpsNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200">
      {/* 
        This Navbar is EXCLUSIVE to the /admin/* route subtree.
        It sits fixed at the top of the admin view.
      */}
      <OpsNavbar />

      {/* 
        Content Area
        pt-16 compensates for the fixed OpsNavbar height 
      */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden pt-16">
        {children}
      </div>
    </div>
  );
}