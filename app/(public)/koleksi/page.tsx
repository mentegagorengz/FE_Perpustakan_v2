"use client";

import { useState } from "react";
import { useBorrow } from "@/hooks/useBorrow";
import BookCard from "@/components/peminjaman/BookCard";
import DetailModal from "@/components/peminjaman/DetailModal";
import ConfirmModal from "@/components/peminjaman/ConfirmModal";
import Pagination from "@/components/peminjaman/Pagination";
import { Search, SearchX, BookOpen, AlertCircle, X, Info } from "lucide-react";

export default function PeminjamanPage() {
  const {
    books,
    searchTerm,
    setSearchTerm,
    categories,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedBook,
    setSelectedBook,
    showConfirmPopup,
    setShowConfirmPopup,
    handleBorrow,
    isBorrowing,
    borrowSuccess,
    borrowError,
    isAuthenticated,
    availableCount,
    returnEstimates,
  } = useBorrow();
  const [savedBooks, setSavedBooks] = useState<Set<number>>(new Set());

  const toggleSavedBook = (id: number) => {
    setSavedBooks((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        {/* Toast Success */}
        {borrowSuccess && (
          <div
            role="status"
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 rounded-md bg-white border border-emerald-200 px-4 py-3 text-sm text-slate-900 shadow-xl"
          >
            <BookOpen size={18} className="text-emerald-600 shrink-0" />
            <span className="font-medium">Buku berhasil dipinjam!</span>
          </div>
        )}

        {/* Toast Error */}
        {borrowError && (
          <div
            role="alert"
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 rounded-md bg-white border border-red-200 px-4 py-3 text-sm text-slate-900 shadow-xl"
          >
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <span className="font-medium">{borrowError}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Katalog Koleksi Digital
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Jelajahi literatur, buku teks, dan publikasi ilmiah Universitas Sam Ratulangi.
          </p>

          {!isAuthenticated && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                <Info size={14} className="text-amber-600" />
                Login untuk meminjam buku secara langsung
              </span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <label htmlFor="book-search" className="sr-only">
            Cari buku atau penulis
          </label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
            <Search size={19} />
          </div>
          <input
            id="book-search"
            name="book-search"
            type="search"
            placeholder="Cari berdasarkan judul, penulis, atau kata kunci..."
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-300 shadow-xs rounded-md focus:ring-2 focus:ring-sky-500/20 focus:border-secondary outline-none transition-all text-slate-900 text-sm placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Bersihkan pencarian"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat: string) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border shadow-xs ${
                  isSelected
                    ? "bg-secondary text-white border-secondary"
                    : "bg-white text-slate-700 border-slate-300 hover:border-secondary hover:text-secondary"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Toolbar Info */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 text-xs sm:text-sm text-slate-600">
          <span>
            Menampilkan <strong className="text-slate-900 font-semibold">{books.length}</strong> buku
            {selectedCategory !== "Semua" ? ` dalam "${selectedCategory}"` : ""}
          </span>
        </div>

        {/* Book Grid */}
        {books.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onDetailClick={setSelectedBook}
                  saved={savedBooks.has(book.id)}
                  onSave={(item) => toggleSavedBook(item.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-14">
              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="max-w-md mx-auto text-center py-14 px-6 bg-white rounded-md border border-slate-200 shadow-xs">
            <SearchX size={44} strokeWidth={1.5} className="mx-auto mb-3 text-slate-300" />
            <h3 className="text-base font-bold text-slate-900 mb-1">Buku Tidak Ditemukan</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Tidak ada koleksi yang cocok dengan pencarian atau filter Anda.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Semua");
              }}
              className="inline-flex items-center gap-1.5 text-secondary text-sm font-semibold hover:underline"
            >
              Reset Pencarian & Filter
            </button>
          </div>
        )}

        {/* Detail Modal */}
        {selectedBook && (
          <DetailModal
            book={selectedBook}
            availableCount={availableCount}
            returnEstimates={returnEstimates}
            onClose={() => setSelectedBook(null)}
            onBorrow={() => setShowConfirmPopup(true)}
            active={!showConfirmPopup}
          />
        )}

        {/* Confirm Modal */}
        {showConfirmPopup && (
          <ConfirmModal
            onConfirm={handleBorrow}
            onCancel={() => setShowConfirmPopup(false)}
            isPending={isBorrowing}
          />
        )}
      </div>
    </div>
  );
}
