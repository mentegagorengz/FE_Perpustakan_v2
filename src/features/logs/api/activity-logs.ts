import { http } from "@/lib/api-client";
import type { ApiLog } from "@/features/logs";
import type { Paginated } from "@/lib/types";

export const activityLogsApi = {
  list(params: { page: number; action?: string }) {
    return http.get<Paginated<ApiLog>>("/activity-logs", { params });
  },
};