import { http } from "@/lib/api-client";
import type { ApiPolicy } from "@/types/api";

export type PolicyDto = Partial<Pick<ApiPolicy, "fine_per_day" | "loan_duration_days" | "max_books_per_user">>;

export const policyApi = {
  get() {
    return http.get<ApiPolicy>("/policy");
  },
  update(dto: PolicyDto) {
    return http.patch<ApiPolicy>("/policy", dto);
  },
};