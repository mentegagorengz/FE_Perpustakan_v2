"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useHeader } from "@/hooks/useHeader";

export default function Header() {
  const { isAuthenticated, isMenuOpen, showToast, toggleMenu, onLogout } = useHeader();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="bg-secondary text-white sticky top-0 z-50 shadow-md font-sans">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <Image src="/images/logo_unsrat.png" alt="Logo" width={40} height={40} />
          <h1 className="text-lg font-bold tracking-tight">Perpustakaan UNSRAT</h1>
        </div>

        <button className="lg:hidden text-3xl" onClick={toggleMenu}>
          ☰
        </button>

        <nav className={`${isMenuOpen ? "block" : "hidden"} lg:flex lg:items-center lg:space-x-4`}>
          {/* 1. Beranda */}
          <Link href="/" className="px-4 py-2 text-white/80 hover:text-white transition-colors font-medium">
            Beranda
          </Link>

          {/* 2. Dropdown Berita - Menyatukan Warta & Headline [cite: 2026-02-19] */}
          <div className="relative" onMouseEnter={() => setOpenDropdown("berita")} onMouseLeave={() => setOpenDropdown(null)}>
            <button className="px-4 py-2 flex items-center gap-1 text-white/80 hover:text-white transition-colors font-medium">
              Berita
              <span className={`text-[7px] transition-transform duration-300 ${openDropdown === "berita" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openDropdown === "berita" && (
              <div className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2">
                <Link href="/artikel" className="block px-6 py-3 group hover:bg-gray-50 transition-colors">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-secondary">Warta Artikel</span>
                  <span className="text-[9px] text-gray-400 font-medium">Tulisan resmi staf perpus</span>
                </Link>
                <div className="h-[1px] bg-gray-50 mx-4 my-1"></div>
                <Link href="/#berita" className="block px-6 py-3 group hover:bg-gray-50 transition-colors">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-secondary">Headline Nasional</span>
                  <span className="text-[9px] text-gray-400 font-medium">Kabar terkini Indonesia</span>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Profil - Mengarah ke halaman detail profil [cite: 2026-02-19] */}
          {/* Dropdown Profil yang Baru di src/components/layout/Header.tsx */}
          <div className="relative" onMouseEnter={() => setOpenDropdown("profil")} onMouseLeave={() => setOpenDropdown(null)}>
            <button className="px-4 py-2 flex items-center gap-1 text-white/80 hover:text-white transition-colors font-medium">
              Profil
              <span className={`text-[7px] transition-transform duration-300 ${openDropdown === "profil" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openDropdown === "profil" && (
              <div className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2">
                <Link href="/profil/kepala-upt" className="block px-6 py-3 group hover:bg-gray-50 transition-colors">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-secondary">Kepala UPT</span>
                  <span className="text-[9px] text-gray-400 font-medium">Mengenal pimpinan perpustakaan</span>
                </Link>
                <div className="h-[1px] bg-gray-50 mx-4 my-1"></div>
                <Link href="/profil/sejarah" className="block px-6 py-3 group hover:bg-gray-50 transition-colors">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-secondary">Sejarah & NPP</span>
                  <span className="text-[9px] text-gray-400 font-medium">Jejak langkah sejak tahun 1961</span>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Dropdown Koleksi */}
          <div className="relative" onMouseEnter={() => setOpenDropdown("koleksi")} onMouseLeave={() => setOpenDropdown(null)}>
            <button className="px-4 py-2 flex items-center gap-1 text-white/80 hover:text-white transition-colors font-medium">
              Koleksi
              <span className={`text-[7px] transition-transform duration-300 ${openDropdown === "koleksi" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openDropdown === "koleksi" && (
              <div className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2">
                <Link href="/koleksi" className="block px-6 py-3 group hover:bg-gray-50 transition-colors">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-secondary">OPAC (Fisik)</span>
                  <span className="text-[9px] text-gray-400 font-medium">Cari buku di rak perpustakaan</span>
                </Link>
                <div className="h-[1px] bg-gray-50 mx-4 my-1"></div>
                <Link href="/koleksidaring" className="block px-6 py-3 group hover:bg-gray-50 transition-colors">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-secondary">Koleksi Daring</span>
                  <span className="text-[9px] text-gray-400 font-medium">Akses E-Journal & E-Book</span>
                </Link>
              </div>
            )}
          </div>

          {/* Tombol Auth */}
          <div className="pl-4 border-l border-white/20 ml-2">
            {isAuthenticated ? (
              <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                Logout
              </button>
            ) : (
              <Link href="/Login" className="bg-white text-secondary hover:bg-cream-soft px-6 py-2 rounded-xl transition font-black text-[11px] uppercase tracking-widest shadow-lg shadow-black/5">
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>

      {showToast && <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce text-[10px] font-black uppercase tracking-widest">Sampai jumpa kembali!</div>}
    </header>
  );
}
