"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { Shield, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Shield className="w-6 h-6" />
            <span>Election Shield</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <UserIcon className="w-4 h-4" />
              <span className="font-medium">{user?.displayName || user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-600 hover:text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
