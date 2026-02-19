"use client";

import { useBorrow } from "@/hooks/useBorrow";
import BookCard from "@/components/peminjaman/BookCard";
import DetailModal from "@/components/peminjaman/DetailModal";
import ConfirmModal from "@/components/peminjaman/ConfirmModal";
import Pagination from "@/components/peminjaman/Pagination";

export default function PeminjamanPage() {
  const { books, searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory, currentPage, setCurrentPage, totalPages, selectedBook, setSelectedBook, showConfirmPopup, setShowConfirmPopup, handleBorrow } = useBorrow();

  return (
    <div className="bg-cream min-h-screen pb-20">
      <div className="container mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-main-text tracking-tight mb-3">E-Library UNSRAT</h1>
          <p className="text-main-text/60 max-w-md mx-auto text-sm sm:text-base font-medium">Akses ribuan koleksi literatur digital secara instan dan mudah.</p>
        </div>

        {/* Search Bar Enhanced */}
        <div className="max-w-xl mx-auto mb-16 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-main-text/40">
            <SearchIcon />
          </div>
          <input type="text" placeholder="Cari buku atau penulis..." className="w-full pl-12 pr-4 py-4 bg-cream-soft border border-main-border shadow-xl shadow-surface/50 rounded-2xl focus:ring-2 focus:ring-secondary outline-none transition-all text-main-text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat: string) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${selectedCategory === cat ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20" : "bg-cream-soft text-main-text/50 border-main-border hover:border-secondary hover:text-secondary"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Content Section */}
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
          <div className="max-w-md mx-auto text-center py-20 bg-cream-soft rounded-3xl border border-dashed border-main-border shadow-sm">
            <div className="text-5xl mb-4">🔎</div>
            <p className="text-main-text/60 font-semibold italic">Oops! Buku tidak ditemukan.</p>
            <button onClick={() => setSearchTerm("")} className="mt-4 text-secondary text-sm font-bold hover:underline">
              Hapus pencarian
            </button>
          </div>
        )}

        {/* Modals */}
        {selectedBook && <DetailModal book={selectedBook} onClose={() => setSelectedBook(null)} onBorrow={() => setShowConfirmPopup(true)} />}

        {showConfirmPopup && <ConfirmModal onConfirm={handleBorrow} onCancel={() => setShowConfirmPopup(false)} />}
      </div>
    </div>
  );
}

// Komponen Ikon Sederhana
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
