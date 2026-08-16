import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { booksApi } from "@/services/books";
import { queryKeys } from "@/lib/constants";

export function useBooks(params: { page: number; search?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.books(params),
    queryFn: () => booksApi.getBooks(params),
    placeholderData: keepPreviousData,
  });
}

export function useBookDetail(id: number | null) {
  return useQuery({
    queryKey: queryKeys.bookDetail(id),
    queryFn: () => booksApi.getBookDetail(id),
    enabled: id != null,
  });
}