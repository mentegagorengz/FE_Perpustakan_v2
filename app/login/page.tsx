"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  // Ambil state dan fungsi langsung dari Context [cite: 2026-02-26]
  const { login, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validasi dasar sebelum menembak API [cite: 2026-02-11]
    if (!email || !password) {
      setLocalError("Email dan password tidak boleh kosong.");
      return;
    }

    try {
      // Panggil fungsi login yang sudah terhubung ke NestJS [cite: 2025-12-01, 2026-02-24]
      await login(email, password);
    } catch (err: any) {
      // Error akan ditangani oleh catch ini jika API gagal [cite: 2026-02-11]
      console.error("Login failed:", err);
    }
  };

  // Gabungkan error dari local dan API [cite: 2026-02-11]
  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-secondary tracking-tight uppercase">Portal Masuk</h1>
            <p className="text-[10px] text-main-text/40 mt-2 font-black uppercase tracking-widest">Akses Mandiri Perpustakaan UNSRAT [cite: 2026-02-26]</p>
          </div>

          <div className="bg-secondary p-10 rounded-[40px] shadow-2xl shadow-secondary/20">
            <form onSubmit={handleLogin} className="space-y-6">
              {displayError && <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-2xl text-[10px] text-center font-black uppercase tracking-wider">{displayError}</div>}

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-widest text-white/50 ml-2">Email / Identitas</label>
                <input type="text" className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all text-white placeholder-white/20 font-bold" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} placeholder="name@student.unsrat.ac.id" />
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-widest text-white/50 ml-2">Kata Sandi</label>
                <input type="password" className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all text-white placeholder-white/20 font-bold" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} placeholder="••••••••" />
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-5 bg-white text-secondary font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:bg-cream-soft transition-all active:scale-[0.98] disabled:opacity-50">
                {isLoading ? "Memverifikasi..." : "Masuk Sekarang"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
