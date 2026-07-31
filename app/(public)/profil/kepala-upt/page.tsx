"use client";

import React from "react";

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-cream py-20 font-sans">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-16 rounded-lg bg-secondary p-10 text-white shadow-[var(--shadow-raised)] md:p-12">
          <h1 className="font-display text-4xl leading-tight md:text-5xl">UPT Perpustakaan</h1>
          <h2 className="mt-1 font-display text-xl text-white/80">Universitas Sam Ratulangi</h2>
          <div className="mt-6 inline-block rounded-md border border-white/20 bg-white/10 px-6 py-3">
            <p className="text-xs tracking-wide text-white/70">Nomor Pokok Perpustakaan (NPP)</p>
            <p className="font-mono text-lg font-semibold">Belum diverifikasi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <section className="max-w-2xl">
            <p className="mb-3 text-xs tracking-wide text-secondary">Sejarah singkat</p>
            <p className="leading-relaxed text-main-text/80">
               UPT Perpustakaan Universitas Sam Ratulangi mendukung kegiatan belajar, penelitian, dan pengabdian
               sivitas akademika melalui layanan informasi yang inklusif.
            </p>
          </section>

          <section className="rounded-lg border border-main-border bg-cream-soft p-10 shadow-[var(--shadow-card)]">
            <p className="mb-4 text-center text-xs tracking-wide text-secondary">Informasi institusional</p>
            <p className="text-center text-main-text-muted">
              NPP, sejarah resmi, visi, dan profil pimpinan menunggu verifikasi dari UPT Perpustakaan UNSRAT.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
