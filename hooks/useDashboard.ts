import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, handleApiResponse } from "@/constants/api";

export function useDashboardSummary(token: string | null) {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await handleApiResponse(response);
      return result.data;
    },
    enabled: !!token,
  });
}