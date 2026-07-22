import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, handleApiResponse } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import type { ApiPolicy } from "@/types/api";

export function usePolicy(token: string | null) {
  return useQuery({
    queryKey: ["policy"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/policy`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await handleApiResponse(response);
      return result.data as ApiPolicy;
    },
    enabled: !!token,
  });
}

export function useUpdatePolicyMutation() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      dto: Partial<
        Pick<
          ApiPolicy,
          "fine_per_day" | "loan_duration_days" | "max_books_per_user"
        >
      >,
    ) => {
      const response = await fetch(`${API_BASE_URL}/policy`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });
      const result = await handleApiResponse(response);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["policy"] }),
  });
}
