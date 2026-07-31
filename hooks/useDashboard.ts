import { useQuery } from "@tanstack/react-query";
import { getMockState, wait } from "@/lib/mockData";

export function useDashboardSummary(token: string | null) {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const state = getMockState();
      return wait({ total_books: state.books.length, total_users: state.users.length, login_attempts: state.logs.filter((log) => log.action === "LOGIN").length, failed_actions: state.logs.filter((log) => log.status === "FAILED").length, server_status: "MODE DUMMY", last_updated: new Date().toISOString(), total_logs: state.logs.length });
    },
    enabled: !!token,
  });
}
