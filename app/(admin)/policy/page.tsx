"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (policy) {
      setDailyFine(String(policy.fine_per_day));
      setMaxDays(String(policy.loan_duration_days));
      setMaxBooks(String(policy.max_books_per_user));
    }
  }, [policy]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const fine = Number(dailyFine);
    const days = Number(maxDays);
    const books = Number(maxBooks);
    if (!Number.isInteger(fine) || fine < 0 || !Number.isInteger(days) || days < 1 || !Number.isInteger(books) || books < 1) {
      setError("Isi denda dengan bilangan bulat minimal 0, serta durasi dan jumlah buku minimal 1.");
      return;
    }

    try {
      await updatePolicy.mutateAsync({ fine_per_day: fine, loan_duration_days: days, max_books_per_user: books });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan kebijakan.");
    }
  };

  return (
    <div className="min-h-screen bg-cream p-4 font-sans sm:p-6 lg:p-10">
      <div className="mb-8 border-b border-main-border pb-6">
        <h1 className="font-display text-3xl text-secondary">Kebijakan &amp; denda</h1>
        <p className="mt-2 text-sm text-main-text-muted">Atur parameter denda harian dan kebijakan peminjaman.</p>
      </div>

      
      {saved && (
        <div role="status" className="fixed right-5 top-5 z-50 inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-[var(--shadow-overlay)]">
          <CheckCircle2 className="h-4 w-4" />
          Kebijakan disimpan!
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        <div className="rounded-lg border border-main-border bg-secondary p-5 text-white shadow-[var(--shadow-card)] sm:p-8">
          <h3 className="mb-8 font-display text-lg text-white">Pengaturan finansial</h3>
          <form onSubmit={handleSave} className="space-y-6">
            {error && <div id="policy-error" role="alert" className="flex items-start gap-2 rounded-md border border-red-200 bg-red-950/30 p-3 text-sm text-white"><AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
            <div>
              <label htmlFor="daily-fine" className="mb-2 block text-sm text-white/70">Denda telat per hari (Rp)</label>
              <input id="daily-fine" name="dailyFine" required min="0" step="1" type="number" value={dailyFine} onChange={(e) => setDailyFine(e.target.value)} aria-describedby={error ? "policy-error" : undefined} className="w-full rounded-md border border-white/20 bg-white/10 p-3 font-medium text-white outline-none focus:border-white" />
            </div>
            <div>
              <label htmlFor="max-days" className="mb-2 block text-sm text-white/70">Maks hari peminjaman</label>
              <input id="max-days" name="maxDays" required min="1" step="1" type="number" value={maxDays} onChange={(e) => setMaxDays(e.target.value)} aria-describedby={error ? "policy-error" : undefined} className="w-full rounded-md border border-white/20 bg-white/10 p-3 font-medium text-white outline-none focus:border-white" />
            </div>
            <div>
              <label htmlFor="max-books" className="mb-2 block text-sm text-white/70">Maks buku per user</label>
              <input id="max-books" name="maxBooks" required min="1" step="1" type="number" value={maxBooks} onChange={(e) => setMaxBooks(e.target.value)} aria-describedby={error ? "policy-error" : undefined} className="w-full rounded-md border border-white/20 bg-white/10 p-3 font-medium text-white outline-none focus:border-white" />
            </div>
            <button type="submit" disabled={updatePolicy.isPending} className="flex w-full items-center justify-center gap-2 rounded-md bg-white py-3 text-sm font-medium text-secondary transition-colors hover:bg-cream-soft disabled:opacity-60">
              {updatePolicy.isPending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
              {updatePolicy.isPending ? "Menyimpan..." : "Simpan kebijakan"}
            </button>
          </form>
        </div>

        
        <div className="space-y-6">
          <div className="rounded-lg border border-main-border bg-white p-5 shadow-[var(--shadow-card)] sm:p-8">
            <h3 className="mb-6 font-display text-lg text-main-text">Kebijakan aktif</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-main-border pb-3">
                <span className="text-sm text-main-text-muted">Denda harian</span>
                <span className="font-medium text-secondary">Rp {(policy?.fine_per_day ?? 0).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between border-b border-main-border pb-3">
                <span className="text-sm text-main-text-muted">Maks hari pinjam</span>
                <span className="font-medium text-secondary">{policy?.loan_duration_days ?? "-"} hari</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-main-text-muted">Maks buku/user</span>
                <span className="font-medium text-secondary">{policy?.max_books_per_user ?? "-"} buku</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
