"use client";

import Image from "next/image";
import React from "react";

interface DetailModalProps {
  book: any;
  onClose: () => void;
  onBorrow: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ book, onClose, onBorrow }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
      <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-main-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-main-text">Informasi Koleksi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="relative aspect-[3/4] w-full rounded-lg shadow-md overflow-hidden border border-main-border">
                <Image src={book.imageUrl || "/images/default-image.png"} alt={book.title} fill className="object-cover" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-secondary leading-tight">{book.title}</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <DetailRow label="ISBN" value={book.isbn} />
                <DetailRow label="Penerbit" value={book.publisher} />
                <DetailRow label="Tahun" value={book.year} />
                <DetailRow label="Bahasa" value={book.language} />
                <DetailRow label="Kategori" value={book.category} />
                <DetailRow label="Status" value={book.availability > 0 ? "Tersedia" : "Kosong"} />
              </div>
              <div className="pt-4 border-t border-main-border">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Sinopsis / Catatan</p>
                <p className="text-sm text-main-text/60 leading-relaxed italic">{book.description || "Tidak ada deskripsi tambahan untuk buku ini."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface border-t border-main-border flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-main-text/70 hover:bg-surface-hover rounded-lg transition">
            Tutup
          </button>
          {book.availability > 0 ? (
            <button onClick={onBorrow} className="px-6 py-2 text-sm font-semibold text-white bg-secondary hover:bg-secondary-hover rounded-lg shadow-md transition">
              Pinjam Sekarang
            </button>
          ) : (
            <button disabled className="px-6 py-2 text-sm font-semibold text-white bg-gray-400 rounded-lg cursor-not-allowed">
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
    <p className="text-[10px] font-bold text-main-text/40 uppercase tracking-wider">{label}</p>
    <p className="text-main-text font-medium">{value || "-"}</p>
  </div>
);

export default DetailModal;
