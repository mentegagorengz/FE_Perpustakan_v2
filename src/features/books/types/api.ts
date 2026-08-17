export interface ApiRef {
  id: number;
  name: string;
}

export interface ApiBookItem {
  id: number;
  barcode: string;
  inventory_number?: string | null;
  location?: string | null;
  collection_type?: "CIRCULATION" | "REFERENCE" | "RESERVE";
  acquisition_source?: "PURCHASE" | "DONATION" | "OTHER";
  price?: number | null;
  status: "AVAILABLE" | "RESERVED" | "BORROWED" | "LOST" | "DAMAGED";
  condition: "GOOD" | "SLIGHTLY_DAMAGED" | "HEAVILY_DAMAGED";
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
