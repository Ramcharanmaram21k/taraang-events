"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext, validateCredentials } from "@/lib/admin-auth";

const AUTH_STORAGE_KEY = "taraang_admin_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (validateCredentials(username, password)) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
