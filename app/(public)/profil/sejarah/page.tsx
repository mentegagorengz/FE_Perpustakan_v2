"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SejarahPage() {
  const historyEvents = [
    { year: "2001", desc: "Perpustakaan Cakrawala mulai melayani sivitas Universitas Cakrawala Nusantara." },
    { year: "2005", desc: "Layanan koleksi diperluas melalui pembukaan ruang baca di setiap fakultas." },
    { year: "2010", desc: "Katalog perpustakaan mulai dikelola melalui sistem informasi terintegrasi." },
    { year: "2014", desc: "Perpustakaan menempati gedung layanan terpadu di kawasan kampus utama." },
    { year: "2018", desc: "Repositori institusi diluncurkan untuk mendukung publikasi karya ilmiah." },
    { year: "2021", desc: "Koleksi digital dan layanan peminjaman mandiri mulai tersedia." },
    { year: "2024", desc: "Program literasi informasi diperluas untuk seluruh sivitas akademika." },
    { year: "Sekarang", desc: "Perpustakaan terus mengembangkan layanan belajar, riset, dan literasi digital." },
  ];

  return (
    <div className="min-h-screen bg-cream py-20 font-sans">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-20 text-center">
          <span className="mb-3 block text-xs tracking-wide text-secondary">Jejak langkah</span>
          <h1 className="font-display text-4xl text-main-text md:text-5xl">Sejarah UPT</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-secondary"></div>
        </div>

        <div className="relative ml-4 border-l-2 border-main-border md:left-1/2 md:ml-0">
          {historyEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative mb-16 md:w-1/2 ${index % 2 === 0 ? "md:left-[-50%] md:pr-12 md:text-right" : "md:left-[50%] md:pl-12"}`}
            >
              <div
                className="absolute left-[-9px] top-0 z-10 h-4 w-4 rounded-full border-4 border-cream bg-secondary shadow-[var(--shadow-card)] md:left-auto md:right-[-11px]"
                style={index % 2 !== 0 ? { left: "-11px" } : {}}
              ></div>

              <div className="rounded-lg border border-main-border bg-cream-soft p-8 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]">
                <span className="mb-2 block font-display text-2xl text-secondary">{event.year}</span>
                <p className="leading-relaxed text-main-text/70">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-32">
          <p className="mb-10 text-center text-xs tracking-wide text-secondary">Mantan kepala perpustakaan</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-main-border bg-cream-soft p-6 shadow-[var(--shadow-card)]">
              <ul className="space-y-3 text-sm text-main-text/70">
                <li>1. Dr. Bima Santosa, M.Hum. (2001-2008)</li>
                <li>2. Lestari Wicaksono, M.Si. (2008-2016)</li>
                <li>3. Raka Mahendra, M.I.Kom. (2016-2023)</li>
                <li className="text-secondary">4. Dr. Aruna Pratama, M.Si. (2023-Sekarang)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
