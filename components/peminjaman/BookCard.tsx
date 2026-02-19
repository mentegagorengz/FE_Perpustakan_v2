"use client";

import Image from "next/image";
import React, { useState } from "react";

interface BookCardProps {
  book: any;
  onDetailClick: (book: any) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onDetailClick }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-cream-soft group rounded-2xl border border-main-border shadow-sm hover:shadow-xl hover:shadow-surface/50 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col" onClick={() => onDetailClick(book)}>
      {/* Container Gambar */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        {/* Skeleton Effect */}
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-surface-hover flex items-center justify-center">
            <svg className="w-12 h-12 text-main-text/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <Image src={book.imageUrl || "/images/default-image.png"} alt={book.title} fill className={`object-cover transition-all duration-700 group-hover:scale-110 ${isLoading ? "scale-105 blur-lg" : "scale-100 blur-0"}`} onLoadingComplete={() => setIsLoading(false)} />

        {/* Badge Status */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-cream/90 backdrop-blur-md text-main-text px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">{book.category || "Umum"}</span>
        </div>

        {/* Overlay saat dipinjam */}
        {book.availability <= 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Sedang Dipinjam</span>
          </div>
        )}
      </div>

      {/* Konten Teks */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-main-text line-clamp-2 leading-snug mb-1 group-hover:text-secondary transition-colors duration-300">{book.title}</h3>
        <p className="text-xs text-main-text/50 font-medium mb-4 italic">Oleh {book.mainAuthor || "Penulis Anonim"}</p>

        <div className="mt-auto pt-4 border-t border-surface flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${book.availability > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-[11px] font-bold text-main-text/50 uppercase">{book.availability > 0 ? `${book.availability} Tersedia` : "Kosong"}</span>
          </div>
          <span className="text-xs font-black text-secondary group-hover:translate-x-1 transition-transform">DETAIL →</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
