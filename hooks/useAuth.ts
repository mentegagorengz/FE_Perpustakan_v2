"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getMockState, wait } from "@/lib/mockData";

export function useAuthLogic(setUser: any, setToken: any) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await wait(null);
      if (!password) throw new Error("Kata sandi wajib diisi.");
      const userData = getMockState().users.find((user) => user.email.toLowerCase() === email.toLowerCase());
      if (!userData) throw new Error("Akun dummy tidak ditemukan. Gunakan admin@unsrat.ac.id, staff@unsrat.ac.id, atau mahasiswa@unsrat.ac.id.");
      const accessToken = `dummy-token-${userData.id}`;

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
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    router.push("/login");
  };

  return { login, logout, isLoading, error };
}
