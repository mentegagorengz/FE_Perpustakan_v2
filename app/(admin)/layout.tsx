"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const isAuthorized = token && (user?.role === "SUPER_ADMIN" || user?.role === "STAFF");
      if (!isAuthorized) {
        router.push("/login");
      }
    }
  }, [isLoading, token, user, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-cream font-black text-secondary animate-pulse uppercase tracking-widest">Verifikasi Sesi...</div>;
  }

  return (
    <div className="flex h-screen bg-cream font-sans overflow-hidden">
      <div className="flex-shrink-0 w-64 h-full border-r border-main-border">
        <AdminSidebar />
      </div>

      <main className="flex-1 h-full overflow-y-auto relative">{children}</main>
    </div>
  );
}
