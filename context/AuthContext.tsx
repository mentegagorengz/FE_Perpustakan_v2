"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuthLogic } from "@/hooks/useAuth";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  // Penanda bahwa aplikasi sedang mengambil data dari localStorage [cite: 2026-02-27]
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser && savedUser !== "undefined") {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Sesi rusak, membersihkan storage...", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    // Selesai mengecek sesi, baru izinkan aplikasi merender [cite: 2026-02-27]
    setIsInitializing(false);
  }, []);

  const { login, logout, isLoading, error } = useAuthLogic(setUser, setToken);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      // Gabungkan loading API dan loading inisialisasi [cite: 2026-02-27]
      isLoading: isLoading || isInitializing,
      error,
    }),
    [user, token, login, logout, isLoading, isInitializing, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
