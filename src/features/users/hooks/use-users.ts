import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/users";
import { queryKeys } from "@/lib/constants";
import type { SystemRole } from "../types/api";

interface UseUsersParams {
  enabled: boolean;
  page: number;
  search?: string;
}

export function useUsers({ enabled, page, search }: UseUsersParams) {
  return useQuery({
    queryKey: queryKeys.users({ page, search }),
    queryFn: () => usersApi.list({ page, search }),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: SystemRole }) => usersApi.changeRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}