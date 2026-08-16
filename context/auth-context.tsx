"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLoginMutation, useLogoutMutation, useSessionQuery } from "@/hooks/use-auth";
import { ADMIN_LOGIN_ROUTE, isAdminRoute, LOGIN_ROUTE } from "@/lib/constants";
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
  const pathname = usePathname();
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
    router.push(isAdminRoute(pathname) ? ADMIN_LOGIN_ROUTE : LOGIN_ROUTE);
  }, [logoutMutation, router, pathname]);

  const user = useMemo<ApiUser | null>(() => {
    const data = sessionQuery.data as (ApiSession & ApiUser) | null | undefined;
    if (!data) return null;
    if (data.user && typeof data.user === "object") return data.user;
    if ("id" in data || "email" in data || "role" in data) return data as ApiUser;
    return null;
  }, [sessionQuery.data]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: sessionQuery.isLoading,
      login,
      logout,
    }),
    [user, sessionQuery.isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
