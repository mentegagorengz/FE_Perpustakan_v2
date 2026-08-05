"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Newspaper, ScrollText, Crosshair, ShieldCheck, Wallet, LogOut, X, type LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type MenuItem = { label: string; href: string; icon: LucideIcon; roles: string[] };

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "STAFF"] },
  { label: "Artikel", href: "/articles", icon: Newspaper, roles: ["SUPER_ADMIN", "STAFF"] },
  { label: "Audit Logs", href: "/logs", icon: ScrollText, roles: ["SUPER_ADMIN"] },
  { label: "Tracking User", href: "/tracking", icon: Crosshair, roles: ["SUPER_ADMIN"] },
  { label: "Manajemen Role", href: "/roles", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
  { label: "Kebijakan & Denda", href: "/policy", icon: Wallet, roles: ["SUPER_ADMIN", "STAFF"] },
];

export default function AdminSidebar({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredMenu = menuItems.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="relative flex h-dvh w-64 flex-col overflow-hidden border-r border-black/10 bg-secondary text-white">
      <div className="flex-shrink-0 border-b border-white/10 p-6">
        <div className="flex items-center gap-3 pr-8">
          <BookOpen aria-hidden="true" size={30} strokeWidth={1.5} />
          <div>
            <h2 className="font-display text-base leading-none">Perpustakaan</h2>
            <p className="mt-0.5 text-xs text-on-secondary-muted">Panel Manajemen</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Tutup navigasi admin" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-white md:hidden">
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {filteredMenu.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive ? "bg-white/95 font-medium text-secondary" : "text-on-secondary-muted hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0 border-t border-white/10 bg-black/15 p-6">
        <div className="mb-4">
          <div className="truncate text-sm font-medium text-white">{user?.nama || "Admin System"}</div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-on-secondary-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
            {user?.role?.replace("_", " ")}
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-white/25 py-2.5 text-sm text-on-secondary-muted transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} /> Keluar
        </button>
      </div>
    </aside>
  );
}
