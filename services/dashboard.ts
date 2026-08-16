import { http } from "@/lib/api-client";
import type { DashboardSummary } from "@/types/api";

export const dashboardApi = {
  summary() {
    return http.get<DashboardSummary>("/dashboard/summary");
  },
};