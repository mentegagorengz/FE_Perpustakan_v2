"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { useHome } from "@/hooks/useHome";
import { useNews } from "@/hooks/useNews";
import { useArticles } from "@/hooks/useArticles";
import { images } from "@/constants/Home";

export default function Home() {
  const { currentIndex, handleSearchBook } = useHome(images.length);
  const { articles: newsArticles, loading: newsLoading, setCategory, category } = useNews();

  // Ambil data artikel riil (Internal News) dari database.
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
        {/* --- HERO --- */}
        <section className="relative w-full overflow-hidden">
          {images.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/70 to-secondary/20" />

          <div className="container relative z-10 mx-auto px-6 py-28 lg:py-36">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-medium text-white/70">UPT Perpustakaan Universitas Sam Ratulangi</p>
              <h1 className="font-display text-5xl leading-[1.1] text-white lg:text-6xl">
                Ruang baca, riset, dan literasi untuk sivitas UNSRAT.
              </h1>
              <p className="mt-6 max-w-lg text-lg text-white/80">
                Telusuri koleksi cetak dan digital, ikuti kabar terbaru, dan manfaatkan layanan perpustakaan.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={handleSearchBook}
                  className="inline-flex items-center gap-2 rounded-md bg-cream px-6 py-3 text-sm font-semibold text-secondary transition hover:bg-cream-soft"
                >
                  Cari Koleksi <ArrowRight size={16} />
                </button>
                <Link
                  href="/koleksidaring"
                  className="inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Koleksi Daring
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- NEWS (INTERNAL) --- */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="mb-10 flex items-end justify-between border-b border-main-border pb-5">
              <div>
                <h2 className="font-display text-3xl text-main-text">Warta Perpustakaan</h2>
                <p className="mt-1.5 text-sm text-main-text/55">Artikel dan informasi resmi dari staf perpustakaan UNSRAT.</p>
              </div>
              <Link href="/artikel" className="hidden items-center gap-1 text-sm font-medium text-secondary hover:underline sm:flex">
                Lihat semua <ArrowRight size={15} />
              </Link>
            </div>

            {staffLoading ? (
              <div className="flex justify-center py-20 text-main-text/40">
                <Loader2 size={28} className="animate-spin" />
              </div>
            ) : staffArticles.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Highlight utama */}
                <Link href={`/artikel/${staffArticles[0].id}`} className="group relative block h-[420px] overflow-hidden rounded-lg">
                  <Image
                    src={staffArticles[0].image_url || "/images/placeholder.png"}
                    alt="Highlight"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/25 to-transparent p-8">
                    <span className="mb-3 w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-white">Terbaru</span>
                    <h3 className="font-display text-3xl leading-tight text-white line-clamp-2">{staffArticles[0].title}</h3>
                    <p className="mt-2 text-sm text-white/70 line-clamp-2">{staffArticles[0].content}</p>
                  </div>
                </Link>

                {/* Daftar berita kecil */}
                <div className="flex flex-col divide-y divide-main-border">
                  {staffArticles.slice(1, 4).map((article: any) => (
                    <Link key={article.id} href={`/artikel/${article.id}`} className="group flex gap-5 py-5 first:pt-0 last:pb-0">
                      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-md bg-surface">
                        <Image
                          src={article.image_url || "/images/placeholder.png"}
                          alt="Thumbnail"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-display text-lg leading-snug text-main-text transition-colors group-hover:text-secondary line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="mt-2 text-xs text-main-text/50">
                          {article.author?.full_name || "Admin"} &middot;{" "}
                          {new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-main-border py-16 text-center">
                <p className="text-sm text-main-text/40">Belum ada berita yang dipublikasikan.</p>
              </div>
            )}
          </div>
        </section>

        {/* --- HEADLINE INDONESIA (EKSTERNAL) --- */}
        <section id="berita" className="border-t border-main-border bg-cream py-20">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <h2 className="font-display text-3xl text-main-text">Headline Indonesia</h2>
              <p className="mt-1.5 text-sm text-main-text/55">Kabar nasional terkini dari berbagai kategori.</p>
            </div>

            <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`relative rounded-md px-5 py-2 text-sm transition-colors ${
                    category === cat.id ? "text-white" : "border border-main-border bg-white text-main-text/60 hover:text-main-text"
                  }`}
                >
                  {category === cat.id && <motion.div layoutId="activeTab" className="absolute inset-0 -z-10 rounded-md bg-secondary" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />}
                  {cat.label}
                </button>
              ))}
            </div>

            {newsLoading ? (
              <div className="flex justify-center py-20 text-main-text/40">
                <Loader2 size={28} className="animate-spin" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-3"
                >
                  {newsArticles.slice(0, 3).map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      className="group flex flex-col overflow-hidden rounded-lg border border-main-border bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
                    >
                      <div className="relative h-52 w-full overflow-hidden">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-display text-lg leading-snug text-main-text transition-colors group-hover:text-secondary line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-main-text/55 line-clamp-3">{item.description}</p>
                        <span className="mt-4 flex items-center gap-1 text-sm font-medium text-secondary">
                          Baca selengkapnya <ArrowUpRight size={15} />
                        </span>
                      </div>
                    </a>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* --- SAMBUTAN KEPALA UPT --- */}
        <section className="bg-surface py-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center gap-12 lg:flex-row">
              <div className="relative h-80 w-64 flex-shrink-0 overflow-hidden rounded-lg border border-main-border">
                <Image src="/images/kepala_perpus.jpg" alt="Kepala UPT" fill className="object-cover" />
              </div>

              <div className="flex-1 text-center lg:text-left">
                <p className="mb-3 text-sm font-medium text-secondary">Kepala UPT Perpustakaan</p>
                <h2 className="font-display text-3xl leading-tight text-main-text">Ir. Mecky R. E. Manoppo, MT</h2>
                <p className="mt-5 max-w-xl text-lg italic leading-relaxed text-main-text/70">
                  &ldquo;Menjadi pusat informasi ilmiah unggul dan berbudaya yang mendukung Sam Ratulangi sebagai World Class University.&rdquo;
                </p>
                <Link
                  href="/profil/kepala-upt"
                  className="mt-7 inline-flex items-center gap-2 rounded-md bg-secondary px-6 py-3 text-sm font-medium text-white transition hover:bg-secondary-hover"
                >
                  Lihat profil lengkap <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA --- */}
        <section className="bg-cream py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-display text-3xl text-main-text">Butuh referensi lain?</h2>
            <p className="mx-auto mt-2 max-w-md text-main-text/55">Telusuri koleksi buku digital dan cetak terbaik kami.</p>
            <button
              onClick={handleSearchBook}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-secondary px-8 py-3 text-sm font-medium text-white transition hover:bg-secondary-hover"
            >
              Cari buku sekarang <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
