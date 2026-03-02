"use client";

import React, { useState } from "react";
import { useApp, Article } from "@/context/AppContext";

export default function ArticlesAdminPage() {
  const { articles, addArticle, updateArticle, deleteArticle } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Panduan");
  const [formAuthor, setFormAuthor] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImage, setFormImage] = useState("/images/staf-article-1.png");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft">("Draft");

  const categories = ["Semua", ...Array.from(new Set(articles.map((a) => a.category)))];

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === "Semua" || a.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const resetForm = () => {
    setFormTitle("");
    setFormCategory("Panduan");
    setFormAuthor("");
    setFormExcerpt("");
    setFormContent("");
    setFormImage("/images/staf-article-1.png");
    setFormStatus("Draft");
    setEditingId(null);
    setShowForm(false);
  };

  const openEditForm = (article: Article) => {
    setFormTitle(article.title);
    setFormCategory(article.category);
    setFormAuthor(article.author);
    setFormExcerpt(article.excerpt);
    setFormContent(article.content);
    setFormImage(article.image);
    setFormStatus(article.status);
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    if (editingId) {
      updateArticle(editingId, { title: formTitle, category: formCategory, author: formAuthor, excerpt: formExcerpt, content: formContent, image: formImage, status: formStatus, date: now });
    } else {
      addArticle({ title: formTitle, category: formCategory, author: formAuthor, excerpt: formExcerpt, content: formContent, image: formImage, status: formStatus, date: now });
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    deleteArticle(id);
    setShowDeleteConfirm(null);
  };

  const toggleStatus = (article: Article) => {
    updateArticle(article.id, { status: article.status === "Published" ? "Draft" : "Published" });
  };

  return (
    <div className="p-10 bg-cream min-h-screen font-sans">
      <div className="mb-8 flex justify-between items-end border-b border-main-border pb-6">
        <div>
          <h1 className="text-2xl font-black text-main-text uppercase tracking-tight">Warta & Artikel</h1>
          <p className="text-xs text-main-text/50 font-medium italic">Kelola konten informasi — perubahan langsung terlihat di halaman publik.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-secondary text-white text-[10px] font-black px-6 py-3 rounded-xl uppercase tracking-widest shadow-lg shadow-secondary/20 hover:scale-105 transition-all"
        >
          + Tulis Artikel Baru
        </button>
      </div>

      {/* Filter & Search */}
      <div className="mb-6 flex gap-4">
        <input type="text" placeholder="Cari judul artikel..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-cream-soft border border-main-border px-4 py-2 rounded-lg text-xs w-64 focus:outline-none focus:border-secondary transition-colors font-bold text-main-text/60" />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-cream-soft border border-main-border px-4 py-2 rounded-lg text-[10px] font-black uppercase text-main-text/60 outline-none">
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Tabel Artikel */}
      <div className="bg-cream-soft border border-main-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-surface font-black text-main-text/40 uppercase tracking-widest border-b border-main-border">
            <tr>
              <th className="p-5">Judul Artikel</th>
              <th className="p-5">Kategori</th>
              <th className="p-5">Penulis</th>
              <th className="p-5">Tanggal</th>
              <th className="p-5 text-center">Status</th>
              <th className="p-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-main-text/70">
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-main-border/50 hover:bg-surface/30 transition-all group">
                <td className="p-5 font-bold text-main-text uppercase tracking-tight max-w-xs truncate">{item.title}</td>
                <td className="p-5">
                  <span className="bg-white/50 border border-main-border px-2 py-1 rounded text-[9px] font-black uppercase">{item.category}</span>
                </td>
                <td className="p-5 font-medium">{item.author}</td>
                <td className="p-5 text-main-text/40">{item.date}</td>
                <td className="p-5 text-center">
                  <button onClick={() => toggleStatus(item)} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase cursor-pointer hover:opacity-80 transition ${item.status === "Published" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    {item.status}
                  </button>
                </td>
                <td className="p-5 text-right space-x-3">
                  <button onClick={() => openEditForm(item)} className="text-secondary font-black uppercase text-[9px] hover:underline">
                    Edit
                  </button>
                  <button onClick={() => setShowDeleteConfirm(item.id)} className="text-red-400 font-black uppercase text-[9px] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-main-text/30 italic">
                  Tidak ada artikel ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-main-border flex justify-between items-center">
              <h2 className="text-lg font-black text-main-text uppercase">{editingId ? "Edit Artikel" : "Tulis Artikel Baru"}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-red-500 text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-main-text/50 mb-1 block">Judul</label>
                <input required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full border border-main-border px-4 py-3 rounded-xl text-sm bg-cream-soft focus:outline-none focus:border-secondary" placeholder="Judul artikel..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-main-text/50 mb-1 block">Kategori</label>
                  <input required value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full border border-main-border px-4 py-3 rounded-xl text-sm bg-cream-soft focus:outline-none focus:border-secondary" placeholder="Panduan, Tips, dll" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-main-text/50 mb-1 block">Penulis</label>
                  <input required value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} className="w-full border border-main-border px-4 py-3 rounded-xl text-sm bg-cream-soft focus:outline-none focus:border-secondary" placeholder="Nama penulis" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-main-text/50 mb-1 block">URL Gambar</label>
                  <input value={formImage} onChange={(e) => setFormImage(e.target.value)} className="w-full border border-main-border px-4 py-3 rounded-xl text-sm bg-cream-soft focus:outline-none focus:border-secondary" placeholder="/images/..." />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-main-text/50 mb-1 block">Status</label>
                  <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as "Published" | "Draft")} className="w-full border border-main-border px-4 py-3 rounded-xl text-sm bg-cream-soft focus:outline-none focus:border-secondary">
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-main-text/50 mb-1 block">Ringkasan</label>
                <textarea required value={formExcerpt} onChange={(e) => setFormExcerpt(e.target.value)} rows={2} className="w-full border border-main-border px-4 py-3 rounded-xl text-sm bg-cream-soft focus:outline-none focus:border-secondary resize-none" placeholder="Ringkasan singkat..." />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-main-text/50 mb-1 block">Konten Lengkap</label>
                <textarea required value={formContent} onChange={(e) => setFormContent(e.target.value)} rows={6} className="w-full border border-main-border px-4 py-3 rounded-xl text-sm bg-cream-soft focus:outline-none focus:border-secondary resize-none" placeholder="Isi artikel..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 py-3 bg-surface text-main-text/60 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Batal
                </button>
                <button type="submit" className="flex-1 py-3 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20">
                  {editingId ? "Simpan Perubahan" : "Publikasikan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-cream p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="text-lg font-black text-main-text mb-2 uppercase">Hapus Artikel?</h3>
            <p className="text-xs text-main-text/50 mb-6">Artikel yang dihapus tidak bisa dikembalikan dan akan hilang dari halaman publik.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowDeleteConfirm(null)} className="py-3 bg-surface text-main-text/60 rounded-xl text-[10px] font-black uppercase">
                Batal
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
