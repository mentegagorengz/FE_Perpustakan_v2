"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useHome } from "@/hooks/useHome";
import { useNews } from "@/hooks/useNews";
import { useArticles } from "@/hooks/useArticles";
import { images } from "@/constants/Home";

export default function Home() {
  const { currentIndex, handleSearchBook } = useHome(images.length);
  const { articles: newsArticles, loading: newsLoading, setCategory, category } = useNews();

  // Ambil data artikel riil (Internal News) dari database [cite: 2026-03-03]
  const { articles: staffArticles, isLoading: staffLoading } = useArticles(null);

  const categories = [
    { id: "general", label: "Umum" },
    { id: "technology", label: "Teknologi" },
    { id: "business", label: "Bisnis" },
    { id: "health", label: "Kesehatan" },
  ];

  return (
    <div className="min-h-screen bg-cream">   
      <main className="flex-1">
        {/* --- SECTION 1: HERO --- */}
        <section className="relative w-full h-[500px] overflow-hidden">
          {images.map((src, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}>
              <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>
          ))}
          <div className="relative text-center text-white z-10 flex flex-col items-center justify-center h-full px-4">
            <h2 className="text-5xl font-extrabold mb-4 leading-tight uppercase tracking-tighter">Perpustakaan UNSRAT</h2>
            <p className="text-lg mb-6 font-light uppercase tracking-widest text-white/70">Pusat informasi dan literasi terbaik.</p>
          </div>
        </section>

        {/* --- SECTION 2: NEWS (INTERNAL) --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12 border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-2xl font-black text-main-text uppercase tracking-tighter leading-none">News</h3>
                <p className="text-gray-400 text-xs font-medium mt-2">Artikel dan informasi resmi dari staf perpustakaan UNSRAT.</p>
              </div>
              <Link href="/artikel" className="text-secondary text-[10px] font-black uppercase tracking-widest hover:underline">
                Lihat Semua Berita →
              </Link>
            </div>

            {staffLoading ? (
              <div className="text-center py-20 animate-pulse font-black text-secondary uppercase tracking-widest text-xs">Synchronizing News Feed...</div>
            ) : staffArticles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Highlight Utama */}
                <Link href={`/artikel/${staffArticles[0].id}`} className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] h-[450px] block shadow-xl">
                  <Image src={staffArticles[0].image_url || "/images/placeholder.png"} alt="Highlight" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent flex flex-col justify-end p-10">
                    <span className="bg-secondary text-white text-[8px] font-black px-3 py-1 rounded-full uppercase w-fit mb-4">Paling Baru</span>
                    <h4 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter leading-tight">{staffArticles[0].title}</h4>
                    <p className="text-white/60 text-xs line-clamp-2 italic font-medium leading-relaxed">{staffArticles[0].content}</p>
                  </div>
                </Link>

                {/* Sidebar Berita Kecil */}
                <div className="flex flex-col gap-6">
                  {staffArticles.slice(1, 4).map((article: any) => (
                    <Link key={article.id} href={`/artikel/${article.id}`} className="flex gap-5 group cursor-pointer border-b border-gray-50 pb-5 last:border-0 transition-all hover:pl-2">
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm">
                        <Image src={article.image_url || "/images/placeholder.png"} alt="Thumb" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h5 className="text-md font-black text-main-text group-hover:text-secondary transition-colors uppercase line-clamp-2 leading-tight">{article.title}</h5>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                          <p className="text-[9px] font-black text-secondary uppercase tracking-widest">By: {article.author?.full_name || "Admin"}</p>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1 font-bold italic">{new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-[3rem]">
                <p className="text-main-text/30 font-bold uppercase text-sm tracking-widest">No News Posted Yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* --- SECTION 3: HEADLINE INDONESIA (EKSTERNAL) --- */}
        <section id="berita" className="py-20 bg-cream overflow-hidden border-t border-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-black text-main-text uppercase tracking-tighter">Headline Indonesia</h3>
              <p className="mt-2 text-main-text/60 italic">Navigasi berita nasional dengan sekali sentuh.</p>
            </div>

            <div className="flex justify-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setCategory(cat.id)} className={`relative px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${category === cat.id ? "text-white scale-105" : "text-gray-400 bg-white hover:bg-gray-50 border border-gray-100"}`}>
                  {category === cat.id && <motion.div layoutId="activeTab" className="absolute inset-0 bg-secondary rounded-full -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                  {cat.label}
                </button>
              ))}
            </div>

            {newsLoading ? (
              <div className="flex justify-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-10 w-10 border-4 border-gray-100 border-t-secondary rounded-full" />
              </div>
            ) : (
              <div className="relative min-h-[450px]">
                <AnimatePresence mode="wait">
                  <motion.div key={category} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {newsArticles.slice(0, 3).map((item, index) => (
                      <motion.div key={index} whileHover={{ y: -10 }} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 flex flex-col group">
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

        {/* --- SECTION 4: SAMBUTAN KEPALA UPT --- */}
        <section className="py-24 bg-surface relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="relative w-64 h-80 flex-shrink-0">
                <div className="absolute inset-0 bg-secondary rounded-[3rem] rotate-6"></div>
                <div className="relative w-full h-full rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl">
                  <Image src="/images/kepala_perpus.jpg" alt="Kepala UPT" fill className="object-cover" />
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <span className="text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Kepala UPT Perpustakaan</span>
                <h3 className="text-3xl font-black text-main-text uppercase tracking-tighter mb-6 leading-tight text-secondary">Ir. Mecky R. E. Manoppo, MT</h3>
                <p className="text-gray-500 leading-relaxed font-medium italic mb-8">&quot;Menjadi pusat informasi ilmiah unggul dan berbudaya yang mendukung Sam Ratulangi sebagai World Class University.&quot;</p>
                <Link href="/profil/kepala-upt" className="inline-block px-10 py-4 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg hover:scale-105 transition-all">
                  Lihat Profil Lengkap
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 5: CTA --- */}
        <section className="py-20 bg-cream">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-black text-main-text uppercase tracking-tighter">Butuh Referensi Lain?</h3>
            <p className="text-gray-400 text-xs font-medium mt-2 mb-8 uppercase tracking-widest">Temukan koleksi buku digital terbaik kami.</p>
            <button className="px-12 py-4 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl hover:scale-105 transition-all" onClick={handleSearchBook}>
              Cari Buku Sekarang
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
