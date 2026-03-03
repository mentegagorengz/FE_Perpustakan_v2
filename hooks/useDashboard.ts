import { useQuery } from "@tanstack/react-query";

// Pastikan ejaan: useDashboardSummary (pakai 'h')
export function useDashboardSummary(token: string | null) {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/api/v1/dashboard/summary", {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Gagal mengambil data");
      const result = await response.json();
      return result.data;
    },
    enabled: !!token,
  });
}