import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/services/dashboard";
import { queryKeys } from "@/lib/constants";

export function useDashboardSummary(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: dashboardApi.summary,
    enabled,
  });
}