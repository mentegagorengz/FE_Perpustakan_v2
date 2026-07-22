"use client";

import React from "react";
import { Loader2, Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useArticlesAdmin } from "@/hooks/useArticlesAdmin";

export default function ArticlesAdminPage() {
  const { token } = useAuth();
  const ui = useArticlesAdmin(token);

  if (ui.isLoading)
    return (
      <div className="flex items-center gap-2 p-10 text-secondary">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Memuat data artikel...</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-cream p-10 font-sans">
      <div className="mb-8 flex items-end justify-between border-b border-main-border pb-6">
        <div>
          <h1 className="font-display text-3xl text-secondary">Warta &amp; Artikel</h1>
          <p className="mt-2 text-sm text-main-text/60">Manajemen konten publik perpustakaan.</p>
        </div>
        <button
          onClick={() => {
            ui.resetForm();
            ui.setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-secondary-hover"
        >
          <Plus className="h-4 w-4" />
          Tulis artikel baru
        </button>
      </div>

      <div className="mb-6">
        <div className="relative w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-main-text/40" />
          <input
            type="text"
            placeholder="Cari judul artikel..."
            value={ui.searchTerm}
            onChange={(e) => ui.setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-main-border bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-secondary"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-main-border bg-white shadow-[var(--shadow-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-main-border bg-surface text-main-text/60">
            <tr>
              <th className="p-4 font-medium">Judul artikel</th>
              <th className="p-4 font-medium">Tanggal dibuat</th>
              <th className="p-4 text-center font-medium">Status</th>
              <th className="p-4 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-main-border text-main-text/80">
            {ui.articles.map((item: any) => (
              <tr key={item.id} className="transition-colors hover:bg-surface/40">
                <td className="max-w-xs truncate p-4 font-medium text-main-text">{item.title}</td>
                <td className="p-4 text-main-text/50">{new Date(item.created_at || "").toLocaleDateString("id-ID")}</td>
                <td className="p-4 text-center">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${item.is_published ? "bg-green-100 text-green-700" : "bg-surface text-main-text/50"}`}>
                    {item.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => ui.handleOpenEdit(item)} className="inline-flex items-center gap-1.5 rounded-md border border-main-border px-3 py-1.5 text-xs font-medium text-main-text/80 transition-colors hover:bg-surface">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button onClick={() => ui.setShowDeleteConfirm(item.id || null)} className="inline-flex items-center gap-1.5 rounded-md border border-main-border px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ui.showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-cream shadow-[var(--shadow-overlay)]">
            <div className="flex items-center justify-between border-b border-main-border bg-white p-6">
              <h2 className="font-display text-xl text-secondary">{ui.editingId ? "Edit artikel" : "Tulis artikel baru"}</h2>
              <button onClick={ui.resetForm} className="rounded-md p-1 text-main-text/50 transition-colors hover:bg-surface hover:text-main-text">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={ui.handleActionSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-main-text/70">Judul artikel</label>
                <input required value={ui.form.title} onChange={(e) => ui.form.setTitle(e.target.value)} className="w-full rounded-md border border-main-border px-4 py-2.5 text-sm outline-none focus:border-secondary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-main-text/70">Gambar sampul</label>
                  <input type="file" accept="image/*" onChange={(e) => ui.form.setSelectedFile(e.target.files?.[0] || null)} className="w-full rounded-md border border-main-border bg-white px-4 py-2 text-xs file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-xs file:font-medium file:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-main-text/70">Status publikasi</label>
                  <select value={ui.form.isPublished ? "true" : "false"} onChange={(e) => ui.form.setIsPublished(e.target.value === "true")} className="w-full rounded-md border border-main-border px-4 py-2.5 text-sm outline-none focus:border-secondary">
                    <option value="false">Simpan sebagai draft</option>
                    <option value="true">Publikasikan langsung</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-main-text/70">Konten lengkap</label>
                <textarea required value={ui.form.content} onChange={(e) => ui.form.setContent(e.target.value)} rows={8} className="w-full resize-none rounded-md border border-main-border px-4 py-3 text-sm outline-none focus:border-secondary" />
              </div>
              <button type="submit" disabled={ui.isProcessing} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-secondary py-3 text-sm font-medium text-white transition-colors hover:bg-secondary-hover disabled:opacity-50">
                {ui.isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                {ui.isProcessing ? "Memproses..." : ui.editingId ? "Simpan perubahan" : "Terbitkan artikel"}
              </button>
            </form>
          </div>
        </div>
      )}

      {ui.showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg border border-main-border bg-white p-8 text-center shadow-[var(--shadow-overlay)]">
            <h3 className="font-display text-xl text-red-600">Hapus permanen?</h3>
            <p className="mb-6 mt-2 text-sm text-main-text/60">Artikel ini akan dihapus dari basis data dan tidak bisa dikembalikan.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => ui.setShowDeleteConfirm(null)} className="rounded-md border border-main-border py-2.5 text-sm font-medium text-main-text/70 transition-colors hover:bg-surface">
                Batal
              </button>
              <button onClick={() => ui.handleDelete(ui.showDeleteConfirm!)} className="rounded-md bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700">
                Ya, hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
