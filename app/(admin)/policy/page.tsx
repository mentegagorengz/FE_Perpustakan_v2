"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function PolicyPage() {
  const { policy, updatePolicy, executeWaiver, borrowings } = useApp();
  const [dailyFine, setDailyFine] = useState(policy.dailyFine.toString());
  const [maxDays, setMaxDays] = useState(policy.maxBorrowDays.toString());
  const [maxBooks, setMaxBooks] = useState(policy.maxBooksPerUser.toString());
  const [saved, setSaved] = useState(false);
  const [showWaiverConfirm, setShowWaiverConfirm] = useState(false);
  const [waiverDone, setWaiverDone] = useState(false);

  const totalFines = borrowings.reduce((sum, b) => sum + b.fine, 0);
  const overdueCount = borrowings.filter((b) => b.status === "active" && new Date(b.dueDate) < new Date()).length;

  const handleSave = () => {
    updatePolicy({
      dailyFine: parseInt(dailyFine) || 0,
      maxBorrowDays: parseInt(maxDays) || 14,
      maxBooksPerUser: parseInt(maxBooks) || 3,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleWaiver = () => {
    executeWaiver();
    setShowWaiverConfirm(false);
    setWaiverDone(true);
    setTimeout(() => setWaiverDone(false), 3000);
  };

  return (
    <div className="p-10 bg-cream min-h-screen font-sans">
      <div className="mb-8 border-b border-main-border pb-6">
        <h1 className="text-2xl font-black text-main-text uppercase tracking-tight">Kebijakan & Denda</h1>
        <p className="text-xs text-main-text/50">Atur parameter denda harian dan kebijakan peminjaman.</p>
      </div>

      {/* Toast */}
      {saved && <div className="fixed top-5 right-5 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl text-[10px] font-black uppercase tracking-widest animate-bounce">✅ Kebijakan Disimpan!</div>}
      {waiverDone && <div className="fixed top-5 right-5 z-50 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-2xl text-[10px] font-black uppercase tracking-widest animate-bounce">💰 Pemutihan Denda Berhasil!</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel Kebijakan */}
        <div className="bg-secondary text-white p-8 rounded-xl shadow-2xl">
          <h3 className="text-[10px] font-black uppercase tracking-widest mb-10 opacity-50">Financial Controller</h3>
          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-bold uppercase opacity-60 block mb-2">Denda Telat Per Hari (Rp)</label>
              <div className="flex gap-4">
                <input type="number" value={dailyFine} onChange={(e) => setDailyFine(e.target.value)} className="bg-white/10 border border-white/20 p-3 rounded-lg flex-1 font-black text-white outline-none focus:border-white" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase opacity-60 block mb-2">Maks Hari Peminjaman</label>
              <input type="number" value={maxDays} onChange={(e) => setMaxDays(e.target.value)} className="bg-white/10 border border-white/20 p-3 rounded-lg w-full font-black text-white outline-none focus:border-white" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase opacity-60 block mb-2">Maks Buku Per User</label>
              <input type="number" value={maxBooks} onChange={(e) => setMaxBooks(e.target.value)} className="bg-white/10 border border-white/20 p-3 rounded-lg w-full font-black text-white outline-none focus:border-white" />
            </div>
            <button onClick={handleSave} className="w-full py-4 bg-white text-secondary text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-cream-soft transition-all">
              Simpan Kebijakan
            </button>
            <hr className="border-white/10" />
            <button onClick={() => setShowWaiverConfirm(true)} className="w-full py-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-red-600 transition-all">
              Eksekusi Pemutihan Massal (Fine Waiver)
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="bg-cream-soft border border-main-border p-8 rounded-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-main-text/40">Kebijakan Aktif</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-main-border/50 pb-3">
                <span className="text-[11px] font-bold text-main-text/60 uppercase">Denda Harian</span>
                <span className="text-sm font-black text-secondary">Rp {policy.dailyFine.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b border-main-border/50 pb-3">
                <span className="text-[11px] font-bold text-main-text/60 uppercase">Maks Hari Pinjam</span>
                <span className="text-sm font-black text-secondary">{policy.maxBorrowDays} hari</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-main-text/60 uppercase">Maks Buku/User</span>
                <span className="text-sm font-black text-secondary">{policy.maxBooksPerUser} buku</span>
              </div>
            </div>
          </div>

          <div className="bg-cream-soft border border-main-border p-8 rounded-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-main-text/40">Statistik Denda</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-main-text/60 uppercase">Total Denda Terkumpul</span>
                <span className="text-sm font-black text-red-500">Rp {totalFines.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-main-text/60 uppercase">Peminjaman Terlambat</span>
                <span className="text-sm font-black text-amber-500">{overdueCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Waiver Confirm Modal */}
      {showWaiverConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-cream p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-black text-main-text mb-2 uppercase">Pemutihan Massal?</h3>
            <p className="text-xs text-main-text/50 mb-6">Semua denda akan direset ke Rp 0. Aksi ini tidak bisa dibatalkan.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowWaiverConfirm(false)} className="py-3 bg-surface text-main-text/60 rounded-xl text-[10px] font-black uppercase">
                Batal
              </button>
              <button onClick={handleWaiver} className="py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg">
                Ya, Eksekusi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
