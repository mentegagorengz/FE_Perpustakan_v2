"use client";

import { Loader2, BookOpen, Users, ArrowLeftRight, TriangleAlert, Database } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDashboardSummary } from "@/hooks/useDashboard";

export default function AdminDashboard() {
  const { token } = useAuth();

  const { data, isLoading, isError } = useDashboardSummary(token);

  if (isLoading)
    return (
      <div className="flex items-center gap-2 p-10 text-secondary">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Memuat data sistem...</span>
      </div>
    );

  if (isError)
    return <div className="p-10 text-red-600">Terjadi kesalahan saat memuat data database.</div>;

  const stats = [
    { label: "Total koleksi", value: data?.total_books, icon: BookOpen },
    { label: "User aktif", value: data?.total_users, icon: Users },
    { label: "Login attempt", value: data?.login_attempts, icon: ArrowLeftRight },
    { label: "Failed action", value: data?.failed_actions, icon: TriangleAlert },
  ];

  return (
    <div className="min-h-screen bg-cream p-10 font-sans">
      <div className="mb-8 border-b border-main-border pb-6">
        <h1 className="text-3xl font-display text-secondary">Command Center</h1>
        <p className="mt-2 text-sm text-main-text/60">
          Server: <span className="text-green-700">{data?.server_status}</span> &middot; Sync{" "}
          {new Date(data?.last_updated || "").toLocaleTimeString()}
        </p>
      </div>

      {/* Grid Statistik */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-lg border border-main-border bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream-soft text-secondary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl text-secondary">{item.value ?? 0}</p>
              <p className="mt-1 text-sm text-main-text/60">{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* Box Insight */}
      <div className="rounded-lg border border-main-border bg-white p-8 shadow-[var(--shadow-card)]">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-soft text-secondary">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg text-secondary">Sistem terintegrasi</h3>
            <p className="mt-1 text-sm leading-relaxed text-main-text/60">
              Saat ini terdapat <strong className="text-main-text">{data?.total_logs}</strong> rekaman
              aktivitas yang tersimpan aman di database perpustakaan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
