export const AUTH_COOKIE = "auth_token";

export const REFRESH_TOKEN_STORAGE_KEY = "unsrat-library-refresh-token";

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  STAFF: "STAFF",
  USER: "USER",
} as const;

export const LOGIN_ROUTE = "/login";
export const ADMIN_LOGIN_ROUTE = "/admin/login";

export const ADMIN_ROUTES = [
  "/dashboard",
  "/articles",
  "/tracking",
  "/roles",
  "/policy",
  "/logs",
] as const;

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin") || ADMIN_ROUTES.some((path) => pathname.startsWith(path));
}

export const ADMIN_ROLES = ["SUPER_ADMIN", "STAFF"] as const;

export const queryKeys = {
  books: (params: { page: number; search?: string; limit?: number }) => ["books", params] as const,
  bookDetail: (id: number | null) => ["book", id] as const,
  articles: () => ["articles"] as const,
  articleDetail: (id: string | null) => ["article", id] as const,
  transactions: (params: { page: number; search?: string }) => ["transactions", params] as const,
  users: (params: { page: number; search?: string }) => ["users", params] as const,
  policy: () => ["policy"] as const,
  dashboard: () => ["dashboard-summary"] as const,
  logs: (params: { page: number; action?: string }) => ["activity-logs", params] as const,
  session: () => ["session"] as const,
} as const;
