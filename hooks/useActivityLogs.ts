import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMockState, paginate, wait } from "@/lib/mockData";

interface UseLogsParams {
    token: string | null;
    page: number;
    action?: string;
}

export function useActivityLogs({ token, page, action }: UseLogsParams) {
    return useQuery({
        queryKey: ["activity-logs", { page, action }],
        queryFn: async () => {
            const logs = getMockState().logs.filter((log) => action === "all" || !action || log.action === action);
            return wait(paginate(logs, page, 10));
        },
        enabled: !!token,
        placeholderData: keepPreviousData,
    });
}
