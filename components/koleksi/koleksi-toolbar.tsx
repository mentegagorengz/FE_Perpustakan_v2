"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface KoleksiToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  resultCount: number;
}

export default function KoleksiToolbar({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  resultCount,
}: KoleksiToolbarProps) {
  return (
    <>
      {/* Search Bar */}
      <div className="relative mx-auto mb-8 max-w-2xl">
        <label htmlFor="book-search" className="sr-only">
          Cari buku atau penulis
        </label>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-main-text-muted">
          <Search size={19} />
        </div>
        <input
          id="book-search"
          name="book-search"
          type="search"
          placeholder="Cari berdasarkan judul, penulis, atau kata kunci..."
          className="w-full rounded-md border border-main-border bg-paper py-3.5 pl-11 pr-10 text-sm text-main-text shadow-xs outline-none transition-all placeholder:text-main-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-main-text-muted transition-colors hover:text-main-text"
            aria-label="Bersihkan pencarian"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium shadow-xs transition-all sm:text-sm",
                isSelected
                  ? "border-secondary bg-secondary text-white"
                  : "border-main-border bg-paper text-main-text-muted hover:border-secondary hover:text-secondary",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Toolbar Info */}
      <div className="mb-6 flex items-center justify-between border-b border-main-border pb-3 text-xs text-main-text-muted sm:text-sm">
        <span>
          Menampilkan <strong className="font-semibold text-main-text">{resultCount}</strong> buku
          {selectedCategory !== "Semua" ? ` dalam "${selectedCategory}"` : ""}
        </span>
      </div>
    </>
  );
}
