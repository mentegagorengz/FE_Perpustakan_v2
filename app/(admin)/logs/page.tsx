"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useActivityLogs } from "@/hooks/useActivityLogs";

export default function AuditLogsPage() {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterAction, setFilterAction] = useState("all");

  // Panggil hook kita [cite: 2026-03-03]
  const { data, isLoading, isPlaceholderData } = useActivityLogs({
    token,
    page: currentPage,
    action: filterAction,
  });

  const logs = data?.data || [];
  const meta = data?.meta;

  const parseDevice = (info: string) => {
    if (!info) return "Unknown Device";
    return info.length > 25 ? info.substring(0, 25) + "..." : info;
  };

  return (
    <div className="p-10 bg-cream min-h-screen font-sans">
      <div className="mb-8 flex justify-between items-end border-b border-main-border pb-8">
        <h1 className="text-3xl font-black text-secondary uppercase tracking-tighter">System Audit</h1>

        {/* Filter Aksi */}
        <div className="flex gap-2">
          {["all", "CREATE", "UPDATE", "DELETE", "LOGIN", "ACCESS_PAGE"].map((act) => (
            <button
              key={act}
              onClick={() => {
                setFilterAction(act);
                setCurrentPage(1);
              }}
              className={`text-[8px] font-black uppercase px-4 py-2 rounded-lg transition-all border ${filterAction === act ? "bg-secondary text-white shadow-lg" : "bg-white text-main-text/30"}`}
            >
              {act === "all" ? "Semua" : act}
            </button>
          ))}
        </div>
      </div>

      <div className={`bg-white rounded-[40px] overflow-hidden shadow-2xl border border-main-border mb-6 transition-opacity ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}>
        <table className="w-full text-left text-[10px]">
          <thead className="bg-secondary text-white/40 font-black uppercase tracking-[0.25em]">
            <tr>
              <th className="p-7">Timestamp</th>
              <th className="p-7">Identity</th>
              <th className="p-7">Action</th>
              <th className="p-7">Status</th>
            </tr>
          </thead>
          <tbody className="text-main-text/80 font-bold">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-20 text-center animate-pulse">
                  Synchronizing Logs...
                </td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr key={log.id} className="border-b border-main-border/20 hover:bg-cream/20">
                  <td className="p-7 text-gray-400 font-mono italic">{new Date(log.created_at).toLocaleString("id-ID", { hour12: false })}</td>
                  <td className="p-7">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase text-secondary">{log.user?.full_name || "Guest Visitor"}</span>
                      <span className="text-[7px] text-main-text/30 font-black uppercase tracking-widest mt-1">
                        IP: {log.ip_address} • {parseDevice(log.device_info)}
                      </span>
                    </div>
                  </td>
                  <td className="p-7">
                    <span className="text-[10px] text-main-text uppercase font-black">{log.action}</span>
                  </td>
                  <td className="p-7">
                    <div className={`flex items-center gap-2 text-[9px] font-black ${log.status === "SUCCESS" ? "text-green-600" : "text-red-600"}`}>
                      <div className={`w-2 h-2 rounded-full ${log.status === "SUCCESS" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                      {log.status}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {meta && (
        <div className="flex justify-between items-center px-6">
          <p className="text-[10px] font-black text-main-text/30 uppercase tracking-widest">Total {meta.total} Records Found</p>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-6 py-3 bg-white border border-main-border rounded-xl text-[10px] font-black uppercase disabled:opacity-30 hover:bg-secondary hover:text-white transition-all">
              ← Prev
            </button>
            <div className="px-6 py-3 bg-secondary text-white rounded-xl text-[10px] font-black">
              Page {meta.page} of {meta.totalPages}
            </div>
            <button disabled={currentPage === meta.totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-6 py-3 bg-white border border-main-border rounded-xl text-[10px] font-black uppercase disabled:opacity-30 hover:bg-secondary hover:text-white transition-all">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
