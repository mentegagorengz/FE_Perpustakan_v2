"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ current, total, onChange }) => {
  if (total <= 1) return null;

  const getPages = () => {
    const pages = [];
    const startPage = Math.max(1, current - 2);
    const endPage = Math.min(total, current + 2);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(current - 1, 1))}
        disabled={current === 1}
        className="flex items-center gap-1 rounded-md border border-main-border px-3 py-2 text-sm text-main-text/70 transition-colors hover:border-secondary hover:text-secondary disabled:opacity-40 disabled:hover:border-main-border disabled:hover:text-main-text/70"
      >
        <ChevronLeft size={16} /> Prev
      </button>

      <div className="flex items-center gap-1">
        {current > 3 && (
          <>
            <PageButton num={1} active={false} onClick={() => onChange(1)} />
            {current > 4 && <span className="px-1 text-main-text/40">…</span>}
          </>
        )}

        {getPages().map((p) => (
          <PageButton key={p} num={p} active={current === p} onClick={() => onChange(p)} />
        ))}

        {current < total - 2 && (
          <>
            {current < total - 3 && <span className="px-1 text-main-text/40">…</span>}
            <PageButton num={total} active={false} onClick={() => onChange(total)} />
          </>
        )}
      </div>

      <button
        onClick={() => onChange(Math.min(current + 1, total))}
        disabled={current === total}
        className="flex items-center gap-1 rounded-md border border-main-border px-3 py-2 text-sm text-main-text/70 transition-colors hover:border-secondary hover:text-secondary disabled:opacity-40 disabled:hover:border-main-border disabled:hover:text-main-text/70"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

const PageButton = ({ num, active, onClick }: { num: number; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`h-9 w-9 rounded-md text-sm transition-colors ${
      active ? "bg-secondary font-medium text-white" : "text-main-text/60 hover:bg-surface hover:text-main-text"
    }`}
  >
    {num}
  </button>
);

export default Pagination;
