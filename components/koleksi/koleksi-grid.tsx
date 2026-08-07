"use client";

import { SearchX } from "lucide-react";
import BookCard from "@/components/koleksi/book-card";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { UiBook } from "@/types/ui";

interface KoleksiGridProps {
  books: UiBook[];
  savedBooks: Set<number>;
  onToggleSaved: (book: UiBook) => void;
  onSelect: (book: UiBook) => void;
  onResetFilters: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function KoleksiGrid({
  books,
  savedBooks,
  onToggleSaved,
  onSelect,
  onResetFilters,
  page,
  totalPages,
  onPageChange,
}: KoleksiGridProps) {
  if (books.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-md border border-main-border bg-paper shadow-xs">
        <EmptyState
          icon={<SearchX size={44} strokeWidth={1.5} />}
          title="Buku Tidak Ditemukan"
          description="Tidak ada koleksi yang cocok dengan pencarian atau filter Anda."
          action={<Button variant="ghost" onClick={onResetFilters}>Reset Pencarian & Filter</Button>}
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onDetailClick={onSelect}
            saved={savedBooks.has(book.id)}
            onSave={onToggleSaved}
          />
        ))}
      </div>

      <div className="mt-14">
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </>
  );
}
