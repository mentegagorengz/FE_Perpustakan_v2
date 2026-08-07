"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBorrow } from "@/hooks/use-borrow";
import KoleksiHeader from "@/components/koleksi/koleksi-header";
import KoleksiToolbar from "@/components/koleksi/koleksi-toolbar";
import KoleksiGrid from "@/components/koleksi/koleksi-grid";
import BookDetailModal from "@/components/koleksi/book-detail-modal";
import BorrowConfirmModal from "@/components/koleksi/borrow-confirm-modal";

export default function KoleksiPage() {
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

  useEffect(() => {
    if (borrowSuccess) toast.success("Buku berhasil dipinjam!");
  }, [borrowSuccess]);

  useEffect(() => {
    if (borrowError) toast.error(borrowError);
  }, [borrowError]);

  const toggleSavedBook = (bookId: number) => {
    setSavedBooks((current) => {
      const next = new Set(current);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Semua");
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <KoleksiHeader isAuthenticated={isAuthenticated} />

        <KoleksiToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          resultCount={books.length}
        />

        <KoleksiGrid
          books={books}
          savedBooks={savedBooks}
          onToggleSaved={(book) => toggleSavedBook(book.id)}
          onSelect={setSelectedBook}
          onResetFilters={resetFilters}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {selectedBook && (
          <BookDetailModal
            book={selectedBook}
            availableCount={availableCount}
            returnEstimates={returnEstimates}
            onClose={() => setSelectedBook(null)}
            onBorrow={() => setShowConfirmPopup(true)}
          />
        )}

        {showConfirmPopup && (
          <BorrowConfirmModal
            onConfirm={handleBorrow}
            onCancel={() => setShowConfirmPopup(false)}
            isPending={isBorrowing}
          />
        )}
      </div>
    </div>
  );
}
