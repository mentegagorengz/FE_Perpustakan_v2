"use client";

import React, { createContext, useContext, useMemo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalSotrage";

interface User {
  id: string;
  nama: string;
  role: "admin" | "user";
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser, removeUser] = useLocalStorage<User | null>("user", null);
  const [token, setToken, removeToken] = useLocalStorage<string | null>("token", null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (userData: User, userToken: string) => {
      setUser(userData);
      setToken(userToken);
      userData.role === "admin" ? router.push("/admin/dashboard") : router.push("/");
    },
    [setUser, setToken, router],
  );

  const logout = useCallback(() => {
    removeUser();
    removeToken();
    router.push("/login");
  }, [removeUser, removeToken, router]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};