"use client";

export default function Footer() {
  return (
    <footer className="bg-[#292929] text-white">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Col 1 */}
          <div>
            <h4 className="mb-4 font-bold text-[15px]">UPT Perpustakaan Cakrawala</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Jl. Cakrawala No. 10, Kota Nusantara</p>
              <p>Nusantara 95115</p>
            </div>
          </div>
          
          {/* Col 2 */}
          <div>
            <h4 className="mb-4 font-bold text-[15px]">Layanan</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Koleksi Buku & Digital</a></li>
              <li><a href="#" className="hover:text-white transition-colors">E-Journal & E-Book</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Peminjaman Koleksi</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="mb-4 font-bold text-[15px]">Jam Layanan</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Senin &ndash; Jumat: 08.00 &ndash; 16.00</li>
              <li>Sabtu: 08.00 &ndash; 12.00</li>
              <li>Minggu: Tutup</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} UPT Perpustakaan Cakrawala Nusantara</p>
      </div>
    </footer>
  );
}
