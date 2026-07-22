"use client";

import Image from "next/image";

const footerData = {
  contact: {
    address: "Jl. Kampus Unsrat, Kel. Bahu Kec. Malalayang, Manado",
    email: "uptperpustakaan@unsrat.ac.id",
    phone: "085256512130",
  },
  links: [
    { title: "Layanan", items: ["Jam Layanan", "Keanggotaan", "Referensi & Terbitan Berkala"] },
    { title: "E-Resources", items: ["Database & Jurnal", "Buku Elektronik", "Trial Akses"] },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-secondary py-16 text-white">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-6 md:grid-cols-4">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Image src="/images/logo_unsrat.png" alt="Logo UNSRAT" width={44} height={44} className="h-auto w-auto" />
            <span className="font-display text-xl leading-tight">
              Perpustakaan
              <br />
              UNSRAT
            </span>
          </div>
          <div className="space-y-1.5 text-sm leading-relaxed text-white/65">
            <p>{footerData.contact.address}</p>
            <p>Email: {footerData.contact.email}</p>
            <p>Telp: {footerData.contact.phone}</p>
          </div>
        </div>

        {footerData.links.map((section) => (
          <div key={section.title}>
            <h4 className="mb-5 font-display text-base text-white/90">{section.title}</h4>
            <ul className="space-y-3 text-sm">
              {section.items.map((item) => (
                <li key={item} className="cursor-pointer text-white/65 transition-colors hover:text-white">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col">
          <h4 className="mb-5 font-display text-base text-white/90">Lokasi Kampus</h4>
          <div className="h-48 overflow-hidden rounded-lg border border-white/15">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.471448378906!2d124.821437314754!3d1.458269998936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x328774906f35832b%3A0x6a0f7a6f272c72b2!2sUPT%20Perpustakaan%20UNSRAT!5e0!3m2!1sid!2sid!4v1708320000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <p className="mt-3 text-xs text-white/50">Klik peta untuk navigasi ke gedung perpustakaan.</p>
        </div>
      </div>

      <div className="container mx-auto mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 px-6 pt-8 text-sm text-white/45 md:flex-row">
        <p>&copy; {new Date().getFullYear()} Perpustakaan Universitas Sam Ratulangi</p>
        <p>Manado, Sulawesi Utara</p>
      </div>
    </footer>
  );
}
