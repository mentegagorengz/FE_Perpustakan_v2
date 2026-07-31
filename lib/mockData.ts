import type { ApiBook, ApiPolicy, ApiTransaction, ApiUser, Paginated, SystemRole } from "@/types/api";

export interface MockArticle { id: number; title: string; content: string; image_url: string; is_published: boolean; created_at: string; author?: { full_name: string } }
export interface MockLog { id: number; created_at: string; action: string; status: "SUCCESS" | "FAILED"; ip_address: string; device_info: string; user?: { full_name: string } }

const books: ApiBook[] = [
  { id: 1, title: "Pengantar Ilmu Komputer", sub_title: null, isbn_13: "9786020000001", isbn_10: null, published_year: 2022, description: "Dasar ilmu komputer untuk pembelajar awal.", image_url: null, category: { id: 1, name: "Komputer" }, publisher: { id: 1, name: "Penerbit UNSRAT" }, language: { id: 1, name: "Indonesia" }, authors: [{ id: 1, name: "Rinaldi Munir" }], items: [{ id: 1, barcode: "BK-001", status: "AVAILABLE", condition: "BAIK", added_at: "2024-01-01", updated_at: "2024-01-01" }], created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 2, title: "Algoritma dan Pemrograman", sub_title: null, isbn_13: "9786020000002", isbn_10: null, published_year: 2021, description: "Konsep algoritma dan pemrograman terapan.", image_url: null, category: { id: 1, name: "Komputer" }, publisher: { id: 1, name: "Penerbit UNSRAT" }, language: { id: 1, name: "Indonesia" }, authors: [{ id: 2, name: "Budi Santoso" }], items: [{ id: 2, barcode: "BK-002", status: "BORROWED", condition: "BAIK", added_at: "2024-01-01", updated_at: "2024-01-01" }], created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 3, title: "Basis Data Relasional", sub_title: null, isbn_13: "9786020000003", isbn_10: null, published_year: 2020, description: "Pengantar perancangan basis data relasional.", image_url: null, category: { id: 1, name: "Komputer" }, publisher: { id: 1, name: "Penerbit UNSRAT" }, language: { id: 1, name: "Indonesia" }, authors: [{ id: 3, name: "Fathansyah" }], items: [{ id: 3, barcode: "BK-003", status: "AVAILABLE", condition: "BAIK", added_at: "2024-01-01", updated_at: "2024-01-01" }], created_at: "2024-01-01", updated_at: "2024-01-01" },
];
const users: ApiUser[] = [
  { id: 1, identification_number: "198001", email: "admin@unsrat.ac.id", full_name: "Admin Perpustakaan", role: "SUPER_ADMIN", category: "LIBRARY_STAFF", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 2, identification_number: "198002", email: "staff@unsrat.ac.id", full_name: "Staf Layanan", role: "STAFF", category: "LIBRARY_STAFF", created_at: "2024-01-02", updated_at: "2024-01-02" },
  { id: 3, identification_number: "220001", email: "mahasiswa@unsrat.ac.id", full_name: "Mahasiswa UNSRAT", role: "USER", category: "STUDENT", created_at: "2024-02-01", updated_at: "2024-02-01" },
];
const articles: MockArticle[] = [{ id: 1, title: "Layanan Perpustakaan untuk Sivitas Akademika", content: "Informasi layanan perpustakaan UNSRAT untuk mendukung pembelajaran dan riset.", image_url: "", is_published: true, created_at: "2024-03-01", author: { full_name: "Admin Perpustakaan" } }];
const transactions: ApiTransaction[] = [{ id: 1, borrowed_at: "2024-03-10", due_date: "2024-03-24", returned_at: null, fine_amount: 0, status: "BORROWED", user: { id: 3, full_name: "Mahasiswa UNSRAT", email: "mahasiswa@unsrat.ac.id" }, bookItem: { id: 2, barcode: "BK-002", status: "BORROWED", book: { id: 2, title: "Algoritma dan Pemrograman" } } }];
const logs: MockLog[] = [{ id: 1, created_at: "2024-03-10T08:30:00Z", action: "LOGIN", status: "SUCCESS", ip_address: "127.0.0.1", device_info: "Chrome on macOS", user: { full_name: "Admin Perpustakaan" } }];
const seed = { books, users, articles, transactions, logs, policy: { id: 1, fine_per_day: 1000, loan_duration_days: 14, max_books_per_user: 3 } satisfies ApiPolicy };
export type MockState = typeof seed;
const storageKey = "unsrat-library-dummy-data";

export function getMockState(): MockState {
  if (typeof window === "undefined") return structuredClone(seed);
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved) as MockState;
  localStorage.setItem(storageKey, JSON.stringify(seed));
  return structuredClone(seed);
}
export function updateMockState(updater: (state: MockState) => MockState) {
  const next = updater(getMockState());
  if (typeof window !== "undefined") localStorage.setItem(storageKey, JSON.stringify(next));
  return next;
}
export function paginate<T>(items: T[], page: number, limit = 10): Paginated<T> {
  const start = (page - 1) * limit;
  return { data: items.slice(start, start + limit), meta: { total: items.length, page, limit, totalPages: Math.max(1, Math.ceil(items.length / limit)) } };
}
export const wait = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 150));
export const changeUserRole = (users: ApiUser[], id: number, role: SystemRole) => users.map((user) => user.id === id ? { ...user, role } : user);
