"use client";

import { useAuth } from "@/context/AuthContext";
import { useDashboardSummary } from "@/hooks/useDashboard";

export default function AdminDashboard() {
  const { token } = useAuth();

  const { data, isLoading, isError } = useDashboardSummary(token);

  if (isLoading) return <div className="p-10 font-black text-secondary animate-pulse uppercase tracking-widest">Gathering System Data...</div>;

  if (isError) return <div className="p-10 text-red-500 font-black">Terjadi kesalahan saat memuat data database.</div>;

  return (
    <div className="p-10 bg-cream min-h-screen font-sans">
      <div className="mb-8 flex justify-between items-end border-b border-main-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-secondary uppercase tracking-tighter">Command Center</h1>
          <p className="text-[10px] text-main-text/40 font-bold uppercase tracking-widest mt-2">
            Server: <span className="text-green-600">{data?.server_status}</span> • Sync: {new Date(data?.last_updated || "").toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Koleksi", value: data?.total_books, color: "border-secondary" },
          { label: "User Aktif", value: data?.total_users, color: "border-blue-500" },
          { label: "Login Attempt", value: data?.login_attempts, color: "border-amber-500" },
          { label: "Failed Action", value: data?.failed_actions, color: "border-red-500" },
        ].map((item, i) => (
          <div key={i} className={`bg-white p-7 border-l-4 ${item.color} rounded-[32px] shadow-sm border border-main-border`}>
            <p className="text-[9px] font-black text-main-text/30 uppercase mb-1">{item.label}</p>
            <p className="text-3xl font-black text-secondary">{item.value ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Box Insight  */}
      <div className="bg-white rounded-[40px] border border-main-border shadow-2xl p-10 text-center">
        <div className="inline-block p-8 bg-cream rounded-full mb-6 text-4xl">🚀</div>
        <h3 className="text-lg font-black text-secondary uppercase mb-2">Sistem Terintegrasi</h3>
        <p className="text-[11px] text-main-text/50 max-w-xs mx-auto leading-relaxed">
          Saat ini terdapat <strong>{data?.total_logs}</strong> rekaman aktivitas yang tersimpan aman di database perpustakaan.
        </p>
      </div>
    </div>
  );
}
