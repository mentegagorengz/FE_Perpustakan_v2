import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { API_BASE_URL, handleApiResponse } from "@/constants/api";
import type { ApiBook, Paginated } from "@/types/api";

export function useBooks(params: { page: number; search?: string; limit?: number }) {
  const { page, search, limit = 100 } = params;
  return useQuery({
    queryKey: ["books", { page, search, limit }],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
      });
      const response = await fetch(`${API_BASE_URL}/books?${query}`);
      const result = await handleApiResponse(response);
      return result.data as Paginated<ApiBook>;
    },
    placeholderData: keepPreviousData,
  });
}

export function useBookDetail(id: number | null) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/books/${id}`);
      const result = await handleApiResponse(response);
      return result.data as ApiBook;
    },
    enabled: id != null,
  });
}
