"use client";

import { LayoutDashboard, BookOpen, Users, ArrowLeftRight, TriangleAlert, Database } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useDashboardSummary } from "@/features/dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { StatsGrid } from "@/components/ui/stats-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError } = useDashboardSummary(isAuthenticated);

  const serverLine = `Server: ${isError ? "offline" : data?.server_status ?? "-"}${data?.last_updated ? ` \u00b7 Sync ${new Date(data.last_updated).toLocaleTimeString()}` : ""}`;

  return (
    <div className="min-h-screen bg-cream p-4 font-sans sm:p-6 lg:p-10">
      <PageHeader
        title="Command Center"
        description={isError ? "Terjadi kesalahan saat memuat data database." : serverLine}
        icon={<LayoutDashboard size={20} />}
        className="mb-8 border-b border-main-border pb-6"
      />

      {isError && (
        <div role="alert" className="mb-6 rounded-sm border border-danger-border bg-danger-surface p-4 text-sm text-danger-text">
          Terjadi kesalahan saat memuat data database.
        </div>
      )}

      <StatsGrid
        className="mb-10"
        isLoading={isLoading}
        items={[
          { label: "Total koleksi", value: data?.total_books ?? 0, icon: <BookOpen size={20} /> },
          { label: "User aktif", value: data?.total_users ?? 0, icon: <Users size={20} /> },
          { label: "Login attempt", value: data?.login_attempts ?? 0, icon: <ArrowLeftRight size={20} /> },
          { label: "Failed action", value: data?.failed_actions ?? 0, icon: <TriangleAlert size={20} /> },
        ]}
      />

      <div className="rounded-sm border border-main-border bg-paper p-5 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-soft text-secondary">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg text-secondary">Sistem terintegrasi</h3>
            {isLoading ? (
              <Skeleton className="mt-2 h-5 w-72" />
            ) : (
              <p className="mt-1 text-sm leading-relaxed text-main-text-muted">
                Saat ini terdapat <strong className="text-main-text">{data?.total_logs ?? 0}</strong> rekaman aktivitas yang tersimpan
                aman di database perpustakaan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
