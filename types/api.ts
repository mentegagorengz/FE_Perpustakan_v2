// Bentuk response NYATA dari BE (snake_case). Berbeda dari types/app.ts (mock, camelCase).
export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ApiRef { id: number; name: string }

export interface ApiBookItem {
  id: number;
  barcode: string;
  status: "AVAILABLE" | "RESERVED" | "BORROWED" | "LOST" | "DAMAGED";
  condition: "BAIK" | "RUSAK_RINGAN" | "RUSAK_BERAT";
  added_at: string;
  updated_at: string;
}

export interface ApiBook {
  id: number;
  title: string;
  sub_title: string | null;
  isbn_13: string | null;
  isbn_10: string | null;
  published_year: number | null;
  description: string | null;
  image_url: string | null;
  category: ApiRef | null;
  publisher: ApiRef | null;
  language: ApiRef | null;
  authors: ApiRef[];
  items?: ApiBookItem[]; // hanya ada di GET /books/:id, TIDAK di list
  created_at: string;
  updated_at: string;
}

export type SystemRole = "SUPER_ADMIN" | "STAFF" | "USER";
export type UserCategory = "STUDENT" | "LECTURER" | "LIBRARY_STAFF" | "PUBLIC";

export interface ApiUser {
  id: number;
  identification_number: string;
  email: string;
  full_name: string;
  role: SystemRole;
  category: UserCategory;
  created_at: string;
  updated_at: string;
}

export interface ApiTransaction {
  id: number;
  borrowed_at: string;
  due_date: string | null;
  returned_at: string | null;
  fine_amount: number;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
  user?: { id: number; full_name: string; email: string };
  bookItem?: {
    id: number;
    barcode: string;
    status: string;
    book?: { id: number; title: string };
  };
}

export interface ApiPolicy {
  id: number;
  fine_per_day: number;
  loan_duration_days: number;
  max_books_per_user: number;
}
