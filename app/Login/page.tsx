"use client";

import React from "react";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { email, setEmail, password, setPassword, isLoading, error, handleLogin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Memasukkan Header agar navigasi tetap ada [cite: 2026-02-12] */}
      <Header />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary tracking-tight">Selamat Datang</h1>
            <p className="text-main-text/60 mt-2 font-medium">Silakan masuk untuk mengakses layanan penuh</p>
          </div>

          {/* Card Login dengan warna yang ditukar [cite: 2026-02-12] */}
          <div className="bg-secondary p-10 rounded-3xl shadow-2xl shadow-secondary/20">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg text-xs text-center font-bold">{error}</div>}

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-white/70 mb-2 ml-1">Username / Email</label>
                <input type="text" className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all text-white placeholder-white/40" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} placeholder="Masukkan identitas" />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-white/70 mb-2 ml-1">Password</label>
                <input type="password" className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all text-white placeholder-white/40" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} placeholder="••••••••" />
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-4 bg-white text-secondary font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg hover:bg-cream-soft transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? "Memproses..." : "Masuk Sekarang"}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-main-text/40 text-xs font-medium uppercase tracking-widest">Perpustakaan Digital UNSRAT © 2026</p>
        </div>
      </div>
    </div>
  );
}
