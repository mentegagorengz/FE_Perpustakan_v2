"use client";

import React from "react";
import { X } from "lucide-react";

interface DetailModalProps {
  book: any;
  availableCount: number;
  onClose: () => void;
  onBorrow: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ book, availableCount, onClose, onBorrow }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-cream shadow-[var(--shadow-overlay)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-main-border p-4">
          <h2 className="font-display text-xl text-main-text">Informasi Koleksi</h2>
          <button onClick={onClose} className="text-main-text/50 transition-colors hover:text-secondary" aria-label="Tutup">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="w-full flex-shrink-0 md:w-1/3">
              <div className="aspect-[3/4] w-full rounded-md border border-main-border bg-surface" aria-hidden="true" />
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="font-display text-2xl leading-tight text-secondary">{book.title}</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <DetailRow label="ISBN" value={book.isbn} />
                <DetailRow label="Penerbit" value={book.publisher} />
                <DetailRow label="Tahun" value={book.year} />
                <DetailRow label="Bahasa" value={book.language} />
                <DetailRow label="Kategori" value={book.category} />
                <DetailRow label="Status" value={availableCount > 0 ? `${availableCount} tersedia` : "Kosong"} />
              </div>
              <div className="border-t border-main-border pt-4">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-main-text/45">Sinopsis / Catatan</p>
                <p className="text-sm leading-relaxed text-main-text/70">
                  {book.description || "Tidak ada deskripsi tambahan untuk buku ini."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-main-border bg-surface p-4">
          <button onClick={onClose} className="rounded-md px-5 py-2 text-sm font-medium text-main-text/70 transition hover:bg-surface-hover">
            Tutup
          </button>
          {availableCount > 0 ? (
            <button onClick={onBorrow} className="rounded-md bg-secondary px-5 py-2 text-sm font-medium text-white transition hover:bg-secondary-hover">
              Pinjam Sekarang
            </button>
          ) : (
            <button disabled className="cursor-not-allowed rounded-md bg-main-border px-5 py-2 text-sm font-medium text-white">
              Stok Habis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-main-text/40">{label}</p>
    <p className="font-medium text-main-text">{value || "-"}</p>
  </div>
);

export default DetailModal;
