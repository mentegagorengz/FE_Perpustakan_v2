import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api-client";
import { queryKeys } from "@/lib/constants";
import type { ApiLog, Paginated } from "@/types/api";

interface UseLogsParams {
  enabled: boolean;
  page: number;
  action?: string;
}

export function useActivityLogs({ enabled, page, action }: UseLogsParams) {
  const queryParams: { page: number; action?: string } = { page };
  if (action && action !== "all") {
    queryParams.action = action;
  }

  return useQuery({
    queryKey: queryKeys.logs({ page, action }),
    queryFn: () => http.get<Paginated<ApiLog>>("/activity-logs", { params: queryParams }),
    enabled,
    placeholderData: keepPreviousData,
  });
}
