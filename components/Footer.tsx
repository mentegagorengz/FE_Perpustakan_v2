"use client";

import Image from "next/image";

const footerData = {
  contact: {
    address: "Jl. Kampus Unsrat, Kel. Bahu Kec. Malalayang, Manado", // Alamat lengkap
    email: "uptperpustakaan@unsrat.ac.id",
    phone: "085256512130",
  },
  links: [
    {
      title: "Layanan",
      items: ["Jam Layanan", "Keanggotaan", "Referensi & Terbitan Berkala"],
    },
    {
      title: "E-Resources",
      items: ["Database & Jurnal", "Buku Elektronik", "Trial Akses"],
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-16 border-t border-white/5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-6">
        {/* Kolom 1: Brand & Kontak Utama */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Image src="/images/logo_unsrat.png" alt="Logo UNSRAT" width={50} height={50} className="h-auto w-auto" />
            <span className="font-black text-xl leading-tight uppercase tracking-tighter">
              Perpustakaan
              <br />
              UNSRAT
            </span>
          </div>
          <div className="text-[11px] font-medium text-white/60 space-y-2 uppercase tracking-widest leading-relaxed">
            <p className="border-l-2 border-white/20 pl-3">{footerData.contact.address}</p>
            <p className="pl-4">Email: {footerData.contact.email}</p>
            <p className="pl-4">Telp: {footerData.contact.phone}</p>
          </div>
        </div>

        {/* Kolom 2 & 3: Mapping Layanan & E-Resources */}
        {footerData.links.map((section) => (
          <div key={section.title}>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-white/40">{section.title}</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-tight">
              {section.items.map((item) => (
                <li key={item} className="hover:translate-x-2 hover:text-white transition-all cursor-pointer text-white/70">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Kolom 4: Google Maps Interaktif */}
        <div className="flex flex-col">
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-white/40 text-center md:text-left">Lokasi Kampus</h4>
          <div className="rounded-[2rem] overflow-hidden bg-white p-1 border border-white/20 shadow-2xl h-48 group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.471448378906!2d124.821437314754!3d1.458269998936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x328774906f35832b%3A0x6a0f7a6f272c72b2!2sUPT%20Perpustakaan%20UNSRAT!5e0!3m2!1sid!2sid!4v1708320000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-[1.8rem] transition-all duration-500 opacity-100" // Opacity full & tanpa grayscale [cite: 2026-02-19]
            ></iframe>
          </div>
          <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-white/50 text-center">Klik untuk Navigasi ke Gedung Perpus</p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">&copy; {new Date().getFullYear()} Perpustakaan Universitas Sam Ratulangi</p>
        <div className="flex gap-6">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Manado, Sulawesi Utara</span>
        </div>
      </div>
    </footer>
  );
}
