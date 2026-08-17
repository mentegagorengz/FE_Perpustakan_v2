import Image from "next/image";

const team = [
  {
    name: "Dian Puspitasari, S.IP.",
    role: "Koordinator Layanan Pemustaka",
    duties: "Mengelola sirkulasi, keanggotaan, layanan referensi, dan pengurusan bebas pustaka.",
  },
  {
    name: "Arif Nugraha, S.Sos.",
    role: "Pustakawan Pengembangan Koleksi",
    duties: "Menangani seleksi, pengadaan, pengolahan, preservasi, dan evaluasi koleksi.",
  },
  {
    name: "Sinta Maharani, S.IP.",
    role: "Pustakawan Literasi Informasi",
    duties: "Mendampingi penelusuran ilmiah, pengelolaan sitasi, dan pelatihan basis data.",
  },
  {
    name: "Fajar Ramadhan, S.Kom.",
    role: "Pengelola Sistem dan Koleksi Digital",
    duties: "Mengelola OPAC, repositori, akses e-journal, jaringan, dan dukungan sistem perpustakaan.",
  },
];

export default function ProfileOrganization() {
  return (
    <section className="mx-auto mt-24 max-w-6xl border-t border-main-border pt-20 lg:mt-28 lg:pt-24">
      <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
        <div>
          <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Struktur organisasi</h2>
          <p className="mt-5 max-w-md leading-7 text-main-text-muted">
            Kepala perpustakaan bersama jajaran pustakawan mengelola layanan, koleksi, literasi informasi, dan
            sistem digital perpustakaan.
          </p>
        </div>

        <div>
          <article className="grid gap-6 bg-cream-soft p-6 sm:grid-cols-[160px_1fr] sm:p-8">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              <Image
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop"
                alt="Ilustrasi kepala UPT perpustakaan"
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <div className="self-center">
              <p className="text-sm font-semibold text-secondary">Kepala UPT Perpustakaan</p>
              <h3 className="mt-2 text-xl font-bold">Dr. Ratna Lestari, S.Sos., M.Si.</h3>
              <p className="mt-4 leading-7 text-main-text-muted">
                Memimpin perencanaan strategis, pengembangan mutu layanan, koordinasi sumber daya, dan kerja
                sama kelembagaan perpustakaan.
              </p>
            </div>
          </article>

          <div className="mt-8 divide-y divide-main-border border-y border-main-border">
            {team.map((person) => (
              <article key={person.name} className="grid gap-3 py-6 sm:grid-cols-[1fr_1.35fr] sm:gap-8">
                <div>
                  <h3 className="font-bold">{person.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-secondary">{person.role}</p>
                </div>
                <p className="text-sm leading-6 text-main-text-muted">{person.duties}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
