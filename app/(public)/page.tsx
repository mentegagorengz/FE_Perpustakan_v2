"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Users, FileText, FlaskConical, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { images } from "@/constants/Home";

export default function Home() {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop",
      title: "Portal Garuda",
    },
    {
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000&auto=format&fit=crop",
      title: "Koleksi Terbaru",
    },
    {
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop",
      title: "Akses E-Journal",
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className="absolute inset-0 h-full w-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
          >
            {/* Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />
            
            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
              <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">{slide.title}</h1>
              <button className="rounded bg-[#8c5932] px-6 py-2.5 text-sm font-medium transition hover:bg-[#724828]">
                Kunjungi Portal
              </button>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-black/50 text-white hover:bg-black/70">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-black/50 text-white hover:bg-black/70">
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentSlide(index)} 
              className={`h-2 w-2 rounded-full transition-colors ${currentSlide === index ? "bg-white" : "bg-white/40"}`} 
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto py-12 px-6 max-w-5xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white p-6 shadow-sm text-center">
            <BookOpen className="mb-3 text-[#8c5932]" size={28} strokeWidth={1.5} />
            <h3 className="text-2xl font-bold">12.450+</h3>
            <p className="text-sm text-gray-500">Koleksi Buku</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white p-6 shadow-sm text-center">
            <Users className="mb-3 text-[#8c5932]" size={28} strokeWidth={1.5} />
            <h3 className="text-2xl font-bold">3.200+</h3>
            <p className="text-sm text-gray-500">Anggota</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white p-6 shadow-sm text-center">
            <FileText className="mb-3 text-[#8c5932]" size={28} strokeWidth={1.5} />
            <h3 className="text-2xl font-bold">850+</h3>
            <p className="text-sm text-gray-500">E-Journal</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white p-6 shadow-sm text-center">
            <FlaskConical className="mb-3 text-[#8c5932]" size={28} strokeWidth={1.5} />
            <h3 className="text-2xl font-bold">2.100+</h3>
            <p className="text-sm text-gray-500">Penelitian</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="flex-1">
            <h2 className="mb-4 font-display text-2xl font-bold text-[#1a202c]">Tentang Perpustakaan</h2>
            <p className="mb-6 text-gray-600 leading-relaxed text-[15px]">
              UPT Perpustakaan Cakrawala menyediakan akses ke koleksi buku, jurnal ilmiah, dan karya penelitian untuk mendukung kegiatan akademik civitas akademika.
            </p>
            <button className="rounded bg-[#8c5932] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#724828]">
              Lihat Koleksi
            </button>
          </div>
          <div className="flex-1 w-full">
            <div className="overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop" 
                alt="Library Interior" 
                className="w-full h-[300px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Koleksi Terbaru */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="mb-8 font-display text-2xl font-bold text-[#1a202c]">Koleksi Terbaru</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Pengantar Ilmu Komputer", author: "Rinaldi Munir", status: "Tersedia", color: "bg-green-50 text-green-700" },
              { title: "Algoritma dan Pemrograman", author: "Budi Santoso", status: "Dipinjam", color: "bg-yellow-50 text-yellow-700" },
              { title: "Basis Data Relasional", author: "Fathansyah", status: "Tersedia", color: "bg-green-50 text-green-700" },
              { title: "Jaringan Komputer", author: "Forouzan", status: "Tersedia", color: "bg-green-50 text-green-700" },
            ].map((book, i) => (
              <div key={i} className="flex flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-1">
                <div className="mb-4 flex h-36 items-center justify-center rounded bg-gray-50 text-gray-300">
                  <BookOpen size={40} strokeWidth={1} />
                </div>
                <h3 className="mb-1 text-sm font-bold leading-tight text-[#1a202c]">{book.title}</h3>
                <p className="mb-4 text-xs text-gray-500">{book.author}</p>
                <div className="mt-auto">
                  <span className={`inline-block rounded px-2.5 py-1 text-[11px] font-semibold ${book.color}`}>
                    {book.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/koleksi" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8c5932] hover:underline">
              Lihat semua koleksi <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#78502f] py-20 text-center text-white">
        <div className="container mx-auto px-6">
          <h2 className="mb-4 font-display text-2xl font-bold">Daftar sebagai anggota</h2>
          <p className="mb-8 text-[15px] text-white/80 max-w-lg mx-auto">
            Akses ribuan koleksi digital secara gratis sebagai civitas akademika Perpustakaan Cakrawala.
          </p>
          <button className="rounded bg-white px-8 py-3 text-sm font-semibold text-[#78502f] transition hover:bg-gray-100">
            Daftar Sekarang
          </button>
        </div>
      </section>
    </div>
  );
}
