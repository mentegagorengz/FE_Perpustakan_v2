"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useArticlesAdmin } from "@/hooks/useArticlesAdmin";

export default function ArticlesAdminPage() {
  const { token } = useAuth();
  const ui = useArticlesAdmin(token);

  if (ui.isLoading) return <div className="p-10 font-black text-secondary animate-pulse uppercase">Syncing Library Archive...</div>;

  return (
    <div className="p-10 bg-cream min-h-screen font-sans">
      <div className="mb-8 flex justify-between items-end border-b border-main-border pb-6">
        <div>
          <h1 className="text-2xl font-black text-main-text uppercase tracking-tight">Warta & Artikel</h1>
          <p className="text-xs text-main-text/50 font-medium italic text-left">Manajemen konten publik via NestJS API [cite: 2026-03-03].</p>
        </div>
        <button
          onClick={() => {
            ui.resetForm();
            ui.setShowForm(true);
          }}
          className="bg-secondary text-white text-[10px] font-black px-6 py-3 rounded-xl uppercase shadow-lg hover:scale-105 transition-all"
        >
          + Tulis Artikel Baru
        </button>
      </div>

      <div className="mb-6">
        <input type="text" placeholder="Cari judul artikel..." value={ui.searchTerm} onChange={(e) => ui.setSearchTerm(e.target.value)} className="bg-white border border-main-border px-4 py-2 rounded-lg text-xs w-64 focus:border-secondary outline-none font-bold" />
      </div>

      <div className="bg-white border border-main-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-surface font-black text-main-text/40 uppercase tracking-widest border-b border-main-border">
            <tr>
              <th className="p-5">Judul Artikel</th>
              <th className="p-5">Tanggal Dibuat</th>
              <th className="p-5 text-center">Status</th>
              <th className="p-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-main-text/70">
            {ui.articles.map((item) => (
              <tr key={item.id} className="border-b border-main-border/50 hover:bg-surface/30 transition-all group">
                <td className="p-5 font-bold text-main-text uppercase max-w-xs truncate text-left">{item.title}</td>
                <td className="p-5 text-main-text/40 font-mono text-left">{new Date(item.created_at || "").toLocaleDateString("id-ID")}</td>
                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${item.is_published ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>{item.is_published ? "Published" : "Draft"}</span>
                </td>
                <td className="p-5 text-right space-x-3">
                  <button onClick={() => ui.handleOpenEdit(item)} className="text-secondary font-black uppercase text-[9px] hover:underline">
                    Edit
                  </button>
                  <button onClick={() => ui.setShowDeleteConfirm(item.id || null)} className="text-red-400 font-black uppercase text-[9px] hover:underline">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ui.showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-main-border bg-white flex justify-between items-center">
              <h2 className="text-lg font-black text-main-text uppercase">{ui.editingId ? "Edit Artikel" : "Tulis Artikel Baru"}</h2>
              <button onClick={ui.resetForm} className="text-gray-400 hover:text-red-500 text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={ui.handleActionSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-main-text/50 mb-1 block text-left">Judul Artikel</label>
                <input required value={ui.form.title} onChange={(e) => ui.form.setTitle(e.target.value)} className="w-full border border-main-border px-4 py-3 rounded-xl text-sm outline-none focus:border-secondary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-main-text/50 mb-1 block text-left text-left">Upload Gambar Sampul</label>
                  <input type="file" accept="image/*" onChange={(e) => ui.form.setSelectedFile(e.target.files?.[0] || null)} className="w-full border border-main-border px-4 py-2 rounded-xl text-xs bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-secondary file:text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-main-text/50 mb-1 block text-left text-left">Status Publikasi</label>
                  <select value={ui.form.isPublished ? "true" : "false"} onChange={(e) => ui.form.setIsPublished(e.target.value === "true")} className="w-full border border-main-border px-4 py-3 rounded-xl text-sm outline-none">
                    <option value="false">Simpan sebagai Draft</option>
                    <option value="true">Publikasikan Langsung</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-main-text/50 mb-1 block text-left">Konten Lengkap</label>
                <textarea required value={ui.form.content} onChange={(e) => ui.form.setContent(e.target.value)} rows={8} className="w-full border border-main-border px-4 py-3 rounded-xl text-sm outline-none focus:border-secondary resize-none" />
              </div>
              <button type="submit" disabled={ui.isProcessing} className="w-full py-3 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg disabled:opacity-50">
                {ui.isProcessing ? "MEMPROSES..." : ui.editingId ? "SIMPAN PERUBAHAN" : "TERBITKAN ARTIKEL"}
              </button>
            </form>
          </div>
        </div>
      )}

      {ui.showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-main-border">
            <h3 className="text-lg font-black text-red-500 mb-2 uppercase tracking-tighter">Hapus Permanen?</h3>
            <p className="text-[10px] text-main-text/50 mb-6 font-bold uppercase tracking-widest">Aksi ini akan menghapus artikel dari database NestJS.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => ui.setShowDeleteConfirm(null)} className="py-3 bg-cream text-main-text/60 rounded-xl text-[10px] font-black uppercase">
                Batal
              </button>
              <button onClick={() => ui.handleDelete(ui.showDeleteConfirm!)} className="py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
