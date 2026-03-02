"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Gunakan 'token' sesuai dengan yang ada di AuthContext kita [cite: 2026-02-26]
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Pastikan loading selesai sebelum mengecek akses [cite: 2026-02-26]
    if (!isLoading) {
      // Cek apakah token ada DAN apakah role termasuk golongan pengelola [cite: 2026-02-26]
      const isAuthorized = token && (user?.role === "SUPER_ADMIN" || user?.role === "STAFF");

      if (!isAuthorized) {
        // Sesuaikan "/login" dengan nama folder kamu (kecil/besar) [cite: 2026-02-26]
        router.push("/login");
      }
    }
  }, [isLoading, token, user, router]);

  // Tampilkan loading spinner saat inisialisasi localStorage [cite: 2026-02-12, 2026-02-26]
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="h-10 w-10 border-4 border-gray-100 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  // Double check sebelum merender Sidebar dan konten Admin [cite: 2026-02-26]
  if (!token || (user?.role !== "SUPER_ADMIN" && user?.role !== "STAFF")) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-cream font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
