"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useArticleDetail } from "@/hooks/useArticles";
import { ArrowLeft, Loader2, CalendarDays } from "lucide-react";

export default function ArtikelDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: article, isLoading, isError } = useArticleDetail(params.slug as string);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-secondary">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Memuat arsip...</span>
      </div>
    );
  if (isError || !article)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-main-text/60">Arsip tidak ditemukan.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-cream px-4 py-20 font-sans">
      <article className="container mx-auto max-w-3xl">
        <button
          onClick={() => router.back()}
          className="group mb-10 inline-flex items-center gap-2 text-sm text-main-text/50 transition-colors hover:text-secondary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Kembali
        </button>

        <div className="relative mb-10 h-[420px] w-full overflow-hidden rounded-lg border border-main-border shadow-[var(--shadow-card)]">
          <div className="absolute inset-0 bg-surface" aria-hidden="true" />
        </div>

        <h1 className="font-display text-4xl leading-tight text-main-text md:text-5xl">{article.title}</h1>

        <div className="mt-6 mb-10 flex flex-wrap items-center gap-3 border-b border-main-border pb-8 text-sm text-main-text/60">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-white">{article.author?.full_name}</span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        
        <div className="max-w-2xl whitespace-pre-line text-lg leading-relaxed text-main-text/90">{article.content}</div>
      </article>
    </div>
  );
}
