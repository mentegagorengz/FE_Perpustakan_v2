"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-footer text-white">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Col 1 */}
          <div>
            <h4 className="mb-4 font-bold text-[15px]">Perpustakaan</h4>
            <div className="space-y-1 text-sm text-footer-muted">
              <p>Informasi lokasi tersedia melalui profil resmi perpustakaan.</p>
            </div>
          </div>
          
          {/* Col 2 */}
          <div>
            <h4 className="mb-4 font-bold text-[15px]">Layanan</h4>
            <ul className="space-y-2 text-sm text-footer-muted">
              <li><Link href="/koleksi" className="hover:text-white transition-colors">Koleksi Buku &amp; Digital</Link></li>
              <li><Link href="/koleksidaring" className="hover:text-white transition-colors">E-Journal &amp; E-Book</Link></li>
              <li><Link href="/koleksi" className="hover:text-white transition-colors">Peminjaman Koleksi</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="mb-4 font-bold text-[15px]">Informasi layanan</h4>
            <p className="text-sm text-footer-muted">Jadwal layanan mengikuti informasi resmi perpustakaan.</p>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-footer-subtle">
        <p>&copy; {new Date().getFullYear()} Perpustakaan</p>
      </div>
    </footer>
  );
}
