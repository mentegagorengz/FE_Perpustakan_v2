"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SejarahPage() {
  const historyEvents = [
    { year: "1961", desc: "Lahirnya UPT Perpustakaan UNSRAT bersamaan dengan instansi induk Universitas Sam Ratulangi." },
    { year: "1962", desc: "Pembentukan perpustakaan di tiap fakultas akibat penggabungan perguruan tinggi di Sulawesi Utara-Tengah." },
    { year: "1967", desc: "Pendirian resmi Perpustakaan UNSRAT berdasarkan SK Menteri P dan K No. 12 tahun 1967." },
    { year: "1970", desc: "Pengangkatan Direktur Perpustakaan Pusat UNSRAT pertama pada 28 Agustus 1970." },
    { year: "1971", desc: "Beroperasi di ruangan seluas 30 m² milik Fakultas Ilmu Sosial dan Ilmu Politik." },
    { year: "1977", desc: "Perpustakaan resmi menempati gedung sendiri setelah beberapa kali berpindah lokasi." },
    { year: "1993", desc: "Perubahan status menjadi UPT Perpustakaan berdasarkan SK Mendikbud No. 02126/1993." },
    { year: "Sekarang", desc: "Dipimpin oleh Ir. Mecky R. E. Manoppo, MT (sejak 2023) menuju World Class University." },
  ];

  return (
    <div className="min-h-screen bg-white py-20 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Jejak Langkah</span>
          <h1 className="text-5xl font-black text-main-text uppercase tracking-tighter mb-4">Sejarah UPT</h1>
          <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>

        {/* Timeline Section */}
        <div className="relative border-l-2 border-gray-100 ml-4 md:ml-0 md:left-1/2">
          {historyEvents.map((event, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className={`relative mb-16 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right md:left-[-50%]" : "md:pl-12 md:left-[50%]"}`}>
              {/* Dot Indicator */}
              <div className="absolute top-0 left-[-9px] md:left-auto md:right-[-11px] w-4 h-4 rounded-full bg-secondary border-4 border-white shadow-sm z-10" style={index % 2 !== 0 ? { left: "-11px" } : {}}></div>

              <div className="bg-cream-soft p-8 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-2xl font-black text-secondary mb-2 block">{event.year}</span>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* List Kepala Perpustakaan (Detail Tambahan) */}
        <section className="mt-32">
          <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-10 text-center">Mantan Kepala Perpustakaan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 p-6 rounded-2xl">
              <ul className="text-[11px] font-bold text-gray-500 uppercase space-y-3">
                <li>1. Dra. Ny. Kalangi – Pandey</li>
                <li>2. Dra. NY. Jasin – L</li>
                <li>3. Ny. Piri – Kaunang</li>
                <li>...</li>
                <li>12. Freddy Lolong, SH., MH. (2018-2022)</li>
                <li className="text-secondary">13. Ir. Mecky R. E. Manoppo, MT. (2023 - Sekarang)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
