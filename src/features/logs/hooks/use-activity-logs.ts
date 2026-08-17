import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { activityLogsApi } from "@/features/logs";
import { queryKeys } from "@/lib/constants";

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
    queryFn: () => activityLogsApi.list(queryParams),
    enabled,
    placeholderData: keepPreviousData,
  });
}