"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // RELIABILITY FIX: Hard redirect to home
      window.location.href = "/";
    } catch (e) {
      console.error(e);
      window.location.href = "/";
    }
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout} 
      disabled={loading}
      className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
    >
      <LogOut className="w-4 h-4 mr-2" />
      {loading ? "Exiting..." : "Sign Out"}
    </Button>
  );
}