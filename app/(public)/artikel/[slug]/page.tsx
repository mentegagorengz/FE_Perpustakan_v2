"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useArticleDetail } from "@/hooks/useArticles";
import Image from "next/image";

export default function ArtikelDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: article, isLoading, isError } = useArticleDetail(params.slug as string);

  if (isLoading) return <div className="p-20 text-center font-black animate-bounce text-secondary">MEMBUKA ARSIP...</div>;
  if (isError || !article) return <div className="p-20 text-center uppercase font-black text-red-400">Arsip Tidak Ditemukan</div>;

  return (
    <div className="min-h-screen bg-white py-20 px-4 font-sans">
      <article className="container mx-auto max-w-3xl">
        <button onClick={() => router.back()} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-secondary transition-all mb-12">
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> KEMBALI
        </button>

        <div className="relative h-[450px] w-full rounded-[3rem] overflow-hidden mb-12 shadow-2xl border border-gray-100">
          <Image src={article.image_url || "/images/placeholder.png"} alt={article.title} fill className="object-cover" />
        </div>

        <h1 className="text-5xl font-black text-main-text mb-6 leading-[1.1] uppercase tracking-tighter">{article.title}</h1>

        <div className="flex items-center gap-4 text-gray-400 text-[10px] font-black mb-12 pb-8 border-b border-gray-100 uppercase tracking-[0.2em]">
          <div className="bg-secondary text-white px-3 py-1 rounded">AUTHOR: {article.author?.full_name}</div>
          <span>•</span>
          <span>{new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>

        <div className="prose prose-stone max-w-none">
          {/* Menggunakan whitespace-pre-line agar format paragraf dari textarea terjaga [cite: 2026-03-03] */}
          <div className="text-main-text leading-relaxed whitespace-pre-line font-medium text-lg">{article.content}</div>
        </div>
      </article>
    </div>
  );
}
