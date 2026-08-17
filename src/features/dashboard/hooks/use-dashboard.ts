import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api-client";
import { queryKeys } from "@/lib/constants";
import type { DashboardSummary } from "../types/api";

export function useDashboardSummary(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: () => http.get<DashboardSummary>("/dashboard/summary"),
    enabled,
  });
}