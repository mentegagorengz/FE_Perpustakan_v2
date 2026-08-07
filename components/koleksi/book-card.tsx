"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import type { UiBook } from "@/types/ui";

interface BookCardProps {
  book: UiBook;
  onDetailClick: (book: UiBook) => void;
  saved: boolean;
  onSave: (book: UiBook) => void;
}

function BookCard({ book, onDetailClick, saved, onSave }: BookCardProps) {
  const availableCount = book.items.filter((item) => item.status === "AVAILABLE").length;
  const isAvailable = availableCount > 0;
  const [imgSrc, setImgSrc] = useState(book.imageUrl || "/placeholder_koleksi.svg");

  useEffect(() => {
    setImgSrc(book.imageUrl || "/placeholder_koleksi.svg");
  }, [book.imageUrl]);

  return (
    <article
      onClick={() => onDetailClick(book)}
      className="group flex flex-col overflow-hidden rounded-md border border-main-border bg-cream-soft shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
    >
      {/* Top Cover Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-main-border bg-surface">
        <Image
          src={imgSrc}
          alt={`Sampul ${book.title}`}
          fill
          unoptimized={imgSrc.endsWith(".svg")}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc("/placeholder_koleksi.svg")}
        />

        {/* Floating Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSave(book);
          }}
          aria-label={saved ? `Hapus ${book.title} dari simpanan` : `Simpan ${book.title}`}
          aria-pressed={saved}
          className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-main-border/60 bg-paper/85 backdrop-blur-md shadow-sm transition-colors ${
            saved
              ? "border-secondary bg-secondary text-white"
              : "text-main-text-muted hover:border-secondary hover:text-secondary"
          }`}
        >
          <Bookmark aria-hidden="true" size={15} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Card Content Area */}
      <div className="flex flex-1 flex-col justify-between p-3.5 gap-2.5">
        <div>
          {/* Status Badge */}
          <div className="mb-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                isAvailable
                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-700 border-amber-500/30"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isAvailable ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {isAvailable ? `Tersedia (${availableCount})` : "Dipinjam"}
            </span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 font-display text-sm sm:text-base font-bold leading-snug text-main-text transition-colors group-hover:text-secondary">
            {book.title}
          </h3>

          {/* Author & Year */}
          <p className="mt-1 line-clamp-1 text-xs text-main-text-muted">
            {book.mainAuthor || "Penulis Anonim"}
            {book.year ? ` • ${book.year}` : ""}
          </p>
        </div>

      </div>
    </article>
  );
}

export default BookCard;
