"use client";

import React, { useDeferredValue, useState } from "react";
import { AlertCircle, CheckCircle2, Search, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUsers, useUpdateRoleMutation, useDeleteUserMutation } from "@/hooks/useUsers";
import type { SystemRole } from "@/types/api";

export default function RoleManagementPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | SystemRole>("all");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const { data } = useUsers({ token, page, search: deferredSearchTerm || undefined, role: filterRole === "all" ? undefined : filterRole });
  const updateRole = useUpdateRoleMutation();
  const deleteUser = useDeleteUserMutation();

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const users = data?.data ?? [];
  const handleRole = async (id: number, role: SystemRole, name: string) => {
    try {
      await updateRole.mutateAsync({ id, role });
      showToast(`${name} → ${role}`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal ubah role.", "error");
    }
  };
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus user ${name}? Aksi permanen.`)) return;
    try {
      await deleteUser.mutateAsync(id);
      showToast(`${name} dihapus`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal hapus.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-cream p-4 font-sans sm:p-6 lg:p-10">
      <div className="mb-8 border-b border-main-border pb-6">
        <h1 className="font-display text-3xl text-secondary">Otoritas pengguna</h1>
        <p className="mt-2 text-sm text-main-text/60">Kelola role staf dan akses pengguna perpustakaan.</p>
      </div>

      
      {toast && (
        <div role={toast.type === "error" ? "alert" : "status"} className={`fixed right-5 top-5 z-50 inline-flex items-center gap-2 rounded-sm px-4 py-3 text-sm font-medium text-white shadow-[var(--shadow-overlay)] ${toast.type === "error" ? "bg-red-700" : "bg-green-700"}`}>
          {toast.type === "error" ? <AlertCircle aria-hidden="true" className="h-4 w-4" /> : <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-sm border border-main-border bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-main-text/50">Total pengguna</p>
          <p className="mt-1 font-display text-3xl text-main-text">{data?.meta.total ?? 0}</p>
        </div>
        <div className="rounded-sm border border-main-border bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-main-text/50">Hasil filter role</p>
          <p className="mt-1 font-display text-3xl text-secondary">{data?.meta.total ?? 0}</p>
        </div>
      </div>

      
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative w-full max-w-sm">
          <label htmlFor="user-search" className="sr-only">Cari nama atau email pengguna</label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-main-text/40" />
          <input id="user-search" name="user-search" type="search" placeholder="Cari nama / email..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="w-full rounded-sm border border-main-border bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-secondary" />
        </div>
        <label htmlFor="role-filter" className="sr-only">Filter berdasarkan role</label>
        <select id="role-filter" name="role-filter" value={filterRole} onChange={(e) => setFilterRole(e.target.value as "all" | SystemRole)} className="w-full rounded-sm border border-main-border bg-white px-4 py-2.5 text-sm text-main-text/70 outline-none focus:border-secondary sm:w-auto">
          <option value="all">Semua role</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          <option value="STAFF">STAFF</option>
          <option value="USER">USER</option>
        </select>
      </div>

      
      <div className="overflow-x-auto rounded-sm border border-main-border bg-white shadow-[var(--shadow-card)]">
        <table className="min-w-[58rem] w-full text-left text-sm">
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
            {users.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-surface/40">
                <td className="p-4 font-medium text-main-text">{u.full_name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`inline-flex rounded-sm px-2 py-1 text-xs font-medium ${u.role === "USER" ? "bg-surface text-main-text/60" : "bg-secondary/10 text-secondary"}`}>{u.role}</span>
                </td>
                <td className="p-4 text-main-text/50">{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    {u.role === "USER" ? (
                      <button disabled={updateRole.isPending || deleteUser.isPending} onClick={() => handleRole(u.id, "STAFF", u.full_name)} className="inline-flex items-center gap-1.5 rounded-sm border border-main-border px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-surface disabled:opacity-50">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Jadikan STAFF
                      </button>
                    ) : (
                      <button disabled={updateRole.isPending || deleteUser.isPending} onClick={() => handleRole(u.id, "USER", u.full_name)} className="inline-flex items-center gap-1.5 rounded-sm border border-main-border px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-surface disabled:opacity-50">
                        <ShieldOff className="h-3.5 w-3.5" />
                        Turunkan ke USER
                      </button>
                    )}
                    <button disabled={updateRole.isPending || deleteUser.isPending} onClick={() => handleDelete(u.id, u.full_name)} className="inline-flex items-center gap-1.5 rounded-sm border border-main-border px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50">
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-main-text/40">
                  Tidak ada pengguna ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      {data && data.meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-sm border border-main-border bg-white px-3 py-1.5 text-sm text-main-text/70 disabled:opacity-40">
            Sebelumnya
          </button>
          <span className="text-sm text-main-text/60">
            {page} / {data.meta.totalPages}
          </span>
          <button onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))} disabled={page >= data.meta.totalPages} className="rounded-sm border border-main-border bg-white px-3 py-1.5 text-sm text-main-text/70 disabled:opacity-40">
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}
