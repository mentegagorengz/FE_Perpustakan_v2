import { http } from "@/lib/api-client";
import type { ApiTransaction, Paginated } from "@/types/api";

export const transactionsApi = {
  list(params: { page: number; search?: string }) {
    return http.get<Paginated<ApiTransaction>>("/transactions", { params });
  },
  borrow(barcode: string) {
    return http.post<ApiTransaction>("/transactions/borrow", { barcode });
  },
  returnBook(barcode: string) {
    return http.post<{ success: boolean }>("/transactions/return", { barcode });
  },
};