"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation, useLogoutMutation, useSessionQuery } from "@/hooks/use-auth";
import type { ApiUser, LoginResponse } from "@/types/api";

interface AuthContextValue {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const sessionQuery = useSessionQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const login = useCallback(
    async (email: string, password: string) => {
      return loginMutation.mutateAsync({ email, password });
    },
    [loginMutation],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    router.push("/login");
  }, [logoutMutation, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: sessionQuery.data?.user ?? null,
      isAuthenticated: Boolean(sessionQuery.data?.user),
      isLoading: sessionQuery.isLoading,
      login,
      logout,
    }),
    [sessionQuery.data, sessionQuery.isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
