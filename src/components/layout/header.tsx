"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useHeader } from "@/features/auth";

const nav = [
  { key: "beranda", label: "Beranda", href: "/" },
  {
    key: "profil",
    label: "Profil",
    items: [
      { href: "/profil", label: "Tentang Kami", desc: "Profil singkat perpustakaan" },
    ],
  },
  {
    key: "koleksi",
    label: "Koleksi",
    items: [
      { href: "/koleksi", label: "OPAC (Fisik)", desc: "Cari buku di rak perpustakaan" },
      { href: "/koleksidaring", label: "Koleksi Daring", desc: "Akses E-Journal & E-Book" },
    ],
  },
  {
    key: "berita",
    label: "Berita",
    items: [{ href: "/artikel", label: "Warta Artikel", desc: "Tulisan resmi staf perpustakaan" }],
  },
] as const;

const EASE = [0.32, 0.72, 0, 1] as const;

export default function Header() {
  const { user, isAuthenticated, isMenuOpen, toggleMenu, onLogout } = useHeader();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !openDropdown) return;
      triggers.current[openDropdown]?.focus();
      setOpenDropdown(null);
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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      ref={headerRef}
      onMouseLeave={() => setOpenDropdown(null)}
      className="sticky top-0 z-50 bg-secondary/80 text-white backdrop-blur-xl backdrop-saturate-150 border-b border-white/10"
    >
      <div className="container mx-auto flex items-center px-6 py-[12px]">
        <Link href="/" className="mr-auto flex items-center gap-2 text-white/90 transition-opacity hover:opacity-70">
          <span className="text-[20px] leading-none">Perpustakaan</span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden lg:flex lg:items-stretch lg:gap-1 lg:self-stretch">
          {nav.map((item) =>
            "href" in item ? (
              <Link
                key={item.key}
                href={item.href}
                onMouseEnter={() => setOpenDropdown(null)}
                className="flex items-center px-4 text-[16px] text-white/85 transition-opacity hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <div key={item.key} className="relative flex items-stretch">
                <button
                  ref={(element) => {
                    triggers.current[item.key] = element;
                  }}
                  type="button"
                  aria-expanded={openDropdown === item.key}
                  aria-controls={`menu-${item.key}`}
                  onMouseEnter={() => setOpenDropdown(item.key)}
                  onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                  className="flex items-center px-4 text-[16px] text-white/85 transition-opacity hover:text-white"
                >
                  {item.label}
                </button>

                <AnimatePresence>
                  {openDropdown === item.key && (
                    <motion.div
                      id={`menu-${item.key}`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className="absolute left-1/2 top-full w-64 -translate-x-1/2 rounded-sm border border-white/15 bg-secondary/90 p-1.5 shadow-[var(--shadow-overlay)] backdrop-blur-xl backdrop-saturate-150"
                    >
                      {item.items.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block rounded-sm px-3 py-2.5 transition-colors hover:bg-white/10"
                        >
                          <span className="block text-[13px] text-white">{link.label}</span>
                          <span className="mt-0.5 block text-[11px] text-white/55">{link.desc}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:ml-6 lg:flex">
          {isAuthenticated ? (
            <>
              <span className="text-[16px] text-white/70">
                Halo, <span className="text-white">{user?.full_name ?? "User"}</span>
              </span>
              {(user?.role === "SUPER_ADMIN" || user?.role === "STAFF") && (
                <Link href="/dashboard" className="rounded-sm bg-white/10 px-3 py-1.5 text-[16px] transition hover:bg-white/20">
                  Admin Panel
                </Link>
              )}
              <button onClick={onLogout} className="rounded-sm border border-white/25 px-3 py-1.5 text-[16px] transition hover:bg-white/10">
                Keluar
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded-sm bg-cream px-4 py-1.5 text-[16px] font-medium text-secondary transition hover:bg-cream-soft">
              Masuk
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation-mobile"
          className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
        >
          {isMenuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="site-navigation-mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-full overflow-y-auto bg-secondary/95 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Navigasi utama" className="px-6 py-4">
              {nav.map((item) =>
                "href" in item ? (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={toggleMenu}
                    className="block border-b border-white/10 py-4 text-[17px] text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div key={item.key} className="border-b border-white/10">
                    <button
                      type="button"
                      aria-expanded={openDropdown === item.key}
                      aria-controls={`mobile-menu-${item.key}`}
                      onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                      className="flex w-full items-center justify-between py-4 text-[17px] text-white"
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        size={18}
                        className={`transition-transform duration-200 ${openDropdown === item.key ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === item.key && (
                      <ul id={`mobile-menu-${item.key}`} className="pb-4 pl-4">
                        {item.items.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => {
                                setOpenDropdown(null);
                                toggleMenu();
                              }}
                              className="block py-2.5 text-[15px] text-white/80"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              )}

              <div className="mt-6 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <span className="text-[13px] text-white/70">
                      Halo, <span className="text-white">{user?.full_name ?? "User"}</span>
                    </span>
                    {(user?.role === "SUPER_ADMIN" || user?.role === "STAFF") && (
                      <Link
                        href="/dashboard"
                        onClick={toggleMenu}
                        className="rounded-sm bg-white/10 px-4 py-2.5 text-center text-[14px] transition hover:bg-white/20"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        toggleMenu();
                        onLogout();
                      }}
                      className="rounded-sm border border-white/25 px-4 py-2.5 text-[14px] transition hover:bg-white/10"
                    >
                      Keluar
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={toggleMenu}
                    className="rounded-sm bg-cream px-4 py-2.5 text-center text-[14px] font-medium text-secondary"
                  >
                    Masuk
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
