"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth(); 

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "📊", roles: ["SUPER_ADMIN", "STAFF"] },
    { label: "Artikel", href: "/articles", icon: "📰", roles: ["SUPER_ADMIN", "STAFF"] },
    { label: "Audit Logs", href: "/logs", icon: "📜", roles: ["SUPER_ADMIN"] },
    { label: "Tracking User", href: "/tracking", icon: "🎯", roles: ["SUPER_ADMIN"] },
    { label: "Manajemen Role", href: "/roles", icon: "🛡️", roles: ["SUPER_ADMIN"] },
    { label: "Kebijakan & Denda", href: "/policy", icon: "💰", roles: ["SUPER_ADMIN", "STAFF"] },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(user?.role)); 

  return (
    /* Perubahan utama: h-screen (mengunci tinggi sesuai layar) dan overflow-hidden  */
    <aside className="w-64 bg-secondary text-white h-screen flex flex-col sticky top-0 shadow-2xl font-sans overflow-hidden">
      
      {/* Header Sidebar: Tetap di atas  */}
      <div className="p-8 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <Image src="/images/logo_unsrat.png" alt="Logo" width={28} height={28} className="brightness-200" />
          <div>
            <h2 className="text-[12px] font-black tracking-[0.2em] leading-none uppercase">UPT PERPUS</h2>
            <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest mt-1">Management v2.0</p>
          </div>
        </div>
      </div>

      {/* Navigasi: Hanya bagian ini yang bisa di-scroll jika menu terlalu banyak  */}
      <nav className="flex-1 py-6 overflow-y-auto no-scrollbar">
        {filteredMenu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center gap-4 px-8 py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all group ${
                isActive ? "bg-white text-secondary shadow-lg shadow-black/20" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`text-base transition-transform group-hover:scale-110 ${isActive ? "opacity-100" : "opacity-50"}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar & Logout: Terkunci di bawah layar  */}
      <div className="p-8 border-t border-white/5 bg-black/20 flex-shrink-0">
        <div className="mb-6">
          <div className="text-[10px] font-black text-white uppercase tracking-wider truncate">
            {user?.nama || "Admin System"}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <div className="text-[8px] text-white/30 font-bold uppercase tracking-widest">
              {user?.role?.replace("_", " ")} 
            </div>
          </div>
        </div>

        <button 
          onClick={logout} 
          className="w-full py-3 border border-red-400/30 text-red-400 hover:bg-red-400 hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2"
        >
          <span>🚪</span> KELUAR SISTEM
        </button>
      </div>
    </aside>
  );
}