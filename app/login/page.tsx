"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Email dan password tidak boleh kosong.");
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      console.error("Login failed:", err);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-main-border bg-white p-8 shadow-[var(--shadow-card)]">
            <div className="mb-8">
              <h1 className="text-3xl font-display text-secondary">Portal Masuk</h1>
              <p className="mt-2 text-sm text-main-text/60">
                Akses Mandiri Perpustakaan UNSRAT
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {displayError && (
                <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {displayError}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-main-text">
                  Email / Identitas
                </label>
                <input
                  id="email"
                  type="text"
                  className="w-full rounded-md border border-main-border bg-cream-soft px-4 py-2.5 text-main-text outline-none transition-colors placeholder:text-main-text/40 focus:border-secondary focus:ring-1 focus:ring-secondary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="name@student.unsrat.ac.id"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-main-text">
                  Kata Sandi
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-md border border-main-border bg-cream-soft px-4 py-2.5 text-main-text outline-none transition-colors placeholder:text-main-text/40 focus:border-secondary focus:ring-1 focus:ring-secondary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-secondary py-3 font-medium text-white transition-colors hover:bg-secondary-hover disabled:opacity-50"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Memverifikasi..." : "Masuk Sekarang"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
