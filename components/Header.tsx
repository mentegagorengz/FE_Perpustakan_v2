"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronDown, Menu } from "lucide-react";
import { useHeader } from "@/hooks/useHeader";

const dropdowns = {
  berita: [
    { href: "/artikel", label: "Warta Artikel", desc: "Tulisan resmi staf perpustakaan" },
  ],
  profil: [
    { href: "/profil/kepala-upt", label: "Kepala UPT", desc: "Mengenal pimpinan perpustakaan" },
    { href: "/profil/sejarah", label: "Sejarah & NPP", desc: "Jejak langkah perpustakaan" },
  ],
  koleksi: [
    { href: "/koleksi", label: "OPAC (Fisik)", desc: "Cari buku di rak perpustakaan" },
    { href: "/koleksidaring", label: "Koleksi Daring", desc: "Akses E-Journal & E-Book" },
  ],
} as const;

export default function Header() {
  const { user, isAuthenticated, isMenuOpen, showToast, toggleMenu, onLogout } = useHeader();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const dropdownTriggers = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openDropdown) {
        dropdownTriggers.current[openDropdown]?.focus();
        setOpenDropdown(null);
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenDropdown(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [openDropdown]);

  return (
    <header ref={headerRef} className="bg-secondary text-white sticky top-0 z-50 border-b border-black/10">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <BookOpen aria-hidden="true" size={38} strokeWidth={1.5} />
          <span className="font-display text-xl leading-none">UPT Perpustakaan UNSRAT</span>
        </Link>

        <button type="button" className="flex h-11 w-11 items-center justify-center lg:hidden" onClick={toggleMenu} aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={isMenuOpen} aria-controls="site-navigation">
          <Menu aria-hidden="true" size={24} />
        </button>

        <nav id="site-navigation" aria-label="Navigasi utama" className={`${isMenuOpen ? "block" : "hidden"} lg:flex lg:items-center lg:gap-1`}>
          <Link href="/" className="block px-4 py-2 text-sm text-on-secondary-muted hover:text-white transition-colors">
            Beranda
          </Link>

          {(Object.keys(dropdowns) as Array<keyof typeof dropdowns>).map((key) => (
            <div key={key} className="relative" onMouseEnter={() => setOpenDropdown(key)} onMouseLeave={() => setOpenDropdown(null)}>
              <button
                ref={(element) => { dropdownTriggers.current[key] = element; }}
                type="button"
                className="flex items-center gap-1 px-4 py-2 text-sm text-on-secondary-muted hover:text-white transition-colors capitalize"
                aria-expanded={openDropdown === key}
                aria-controls={`menu-${key}`}
                onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
              >
                {key}
                <ChevronDown aria-hidden="true" size={14} className={`transition-transform duration-200 ${openDropdown === key ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === key && (
                <div id={`menu-${key}`} className="absolute top-full left-0 w-60 bg-cream text-main-text rounded-lg border border-main-border py-1.5 shadow-[var(--shadow-overlay)]">
                  {dropdowns[key].map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpenDropdown(null)} className="block px-5 py-2.5 hover:bg-surface transition-colors">
                      <span className="block text-sm font-medium text-secondary">{item.label}</span>
                      <span className="text-xs text-main-text-muted">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center gap-3 pl-4 lg:ml-2 lg:border-l lg:border-white/20">
            {isAuthenticated ? (
              <>
                <span className="hidden text-sm text-on-secondary-muted lg:inline">
                  Halo, <span className="font-medium text-white">{user?.nama ?? "User"}</span>
                </span>
                {(user?.role === "SUPER_ADMIN" || user?.role === "STAFF") && (
                  <Link href="/dashboard" className="rounded-md bg-white/10 px-4 py-2 text-xs font-medium transition hover:bg-white/20">
                    Admin Panel
                  </Link>
                )}
                <button onClick={onLogout} className="rounded-md border border-white/25 px-4 py-2 text-xs font-medium transition hover:bg-white/10">
                  Keluar
                </button>
              </>
            ) : (
              <Link href="/login" className="rounded-md bg-cream px-5 py-2 text-xs font-semibold text-secondary transition hover:bg-cream-soft">
                Masuk
              </Link>
            )}
          </div>
        </nav>
      </div>

      {showToast && (
        <div role="status" className="fixed right-5 top-5 rounded-md bg-secondary px-5 py-3 text-sm text-white shadow-[var(--shadow-overlay)]">
          Sampai jumpa kembali.
        </div>
      )}
    </header>
  );
}
