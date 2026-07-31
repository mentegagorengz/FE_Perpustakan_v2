"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTransactionsList, useReturnMutation } from "@/hooks/useTransactions";

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");
const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleDateString("id-ID") : "-");

export default function SecurityTrackingPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTransactionsList({ token, page });
  const returnMutation = useReturnMutation();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const txs = data?.data ?? [];
  const activeCount = txs.filter((t) => t.status === "BORROWED").length;
  const overdueCount = txs.filter((t) => t.status === "OVERDUE").length;
  const returnedCount = txs.filter((t) => t.status === "RETURNED").length;

  const statusLabel = (s: string) =>
    s === "BORROWED" ? "Aktif" : s === "RETURNED" ? "Dikembalikan" : "Terlambat";

  const handleReturn = async (barcode: string, title: string) => {
    try {
      await returnMutation.mutateAsync(barcode);
      showToast(`"${title}" berhasil dikembalikan!`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal mengembalikan.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-cream p-4 font-sans sm:p-6 lg:p-10">
      
      <div className="mb-8 border-b border-main-border pb-6">
        <h1 className="font-display text-3xl text-secondary">Tracking peminjaman</h1>
        <p className="mt-2 text-sm text-main-text/60">Monitoring seluruh peminjaman buku perpustakaan.</p>
      </div>

      
      {toast && (
        <div role={toast.type === "error" ? "alert" : "status"} className={`fixed right-5 top-5 z-50 inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium text-white shadow-[var(--shadow-overlay)] ${toast.type === "error" ? "bg-red-700" : "bg-green-700"}`}>
          {toast.type === "error" ? <AlertCircle aria-hidden="true" className="h-4 w-4" /> : <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-main-border bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-main-text/50">Total ditemukan</p>
          <p className="mt-1 font-display text-3xl text-main-text">{data?.meta.total ?? 0}</p>
        </div>
        <div className="rounded-lg border border-main-border bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-main-text/50">Aktif</p>
          <p className="mt-1 font-display text-3xl text-secondary">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-main-border bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-main-text/50">Terlambat</p>
          <p className="mt-1 font-display text-3xl text-red-600">{overdueCount}</p>
        </div>
        <div className="rounded-lg border border-main-border bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-main-text/50">Dikembalikan</p>
          <p className="mt-1 font-display text-3xl text-green-700">{returnedCount}</p>
        </div>
      </div>

      
      <div className="overflow-x-auto rounded-lg border border-main-border bg-white shadow-[var(--shadow-card)]">
        <table className="min-w-[72rem] w-full text-left text-sm">
          <thead className="border-b border-main-border bg-surface text-main-text/60">
            <tr>
              <th className="p-4 font-medium">Peminjam</th>
              <th className="p-4 font-medium">Buku</th>
              <th className="p-4 font-medium">Tgl pinjam</th>
              <th className="p-4 font-medium">Jatuh tempo</th>
              <th className="p-4 font-medium">Denda</th>
              <th className="p-4 text-center font-medium">Status</th>
              <th className="p-4 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-main-border text-main-text/80">
            {txs.map((t) => (
              <tr key={t.id} className="transition-colors hover:bg-surface/40">
                <td className="p-4">
                  <div className="font-medium text-main-text">{t.user?.full_name ?? "-"}</div>
                  <div className="text-xs text-main-text/40">{t.user?.email ?? ""}</div>
                </td>
                <td className="p-4">{t.bookItem?.book?.title ?? "-"}</td>
                <td className="p-4 text-main-text/50">{fmtDate(t.borrowed_at)}</td>
                <td className="p-4 text-main-text/50">{fmtDate(t.due_date)}</td>
                <td className="p-4">{t.fine_amount > 0 ? <span className="font-medium text-red-600">{rupiah(t.fine_amount)}</span> : <span className="text-main-text/40">-</span>}</td>
                <td className="p-4 text-center">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${t.status === "BORROWED" ? "bg-secondary/10 text-secondary" : t.status === "RETURNED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{statusLabel(t.status)}</span>
                </td>
                <td className="p-4 text-right">
                  {t.status !== "RETURNED" && t.bookItem && (
                    <button disabled={returnMutation.isPending} onClick={() => handleReturn(t.bookItem!.barcode, t.bookItem?.book?.title ?? "")} className="inline-flex items-center gap-1.5 rounded-md border border-main-border px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-surface disabled:opacity-50">
                      <RotateCcw className="h-3.5 w-3.5" />
                      Kembalikan
                    </button>
                  )}
                  {t.status === "RETURNED" && t.returned_at && <span className="text-xs text-main-text/40">{fmtDate(t.returned_at)}</span>}
                </td>
              </tr>
            ))}
            {!isLoading && txs.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-main-text/40">
                  Tidak ada data peminjaman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
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
