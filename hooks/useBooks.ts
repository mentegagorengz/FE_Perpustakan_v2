import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMockState, paginate, wait } from "@/lib/mockData";
import type { ApiBook, Paginated } from "@/types/api";

export function useBooks(params: { page: number; search?: string; limit?: number }) {
  const { page, search, limit = 100 } = params;
  return useQuery({
    queryKey: ["books", { page, search, limit }],
    queryFn: async () => {
      const books = getMockState().books.filter((book) => !search || book.title.toLowerCase().includes(search.toLowerCase()));
      return wait(paginate(books, page, limit) as Paginated<ApiBook>);
    },
    placeholderData: keepPreviousData,
  });
}

export function useBookDetail(id: number | null) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      return wait(getMockState().books.find((book) => book.id === id) as ApiBook);
    },
    enabled: id != null,
  });
}
