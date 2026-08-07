export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ApiRef { id: number; name: string }

export interface ApiBookItem {
  id: number;
  barcode: string;
  inventory_number?: string | null;
  location?: string | null;
  collection_type?: "CIRCULATION" | "REFERENCE" | "RESERVE";
  acquisition_source?: "PURCHASE" | "DONATION" | "OTHER";
  price?: number | null;
  status: "AVAILABLE" | "RESERVED" | "BORROWED" | "LOST" | "DAMAGED";
  condition: "BAIK" | "RUSAK_RINGAN" | "RUSAK_BERAT";
  added_at: string;
  updated_at: string;
}

export interface ApiBook {
  id: number;
  title: string;
  sub_title: string | null;
  edition?: string | null;
  gmd?: "TEXT" | "DVD" | "EBOOK" | "AUDIO" | null;
  isbn_13: string | null;
  isbn_10: string | null;
  issn?: string | null;
  published_year: number | null;
  publication_city?: string | null;
  physical_description?: string | null;
  classification_number?: string | null;
  call_number?: string | null;
  subjects?: string[];
  attachment_url?: string | null;
  description: string | null;
  image_url: string | null;
  category: ApiRef | null;
  publisher: ApiRef | null;
  language: ApiRef | null;
  authors: ApiRef[];
  items?: ApiBookItem[];
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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiSession {
  user: ApiUser | null;
}

export interface ApiArticle {
  id: number;
  title: string;
  content: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  author?: { full_name: string };
}

export interface ArticlePayload {
  title: string;
  content: string;
  image_url?: string;
  is_published: boolean;
}

export interface ApiLog {
  id: number;
  created_at: string;
  action: string;
  status: "SUCCESS" | "FAILED";
  ip_address: string;
  device_info: string;
  user?: { full_name: string };
}

export interface DashboardSummary {
  total_books: number;
  total_users: number;
  login_attempts: number;
  failed_actions: number;
  server_status: string;
  last_updated: string;
  total_logs: number;
}

export interface ApiError {
  message?: string;
  statusCode?: number;
}
