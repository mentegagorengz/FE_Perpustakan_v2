"use client";

import React, { useState } from "react";
import { CheckCircle2, Search, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUsers, useUpdateRoleMutation, useDeleteUserMutation } from "@/hooks/useUsers";
import type { SystemRole } from "@/types/api";

export default function RoleManagementPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | SystemRole>("all");
  const [toast, setToast] = useState<string | null>(null);
  const { data } = useUsers({ token, page, search: searchTerm || undefined });
  const updateRole = useUpdateRoleMutation();
  const deleteUser = useDeleteUserMutation();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const users = data?.data ?? [];
  const filtered = filterRole === "all" ? users : users.filter((u) => u.role === filterRole);
  const staffCount = users.filter((u) => u.role === "STAFF" || u.role === "SUPER_ADMIN").length;

  const handleRole = async (id: number, role: SystemRole, name: string) => {
    try {
      await updateRole.mutateAsync({ id, role });
      showToast(`${name} → ${role}`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal ubah role.");
    }
  };
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus user ${name}? Aksi permanen.`)) return;
    try {
      await deleteUser.mutateAsync(id);
      showToast(`${name} dihapus`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal hapus.");
    }
  };

  return (
    <div className="min-h-screen bg-cream p-10 font-sans">
      <div className="mb-8 border-b border-main-border pb-6">
        <h1 className="font-display text-3xl text-secondary">Otoritas pengguna</h1>
        <p className="mt-2 text-sm text-main-text/60">Kelola role staf dan akses pengguna perpustakaan.</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed right-5 top-5 z-50 inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-[var(--shadow-overlay)]">
          <CheckCircle2 className="h-4 w-4" />
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-main-border bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-main-text/50">Total pengguna</p>
          <p className="mt-1 font-display text-3xl text-main-text">{users.length}</p>
        </div>
        <div className="rounded-lg border border-main-border bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-main-text/50">Staf / Admin</p>
          <p className="mt-1 font-display text-3xl text-secondary">{staffCount}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-main-text/40" />
          <input type="text" placeholder="Cari nama / email..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="w-full rounded-md border border-main-border bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-secondary" />
        </div>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value as "all" | SystemRole)} className="rounded-md border border-main-border bg-white px-4 py-2.5 text-sm text-main-text/70 outline-none focus:border-secondary">
          <option value="all">Semua role</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          <option value="STAFF">STAFF</option>
          <option value="USER">USER</option>
        </select>
      </div>

      {/* User Table */}
      <div className="overflow-hidden rounded-lg border border-main-border bg-white shadow-[var(--shadow-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-main-border bg-surface text-main-text/60">
            <tr>
              <th className="p-4 font-medium">Nama</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Bergabung</th>
              <th className="p-4 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-main-border text-main-text/80">
            {filtered.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-surface/40">
                <td className="p-4 font-medium text-main-text">{u.full_name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${u.role === "USER" ? "bg-surface text-main-text/60" : "bg-secondary/10 text-secondary"}`}>{u.role}</span>
                </td>
                <td className="p-4 text-main-text/50">{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    {u.role === "USER" ? (
                      <button onClick={() => handleRole(u.id, "STAFF", u.full_name)} className="inline-flex items-center gap-1.5 rounded-md border border-main-border px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-surface">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Jadikan STAFF
                      </button>
                    ) : (
                      <button onClick={() => handleRole(u.id, "USER", u.full_name)} className="inline-flex items-center gap-1.5 rounded-md border border-main-border px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-surface">
                        <ShieldOff className="h-3.5 w-3.5" />
                        Turunkan ke USER
                      </button>
                    )}
                    <button onClick={() => handleDelete(u.id, u.full_name)} className="inline-flex items-center gap-1.5 rounded-md border border-main-border px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-main-text/40">
                  Tidak ada pengguna ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginasi */}
      {data && data.meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-md border border-main-border bg-white px-3 py-1.5 text-sm text-main-text/70 disabled:opacity-40">
            Sebelumnya
          </button>
          <span className="text-sm text-main-text/60">
            {page} / {data.meta.totalPages}
          </span>
          <button onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))} disabled={page >= data.meta.totalPages} className="rounded-md border border-main-border bg-white px-3 py-1.5 text-sm text-main-text/70 disabled:opacity-40">
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}
