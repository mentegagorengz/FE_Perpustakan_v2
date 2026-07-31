import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMockState, updateMockState, wait } from "@/lib/mockData";
import type { ApiPolicy } from "@/types/api";

export function usePolicy(token: string | null) {
  return useQuery({
    queryKey: ["policy"],
    queryFn: async () => {
      return wait(getMockState().policy as ApiPolicy);
    },
    enabled: !!token,
  });
}

export function useUpdatePolicyMutation() {
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
      return wait(updateMockState((state) => ({ ...state, policy: { ...state.policy, ...dto } })).policy);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["policy"] }),
  });
}
