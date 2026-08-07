import { handleMockRequest, MockHttpError, MOCK_ENABLED } from "@/lib/mock-api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

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

function redirectToLogin(pathname: string): void {
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
  }
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, body, ...restOptions } = options;

  if (MOCK_ENABLED) {
    const url = new URL(buildUrl(endpoint, params), "http://localhost");
    let payload: unknown = undefined;
    if (body) {
      payload = typeof body === "string" ? JSON.parse(body) : body;
    }
    try {
      return (await handleMockRequest(restOptions.method ?? "GET", url.pathname, url.searchParams, payload)) as T;
    } catch (error) {
      if (error instanceof MockHttpError && error.status === 401) {
        redirectToLogin(url.pathname);
      }
      throw new Error(error instanceof Error ? error.message : "HTTP Error");
    }
  }

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

  if (response.status === 401) {
    redirectToLogin(window.location.pathname);
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }

  const payload = (await response.json()) as { data?: T };
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
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