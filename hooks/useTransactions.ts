import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { API_BASE_URL, handleApiResponse } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import type { ApiTransaction, Paginated } from "@/types/api";

export function useBorrowMutation() {
  const { token, user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (barcode: string) => {
      const response = await fetch(`${API_BASE_URL}/transactions/borrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // user_id di-override server-side dari JWT; DTO tetap wajib angka valid.
        body: JSON.stringify({ barcode, user_id: user?.id ?? 0 }),
      });
      const result = await handleApiResponse(response);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["books"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useTransactionsList(params: {
  token: string | null;
  page: number;
  search?: string;
}) {
  const { token, page, search } = params;
  return useQuery({
    queryKey: ["transactions", { page, search }],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(search ? { search } : {}),
      });
      const response = await fetch(`${API_BASE_URL}/transactions?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await handleApiResponse(response);
      return result.data as Paginated<ApiTransaction>;
    },
    enabled: !!token,
    placeholderData: keepPreviousData,
  });
}

export function useReturnMutation() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (barcode: string) => {
      const response = await fetch(
        `${API_BASE_URL}/transactions/return/${barcode}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await handleApiResponse(response);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
