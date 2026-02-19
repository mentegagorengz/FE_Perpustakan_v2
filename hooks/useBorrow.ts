"use client";

import { useState, useEffect, useMemo } from "react";
import { DUMMY_BOOKS } from "@/constants/books";

export function useBorrow() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua"); // State Filter Baru [cite: 2026-02-12]
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // Ambil daftar kategori unik dari data buku secara dinamis [cite: 2026-02-12]
  const categories = useMemo(() => {
    const list = DUMMY_BOOKS.map((b) => b.category);
    return ["Semua", ...Array.from(new Set(list))];
  }, []);

  // Logika Filter Gabungan: Search + Category [cite: 2026-02-12]
  const filteredBooks = useMemo(() => {
    return DUMMY_BOOKS.filter((book) => {
      const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.mainAuthor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "Semua" || book.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  // Reset halaman jika filter berubah [cite: 2026-02-12]
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return {
    books: paginatedBooks,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedBook,
    setSelectedBook,
    showConfirmPopup,
    setShowConfirmPopup,
    handleBorrow: () => {
      /* Logika alert */
    },
  };
}
