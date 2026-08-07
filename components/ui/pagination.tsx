"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <nav aria-label="Navigasi halaman" className={cn("flex flex-wrap items-center justify-center gap-1.5", className)}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Halaman sebelumnya"
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-main-border bg-paper text-main-text-muted transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft aria-hidden="true" size={16} />
      </button>

      {pageNumbers.map((num, index) =>
        num === "..." ? (
          <span key={`dots-${index}`} aria-hidden="true" className="flex h-9 w-9 items-center justify-center text-sm text-main-text-muted">
            ...
          </span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            aria-current={num === page ? "page" : undefined}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-sm border text-sm font-semibold transition-colors",
              num === page
                ? "border-secondary bg-secondary text-white"
                : "border-main-border bg-paper text-main-text-muted hover:bg-surface",
            )}
          >
            {num}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Halaman berikutnya"
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-main-border bg-paper text-main-text-muted transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight aria-hidden="true" size={16} />
      </button>
    </nav>
  );
}

function getPageNumbers(current: number, total: number): Array<number | "..."> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: Array<number | "..."> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}
