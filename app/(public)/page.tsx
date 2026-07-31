"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, FileText, FlaskConical, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop",
      title: "Portal Garuda",
      href: "https://garuda.kemdikbud.go.id/",
    },
    {
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000&auto=format&fit=crop",
      title: "Koleksi Terbaru",
      href: "/koleksi",
    },
    {
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop",
      title: "Akses E-Journal",
      href: "/koleksidaring",
    }
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
    if (isPaused || prefersReducedMotion) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, slides.length]);

  return (
    <div className="min-h-screen bg-cream font-sans text-main-text">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 h-full w-full ease-in-out ${prefersReducedMotion ? "transition-none" : "transition-transform duration-500"}`}
            style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
          >
            {/* Background */}
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
              className="object-cover object-center"
              aria-hidden="true"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />
            
            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
              <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">{slide.title}</h1>
              <Link href={slide.href} className="rounded bg-secondary px-6 py-2.5 text-sm font-medium transition hover:bg-secondary-hover">
                Kunjungi Portal
              </Link>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button type="button" onClick={prevSlide} aria-label="Slide sebelumnya" className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-black/50 text-white hover:bg-black/70">
          <ChevronLeft aria-hidden="true" size={20} />
        </button>
        <button type="button" onClick={nextSlide} aria-label="Slide berikutnya" className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-black/50 text-white hover:bg-black/70">
          <ChevronRight aria-hidden="true" size={20} />
        </button>

        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-label={isPaused ? "Putar carousel" : "Jeda carousel"}
          aria-pressed={isPaused}
          className="absolute bottom-6 right-4 z-20 rounded bg-black/60 px-3 py-2 text-xs text-white hover:bg-black/80"
        >
          {isPaused ? "Putar" : "Jeda"}
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button 
              type="button"
              key={index} 
              onClick={() => setCurrentSlide(index)} 
              aria-label={`Tampilkan slide ${index + 1}`}
              aria-current={currentSlide === index ? "true" : undefined}
              className="flex h-11 w-11 items-center justify-center rounded-full"
            >
            <span aria-hidden="true" className={`h-2 w-2 rounded-full transition-colors ${currentSlide === index ? "bg-white" : "bg-white/70"}`} />
            </button>
          ))}
        </div>
      </section>

       {/* Service navigation */}
      <section className="container mx-auto py-12 px-6 max-w-5xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-lg border border-main-border bg-cream-soft p-6 text-center shadow-[var(--shadow-card)]">
            <BookOpen aria-hidden="true" className="mb-3 text-secondary" size={28} strokeWidth={1.5} />
            <h3 className="text-lg font-bold">Koleksi fisik</h3>
            <p className="text-sm text-main-text-muted">Telusuri katalog buku</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-main-border bg-cream-soft p-6 text-center shadow-[var(--shadow-card)]">
            <Users aria-hidden="true" className="mb-3 text-secondary" size={28} strokeWidth={1.5} />
            <h3 className="text-lg font-bold">Koleksi daring</h3>
            <p className="text-sm text-main-text-muted">Akses sumber elektronik</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-main-border bg-cream-soft p-6 text-center shadow-[var(--shadow-card)]">
            <FileText aria-hidden="true" className="mb-3 text-secondary" size={28} strokeWidth={1.5} />
            <h3 className="text-lg font-bold">Warta</h3>
            <p className="text-sm text-main-text-muted">Baca informasi perpustakaan</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-main-border bg-cream-soft p-6 text-center shadow-[var(--shadow-card)]">
            <FlaskConical aria-hidden="true" className="mb-3 text-secondary" size={28} strokeWidth={1.5} />
            <h3 className="text-lg font-bold">Profil UPT</h3>
            <p className="text-sm text-main-text-muted">Kenali layanan perpustakaan</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="flex-1">
            <h2 className="mb-4 font-display text-2xl font-bold text-main-text">Tentang Perpustakaan</h2>
            <p className="mb-6 text-[15px] leading-relaxed text-main-text-muted">
              UPT Perpustakaan Universitas Sam Ratulangi menyediakan akses ke koleksi dan informasi ilmiah untuk
              mendukung kegiatan akademik sivitas akademika.
            </p>
            <Link href="/koleksi" className="inline-block rounded bg-secondary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-hover">
              Lihat Koleksi
            </Link>
          </div>
          <div className="flex-1 w-full">
            <div className="overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop"
                alt="Interior perpustakaan UNSRAT"
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
              <div key={i} className="flex flex-col rounded-lg border border-main-border bg-cream p-4 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
                <div className="mb-4 flex h-36 items-center justify-center rounded bg-surface text-main-text-muted">
                  <BookOpen aria-hidden="true" size={40} strokeWidth={1} />
                </div>
                <h3 className="mb-1 text-sm font-bold leading-tight text-main-text">{book.title}</h3>
                <p className="mb-4 text-xs text-main-text-muted">{book.author}</p>
                <div className="mt-auto">
                  <span className={`inline-block rounded px-2.5 py-1 text-[11px] font-semibold ${book.color}`}>
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
          <Link href="/login" className="inline-block rounded bg-cream px-8 py-3 text-sm font-semibold text-secondary transition hover:bg-cream-soft">
            Masuk Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
