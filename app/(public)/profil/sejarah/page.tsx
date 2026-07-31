"use client";

import React from "react";

export default function SejarahPage() {
  return (
    <div className="min-h-screen bg-cream py-20 font-sans">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-20 text-center">
          <span className="mb-3 block text-xs tracking-wide text-secondary">Jejak langkah</span>
          <h1 className="font-display text-4xl text-main-text md:text-5xl">Sejarah UPT</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-secondary"></div>
        </div>

        <section className="mx-auto max-w-2xl border-y border-main-border py-10 text-center">
          <h2 className="font-display text-2xl text-secondary">Data sejarah sedang diverifikasi</h2>
          <p className="mt-3 leading-relaxed text-main-text-muted">
            Kronologi, NPP, dan daftar pimpinan akan ditampilkan setelah dikonfirmasi oleh UPT Perpustakaan UNSRAT.
          </p>
        </section>
      </div>
    </div>
  );
}
