import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { API_BASE_URL, handleApiResponse } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import type { ApiUser, Paginated, SystemRole } from "@/types/api";

export function useUsers(params: {
  token: string | null;
  page: number;
  search?: string;
}) {
  const { token, page, search } = params;
  return useQuery({
    queryKey: ["users", { page, search }],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(search ? { search } : {}),
      });
      const response = await fetch(`${API_BASE_URL}/users?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await handleApiResponse(response);
      return result.data as Paginated<ApiUser>;
    },
    enabled: !!token,
    placeholderData: keepPreviousData,
  });
}

export function useUpdateRoleMutation() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: number; role: SystemRole }) => {
      const response = await fetch(`${API_BASE_URL}/users/${vars.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: vars.role }),
      });
      const result = await handleApiResponse(response);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUserMutation() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await handleApiResponse(response);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
