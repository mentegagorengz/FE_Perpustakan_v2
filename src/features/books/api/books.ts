import { http } from "@/lib/api-client";
import type { ApiBook } from "../types/api";
import type { Paginated } from "@/lib/types";

export const booksApi = {
  getBooks(params: { page: number; search?: string; limit?: number }) {
    return http.get<Paginated<ApiBook>>("/books", { params });
  },
  getBookDetail(id: number | null) {
    return http.get<ApiBook>(`/books/${id}`);
  },
};