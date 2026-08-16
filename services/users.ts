import { http } from "@/lib/api-client";
import type { ApiUser, Paginated, SystemRole } from "@/types/api";

export const usersApi = {
  list(params: { page: number; search?: string }) {
    return http.get<Paginated<ApiUser>>("/users", { params });
  },
  changeRole(id: number, role: SystemRole) {
    return http.patch<ApiUser>(`/users/${id}/role`, { role });
  },
  remove(id: number) {
    return http.delete<{ success: boolean }>(`/users/${id}`);
  },
};