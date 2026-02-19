import Image from "next/image";

// Data statis dipisah agar rapi
const footerData = {
  contact: {
    address: "Jl. Kampus Unsrat, Manado",
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
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-6">
        {/* Kolom 1: Brand & Kontak Utama */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Image src="/images/logo_unsrat.png" alt="Logo UNSRAT" width={50} height={50} className="h-auto w-auto" />
            <span className="font-bold text-xl leading-tight">
              Perpustakaan
              <br />
              UNSRAT
            </span>
          </div>
          <div className="text-sm text-white/70 space-y-1">
            <p>{footerData.contact.address}</p>
            <p>Email: {footerData.contact.email}</p>
            <p>Telp: {footerData.contact.phone}</p>
          </div>
        </div>

        {/* Kolom 2 & 3: Mapping Layanan & E-Resources */}
        {footerData.links.map((section) => (
          <div key={section.title}>
            <h4 className="font-bold text-lg mb-6 border-b-2 border-white/20 pb-2 inline-block">{section.title}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              {section.items.map((item) => (
                <li key={item} className="hover:translate-x-1 hover:text-white transition-all cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Kolom 4: Lokasi Map atau Jam Operasional (Inovatif) */}
        <div>
          <h4 className="font-bold text-lg mb-6 border-b-2 border-white/20 pb-2 inline-block">Lokasi Kami</h4>
          <div className="rounded-lg overflow-hidden bg-white/10 p-1">
            {/* Placeholder untuk ilustrasi Map atau Info Tambahan */}
            <p className="text-xs p-2 italic text-white/60">Terletak di jantung kampus UNSRAT, siap melayani kebutuhan literasi Anda.</p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto px-6 mt-12 pt-6 border-t border-white/10 text-center text-sm text-white/50">
        <p>&copy; {new Date().getFullYear()} Perpustakaan UNSRAT. All rights reserved.</p>
        <p className="mt-1 text-xs">Developed with passion for UNSRAT IT Community.</p>
      </div>
    </footer>
  );
}
