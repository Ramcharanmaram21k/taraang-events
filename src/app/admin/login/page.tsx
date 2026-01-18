"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate a slight delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(username, password);
    if (success) {
      router.push("/admin");
    } else {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md relative bg-white/95 backdrop-blur-xl shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Image
                src="/new-logo.png"
                alt="Taraang Events"
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md">
              <Lock className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-slate-500">
            Sign in to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
