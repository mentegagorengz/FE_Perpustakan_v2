"use client";

import React from "react";

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-white py-20 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Profil */}
        <div className="bg-secondary p-12 rounded-[3rem] text-white mb-16 shadow-2xl shadow-secondary/20">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">UPA Perpustakaan</h1>
          <h2 className="text-xl font-bold opacity-80 uppercase mb-6">Universitas Sam Ratulangi</h2>
          <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Nomor Pokok Perpustakaan (NPP)</p>
            <p className="text-lg font-mono font-bold">7171092D1020413</p>
          </div>
        </div>

        {/* Konten Sejarah & Visi */}
        <div className="grid grid-cols-1 gap-16">
          <section>
            <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-4">Sejarah Singkat</h3>
            <p className="text-main-text leading-loose font-medium">Unit Pelaksana Teknis Perpustakaan Universitas Sam Ratulangi (UPT Perpustakaan UNSRAT) lahir pada tahun 1961 sejak lahirnya instansi induk yang sekarang dikenal sebagai Universitas Sam Ratulangi Manado.</p>
          </section>

          <section className="bg-cream-soft p-10 rounded-[2.5rem] border border-gray-100">
            <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-6 text-center">Visi Utama</h3>
            <p className="text-xl font-black text-main-text text-center leading-snug uppercase tracking-tight">"Menjadi pusat informasi ilmiah unggul dan berbudaya yang memberikan pelayanan prima berbasis teknologi informasi dan komunikasi."</p>
          </section>
        </div>
      </div>
    </div>
  );
}
