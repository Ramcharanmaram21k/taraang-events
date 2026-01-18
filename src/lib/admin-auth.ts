"use client";

import { createContext, useContext } from "react";

// Admin credentials - in production, use environment variables
export const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "taraang@2024";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const validateCredentials = (username: string, password: string): boolean => {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
};
