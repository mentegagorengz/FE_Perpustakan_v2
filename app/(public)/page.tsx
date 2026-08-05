"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, FileText, FlaskConical, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  const slides = [
      { image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop" },
      { image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000&auto=format&fit=crop" },
      { image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop" },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, slides.length]);

  return (
    <div className="min-h-screen bg-cream font-sans text-main-text">
      {/* Hero Section */}
      <section
        aria-roledescription="carousel"
        aria-label="Sorotan layanan perpustakaan"
        className="group relative isolate flex h-[78vh] min-h-[440px] w-full flex-col justify-end overflow-hidden bg-secondary lg:max-h-[680px]"
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.image}
              inert={!isActive}
              aria-hidden={!isActive}
              className={`absolute inset-0 ${isActive ? "opacity-100" : "opacity-0"} ${
                prefersReducedMotion ? "transition-none" : "transition-opacity duration-1000 ease-in-out"
              }`}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
                 className="object-cover object-center scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
            </div>
          );
        })}

        {/* Welcoming Text */}
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="container mx-auto px-6 max-w-3xl">
            <span className="inline-block px-3.5 py-1 mb-4 text-[11px] font-medium tracking-[0.25em] uppercase text-white/80 bg-white/10 backdrop-blur-md rounded-full border border-white/15">
              Portal Literasi &amp; Informasi
            </span>
            <h1 className="font-display text-4xl leading-tight tracking-tight text-white md:text-6xl lg:text-7xl font-bold">
              Selamat Datang di Perpustakaan
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/80 max-w-xl mx-auto font-normal leading-relaxed">
              Pusat ilmu pengetahuan, koleksi literatur digital, dan ruang belajar untuk mendukung riset dan inovasi.
            </p>
          </div>
        </div>

        {/* Subtle Next/Prev Arrows */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Slide sebelumnya"
          className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white/70 backdrop-blur-md transition-all hover:bg-white/25 hover:text-white md:flex opacity-60 hover:opacity-100"
        >
          <ChevronLeft aria-hidden="true" size={20} />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Slide berikutnya"
          className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white/70 backdrop-blur-md transition-all hover:bg-white/25 hover:text-white md:flex opacity-60 hover:opacity-100"
        >
          <ChevronRight aria-hidden="true" size={20} />
        </button>

        {/* Subtle Indicator Pills */}
        <div className="relative z-10 pb-6 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
              className="group p-1"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/40 group-hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>
      </section>

       {/* Service navigation */}
      <section className="container mx-auto py-12 px-6 max-w-5xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-sm border border-main-border bg-cream-soft p-6 text-center shadow-[var(--shadow-card)]">
            <BookOpen aria-hidden="true" className="mb-3 text-secondary" size={28} strokeWidth={1.5} />
            <h3 className="text-lg font-bold">Koleksi</h3>
            <p className="text-sm text-main-text-muted">Telusuri katalog buku</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-sm border border-main-border bg-cream-soft p-6 text-center shadow-[var(--shadow-card)]">
            <Users aria-hidden="true" className="mb-3 text-secondary" size={28} strokeWidth={1.5} />
            <h3 className="text-lg font-bold">Koleksi daring</h3>
            <p className="text-sm text-main-text-muted">Akses sumber elektronik</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-sm border border-main-border bg-cream-soft p-6 text-center shadow-[var(--shadow-card)]">
            <FileText aria-hidden="true" className="mb-3 text-secondary" size={28} strokeWidth={1.5} />
            <h3 className="text-lg font-bold">Warta</h3>
            <p className="text-sm text-main-text-muted">Baca informasi perpustakaan</p>
          </div>
          <Link href="/profil" className="flex flex-col items-center justify-center rounded-sm border border-main-border bg-cream-soft p-6 text-center shadow-[var(--shadow-card)] hover:bg-surface">
            <FlaskConical aria-hidden="true" className="mb-3 text-secondary" size={28} strokeWidth={1.5} />
            <h3 className="text-lg font-bold">Profil Perpustakaan</h3>
            <p className="text-sm text-main-text-muted">Kenali layanan perpustakaan</p>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="flex-1">
            <h2 className="mb-4 font-display text-2xl font-bold text-main-text">Tentang Perpustakaan</h2>
            <p className="mb-6 text-[15px] leading-relaxed text-main-text-muted">
              Perpustakaan menyediakan akses ke koleksi dan informasi ilmiah untuk
              mendukung kegiatan akademik sivitas akademika.
            </p>
            <Link href="/koleksi" className="inline-block rounded-sm bg-secondary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-hover">
              Lihat Koleksi
            </Link>
          </div>
          <div className="flex-1 w-full">
            <div className="overflow-hidden rounded-sm">
              <Image
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop"
                alt="Interior perpustakaan"
                width={1000}
                height={300}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="w-full h-[300px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Koleksi Terbaru */}
      <section className="bg-cream-soft py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="mb-8 font-display text-2xl font-bold text-main-text">Koleksi Terbaru</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Pengantar Ilmu Komputer", author: "Rinaldi Munir", status: "Tersedia", color: "bg-green-50 text-green-700" },
              { title: "Algoritma dan Pemrograman", author: "Budi Santoso", status: "Dipinjam", color: "bg-yellow-50 text-yellow-700" },
              { title: "Basis Data Relasional", author: "Fathansyah", status: "Tersedia", color: "bg-green-50 text-green-700" },
              { title: "Jaringan Komputer", author: "Forouzan", status: "Tersedia", color: "bg-green-50 text-green-700" },
            ].map((book, i) => (
              <div key={i} className="flex flex-col rounded-sm border border-main-border bg-cream p-4 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
                <div className="mb-4 flex h-36 items-center justify-center rounded-sm bg-surface text-main-text-muted">
                  <BookOpen aria-hidden="true" size={40} strokeWidth={1} />
                </div>
                <h3 className="mb-1 text-sm font-bold leading-tight text-main-text">{book.title}</h3>
                <p className="mb-4 text-xs text-main-text-muted">{book.author}</p>
                <div className="mt-auto">
                  <span className={`inline-block rounded-sm px-2.5 py-1 text-[11px] font-semibold ${book.color}`}>
                    {book.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/koleksi" className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline">
              Lihat semua koleksi <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary py-20 text-center text-white">
        <div className="container mx-auto px-6">
          <h2 className="mb-4 font-display text-2xl font-bold">Daftar sebagai anggota</h2>
          <p className="mx-auto mb-8 max-w-lg text-[15px] text-on-secondary-muted">
            Masuk untuk mengakses layanan perpustakaan sesuai hak akses civitas akademika.
          </p>
          <Link href="/login" className="inline-block rounded-sm bg-cream px-8 py-3 text-sm font-semibold text-secondary transition hover:bg-cream-soft">
            Masuk Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
