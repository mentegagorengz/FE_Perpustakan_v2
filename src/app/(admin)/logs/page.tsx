"use client";

import { useState } from "react";
import { ScrollText } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useActivityLogs } from "@/features/logs";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApiLog } from "@/features/logs";
import type { Column } from "@/components/ui";

const ACTION_FILTERS = ["all", "CREATE", "UPDATE", "DELETE", "LOGIN", "ACCESS_PAGE"] as const;

export default function AuditLogsPage() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterAction, setFilterAction] = useState<string>("all");

  const { data, isLoading, isPlaceholderData } = useActivityLogs({
    enabled: isAuthenticated,
    page: currentPage,
    action: filterAction,
  });

  const logs = data?.data ?? [];
  const meta = data?.meta;

  const columns: Column<ApiLog>[] = [
    {
      key: "created_at",
      header: "Timestamp",
      render: (log) => (
        <span className="font-mono text-xs text-main-text-muted">
          {new Date(log.created_at).toLocaleString("id-ID", { hour12: false })}
        </span>
      ),
    },
    {
      key: "user",
      header: "Identitas",
      render: (log) => (
        <div className="flex flex-col">
          <span className="font-medium text-main-text">{log.user?.full_name || "Guest Visitor"}</span>
          <span className="mt-0.5 text-xs text-main-text-muted">
            IP: {log.ip_address} &middot; {log.device_info || "Perangkat tidak diketahui"}
          </span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      render: (log) => (
        <span className="rounded-sm bg-surface px-2 py-1 text-xs font-medium text-main-text-muted">{log.action}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (log) => (
        <Badge variant={log.status === "SUCCESS" ? "success" : "danger"}>{log.status}</Badge>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-cream p-4 font-sans sm:p-6 lg:p-10">
      <PageHeader
        title="Audit sistem"
        description="Riwayat aktivitas dan keamanan sistem."
        icon={<ScrollText size={20} />}
        className="mb-8 border-b border-main-border pb-6"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {ACTION_FILTERS.map((act) => (
          <button
            key={act}
            onClick={() => {
              setFilterAction(act);
              setCurrentPage(1);
            }}
            className={cn(
              "rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors",
              filterAction === act
                ? "border-secondary bg-secondary text-white"
                : "border-main-border bg-paper text-main-text-muted hover:bg-surface",
            )}
          >
            {act === "all" ? "Semua" : act}
          </button>
        ))}
      </div>

      <DataTable
        className={cn("transition-opacity", isPlaceholderData && "opacity-50")}
        columns={columns}
        data={logs}
        keyField="id"
        isLoading={isLoading}
        page={currentPage}
        totalPages={meta?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        emptyTitle="Tidak ada log ditemukan"
        emptyDescription={meta ? `Total ${meta.total} catatan ditemukan` : undefined}
      />
    </div>
  );
}
