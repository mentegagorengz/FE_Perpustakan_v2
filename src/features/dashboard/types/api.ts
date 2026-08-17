export interface DashboardSummary {
  total_books: number;
  total_users: number;
  login_attempts: number;
  failed_actions: number;
  server_status: string;
  last_updated: string;
  total_logs: number;
}