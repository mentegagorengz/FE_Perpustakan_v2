import { http } from "@/lib/api-client";
import type { ApiLog, Paginated } from "@/types/api";

export const activityLogsApi = {
  list(params: { page: number; action?: string }) {
    return http.get<Paginated<ApiLog>>("/activity-logs", { params });
  },
};