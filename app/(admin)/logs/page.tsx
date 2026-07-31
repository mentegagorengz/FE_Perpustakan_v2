"use client";

import React, { useState } from "react";
import { Loader2, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useActivityLogs } from "@/hooks/useActivityLogs";

export default function AuditLogsPage() {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterAction, setFilterAction] = useState("all");

  const { data, isLoading, isPlaceholderData } = useActivityLogs({
    token,
    page: currentPage,
    action: filterAction,
  });

  const logs = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-cream p-4 font-sans sm:p-6 lg:p-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-main-border pb-6">
        <div>
          <h1 className="font-display text-3xl text-secondary">Audit sistem</h1>
          <p className="mt-2 text-sm text-main-text/60">Riwayat aktivitas dan keamanan sistem.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "CREATE", "UPDATE", "DELETE", "LOGIN", "ACCESS_PAGE"].map((act) => (
            <button
              key={act}
              onClick={() => {
                setFilterAction(act);
                setCurrentPage(1);
              }}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${filterAction === act ? "border-secondary bg-secondary text-white" : "border-main-border bg-white text-main-text/60 hover:bg-surface"}`}
            >
              {act === "all" ? "Semua" : act}
            </button>
          ))}
        </div>
      </div>

      <div className={`mb-6 overflow-x-auto rounded-lg border border-main-border bg-white shadow-[var(--shadow-card)] transition-opacity ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}>
        <table className="min-w-[48rem] w-full text-left text-sm">
          <thead className="border-b border-main-border bg-surface text-main-text/60">
            <tr>
              <th className="p-4 font-medium">Timestamp</th>
              <th className="p-4 font-medium">Identitas</th>
              <th className="p-4 font-medium">Aksi</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-main-border text-main-text/80">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-16 text-center">
                  <span role="status" className="inline-flex items-center gap-2 text-secondary">
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    Memuat log...
                  </span>
                </td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr key={log.id} className="transition-colors hover:bg-surface/40">
                  <td className="p-4 font-mono text-xs text-main-text/50">{new Date(log.created_at).toLocaleString("id-ID", { hour12: false })}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-main-text">{log.user?.full_name || "Guest Visitor"}</span>
                      <span className="mt-0.5 text-xs text-main-text/40">
                        IP: {log.ip_address} &middot; {log.device_info || "Perangkat tidak diketahui"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="rounded-md bg-surface px-2 py-1 text-xs font-medium text-main-text/70">{log.action}</span>
                  </td>
                  <td className="p-4">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${log.status === "SUCCESS" ? "text-green-700" : "text-red-600"}`}>
                      {log.status === "SUCCESS" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {log.status}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-main-text/50">Total {meta.total} catatan ditemukan</p>
          <div className="flex flex-wrap items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="inline-flex items-center gap-1 rounded-md border border-main-border bg-white px-3 py-2 text-xs font-medium transition-colors hover:bg-surface disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </button>
            <div className="rounded-md bg-secondary px-4 py-2 text-xs font-medium text-white">
              Halaman {meta.page} dari {meta.totalPages}
            </div>
            <button disabled={currentPage === meta.totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="inline-flex items-center gap-1 rounded-md border border-main-border bg-white px-3 py-2 text-xs font-medium transition-colors hover:bg-surface disabled:opacity-40">
              Berikutnya
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
