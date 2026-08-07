"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Crosshair, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useTransactionsList, useReturnMutation } from "@/hooks/use-transactions";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatsGrid } from "@/components/ui/stats-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ApiTransaction } from "@/types/api";
import type { Column } from "@/types/ui";

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");
const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleDateString("id-ID") : "-");

const statusLabel = (s: string) => (s === "BORROWED" ? "Aktif" : s === "RETURNED" ? "Dikembalikan" : "Terlambat");
const statusVariant = (s: string) => (s === "BORROWED" ? "primary" : s === "RETURNED" ? "success" : "danger") as "primary" | "success" | "danger";

export default function SecurityTrackingPage() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTransactionsList({ enabled: isAuthenticated, page });
  const returnMutation = useReturnMutation();

  const txs = data?.data ?? [];
  const activeCount = txs.filter((t) => t.status === "BORROWED").length;
  const overdueCount = txs.filter((t) => t.status === "OVERDUE").length;
  const returnedCount = txs.filter((t) => t.status === "RETURNED").length;

  const handleReturn = async (barcode: string, title: string) => {
    try {
      await returnMutation.mutateAsync(barcode);
      toast.success(`"${title}" berhasil dikembalikan!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal mengembalikan.");
    }
  };

  const columns: Column<ApiTransaction>[] = [
    {
      key: "user",
      header: "Peminjam",
      render: (t) => (
        <div>
          <div className="font-medium text-main-text">{t.user?.full_name ?? "-"}</div>
          <div className="text-xs text-main-text-muted">{t.user?.email ?? ""}</div>
        </div>
      ),
    },
    {
      key: "bookItem",
      header: "Buku",
      render: (t) => <span className="text-main-text-muted">{t.bookItem?.book?.title ?? "-"}</span>,
    },
    { key: "borrowed_at", header: "Tgl pinjam", render: (t) => <span className="text-main-text-muted">{fmtDate(t.borrowed_at)}</span> },
    { key: "due_date", header: "Jatuh tempo", render: (t) => <span className="text-main-text-muted">{fmtDate(t.due_date)}</span> },
    {
      key: "fine_amount",
      header: "Denda",
      render: (t) =>
        t.fine_amount > 0 ? <span className="font-medium text-danger-text">{rupiah(t.fine_amount)}</span> : <span className="text-main-text-muted">-</span>,
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: (t) => <Badge variant={statusVariant(t.status)}>{statusLabel(t.status)}</Badge>,
    },
    {
      key: "id",
      header: "Aksi",
      align: "right",
      render: (t) =>
        t.status !== "RETURNED" && t.bookItem ? (
          <Button variant="outline" className="px-3 py-1.5 text-xs text-secondary" disabled={returnMutation.isPending} onClick={() => handleReturn(t.bookItem!.barcode, t.bookItem?.book?.title ?? "")}>
            <RotateCcw className="h-3.5 w-3.5" />
            Kembalikan
          </Button>
        ) : (
          t.returned_at && <span className="text-xs text-main-text-muted">{fmtDate(t.returned_at)}</span>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-cream p-4 font-sans sm:p-6 lg:p-10">
      <PageHeader
        title="Tracking peminjaman"
        description="Monitoring seluruh peminjaman buku perpustakaan."
        icon={<Crosshair size={20} />}
        className="mb-8 border-b border-main-border pb-6"
      />

      <StatsGrid
        className="mb-8"
        items={[
          { label: "Total ditemukan", value: data?.meta.total ?? 0, icon: <></> },
          { label: "Aktif", value: activeCount, icon: <></> },
          { label: "Terlambat", value: overdueCount, icon: <></> },
          { label: "Dikembalikan", value: returnedCount, icon: <></> },
        ]}
      />

      <DataTable
        columns={columns}
        data={txs}
        keyField="id"
        isLoading={isLoading}
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
        emptyTitle="Tidak ada data peminjaman"
      />
    </div>
  );
}
