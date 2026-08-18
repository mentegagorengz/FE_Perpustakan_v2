const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  _isRetry?: boolean;
}

let isRefreshing = false;

function buildUrl(endpoint: string, params?: FetchOptions["params"]): string {
  let url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    const queryString = searchParams.toString();
    if (queryString) url += `${url.includes("?") ? "&" : "?"}${queryString}`;
  }
  return url;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, body, _isRetry, ...restOptions } = options;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    ...restOptions,
  };
  if (body !== undefined) config.body = body;

  const response = await fetch(buildUrl(endpoint, params), config);

  if (response.status === 401 && !_isRetry && endpoint !== "/auth/login" && endpoint !== "/auth/refresh") {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(buildUrl("/auth/refresh"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        isRefreshing = false;

        if (refreshRes.ok) {
          // Refresh token dirotasi via cookie HttpOnly by backend — FE tak perlu simpan.
          return apiClient<T>(endpoint, { ...options, _isRetry: true });
        }
      } catch {
        isRefreshing = false;
      }
    }
    // regenerasi gagal — token mati. Biarkan error beredar; jangan redirect.
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || "Sesi berakhir. Silakan login kembali.");
  }

  if (response.status === 401 && endpoint !== "/auth/login") {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || "Sesi berakhir. Silakan login kembali.");
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }

  const payload = (await response.json()) as (T & { data?: unknown; meta?: unknown }) | undefined;
  if (payload && typeof payload === "object") {
    // envelope backend: { success, message, data, meta? } — unwrap data,
    // lalu gabung meta sibling kembali agar paginated shape { data, meta } konsisten.
    if ("data" in payload) {
      if (payload.meta !== undefined) {
        // meta spec: { total_items, total_pages, has_next_page, has_prev_page } → normalisasi ke Paginated FE
        const m = payload.meta as Record<string, unknown>;
        const meta = {
          total: m.total_items ?? m.total,
          page: m.page,
          limit: m.limit,
          totalPages: m.total_pages ?? m.totalPages,
        };
        return { data: payload.data, meta } as T;
      }
      return payload.data as T;
    }
    return payload as T;
  }
  return payload as T;
}

export const http = {
  get: <T>(endpoint: string, options?: FetchOptions) => apiClient<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PATCH", body: body === undefined ? undefined : JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: FetchOptions) => apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};