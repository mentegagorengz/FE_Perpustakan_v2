"use client";

import { useBorrow } from "@/hooks/useBorrow";
import BookCard from "@/components/peminjaman/BookCard";
import DetailModal from "@/components/peminjaman/DetailModal";
import ConfirmModal from "@/components/peminjaman/ConfirmModal";
import Pagination from "@/components/peminjaman/Pagination";
import { Search, SearchX, BookOpen, AlertCircle } from "lucide-react";

export default function PeminjamanPage() {
  const { books, searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory, currentPage, setCurrentPage, totalPages, selectedBook, setSelectedBook, showConfirmPopup, setShowConfirmPopup, handleBorrow, borrowSuccess, borrowError, isAuthenticated, availableCount } = useBorrow();

  return (
    <div className="bg-cream min-h-screen pb-20">
      <div className="container mx-auto py-12 px-4">
        {borrowSuccess && (
          <div className="fixed top-5 right-5 z-[100] flex items-center gap-2.5 rounded-md bg-cream-soft border border-main-border px-4 py-3 text-sm text-main-text shadow-[var(--shadow-overlay)]">
            <BookOpen size={18} className="text-secondary" />
            Buku berhasil dipinjam!
          </div>
        )}
        {borrowError && (
          <div className="fixed top-5 right-5 z-[100] flex items-center gap-2.5 rounded-md bg-cream-soft border border-red-300 px-4 py-3 text-sm text-main-text shadow-[var(--shadow-overlay)]">
            <AlertCircle size={18} className="text-red-500" />
            {borrowError}
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-main-text mb-3">E-Library UNSRAT</h1>
          <p className="text-main-text/60 max-w-md mx-auto text-sm sm:text-base">Akses ribuan koleksi literatur digital secara instan dan mudah.</p>
          {!isAuthenticated && <p className="mt-3 text-sm text-secondary">Login untuk meminjam buku.</p>}
        </div>

        <div className="max-w-xl mx-auto mb-14 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-main-text/40">
            <Search size={20} />
          </div>
          <input type="text" placeholder="Cari buku atau penulis..." className="w-full pl-12 pr-4 py-3.5 bg-cream-soft border border-main-border shadow-[var(--shadow-card)] rounded-lg focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all text-main-text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat: string) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-full text-sm transition-colors border ${selectedCategory === cat ? "bg-secondary text-white border-secondary" : "bg-cream-soft text-main-text/60 border-main-border hover:border-secondary hover:text-secondary"}`}>
              {cat}
            </button>
          ))}
        </div>

        {books.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book) => (
                <BookCard key={book.id} book={book} onDetailClick={setSelectedBook} />
              ))}
            </div>

            <div className="mt-16">
              <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
            </div>
          </>
        ) : (
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-cream-soft rounded-lg border border-dashed border-main-border shadow-[var(--shadow-card)]">
            <SearchX size={44} strokeWidth={1.5} className="mx-auto mb-4 text-main-text/30" />
            <p className="text-main-text/60">Buku tidak ditemukan.</p>
            <button onClick={() => setSearchTerm("")} className="mt-4 text-secondary text-sm font-medium hover:underline">
              Hapus pencarian
            </button>
          </div>
        )}

        {selectedBook && <DetailModal book={selectedBook} availableCount={availableCount} onClose={() => setSelectedBook(null)} onBorrow={() => setShowConfirmPopup(true)} />}

        {showConfirmPopup && <ConfirmModal onConfirm={handleBorrow} onCancel={() => setShowConfirmPopup(false)} />}
      </div>
    </div>
  );
}
