"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function AdminDashboard() {
  const { books, articles, borrowings, getActiveBorrowings, users } = useApp();

  const activeBorrowings = getActiveBorrowings();
  const publishedArticles = articles.filter((a) => a.status === "Published");
  const totalAvailability = books.reduce((sum, b) => sum + b.availability, 0);

  const stats = [
    { label: "TOTAL KOLEKSI BUKU", value: books.length.toLocaleString(), sub: `${totalAvailability} tersedia`, color: "border-l-secondary" },
    { label: "PEMINJAMAN AKTIF", value: activeBorrowings.length.toString(), sub: `${borrowings.length} total semua`, color: "border-l-blue-500" },
    { label: "PENGGUNA TERDAFTAR", value: users.length.toString(), sub: `${users.filter((u) => u.status === "banned").length} banned`, color: "border-l-green-500" },
    { label: "WARTA ARTIKEL", value: articles.length.toString(), sub: `${publishedArticles.length} published`, color: "border-l-amber-500" },
  ];

  return (
    <div className="p-10 bg-cream min-h-screen font-sans">
      <div className="mb-8 flex justify-between items-end border-b border-main-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-main-text tracking-tight">DASHBOARD UTAMA</h1>
          <p className="text-xs text-main-text/50">Ringkasan data operasional perpustakaan real-time.</p>
        </div>
        <div className="text-[10px] font-bold text-main-text/40 uppercase">
          Status: <span className="text-green-600">Terhubung</span>
        </div>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-cream-soft p-6 border border-main-border border-l-4 ${stat.color} shadow-sm rounded-xl`}>
            <p className="text-[10px] font-bold text-main-text/40 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-main-text">{stat.value}</p>
            <p className="text-[9px] font-medium text-main-text/30 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabel Peminjaman Terbaru */}
        <div className="lg:col-span-2 bg-cream-soft border border-main-border shadow-sm rounded-xl overflow-hidden">
          <div className="p-5 border-b border-main-border flex justify-between items-center">
            <h2 className="text-xs font-bold text-main-text uppercase">Peminjaman Terbaru</h2>
            <Link href="/tracking" className="text-[10px] font-bold text-secondary hover:underline">
              LIHAT SEMUA
            </Link>
          </div>
          <table className="w-full text-left">
            <thead className="bg-surface text-[10px] font-bold text-main-text/50 uppercase border-b border-main-border">
              <tr>
                <th className="p-4">Peminjam</th>
                <th className="p-4">Buku</th>
                <th className="p-4">Tgl Pinjam</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs text-main-text/70">
              {borrowings.slice(0, 5).map((b) => (
                <tr key={b.id} className="border-b border-main-border/50 hover:bg-surface/50 transition-colors">
                  <td className="p-4 font-semibold">{b.userName}</td>
                  <td className="p-4 italic">{b.bookTitle}</td>
                  <td className="p-4 text-main-text/40">{b.borrowDate}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${b.status === "active" ? "bg-blue-100 text-blue-600" : b.status === "returned" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{b.status === "active" ? "Aktif" : b.status === "returned" ? "Dikembalikan" : "Terlambat"}</span>
                  </td>
                </tr>
              ))}
              {borrowings.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-main-text/30 italic">
                    Belum ada data peminjaman
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions & System Info */}
        <div className="space-y-6">
          <div className="bg-secondary text-white p-6 shadow-sm rounded-xl">
            <h2 className="text-xs font-bold uppercase mb-6 tracking-widest text-white/50">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/articles" className="block w-full py-3 bg-white/10 text-center text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white/20 transition-colors">
                + Tulis Artikel Baru
              </Link>
              <Link href="/roles" className="block w-full py-3 bg-white/10 text-center text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white/20 transition-colors">
                Kelola Pengguna
              </Link>
              <Link href="/policy" className="block w-full py-3 bg-white/10 text-center text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white/20 transition-colors">
                Atur Kebijakan
              </Link>
            </div>
          </div>

          <div className="bg-cream-soft border border-main-border p-6 rounded-xl">
            <h2 className="text-xs font-bold uppercase mb-4 tracking-widest text-main-text/40">Artikel Terbaru</h2>
            <div className="space-y-3">
              {articles.slice(0, 3).map((a) => (
                <div key={a.id} className="flex justify-between items-start text-[10px] border-b border-main-border/50 pb-2">
                  <div>
                    <p className="font-bold text-main-text uppercase truncate max-w-[180px]">{a.title}</p>
                    <p className="text-main-text/40">{a.date}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black ${a.status === "Published" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
