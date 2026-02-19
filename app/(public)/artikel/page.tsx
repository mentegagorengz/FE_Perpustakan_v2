"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DUMMY_ARTICLES } from "@/constants/articles";

export default function ArtikelPage() {
  return (
    <div className="min-h-screen bg-white py-20 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-16">
          <h1 className="text-4xl font-black text-main-text uppercase tracking-tighter">Warta Perpustakaan</h1>
          <p className="text-gray-400 mt-2 font-medium italic">Pusat informasi, tips, dan literasi dari staf UNSRAT.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {DUMMY_ARTICLES.map((article) => (
            <Link key={article.id} href={`/artikel/${article.slug}`} className="group">
              <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{article.category}</span>
              <h2 className="text-xl font-bold text-main-text mt-2 group-hover:text-secondary transition-colors uppercase leading-tight">{article.title}</h2>
              <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed font-medium italic">{article.excerpt}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200" />
                <span className="text-[10px] font-bold text-gray-500">
                  {article.author} • {article.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
