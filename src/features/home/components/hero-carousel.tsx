"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop",
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Sorotan layanan perpustakaan"
      className="group relative isolate flex h-[78vh] min-h-[440px] w-full flex-col justify-end overflow-hidden bg-secondary lg:max-h-[680px]"
    >
      {slides.map((image, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={image}
            inert={!isActive}
            aria-hidden={!isActive}
            className={`absolute inset-0 ${isActive ? "opacity-100" : "opacity-0"} ${
              prefersReducedMotion ? "transition-none" : "transition-opacity duration-1000 ease-in-out"
            }`}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              className="scale-105 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
          </div>
        );
      })}

      {/* Welcoming Text */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="container mx-auto max-w-3xl px-6">
          <span className="mb-4 inline-block rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white/80 backdrop-blur-md">
            Portal Literasi &amp; Informasi
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Selamat Datang di Perpustakaan
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-normal leading-relaxed text-white/80 md:text-lg">
            Pusat ilmu pengetahuan, koleksi literatur digital, dan ruang belajar untuk mendukung riset dan inovasi.
          </p>
        </div>
      </div>

      {/* Subtle Next/Prev Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Slide sebelumnya"
        className="absolute left-6 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/70 opacity-60 backdrop-blur-md transition-all hover:bg-white/25 hover:text-white hover:opacity-100 md:flex"
      >
        <ChevronLeft aria-hidden="true" size={20} />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Slide berikutnya"
        className="absolute right-6 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/70 opacity-60 backdrop-blur-md transition-all hover:bg-white/25 hover:text-white hover:opacity-100 md:flex"
      >
        <ChevronRight aria-hidden="true" size={20} />
      </button>

      {/* Subtle Indicator Pills */}
      <div className="relative z-10 flex items-center justify-center gap-2 pb-6">
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
  );
}
