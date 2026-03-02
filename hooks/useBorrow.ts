"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

export function useBorrow() {
  const { books: allBooks, borrowBook: borrowBookFromContext, policy } = useApp();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [borrowError, setBorrowError] = useState<string | null>(null);

  const categories = useMemo(() => {
    const list = allBooks.map((b) => b.category);
    return ["Semua", ...Array.from(new Set(list))];
  }, [allBooks]);

  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.mainAuthor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "Semua" || book.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [allBooks, searchTerm, selectedCategory]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handleBorrow = () => {
    setBorrowError(null);

    if (!isAuthenticated) {
      router.push("/Login");
      return;
    }

    if (!selectedBook) return;

    const success = borrowBookFromContext(selectedBook.id);
    if (success) {
      setBorrowSuccess(true);
      setShowConfirmPopup(false);
      setSelectedBook(null);
      setTimeout(() => setBorrowSuccess(false), 3000);
    } else {
      setBorrowError(`Gagal meminjam. Maks ${policy.maxBooksPerUser} buku aktif per user.`);
      setShowConfirmPopup(false);
      setTimeout(() => setBorrowError(null), 4000);
    }
  };

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
    handleBorrow,
    borrowSuccess,
    borrowError,
    isAuthenticated,
  };
}
