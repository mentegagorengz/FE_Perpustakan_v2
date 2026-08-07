import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api-client";
import { queryKeys } from "@/lib/constants";
import type { ApiBook, Paginated } from "@/types/api";

export function useBooks(params: { page: number; search?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.books(params),
    queryFn: () => http.get<Paginated<ApiBook>>("/books", { params }),
    placeholderData: keepPreviousData,
  });
}

export function useBookDetail(id: number | null) {
  return useQuery({
    queryKey: queryKeys.bookDetail(id),
    queryFn: () => http.get<ApiBook>(`/books/${id}`),
    enabled: id != null,
  });
}
