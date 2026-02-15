"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/admin-auth";
import { LogOut, FileText, FileSpreadsheet, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md overflow-hidden">
              <Image
                src="/new-logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Admin Panel</h1>
              <p className="text-xs text-slate-500">SS Taraang Events</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg px-4 py-2 transition-all hover:border-red-300 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mx-auto mb-6 overflow-hidden">
            <Image
              src="/new-logo.png"
              alt="Logo"
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome Back!
          </h2>
          <p className="text-slate-500 text-lg">
            Choose a tool to get started
          </p>
        </div>

        {/* Two Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Simple Invoice Card */}
          <Link href="/admin/invoice" className="group block">
            <div className="relative bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-sm transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1">
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                Simple Invoice
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Generate a quick billing invoice with customer details, amount finalized, advance paid, and balance due.
              </p>

              {/* Arrow */}
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                Open Invoice Generator <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Quotation Generator Card */}
          <Link href="/admin/quotation" className="group block">
            <div className="relative bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-sm transition-all duration-300 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-100 hover:-translate-y-1">
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-200 mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileSpreadsheet className="w-8 h-8 text-white" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                Quotation Generator
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Create detailed event quotations with food menu, services, charges breakdown, and PDF download.
              </p>

              {/* Arrow */}
              <div className="flex items-center gap-2 text-sm font-medium text-amber-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                Open Quotation Generator <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400 mt-12">
          SS Taraang Events &middot; Admin Dashboard
        </p>
      </main>
    </div>
  );
}
