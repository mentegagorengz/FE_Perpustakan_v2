import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api-client";
import { queryKeys } from "@/lib/constants";
import type { ApiTransaction, Paginated } from "@/types/api";

export function useTransactionsList(params: { enabled: boolean; page: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.transactions({ page: params.page, search: params.search }),
    queryFn: () => http.get<Paginated<ApiTransaction>>("/transactions", { params: { page: params.page, search: params.search } }),
    enabled: params.enabled,
    placeholderData: keepPreviousData,
  });
}

export function useBorrowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (barcode: string) => http.post<ApiTransaction>("/transactions/borrow", { barcode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useReturnMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (barcode: string) => http.post<{ success: boolean }>("/transactions/return", { barcode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
