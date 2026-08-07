import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api-client";
import { queryKeys } from "@/lib/constants";
import type { ApiUser, Paginated, SystemRole } from "@/types/api";

interface UseUsersParams {
  enabled: boolean;
  page: number;
  search?: string;
}

export function useUsers({ enabled, page, search }: UseUsersParams) {
  return useQuery({
    queryKey: queryKeys.users({ page, search }),
    queryFn: () => http.get<Paginated<ApiUser>>("/users", { params: { page, search } }),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: SystemRole }) => http.patch<ApiUser>(`/users/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => http.delete<{ success: boolean }>(`/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
