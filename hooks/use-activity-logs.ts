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
  return useQuery({
    queryKey: queryKeys.logs({ page, action }),
    queryFn: () => http.get<Paginated<ApiLog>>("/activity-logs", { params: { page, action } }),
    enabled,
    placeholderData: keepPreviousData,
  });
}
