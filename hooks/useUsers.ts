import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { changeUserRole, getMockState, paginate, updateMockState, wait } from "@/lib/mockData";
import type { ApiUser, Paginated, SystemRole } from "@/types/api";

export function useUsers(params: {
  token: string | null;
  page: number;
  search?: string;
  role?: SystemRole;
}) {
  const { token, page, search, role } = params;
  return useQuery({
    queryKey: ["users", { page, search, role }],
    queryFn: async () => {
      const users = getMockState().users.filter((user) => (!search || `${user.full_name} ${user.email}`.toLowerCase().includes(search.toLowerCase())) && (!role || user.role === role));
      return wait(paginate(users, page, 10) as Paginated<ApiUser>);
    },
    enabled: !!token,
    placeholderData: keepPreviousData,
  });
}

export function useUpdateRoleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: number; role: SystemRole }) => {
      return wait(updateMockState((state) => ({ ...state, users: changeUserRole(state.users, vars.id, vars.role) })).users.find((user) => user.id === vars.id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return wait(updateMockState((state) => ({ ...state, users: state.users.filter((user) => user.id !== id) })));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
