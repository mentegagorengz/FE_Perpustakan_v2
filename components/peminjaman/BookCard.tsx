"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import type { UiBook } from "@/hooks/useBorrow";

interface BookCardProps {
  book: UiBook;
  onDetailClick: (book: UiBook) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onDetailClick }) => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-main-border bg-cream-soft shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-raised)]">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-2.5 py-1 text-[11px] font-medium text-main-text/70">
          {book.category || "Umum"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg leading-snug text-main-text transition-colors group-hover:text-secondary line-clamp-2">
          {book.title}
        </h3>
        <p className="mt-1 text-sm italic text-main-text-muted">Oleh {book.mainAuthor || "Penulis Anonim"}</p>

        <div className="mt-auto flex items-center justify-end border-t border-main-border/60 pt-4">
          <button type="button" onClick={() => onDetailClick(book)} aria-label={`Lihat detail ${book.title}`} className="flex min-h-11 w-full items-center justify-end gap-1 text-sm font-medium text-secondary">
            Detail
            <ArrowRight aria-hidden="true" size={15} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
