"use client";

import React from "react";

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ current, total, onChange }) => {
  if (total <= 1) return null; // Tidak muncul jika hanya 1 halaman

  const getPages = () => {
    const pages = [];
    const startPage = Math.max(1, current - 2);
    const endPage = Math.min(total, current + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="mt-16 flex justify-center items-center gap-3 flex-wrap">
      {/* Tombol Sebelumnya */}
      <button onClick={() => onChange(Math.max(current - 1, 1))} disabled={current === 1} className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-cream-soft border border-main-border text-main-text/50 hover:text-secondary hover:border-secondary disabled:opacity-30 disabled:hover:text-main-text/50 disabled:hover:border-main-border transition-all duration-300 shadow-sm">
        <span className="text-lg">←</span> Prev
      </button>

      {/* Container Nomor Halaman */}
      <div className="flex items-center gap-2 p-1.5 bg-cream-soft rounded-2xl border border-main-border shadow-sm">
        {/* Halaman Pertama & Ellipsis Awal */}
        {current > 3 && (
          <>
            <PageButton num={1} active={false} onClick={() => onChange(1)} />
            {current > 4 && <span className="px-1 text-main-text/30 font-bold">...</span>}
          </>
        )}

        {/* Nomor Halaman Dinamis */}
        {getPages().map((p) => (
          <PageButton key={p} num={p} active={current === p} onClick={() => onChange(p)} />
        ))}

        {/* Ellipsis Akhir & Halaman Terakhir */}
        {current < total - 2 && (
          <>
            {current < total - 3 && <span className="px-1 text-main-text/30 font-bold">...</span>}
            <PageButton num={total} active={false} onClick={() => onChange(total)} />
          </>
        )}
      </div>

      {/* Tombol Selanjutnya */}
      <button onClick={() => onChange(Math.min(current + 1, total))} disabled={current === total} className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-cream-soft border border-main-border text-main-text/50 hover:text-secondary hover:border-secondary disabled:opacity-30 disabled:hover:text-main-text/50 disabled:hover:border-main-border transition-all duration-300 shadow-sm">
        Next <span className="text-lg">→</span>
      </button>
    </div>
  );
};

// Sub-komponen tombol halaman agar kode lebih bersih
const PageButton = ({ num, active, onClick }: { num: number; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`w-10 h-10 text-sm font-bold rounded-xl transition-all duration-300 ${active ? "bg-secondary text-white shadow-lg shadow-secondary/30 scale-110" : "text-main-text/50 hover:bg-surface hover:text-main-text"}`}>
    {num}
  </button>
);

export default Pagination;
