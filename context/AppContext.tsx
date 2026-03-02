"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalSotrage";
import { useAuth } from "@/context/AuthContext";
import { Article, Book, Borrowing, PolicyConfig, AuditLog, AppUser } from "@/types/app";
import { DEFAULT_ARTICLES, DEFAULT_BOOKS, DEFAULT_BORROWINGS, DEFAULT_POLICY, DEFAULT_LOGS, DEFAULT_USERS } from "@/constants/defaultData";

interface AppContextType {
  articles: Article[];
  addArticle: (article: Omit<Article, "id" | "slug">) => void;
  updateArticle: (id: number, data: Partial<Article>) => void;
  deleteArticle: (id: number) => void;
  getPublishedArticles: () => Article[];
  books: Book[];
  addBook: (book: Omit<Book, "id">) => void;
  updateBook: (id: number, data: Partial<Book>) => void;
  deleteBook: (id: number) => void;
  borrowings: Borrowing[];
  borrowBook: (bookId: number) => boolean;
  returnBook: (borrowingId: number) => void;
  getActiveBorrowings: () => Borrowing[];
  getUserBorrowings: (userId: string) => Borrowing[];
  policy: PolicyConfig;
  updatePolicy: (data: Partial<PolicyConfig>) => void;
  executeWaiver: () => void;
  logs: AuditLog[];
  addLog: (log: Omit<AuditLog, "id" | "time">) => void;
  users: AppUser[];
  updateUserRole: (userId: string, role: "admin" | "user") => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useLocalStorage<Article[]>("app_articles", DEFAULT_ARTICLES);
  const [books, setBooks] = useLocalStorage<Book[]>("app_books", DEFAULT_BOOKS);
  const [borrowings, setBorrowings] = useLocalStorage<Borrowing[]>("app_borrowings", DEFAULT_BORROWINGS);
  const [policy, setPolicy] = useLocalStorage<PolicyConfig>("app_policy", DEFAULT_POLICY);
  const [logs, setLogs] = useLocalStorage<AuditLog[]>("app_logs", DEFAULT_LOGS);
  const [users, setUsers] = useLocalStorage<AppUser[]>("app_users", DEFAULT_USERS);

  const { user } = useAuth();

  // ---- HELPER: Add log ----
  const addLog = useCallback(
    (log: Omit<AuditLog, "id" | "time">) => {
      const newLog: AuditLog = {
        ...log,
        id: Date.now(),
        time: new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      };
      setLogs((prev) => [newLog, ...prev]);
    },
    [setLogs],
  );

  // ---- ARTICLES LOGIC ----
  const addArticle = useCallback(
    (article: Omit<Article, "id" | "slug">) => {
      const slug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setArticles((prev) => [{ ...article, id: Date.now(), slug }, ...prev]);
      addLog({ admin: user?.nama || "System", action: "CREATE", target: `Artikel: ${article.title}`, status: "Info" });
    },
    [setArticles, addLog, user],
  );

  const updateArticle = useCallback(
    (id: number, data: Partial<Article>) => {
      setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
      addLog({ admin: user?.nama || "System", action: "UPDATE", target: `Artikel ID #${id}`, status: "Info" });
    },
    [setArticles, addLog, user],
  );

  const deleteArticle = useCallback(
    (id: number) => {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      addLog({ admin: user?.nama || "System", action: "DELETE", target: `Artikel ID #${id}`, status: "Critical" });
    },
    [setArticles, addLog, user],
  );

  const getPublishedArticles = useCallback(() => articles.filter((a) => a.status === "Published"), [articles]);

  // ---- BOOKS LOGIC ----
  const addBook = useCallback(
    (book: Omit<Book, "id">) => {
      setBooks((prev) => [{ ...book, id: Date.now() }, ...prev]);
      addLog({ admin: user?.nama || "System", action: "CREATE", target: `Buku: ${book.title}`, status: "Info" });
    },
    [setBooks, addLog, user],
  );

  const updateBook = useCallback(
    (id: number, data: Partial<Book>) => {
      setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
      addLog({ admin: user?.nama || "System", action: "UPDATE", target: `Buku ID #${id}`, status: "Info" });
    },
    [setBooks, addLog, user],
  );

  const deleteBook = useCallback(
    (id: number) => {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      addLog({ admin: user?.nama || "System", action: "DELETE", target: `Buku ID #${id}`, status: "Critical" });
    },
    [setBooks, addLog, user],
  );

  // ---- BORROWINGS LOGIC [cite: 2026-02-24] ----
  const borrowBook = useCallback(
    (bookId: number) => {
      if (!user) return false;
      const book = books.find((b) => b.id === bookId);
      if (!book || book.availability <= 0) return false;
      const userActive = borrowings.filter((b) => b.userId === user.id && b.status === "active");
      if (userActive.length >= policy.maxBooksPerUser) return false;

      const now = new Date();
      const due = new Date(now);
      due.setDate(due.getDate() + policy.maxBorrowDays);

      const newBorrow: Borrowing = {
        id: Date.now(),
        userId: user.id,
        userName: user.nama,
        userEmail: user.email,
        bookId,
        bookTitle: book.title,
        borrowDate: now.toISOString().split("T")[0],
        dueDate: due.toISOString().split("T")[0],
        returnDate: null,
        status: "active",
        fine: 0,
      };

      setBorrowings((prev) => [newBorrow, ...prev]);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, availability: b.availability - 1 } : b)));
      addLog({ admin: user.nama, action: "BORROW", target: `Buku: ${book.title}`, status: "Info" });
      return true;
    },
    [user, books, borrowings, policy, setBorrowings, setBooks, addLog],
  );

  const returnBook = useCallback(
    (borrowingId: number) => {
      const borrow = borrowings.find((b) => b.id === borrowingId);
      if (!borrow) return;
      const now = new Date();
      const due = new Date(borrow.dueDate);
      const diffDays = Math.max(0, Math.ceil((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
      const fine = diffDays * policy.dailyFine;

      setBorrowings((prev) => prev.map((b) => (b.id === borrowingId ? { ...b, returnDate: now.toISOString().split("T")[0], status: "returned", fine } : b)));
      setBooks((prev) => prev.map((b) => (b.id === borrow.bookId ? { ...b, availability: b.availability + 1 } : b)));
      addLog({ admin: user?.nama || "System", action: "RETURN", target: `Buku: ${borrow.bookTitle}`, status: fine > 0 ? "Warning" : "Info" });
    },
    [borrowings, policy, setBorrowings, setBooks, addLog, user],
  );

  // ---- ADMIN LOGIC [cite: 2025-09-24, 2026-02-24] ----
  const updatePolicy = useCallback(
    (data: Partial<PolicyConfig>) => {
      setPolicy((prev) => ({ ...prev, ...data }));
      addLog({ admin: user?.nama || "System", action: "POLICY CHANGE", target: "Update Aturan", status: "Warning" });
    },
    [setPolicy, addLog, user],
  );

  const executeWaiver = useCallback(() => {
    setBorrowings((prev) => prev.map((b) => ({ ...b, fine: 0 })));
    addLog({ admin: user?.nama || "System", action: "FINE WAIVER", target: "Pemutihan Denda", status: "Critical" });
  }, [setBorrowings, addLog, user]);

  const updateUserRole = useCallback(
    (userId: string, role: "admin" | "user") => {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      addLog({ admin: user?.nama || "System", action: "ROLE CHANGE", target: `User #${userId}`, status: "Warning" });
    },
    [setUsers, addLog, user],
  );

  const banUser = useCallback(
    (userId: string) => {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "banned" } : u)));
      addLog({ admin: user?.nama || "System", action: "BAN USER", target: `User #${userId}`, status: "Critical" });
    },
    [setUsers, addLog, user],
  );

  const unbanUser = useCallback(
    (userId: string) => {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "active" } : u)));
      addLog({ admin: user?.nama || "System", action: "UNBAN USER", target: `User #${userId}`, status: "Info" });
    },
    [setUsers, addLog, user],
  );

  const value = useMemo(
    () => ({
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      getPublishedArticles,
      books,
      addBook,
      updateBook,
      deleteBook,
      borrowings,
      borrowBook,
      returnBook,
      getActiveBorrowings: () => borrowings.filter((b) => b.status === "active"),
      getUserBorrowings: (uid: string) => borrowings.filter((b) => b.userId === uid),
      policy,
      updatePolicy,
      executeWaiver,
      logs,
      addLog,
      users,
      updateUserRole,
      banUser,
      unbanUser,
    }),
    [articles, addArticle, updateArticle, deleteArticle, getPublishedArticles, books, addBook, updateBook, deleteBook, borrowings, borrowBook, returnBook, policy, updatePolicy, executeWaiver, logs, addLog, users, updateUserRole, banUser, unbanUser],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
