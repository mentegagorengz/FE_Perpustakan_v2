"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { ADMIN_LOGIN_ROUTE } from "@/lib/constants";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const roleUpper = user?.role ? String(user.role).toUpperCase() : "";
  const isAuthorized = Boolean(isAuthenticated && (roleUpper === "SUPER_ADMIN" || roleUpper === "STAFF" || roleUpper === "ADMIN"));

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.replace(ADMIN_LOGIN_ROUTE);
    }
  }, [isAuthorized, isLoading, router]);

  if (isLoading || !isAuthorized) {
    return <div className="flex items-center justify-center min-h-screen bg-cream font-black text-secondary animate-pulse uppercase tracking-widest">Verifikasi Sesi...</div>;
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-cream font-sans">
      <button
        type="button"
        aria-label="Buka navigasi admin"
        aria-controls="admin-sidebar"
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-sm border border-main-border bg-cream text-secondary shadow-[var(--shadow-card)] md:hidden"
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>

      {isSidebarOpen && (
        <>
          <button type="button" aria-label="Tutup navigasi admin" onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/45 md:hidden" />
          <div id="admin-sidebar" className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
            <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="hidden w-64 shrink-0 md:block">
        <AdminSidebar />
      </div>

      <main className="relative h-full min-w-0 flex-1 overflow-y-auto pt-16 md:pt-0">{children}</main>
    </div>
  );
}
