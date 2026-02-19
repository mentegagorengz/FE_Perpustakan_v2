"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulasi proses login selama 1.5 detik [cite: 2026-02-12]
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Logika simulasi role-based redirect [cite: 2026-01-22]
      if (email === "admin@unsrat.ac.id") {
        alert("Login Sukses sebagai Admin!");
        router.push("/admin/dashboard");
      } else {
        alert("Login Sukses sebagai Mahasiswa!");
        router.push("/peminjaman");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleLogin,
  };
}
