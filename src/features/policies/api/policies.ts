import { http } from "@/lib/api-client";
import type { ApiPolicy } from "@/features/policies";

export const policiesApi = {
  get() {
    return http.get<ApiPolicy>("/policies");
  },
  update(dto: Partial<Pick<ApiPolicy, "fine_per_day" | "loan_duration_days" | "max_books_per_user">>) {
    return http.patch<ApiPolicy>("/policies", dto);
  },
};