"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Newspaper, ScrollText, Crosshair, ShieldCheck, Wallet, LogOut, type LucideIcon } from "lucide-react";
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

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredMenu = menuItems.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col overflow-hidden border-r border-black/10 bg-secondary text-white">
      <div className="flex-shrink-0 border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <BookOpen size={30} strokeWidth={1.5} aria-label="Logo perpustakaan" />
          <div>
            <h2 className="font-display text-base leading-none">Perpustakaan Cakrawala</h2>
            <p className="mt-0.5 text-xs text-white/45">Panel Manajemen</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {filteredMenu.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive ? "bg-white/95 font-medium text-secondary" : "text-white/60 hover:bg-white/10 hover:text-white"
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
          <div className="mt-0.5 flex items-center gap-2 text-xs text-white/45">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
            {user?.role?.replace("_", " ")}
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-white/25 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} /> Keluar
        </button>
      </div>
    </aside>
  );
}
