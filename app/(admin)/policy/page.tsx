"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePolicy, useUpdatePolicyMutation } from "@/hooks/usePolicy";

export default function PolicyPage() {
  const { token } = useAuth();
  const { data: policy } = usePolicy(token);
  const updatePolicy = useUpdatePolicyMutation();

  const [dailyFine, setDailyFine] = useState("");
  const [maxDays, setMaxDays] = useState("");
  const [maxBooks, setMaxBooks] = useState("");
  const [saved, setSaved] = useState(false);

  // Sinkronkan form dgn data server saat pertama tiba.
  useEffect(() => {
    if (policy) {
      setDailyFine(String(policy.fine_per_day));
      setMaxDays(String(policy.loan_duration_days));
      setMaxBooks(String(policy.max_books_per_user));
    }
  }, [policy]);

  const handleSave = async () => {
    await updatePolicy.mutateAsync({
      fine_per_day: parseInt(dailyFine) || 0,
      loan_duration_days: parseInt(maxDays) || 1,
      max_books_per_user: parseInt(maxBooks) || 1,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-cream p-10 font-sans">
      <div className="mb-8 border-b border-main-border pb-6">
        <h1 className="font-display text-3xl text-secondary">Kebijakan &amp; denda</h1>
        <p className="mt-2 text-sm text-main-text/60">Atur parameter denda harian dan kebijakan peminjaman.</p>
      </div>

      {/* Toast */}
      {saved && (
        <div className="fixed right-5 top-5 z-50 inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-[var(--shadow-overlay)]">
          <CheckCircle2 className="h-4 w-4" />
          Kebijakan disimpan!
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Panel Kebijakan */}
        <div className="rounded-lg border border-main-border bg-secondary p-8 text-white shadow-[var(--shadow-card)]">
          <h3 className="mb-8 font-display text-lg text-white">Pengaturan finansial</h3>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-white/70">Denda telat per hari (Rp)</label>
              <input type="number" value={dailyFine} onChange={(e) => setDailyFine(e.target.value)} className="w-full rounded-md border border-white/20 bg-white/10 p-3 font-medium text-white outline-none focus:border-white" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/70">Maks hari peminjaman</label>
              <input type="number" value={maxDays} onChange={(e) => setMaxDays(e.target.value)} className="w-full rounded-md border border-white/20 bg-white/10 p-3 font-medium text-white outline-none focus:border-white" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/70">Maks buku per user</label>
              <input type="number" value={maxBooks} onChange={(e) => setMaxBooks(e.target.value)} className="w-full rounded-md border border-white/20 bg-white/10 p-3 font-medium text-white outline-none focus:border-white" />
            </div>
            <button onClick={handleSave} className="w-full rounded-md bg-white py-3 text-sm font-medium text-secondary transition-colors hover:bg-cream-soft">
              Simpan kebijakan
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="rounded-lg border border-main-border bg-white p-8 shadow-[var(--shadow-card)]">
            <h3 className="mb-6 font-display text-lg text-main-text">Kebijakan aktif</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-main-border pb-3">
                <span className="text-sm text-main-text/60">Denda harian</span>
                <span className="font-medium text-secondary">Rp {(policy?.fine_per_day ?? 0).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between border-b border-main-border pb-3">
                <span className="text-sm text-main-text/60">Maks hari pinjam</span>
                <span className="font-medium text-secondary">{policy?.loan_duration_days ?? "-"} hari</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-main-text/60">Maks buku/user</span>
                <span className="font-medium text-secondary">{policy?.max_books_per_user ?? "-"} buku</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
