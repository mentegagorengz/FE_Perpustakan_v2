"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter [cite: 2026-02-19]
import { DUMMY_ARTICLES } from "@/constants/articles";
import Image from "next/image";

export default function ArtikelDetail() {
  const params = useParams();
  const router = useRouter(); // Inisialisasi router [cite: 2026-02-19]

  const article = DUMMY_ARTICLES.find((a) => a.slug === params.slug);

  if (!article) return <div className="p-20 text-center uppercase font-black text-gray-300">Artikel Tidak Ditemukan</div>;

  return (
    <div className="min-h-screen bg-white py-20 px-4 font-sans">
      <article className="container mx-auto max-w-3xl">
        {/* Button Kembali yang Inovatif [cite: 2026-02-19] */}
        <button onClick={() => router.back()} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-secondary transition-all mb-10">
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          Kembali ke Daftar
        </button>

        <div className="relative h-[400px] w-full rounded-[2.5rem] overflow-hidden mb-12 shadow-sm">
          <Image src={article.image} alt={article.title} fill className="object-cover" />
        </div>

        <span className="bg-secondary/10 text-secondary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{article.category}</span>

        <h1 className="text-4xl font-black text-main-text mt-6 mb-4 leading-tight uppercase tracking-tighter">{article.title}</h1>

        <div className="flex items-center gap-3 text-gray-400 text-[10px] font-bold mb-10 pb-6 border-b border-gray-100 uppercase tracking-widest">
          <span>Oleh {article.author}</span>
          <span>•</span>
          <span>{article.date}</span>
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-500 leading-loose text-lg font-medium italic mb-8 border-l-4 border-secondary/30 pl-6">"{article.excerpt}"</p>
          <div className="text-main-text leading-relaxed whitespace-pre-line font-medium text-base">{article.content}</div>
        </div>

        {/* Footer Artikel Tambahan [cite: 2025-09-24] */}
        <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Terima kasih telah membaca Warta UNSRAT.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-secondary text-[10px] font-black uppercase tracking-widest hover:underline">
            Kembali ke Atas ↑
          </button>
        </div>
      </article>
    </div>
  );
}
