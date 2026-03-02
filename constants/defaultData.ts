import { Article, Book, Borrowing, PolicyConfig, AuditLog, AppUser } from "@/types/app";

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: 1,
    slug: "panduan-akses-ejournal-internasional",
    title: "Panduan Mengakses E-Journal Internasional dari Rumah",
    author: "Staf Literasi Digital",
    date: "19 Februari 2026",
    category: "Panduan",
    image: "/images/staf-article-1.png",
    excerpt: "Staf perpustakaan membagikan tips langkah demi langkah agar mahasiswa tetap produktif melakukan riset dari mana saja.",
    content: "...", // Isi konten seperti kode sebelumnya
    status: "Published",
  },
  {
    id: 2,
    slug: "strategi-mencari-referensi-skripsi",
    title: "Strategi Mencari Referensi Skripsi Secara Efektif",
    author: "Tim Pelayanan UNSRAT",
    date: "15 Februari 2026",
    category: "Tips",
    image: "/images/staf-thumb-1.png",
    excerpt: "Menemukan literatur yang tepat adalah kunci kelancaran skripsi.",
    content: "...",
    status: "Published",
  },
  {
    id: 3,
    slug: "update-jam-layanan-ramadhan",
    title: "Update Jam Layanan Selama Bulan Ramadhan",
    author: "Admin Perpustakaan",
    date: "10 Februari 2026",
    category: "Pengumuman",
    image: "/images/staf-thumb-2.png",
    excerpt: "Perubahan jam operasional perpustakaan selama bulan Ramadhan 2026.",
    content: "...",
    status: "Published",
  },
];

export const DEFAULT_BOOKS: Book[] = [
  { id: 1, title: "Laskar Pelangi", mainAuthor: "Andrea Hirata", category: "Novel", availability: 5, imageUrl: "/images/book1.png", description: "Kisah perjuangan sepuluh anak di Belitong.", isbn: "978-979-3062-79-1", publisher: "Bentang Pustaka", year: "2005", language: "Indonesia" },
  { id: 2, title: "Clean Code", mainAuthor: "Robert C. Martin", category: "Teknologi", availability: 0, imageUrl: "/images/book2.png", description: "Buku wajib bagi software engineer.", isbn: "978-0132350884", publisher: "Prentice Hall", year: "2008", language: "Inggris" },
  // ... Tambahkan sisa 15 buku dari kode sebelumnya ke sini [cite: 2026-02-24]
];

export const DEFAULT_POLICY: PolicyConfig = {
  dailyFine: 2000,
  maxBorrowDays: 14,
  maxBooksPerUser: 3,
};

export const DEFAULT_USERS: AppUser[] = [
  { id: "1", nama: "Admin Perpustakaan", email: "admin@unsrat.ac.id", role: "admin", status: "active", joinDate: "2024-01-01" },
  { id: "2", nama: "Staf Perpustakaan A", email: "staf@unsrat.ac.id", role: "admin", status: "active", joinDate: "2024-06-15" },
  { id: "3", nama: "John Mahasiswa", email: "john@student.unsrat.ac.id", role: "user", status: "active", joinDate: "2025-08-01" },
  { id: "4", nama: "Jane Mahasiswi", email: "jane@student.unsrat.ac.id", role: "user", status: "active", joinDate: "2025-09-10" },
  { id: "5", nama: "Pelanggar Aturan", email: "banned@student.unsrat.ac.id", role: "user", status: "banned", joinDate: "2025-03-20" },
];

export const DEFAULT_LOGS: AuditLog[] = [{ id: 1, admin: "Admin Perpustakaan", action: "SYSTEM INIT", target: "Aplikasi Perpustakaan", time: new Date().toLocaleString("id-ID"), status: "Info" }];

export const DEFAULT_BORROWINGS: Borrowing[] = [
  { id: 1, userId: "3", userName: "John Mahasiswa", userEmail: "john@student.unsrat.ac.id", bookId: 1, bookTitle: "Laskar Pelangi", borrowDate: "2026-02-20", dueDate: "2026-03-06", returnDate: null, status: "active", fine: 0 },
  // ... Sisa data borrowing [cite: 2026-02-24]
];
