"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // Import untuk animasi smooth
import { useHome } from "@/hooks/useHome";
import { useNews } from "@/hooks/useNews";
import { images } from "@/constants/Home";

export default function Home() {
  const { currentIndex, handleSearchBook } = useHome(images.length);
  const { articles, loading, setCategory, category } = useNews();

  const categories = [
    { id: "general", label: "Umum" },
    { id: "technology", label: "Teknologi" },
    { id: "business", label: "Bisnis" },
    { id: "health", label: "Kesehatan" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <main className="flex-1">
        {/* Section Hero tetap sama */}
        <section className="relative w-full h-[500px] overflow-hidden">
          {images.map((src, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}>
              <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>
          ))}
          <div className="relative text-center text-white z-10 flex flex-col items-center justify-center h-full px-4">
            <h2 className="text-5xl font-extrabold mb-4 leading-tight">Perpustakaan UNSRAT</h2>
            <p className="text-lg mb-6 font-light">Pusat informasi dan literasi terbaik.</p>
          </div>
        </section>

        {/* Section Berita dengan Animasi Smooth [cite: 2026-02-19] */}
        <section id="berita" className="py-20 bg-cream overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-black text-main-text uppercase tracking-tighter">Headline Indonesia</h3>
              <p className="mt-2 text-main-text/60 italic">Navigasi berita nasional dengan sekali sentuh.</p>
            </div>

            {/* Tab Kategori dengan efek Hover & Active Inovatif */}
            <div className="flex justify-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setCategory(cat.id)} className={`relative px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${category === cat.id ? "text-white scale-105" : "text-gray-400 bg-white hover:bg-gray-50 border border-gray-100"}`}>
                  {category === cat.id && <motion.div layoutId="activeTab" className="absolute inset-0 bg-secondary rounded-full -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                  {cat.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-10 w-10 border-4 border-gray-100 border-t-secondary rounded-full" />
              </div>
            ) : (
              <div className="relative min-h-[450px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={category} // Mengunci animasi pada perubahan kategori [cite: 2026-02-19]
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  >
                    {articles.slice(0, 3).map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -10 }} // Efek melayang saat di-hover [cite: 2025-09-24]
                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 flex flex-col group"
                      >
                        <div className="relative h-56 w-full overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[8px] font-black uppercase text-secondary shadow-sm">{category}</div>
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                          <h4 className="text-sm font-black text-main-text mb-4 line-clamp-2 leading-snug uppercase tracking-tight group-hover:text-secondary transition-colors">{item.title}</h4>
                          <p className="text-[11px] text-gray-400 mb-8 line-clamp-3 leading-relaxed font-medium">{item.description}</p>
                          <a href={item.url} target="_blank" className="mt-auto py-4 bg-secondary text-white text-[10px] font-black text-center uppercase tracking-widest rounded-2xl shadow-lg shadow-secondary/20 active:scale-95 transition-all">
                            Baca Selengkapnya
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* Section Artikel Staf / Info Kampus [cite: 2026-02-12] */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12 border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-2xl font-black text-main-text uppercase tracking-tighter">Warta Perpustakaan</h3>
                <p className="text-gray-400 text-xs font-medium mt-1">Artikel dan informasi resmi dari staf perpustakaan UNSRAT.</p>
              </div>
              <button className="text-secondary text-[10px] font-black uppercase tracking-widest hover:underline">Lihat Semua Artikel →</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Artikel Utama (Highlight) [cite: 2025-09-24] */}
              <div className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] h-[400px]">
                <Image src="/images/staf-article-1.png" alt="Highlight" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                  <span className="bg-secondary text-white text-[8px] font-black px-3 py-1 rounded-full uppercase w-fit mb-4">Pengumuman</span>
                  <h4 className="text-xl font-bold text-white mb-2 uppercase">Panduan Mengakses E-Journal Internasional dari Rumah</h4>
                  <p className="text-white/70 text-xs line-clamp-2">Staf perpustakaan membagikan tips langkah demi langkah agar mahasiswa tetap produktif melakukan riset dari mana saja.</p>
                </div>
              </div>

              {/* Daftar Artikel Kecil [cite: 2026-02-12] */}
              <div className="flex flex-col gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                      <Image src={`/images/staf-thumb-${i}.png`} alt="Thumb" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[8px] font-black text-secondary uppercase mb-1">Tips Literasi</span>
                      <h5 className="text-sm font-bold text-main-text group-hover:text-secondary transition-colors uppercase line-clamp-2">Strategi Mencari Referensi Skripsi Secara Efektif</h5>
                      <p className="text-[10px] text-gray-400 mt-1 italic">Oleh: Staf Pelayanan Literasi</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Sambutan Ringkas di src/app/(public)/page.tsx */}
        <section className="py-20 bg-surface">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Foto Kepala UPT dengan Frame Inovatif */}
              <div className="relative w-64 h-80 flex-shrink-0">
                <div className="absolute inset-0 bg-secondary rounded-[3rem] rotate-6"></div>
                <div className="relative w-full h-full rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl">
                  <Image src="/images/kepala_perpus.jpg" alt="Ir. Mecky R. E. Manoppo, MT" fill className="object-cover" />
                </div>
              </div>

              {/* Konten Sambutan */}
              <div className="flex-1 text-center lg:text-left">
                <span className="text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Kepala UPT Perpustakaan</span>
                <h3 className="text-3xl font-black text-main-text uppercase tracking-tighter mb-6 leading-tight">Ir. Mecky R. E. Manoppo, MT</h3>
                <p className="text-gray-500 leading-relaxed font-medium italic mb-8">"Menjadi pusat informasi ilmiah unggul dan berbudaya yang memberikan pelayanan prima berbasis teknologi informasi dan komunikasi untuk mendukung Universitas Sam Ratulangi sebagai World Class University."</p>
                <Link href="/profile" className="inline-block px-10 py-4 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-secondary/20 hover:scale-105 transition-all">
                  Lihat Profil Lengkap
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA tetap sama */}
        <section className="py-16 bg-surface">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-main-text">Butuh Referensi Lain?</h3>
            <button className="mt-8 px-10 py-4 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all" onClick={handleSearchBook}>
              Cari Buku Sekarang
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
