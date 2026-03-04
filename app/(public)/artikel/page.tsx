"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useArticles } from "@/hooks/useArticles";

export default function ArtikelPage() {
  // Ambil data artikel riil (tanpa token karena ini publik) [cite: 2026-03-03, 2026-03-04]
  const { articles, isLoading } = useArticles(null);

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black text-secondary uppercase">Memuat Warta...</div>;

  return (
    <div className="min-h-screen bg-white py-20 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-16">
          <h1 className="text-4xl font-black text-main-text uppercase tracking-tighter leading-none">Warta Perpustakaan</h1>
          <p className="text-gray-400 mt-4 font-medium italic">Pusat informasi dan literasi digital UNSRAT.</p>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {articles.map((article: any) => (
              <Link key={article.id} href={`/artikel/${article.id}`} className="group">
                <div className="relative h-72 w-full rounded-[2.5rem] overflow-hidden mb-6 shadow-sm border border-gray-100 group-hover:shadow-2xl transition-all duration-500">
                  <Image src={article.image_url || "/images/placeholder.png"} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h2 className="text-2xl font-black text-main-text mt-2 group-hover:text-secondary transition-colors uppercase leading-tight tracking-tighter">{article.title}</h2>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-[10px] font-black text-secondary uppercase">{article.author?.full_name[0]}</div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {article.author?.full_name} • {new Date(article.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[3rem]">
            <p className="text-main-text/30 font-black uppercase tracking-widest text-sm">Belum ada warta untuk saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
