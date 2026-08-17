import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "../api/transactions";
import { queryKeys } from "@/lib/constants";

export function useTransactionsList(params: { enabled: boolean; page: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.transactions({ page: params.page, search: params.search }),
    queryFn: () => transactionsApi.list({ page: params.page, search: params.search }),
    enabled: params.enabled,
    placeholderData: keepPreviousData,
  });
}

export function useBorrowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (barcode: string) => transactionsApi.borrow(barcode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useReturnMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (barcode: string) => transactionsApi.returnBook(barcode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}