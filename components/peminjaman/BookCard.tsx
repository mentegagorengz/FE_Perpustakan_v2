"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ArrowRight, ImageOff } from "lucide-react";
import type { UiBook } from "@/hooks/useBorrow";

interface BookCardProps {
  book: UiBook;
  onDetailClick: (book: UiBook) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onDetailClick }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-main-border bg-cream-soft shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-raised)]"
      onClick={() => onDetailClick(book)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        {isLoading && (
          <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-surface-hover">
            <ImageOff size={40} className="text-main-text/25" strokeWidth={1.5} />
          </div>
        )}

        <Image
          src={book.imageUrl || "/images/default-image.png"}
          alt={book.title}
          fill
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${isLoading ? "blur-md" : "blur-0"}`}
          onLoadingComplete={() => setIsLoading(false)}
        />

        <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-2.5 py-1 text-[11px] font-medium text-main-text/70">
          {book.category || "Umum"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg leading-snug text-main-text transition-colors group-hover:text-secondary line-clamp-2">
          {book.title}
        </h3>
        <p className="mt-1 text-sm italic text-main-text/50">Oleh {book.mainAuthor || "Penulis Anonim"}</p>

        <div className="mt-auto flex items-center justify-end border-t border-main-border/60 pt-4">
          <span className="flex items-center gap-1 text-sm font-medium text-secondary">
            Detail
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
