"use client";

import React from "react";
import Link from "next/link";
import { Loader2, CalendarDays } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";

export default function ArtikelPage() {
  const { articles, isLoading } = useArticles(null);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-secondary">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Memuat warta...</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-cream py-20 font-sans">
      <div className="container mx-auto max-w-5xl px-4">
        <header className="mb-16 max-w-2xl">
          <p className="mb-3 text-xs tracking-wide text-secondary">Warta &amp; literasi</p>
          <h1 className="font-display text-4xl leading-tight text-main-text md:text-5xl">Warta Perpustakaan</h1>
          <p className="mt-4 text-main-text/60">Pusat informasi dan literasi digital Perpustakaan Cakrawala.</p>
        </header>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {articles.map((article: any) => (
              <Link key={article.id} href={`/artikel/${article.id}`} className="group block">
                <div className="relative mb-5 h-64 w-full overflow-hidden rounded-lg border border-main-border shadow-[var(--shadow-card)]">
                  <div className="absolute inset-0 bg-surface" aria-hidden="true" />
                </div>
                <h2 className="font-display text-2xl leading-snug text-main-text transition-colors group-hover:text-secondary">
                  {article.title}
                </h2>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-xs font-semibold text-secondary">
                    {article.author?.full_name[0]}
                  </div>
                  <span className="flex items-center gap-2 text-xs text-main-text/50">
                    {article.author?.full_name}
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(article.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-main-border py-20 text-center">
            <p className="text-sm text-main-text/40">Belum ada warta untuk saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
