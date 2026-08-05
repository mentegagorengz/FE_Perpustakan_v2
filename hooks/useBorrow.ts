"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useBooks, useBookDetail } from "@/hooks/useBooks";
import { useBorrowMutation, useTransactionsList } from "@/hooks/useTransactions";
import type { ApiBook, ApiBookItem } from "@/types/api";

export interface UiBook {
  id: number;
  title: string;
  mainAuthor: string;
  category: string;
  imageUrl: string;
  description: string;
  isbn: string;
  publisher: string;
  year: string;
  language: string;
  subtitle: string;
  contributors: string;
  edition: string;
  gmd: string;
  publicationCity: string;
  physicalDescription: string;
  classificationNumber: string;
  callNumber: string;
  subjects: string[];
  attachmentUrl: string;
  items: ApiBookItem[];
}

const gmdLabels = { TEXT: "Teks", DVD: "DVD", EBOOK: "E-book", AUDIO: "Audio" } as const;

function mapBook(b: ApiBook): UiBook {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.sub_title ?? "",
    mainAuthor: b.authors?.[0]?.name ?? "-",
    contributors: b.authors?.map((author) => author.name).join(", ") ?? "-",
    category: b.category?.name ?? "-",
    imageUrl: b.image_url ?? "",
    description: b.description ?? "",
    isbn: b.isbn_13 ?? b.isbn_10 ?? "-",
    publisher: b.publisher?.name ?? "-",
    year: b.published_year ? String(b.published_year) : "-",
    language: b.language?.name ?? "-",
    edition: b.edition ?? "-",
    gmd: b.gmd ? gmdLabels[b.gmd] : "-",
    publicationCity: b.publication_city ?? "-",
    physicalDescription: b.physical_description ?? "-",
    classificationNumber: b.classification_number ?? "-",
    callNumber: b.call_number ?? "-",
    subjects: b.subjects ?? [],
    attachmentUrl: b.attachment_url ?? "",
    items: b.items ?? [],
  };
}

export function useBorrow() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const { data, isLoading, isError } = useBooks({ page: 1 });
  const borrowMutation = useBorrowMutation();
  const { data: transactions } = useTransactionsList({ token, page: 1 });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<UiBook | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [borrowError, setBorrowError] = useState<string | null>(null);

  const allBooks = useMemo(() => (data?.data ?? []).map(mapBook), [data]);

  const categories = useMemo(() => {
    const list = allBooks.map((b) => b.category);
    return ["Semua", ...Array.from(new Set(list))];
  }, [allBooks]);

  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      const matchSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.mainAuthor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "Semua" || book.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [allBooks, searchTerm, selectedCategory]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  const handleSearch = (v: string) => {
    setSearchTerm(v);
    setCurrentPage(1);
  };
  const handleCategory = (v: string) => {
    setSelectedCategory(v);
    setCurrentPage(1);
  };

  const { data: detail } = useBookDetail(selectedBook?.id ?? null);
  const availableCount =
    detail?.items?.filter((it) => it.status === "AVAILABLE").length ?? 0;
  const returnEstimates = Object.fromEntries(
    (transactions?.data ?? [])
      .filter((transaction) => transaction.status !== "RETURNED" && transaction.bookItem?.barcode && transaction.due_date)
      .map((transaction) => [transaction.bookItem!.barcode, transaction.due_date!]),
  );

  const handleBorrow = async () => {
    setBorrowError(null);
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!selectedBook || !detail) return;

    const availableItem = detail.items?.find((it) => it.status === "AVAILABLE");
    if (!availableItem) {
      setBorrowError("Tidak ada eksemplar tersedia untuk buku ini.");
      setShowConfirmPopup(false);
      setTimeout(() => setBorrowError(null), 4000);
      return;
    }

    try {
      await borrowMutation.mutateAsync(availableItem.barcode);
      setBorrowSuccess(true);
      setShowConfirmPopup(false);
      setSelectedBook(null);
      setTimeout(() => setBorrowSuccess(false), 3000);
    } catch (e) {
      setBorrowError(e instanceof Error ? e.message : "Gagal meminjam.");
      setShowConfirmPopup(false);
      setTimeout(() => setBorrowError(null), 4000);
    }
  };

  return {
    books: paginatedBooks,
    searchTerm,
    setSearchTerm: handleSearch,
    selectedCategory,
    setSelectedCategory: handleCategory,
    categories,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedBook,
    setSelectedBook,
    showConfirmPopup,
    setShowConfirmPopup,
    handleBorrow,
    isBorrowing: borrowMutation.isPending,
    borrowSuccess,
    borrowError,
    isAuthenticated,
    isLoading,
    isError,
    availableCount,
    returnEstimates,
  };
}
