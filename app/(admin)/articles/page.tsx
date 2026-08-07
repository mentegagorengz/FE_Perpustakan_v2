"use client";

import { useEffect } from "react";
import { Loader2, Plus, Pencil, Trash2, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useArticlesAdmin } from "@/hooks/use-articles-admin";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogCloseButton,
} from "@/components/ui/dialog";
import type { ApiArticle } from "@/types/api";
import type { Column } from "@/types/ui";

export default function ArticlesAdminPage() {
  const { isAuthenticated } = useAuth();
  const ui = useArticlesAdmin(isAuthenticated);

  useEffect(() => {
    if (ui.articleError) toast.error(ui.articleError instanceof Error ? ui.articleError.message : "Gagal memproses artikel.");
  }, [ui.articleError]);

  const columns: Column<ApiArticle>[] = [
    {
      key: "title",
      header: "Judul artikel",
      width: "60%",
      render: (item) => <span className="block max-w-xs truncate font-medium text-main-text">{item.title}</span>,
    },
    {
      key: "created_at",
      header: "Tanggal dibuat",
      render: (item) => (
        <span className="text-main-text-muted">
          {new Date(item.created_at || "").toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      key: "is_published",
      header: "Status",
      align: "right",
      render: (item) => (
        <Badge variant={item.is_published ? "success" : "neutral"}>{item.is_published ? "Published" : "Draft"}</Badge>
      ),
    },
    {
      key: "id",
      header: "Aksi",
      align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={() => ui.handleOpenEdit(item)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button variant="dangerOutline" className="px-3 py-1.5 text-xs" onClick={() => ui.setShowDeleteConfirm(item.id || null)}>
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  if (ui.isLoading)
    return (
      <div className="min-h-screen bg-cream p-4 sm:p-6 lg:p-10">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-cream p-4 font-sans sm:p-6 lg:p-10">
      <PageHeader
        title="Warta & Artikel"
        description="Manajemen konten publik perpustakaan."
        icon={<Newspaper size={20} />}
        actions={
          <Button
            onClick={() => {
              ui.resetForm();
              ui.setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Tulis artikel baru
          </Button>
        }
        className="mb-8 border-b border-main-border pb-6"
      />

      <DataTable
        columns={columns}
        data={ui.articles}
        keyField="id"
        searchValue={ui.searchTerm}
        onSearchChange={ui.setSearchTerm}
        searchPlaceholder="Cari judul artikel..."
        emptyTitle="Tidak ada artikel"
        emptyDescription="Belum ada artikel yang cocok. Tulis artikel baru untuk memulai."
      />

      <Dialog open={ui.showForm} onOpenChange={(open) => !open && ui.resetForm()}>
        <DialogContent className="max-w-2xl bg-cream">
          <DialogHeader className="bg-paper">
            <DialogTitle className="text-secondary">{ui.editingId ? "Edit artikel" : "Tulis artikel baru"}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <form onSubmit={ui.handleActionSubmit} className="space-y-4 overflow-y-auto p-6">
            <div>
              <label htmlFor="article-title" className="mb-1 block text-sm font-medium text-main-text-muted">
                Judul artikel
              </label>
              <Input
                id="article-title"
                name="title"
                required
                value={ui.form.title}
                onChange={(e) => ui.form.setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="article-cover" className="mb-1 block text-sm font-medium text-main-text-muted">
                  Gambar sampul
                </label>
                <input
                  id="article-cover"
                  name="cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => ui.form.setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full rounded-sm border border-main-border bg-paper px-4 py-2 text-xs file:mr-4 file:rounded-sm file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-xs file:font-medium file:text-white"
                />
              </div>
              <div>
                <label htmlFor="article-status" className="mb-1 block text-sm font-medium text-main-text-muted">
                  Status publikasi
                </label>
                <select
                  id="article-status"
                  name="status"
                  value={ui.form.isPublished ? "true" : "false"}
                  onChange={(e) => ui.form.setIsPublished(e.target.value === "true")}
                  className="w-full rounded-sm border border-main-border bg-paper px-4 py-2.5 text-sm outline-none focus:border-secondary"
                >
                  <option value="false">Simpan sebagai draft</option>
                  <option value="true">Publikasikan langsung</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="article-content" className="mb-1 block text-sm font-medium text-main-text-muted">
                Konten lengkap
              </label>
              <textarea
                id="article-content"
                name="content"
                required
                value={ui.form.content}
                onChange={(e) => ui.form.setContent(e.target.value)}
                rows={8}
                className="w-full resize-none rounded-sm border border-main-border bg-paper px-4 py-3 text-sm outline-none focus:border-secondary"
              />
            </div>
            <Button type="submit" disabled={ui.isProcessing} className="w-full">
              {ui.isProcessing && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
              {ui.isProcessing ? "Memproses..." : ui.editingId ? "Simpan perubahan" : "Terbitkan artikel"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={ui.showDeleteConfirm !== null} onOpenChange={(open) => !open && ui.setShowDeleteConfirm(null)}>
        <DialogContent className="w-full max-w-sm border border-main-border bg-paper p-8 text-center">
          <DialogTitle className="text-danger-text">Hapus permanen?</DialogTitle>
          <DialogDescription className="mb-6 mt-2">
            Artikel ini akan dihapus dari basis data dan tidak bisa dikembalikan.
          </DialogDescription>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" disabled={ui.isProcessing} onClick={() => ui.setShowDeleteConfirm(null)}>
              Batal
            </Button>
            <Button variant="danger" disabled={ui.isProcessing} onClick={() => ui.handleDelete(ui.showDeleteConfirm!)}>
              {ui.isProcessing ? "Menghapus..." : "Ya, hapus"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
