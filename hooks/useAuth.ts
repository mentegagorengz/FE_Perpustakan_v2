"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, handleApiResponse } from "@/constants/api";

export function useAuthLogic(setUser: any, setToken: any) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await handleApiResponse(response);

      const apiResponse = result.data || result;
      const userData = apiResponse.user;
      const accessToken = apiResponse.access_token;

      if (!userData || !accessToken) {
        throw new Error("Data user atau token tidak ditemukan.");
      }

      setToken(accessToken);
      setUser(userData);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      const userRole = userData.role;
      if (userRole === "SUPER_ADMIN" || userRole === "STAFF") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // 1. Bersihkan State & LocalStorage
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2. Hapus Session ID dari Cookies secara manual
    document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 3. Redirect
    router.push("/login");
  };

  return { login, logout, isLoading, error };
}

