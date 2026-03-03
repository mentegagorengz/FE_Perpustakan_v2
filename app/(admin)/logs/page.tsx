"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// Interface disesuaikan dengan response body asli 
interface AuditLog {
  id: number;
  created_at: string;
  user: {
    full_name: string;
    role: string;
  } | null;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "ACCESS_PAGE";
  module: string;
  details: string; // Menggunakan field 'details' sesuai response 
  status: "SUCCESS" | "FAILED";
  ip_address: string;
  device_info: string;
}

interface MetaPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number; // Menggunakan totalPages sesuai response 
}

export default function AuditLogsPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<MetaPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterAction, setFilterAction] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const parseDevice = (info: string) => {
    if (!info) return "Unknown Device";
    // Ambil info browser/OS utama saja agar tidak terlalu panjang [cite: 2026-02-27]
    return info.length > 30 ? info.substring(0, 30) + "..." : info;
  };

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        // Menggunakan URL activity-logs sesuai request url kamu 
        const query = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
          ...(filterAction !== "all" && { action: filterAction }),
          ...(searchTerm && { search: searchTerm }),
        });

        const response = await fetch(`http://localhost:3001/api/v1/activity-logs?${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();

        // Mengambil data dari result.data.data sesuai response body 
        setLogs(result.data?.data || []);
        setMeta(result.data?.meta || null);
      } catch (error) {
        console.error("Database Connection Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchLogs();
  }, [token, currentPage, filterAction, searchTerm]);

  return (
    <div className="p-10 bg-cream min-h-screen font-sans">
      <div className="mb-8 flex justify-between items-end border-b border-main-border pb-8">
        <div>
          <h1 className="text-3xl font-black text-secondary uppercase tracking-tighter">System Audit Logs</h1>
          <p className="text-[10px] text-main-text/40 font-bold uppercase mt-2 tracking-[0.2em]">Database Status: Connected to Activity Logs </p>
        </div>

        <div className="flex flex-col gap-4 items-end">
          {/* Filter Aksi */}
          <div className="flex flex-wrap gap-2 max-w-xl justify-end">
            {["all", "CREATE", "UPDATE", "DELETE", "LOGIN", "ACCESS_PAGE"].map((act) => (
              <button
                key={act}
                onClick={() => {
                  setFilterAction(act);
                  setCurrentPage(1);
                }}
                className={`text-[8px] font-black uppercase px-4 py-2.5 rounded-xl transition-all border ${filterAction === act ? "bg-secondary text-white shadow-lg" : "bg-white text-main-text/30"}`}
              >
                {act === "all" ? "Semua" : act.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-main-border mb-6">
        <table className="w-full text-left text-[10px]">
          <thead className="bg-secondary text-white/40 font-black uppercase tracking-[0.25em]">
            <tr>
              <th className="p-7">Waktu (WITA)</th>
              <th className="p-7">User & Device</th>
              <th className="p-7">Aksi & Modul</th>
              <th className="p-7">Status</th>
            </tr>
          </thead>
          <tbody className="text-main-text/80 font-bold">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-20 text-center animate-pulse font-black uppercase tracking-widest">
                  Reading Database...
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-main-border/20 hover:bg-cream/20 transition-all">
                  <td className="p-7 text-gray-400 font-mono italic">{new Date(log.created_at).toLocaleString("id-ID", { hour12: false })} </td>
                  <td className="p-7">
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-black uppercase ${!log.user ? "text-gray-400" : "text-secondary"}`}>{log.user?.full_name || "Guest Visitor"} </span>
                      <span className="text-[7px] text-main-text/30 font-black uppercase tracking-widest mt-1">
                        IP: {log.ip_address} • {parseDevice(log.device_info)} 
                      </span>
                    </div>
                  </td>
                  <td className="p-7">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-main-text uppercase font-black">{log.action}</span>
                      <span className="text-[8px] text-main-text/40 font-medium lowercase truncate max-w-50 italic">
                        {log.module}: {log.details} 
                      </span>
                    </div>
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
            {!isLoading && logs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-20 text-center text-main-text/20 font-black uppercase tracking-[0.5em]">
                  Data Audit Kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="flex justify-between items-center px-6">
          <p className="text-[10px] font-black text-main-text/30 uppercase tracking-widest">
            Menampilkan {logs.length} dari {meta.total} data 
          </p>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="px-6 py-3 bg-white border border-main-border rounded-xl text-[10px] font-black uppercase disabled:opacity-30 hover:bg-secondary hover:text-white transition-all">
              ← Previous
            </button>
            <div className="px-6 py-3 bg-secondary text-white rounded-xl text-[10px] font-black">
              Page {meta.page} of {meta.totalPages} 
            </div>
            <button disabled={currentPage === meta.totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className="px-6 py-3 bg-white border border-main-border rounded-xl text-[10px] font-black uppercase disabled:opacity-30 hover:bg-secondary hover:text-white transition-all">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
