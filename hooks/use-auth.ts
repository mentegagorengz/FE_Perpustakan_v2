"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api-client";
import { queryKeys } from "@/lib/constants";
import type { ApiSession, LoginPayload } from "@/types/api";

export function useSessionQuery() {
  return useQuery({
    queryKey: queryKeys.session(),
    queryFn: () => http.get<ApiSession>("/auth/me"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => http.post<ApiSession>("/auth/login", payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.session(), data);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => http.post<{ success: boolean }>("/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.session(), { user: null });
      queryClient.clear();
    },
  });
}
