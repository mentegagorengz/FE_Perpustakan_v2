import { useQuery} from '@tanstack/react-query';

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

            const response = await fetch(`http://localhost:3001/api/v1/activity-logs?${query}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch activity logs");
            const result = await response.json();

            return result.data;
        },
        enabled: !!token,
        keepPreviousData: true,
    });
}