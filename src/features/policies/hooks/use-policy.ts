import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api-client";
import { queryKeys } from "@/lib/constants";
import type { ApiPolicy } from "@/features/policies";

export type PolicyDto = Partial<Pick<ApiPolicy, "fine_per_day" | "loan_duration_days" | "max_books_per_user">>;

export function usePolicy(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.policy(),
    queryFn: () => http.get<ApiPolicy>("/policies"),
    enabled,
  });
}

export function useUpdatePolicyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: PolicyDto) => http.patch<ApiPolicy>("/policies", dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.policy() }),
  });
}