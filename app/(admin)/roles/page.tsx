"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function RoleManagementPage() {
  const { users, updateUserRole, banUser, unbanUser } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.nama.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const activeUsers = users.filter((u) => u.status === "active");
  const bannedUsers = users.filter((u) => u.status === "banned");
  const adminUsers = users.filter((u) => u.role === "admin");

  return (
    <div className="p-10 bg-cream min-h-screen font-sans">
      <div className="mb-8 border-b border-main-border pb-6">
        <h1 className="text-2xl font-black text-main-text uppercase tracking-tight">Otoritas Pengguna</h1>
        <p className="text-xs text-main-text/50">Kelola role staf dan akses pengguna perpustakaan.</p>
      </div>

      {/* Toast */}
      {toast && <div className="fixed top-5 right-5 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl text-[10px] font-black uppercase tracking-widest animate-bounce">{toast}</div>}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-cream-soft border border-main-border p-5 rounded-xl">
          <p className="text-[10px] font-bold text-main-text/40 uppercase">Total Aktif</p>
          <p className="text-2xl font-black text-main-text">{activeUsers.length}</p>
        </div>
        <div className="bg-cream-soft border border-main-border p-5 rounded-xl">
          <p className="text-[10px] font-bold text-main-text/40 uppercase">Admin</p>
          <p className="text-2xl font-black text-secondary">{adminUsers.length}</p>
        </div>
        <div className="bg-cream-soft border border-main-border p-5 rounded-xl">
          <p className="text-[10px] font-bold text-main-text/40 uppercase">Banned</p>
          <p className="text-2xl font-black text-red-500">{bannedUsers.length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex gap-4">
        <input type="text" placeholder="Cari nama / email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-sm bg-cream-soft border border-main-border p-3 rounded-lg text-xs font-bold" />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value as any)} className="bg-cream-soft border border-main-border px-4 py-2 rounded-lg text-[10px] font-black uppercase text-main-text/60 outline-none">
          <option value="all">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-cream-soft border border-main-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-surface font-black text-main-text/40 uppercase tracking-widest border-b border-main-border">
            <tr>
              <th className="p-5">Nama</th>
              <th className="p-5">Email</th>
              <th className="p-5">Role</th>
              <th className="p-5">Status</th>
              <th className="p-5">Bergabung</th>
              <th className="p-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-main-text/70">
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-main-border/50 hover:bg-surface/30 transition-all group">
                <td className="p-5 font-black text-main-text uppercase">{u.nama}</td>
                <td className="p-5 font-medium">{u.email}</td>
                <td className="p-5">
                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${u.role === "admin" ? "bg-secondary/10 text-secondary" : "bg-gray-100 text-gray-500"}`}>{u.role}</span>
                </td>
                <td className="p-5">
                  <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${u.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{u.status}</span>
                </td>
                <td className="p-5 text-main-text/40">{u.joinDate}</td>
                <td className="p-5 text-right space-x-2">
                  {u.role === "user" ? (
                    <button
                      onClick={() => {
                        updateUserRole(u.id, "admin");
                        showToast(`${u.nama} → Admin`);
                      }}
                      className="text-secondary font-black uppercase text-[9px] hover:underline"
                    >
                      Jadikan Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        updateUserRole(u.id, "user");
                        showToast(`${u.nama} → User`);
                      }}
                      className="text-amber-500 font-black uppercase text-[9px] hover:underline"
                    >
                      Turunkan
                    </button>
                  )}
                  {u.status === "active" ? (
                    <button
                      onClick={() => {
                        banUser(u.id);
                        showToast(`${u.nama} di-ban`);
                      }}
                      className="text-red-400 font-black uppercase text-[9px] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Ban
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        unbanUser(u.id);
                        showToast(`${u.nama} di-unban`);
                      }}
                      className="text-green-600 font-black uppercase text-[9px] hover:underline"
                    >
                      Unban
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-main-text/30 italic">
                  Tidak ada pengguna ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
