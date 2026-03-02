"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function SecurityTrackingPage() {
  const { borrowings, returnBook, policy } = useApp();
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "returned" | "overdue">("all");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Check overdue
  const enrichedBorrowings = borrowings.map((b) => {
    if (b.status === "active" && new Date(b.dueDate) < new Date()) {
      return { ...b, status: "overdue" as const };
    }
    return b;
  });

  const filtered = filterStatus === "all" ? enrichedBorrowings : enrichedBorrowings.filter((b) => b.status === filterStatus);

  const activeBorrowings = enrichedBorrowings.filter((b) => b.status === "active").length;
  const overdueBorrowings = enrichedBorrowings.filter((b) => b.status === "overdue").length;
  const returnedBorrowings = enrichedBorrowings.filter((b) => b.status === "returned").length;

  const handleReturn = (id: number, bookTitle: string) => {
    returnBook(id);
    showToast(`"${bookTitle}" berhasil dikembalikan!`);
  };

  return (
    <div className="p-10 bg-cream min-h-screen font-sans">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end border-b border-main-border pb-6">
        <div>
          <h1 className="text-2xl font-black text-main-text tracking-tight uppercase">Tracking Peminjaman</h1>
          <p className="text-xs text-main-text/50 font-medium">Monitoring real-time seluruh peminjaman buku perpustakaan.</p>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="fixed top-5 right-5 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl text-[10px] font-black uppercase tracking-widest animate-bounce">✅ {toast}</div>}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-cream-soft border border-main-border p-5 rounded-xl text-center">
          <p className="text-[10px] font-bold text-main-text/40 uppercase">Total</p>
          <p className="text-2xl font-black text-main-text">{borrowings.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-center">
          <p className="text-[10px] font-bold text-blue-400 uppercase">Aktif</p>
          <p className="text-2xl font-black text-blue-600">{activeBorrowings}</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-5 rounded-xl text-center">
          <p className="text-[10px] font-bold text-red-400 uppercase">Terlambat</p>
          <p className="text-2xl font-black text-red-600">{overdueBorrowings}</p>
        </div>
        <div className="bg-green-50 border border-green-100 p-5 rounded-xl text-center">
          <p className="text-[10px] font-bold text-green-400 uppercase">Dikembalikan</p>
          <p className="text-2xl font-black text-green-600">{returnedBorrowings}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "active", "overdue", "returned"] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`text-[9px] font-black uppercase px-4 py-2 rounded-lg transition-all ${filterStatus === s ? "bg-secondary text-white" : "bg-cream-soft border border-main-border text-main-text/50 hover:border-secondary"}`}>
            {s === "all" ? "Semua" : s === "active" ? "Aktif" : s === "overdue" ? "Terlambat" : "Dikembalikan"}
          </button>
        ))}
      </div>

      {/* Tabel Peminjaman */}
      <div className="bg-cream-soft border border-main-border shadow-sm rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface text-[10px] font-black text-main-text/40 uppercase border-b border-main-border tracking-widest">
            <tr>
              <th className="p-5">Peminjam</th>
              <th className="p-5">Buku</th>
              <th className="p-5">Tgl Pinjam</th>
              <th className="p-5">Jatuh Tempo</th>
              <th className="p-5">Denda</th>
              <th className="p-5 text-center">Status</th>
              <th className="p-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-[11px] text-main-text/70">
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-main-border/50 hover:bg-surface/30 transition-all">
                <td className="p-5">
                  <div className="font-black text-main-text uppercase">{b.userName}</div>
                  <div className="text-[9px] text-main-text/40">{b.userEmail}</div>
                </td>
                <td className="p-5 font-bold italic">{b.bookTitle}</td>
                <td className="p-5 text-main-text/40">{b.borrowDate}</td>
                <td className="p-5 text-main-text/40">{b.dueDate}</td>
                <td className="p-5">{b.fine > 0 ? <span className="text-red-500 font-black">Rp {b.fine.toLocaleString()}</span> : <span className="text-green-500 font-bold">-</span>}</td>
                <td className="p-5 text-center">
                  <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${b.status === "active" ? "bg-blue-100 text-blue-600" : b.status === "returned" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{b.status === "active" ? "Aktif" : b.status === "returned" ? "Dikembalikan" : "Terlambat"}</span>
                </td>
                <td className="p-5 text-right">
                  {b.status !== "returned" && (
                    <button onClick={() => handleReturn(b.id, b.bookTitle)} className="text-secondary font-black uppercase text-[9px] hover:underline">
                      Kembalikan
                    </button>
                  )}
                  {b.status === "returned" && b.returnDate && <span className="text-[9px] text-main-text/30">{b.returnDate}</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-main-text/30 italic">
                  Tidak ada data peminjaman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-secondary text-white p-6 rounded-xl">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-white/50">Kebijakan Aktif</h3>
        <div className="grid grid-cols-3 gap-4 text-[11px]">
          <div>
            <span className="opacity-50">Denda / Hari:</span> <span className="font-black ml-1">Rp {policy.dailyFine.toLocaleString()}</span>
          </div>
          <div>
            <span className="opacity-50">Maks Pinjam:</span> <span className="font-black ml-1">{policy.maxBorrowDays} hari</span>
          </div>
          <div>
            <span className="opacity-50">Maks Buku:</span> <span className="font-black ml-1">{policy.maxBooksPerUser} / user</span>
          </div>
        </div>
      </div>
    </div>
  );
}
