import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { policyApi, type PolicyDto } from "@/services/policy";
import { queryKeys } from "@/lib/constants";

export function usePolicy(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.policy(),
    queryFn: policyApi.get,
    enabled,
  });
}

export function useUpdatePolicyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: PolicyDto) => policyApi.update(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.policy() }),
  });
}