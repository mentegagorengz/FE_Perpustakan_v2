"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api-client";
import { queryKeys, REFRESH_TOKEN_STORAGE_KEY } from "@/lib/constants";
import type { ApiSession, LoginPayload, LoginResponse, RefreshTokenPayload } from "@/types/api";

function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

function storeRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
}

function clearRefreshToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function useSessionQuery() {
  return useQuery({
    queryKey: queryKeys.session(),
    queryFn: () => http.get<ApiSession>("/auth/profile"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => http.post<LoginResponse>("/auth/login", payload),
    onSuccess: (data) => {
      storeRefreshToken(data.refreshToken);
      queryClient.setQueryData(queryKeys.session(), { user: data.user });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      const refreshToken = getStoredRefreshToken();
      const body: RefreshTokenPayload | undefined = refreshToken ? { refreshToken } : undefined;
      return http.post<{ success: boolean }>("/auth/logout", body);
    },
    onSuccess: () => {
      clearRefreshToken();
      queryClient.setQueryData(queryKeys.session(), { user: null });
      queryClient.clear();
    },
  });
}
