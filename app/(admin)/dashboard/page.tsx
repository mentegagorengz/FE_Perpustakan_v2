"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      try {
        // Request tunggal ke endpoint summary terbaru 
        const response = await fetch("http://localhost:3001/api/v1/dashboard/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchSummary();
  }, [token]);

  if (isLoading) return <div className="p-10 font-black text-secondary animate-pulse uppercase tracking-[0.3em]">Gathering Intelligence...</div>;

  return (
    <div className="p-10 bg-cream min-h-screen font-sans">
      {/* Header Dashboard  */}
      <div className="mb-8 flex justify-between items-end border-b border-main-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-secondary tracking-tighter uppercase leading-none">Command Center</h1>
          <p className="text-[10px] text-main-text/40 font-bold uppercase tracking-widest mt-2">
            Perpustakaan UNSRAT • Last Update: {new Date(data?.last_updated).toLocaleTimeString()} 
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
          <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Server: {data?.server_status}</span> 
        </div>
      </div>

      {/* Grid Statistik Terpusat  */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-7 rounded-[32px] border border-main-border shadow-sm">
          <p className="text-[9px] font-black text-main-text/20 uppercase tracking-widest mb-1">Total Koleksi</p>
          <p className="text-4xl font-black text-secondary">{data?.total_books}</p> 
        </div>
        <div className="bg-white p-7 rounded-[32px] border border-main-border shadow-sm">
          <p className="text-[9px] font-black text-main-text/20 uppercase tracking-widest mb-1">User Terdaftar</p>
          <p className="text-4xl font-black text-secondary">{data?.total_users}</p> 
        </div>
        <div className="bg-amber-50 p-7 rounded-[32px] border border-amber-100 shadow-sm">
          <p className="text-[9px] font-black text-amber-600/50 uppercase tracking-widest mb-1">Login Attempt</p>
          <p className="text-4xl font-black text-amber-600">{data?.login_attempts}</p> 
        </div>
        <div className="bg-red-50 p-7 rounded-[32px] border border-red-100 shadow-sm">
          <p className="text-[9px] font-black text-red-600/50 uppercase tracking-widest mb-1">Security Alert</p>
          <p className="text-4xl font-black text-red-600">{data?.failed_actions}</p> 
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monitoring Aktivitas Cepat  */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-main-border shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-main-border bg-surface/30 flex justify-between items-center">
            <h2 className="text-[11px] font-black text-secondary uppercase tracking-[0.2em]">Sistem Insight</h2>
            <Link href="/logs" className="text-[9px] font-black text-main-text/30 hover:text-secondary uppercase">Audit Full Logs →</Link>
          </div>
          <div className="p-10 text-center">
             <div className="inline-block p-8 bg-cream rounded-full mb-6">
                <span className="text-4xl">📊</span>
             </div>
             <h3 className="text-lg font-black text-secondary uppercase mb-2">Aktivitas Terdeteksi</h3>
             <p className="text-[11px] text-main-text/50 max-w-xs mx-auto leading-relaxed">
               Terdapat total **{data?.total_logs}** aktivitas yang terekam dalam database hingga saat ini. [cite: 2026-03-03]
             </p>
          </div>
        </div>

        {/* Akses Kontrol Terpusat  */}
        <div className="space-y-6">
          <div className="bg-secondary p-8 rounded-[40px] text-white shadow-xl shadow-secondary/30">
            <h2 className="text-[9px] font-black uppercase tracking-[0.25em] mb-8 text-white/30">Quick Operations</h2>
            <div className="grid gap-3">
              <Link href="/tracking" className="p-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-between">
                <span>Cek Peminjaman</span>
                <span>→</span>
              </Link>
              <Link href="/roles" className="p-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-between">
                <span>Manajemen User</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}