import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { API_BASE_URL, handleApiResponse } from "@/constants/api";

interface UseLogsParams {
    token: string | null;
    page: number;
    action?: string;
}

export function useActivityLogs({ token, page, action }: UseLogsParams) {
    return useQuery({
        queryKey: ["activity-logs", { page, action }],
        queryFn: async () => {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                ...(action !== "all" && action ? { action } : {}),
            });

            const response = await fetch(`${API_BASE_URL}/activity-logs?${query}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const result = await handleApiResponse(response);
            return result.data;
        },
        enabled: !!token,
        placeholderData: keepPreviousData,
    });
}