import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="bg-cream text-main-text">
      <section className="relative min-h-[520px] overflow-hidden bg-footer text-white">
        <Image
          src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2000&auto=format&fit=crop"
          alt="Ilustrasi gedung perpustakaan"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[520px] max-w-6xl items-end px-6 pb-16 pt-28 lg:pb-20">
          <div className="max-w-3xl">
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-7xl">
              Tentang Perpustakaan
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Pusat sumber belajar dan informasi ilmiah untuk mendukung pendidikan,
              penelitian, dan pengabdian sivitas akademika Universitas Sam Ratulangi.
            </p>
          </div>
        </div>
      </section>

      <aside className="bg-secondary px-6 py-3 text-center text-sm text-on-secondary-muted">
        Konten pada halaman ini menggunakan data demonstrasi dan perlu diganti dengan data resmi perpustakaan.
      </aside>

      <main className="px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.25fr_.75fr] lg:gap-20">
          <div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Tentang kami</h2>
            <p className="mt-6 max-w-[68ch] text-base leading-8 text-main-text-muted">
              Sejak 1961, UPT Perpustakaan Universitas Sam Ratulangi berkembang sebagai
              pusat sumber belajar, pelestarian pengetahuan, dan dukungan riset. Perpustakaan
              menghubungkan koleksi tercetak, sumber elektronik, pustakawan, dan ruang belajar
              untuk membantu sivitas akademika menemukan serta menggunakan informasi secara tepat.
            </p>

            <div className="mt-10 grid gap-8 border-t border-main-border pt-8 sm:grid-cols-2">
              <section>
                <h3 className="text-lg font-bold text-secondary">Visi</h3>
                <p className="mt-3 leading-7 text-main-text-muted">
                  Menjadi pusat informasi ilmiah yang unggul, inklusif, dan adaptif terhadap
                  perkembangan pengetahuan.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-secondary">Misi</h3>
                <ul className="mt-3 space-y-2 leading-7 text-main-text-muted">
                  <li>Menyediakan sumber informasi yang bermutu.</li>
                  <li>Menguatkan literasi informasi sivitas akademika.</li>
                  <li>Membangun layanan yang ramah dan mudah diakses.</li>
                </ul>
              </section>
            </div>
          </div>

          <aside className="h-fit border-t-4 border-secondary bg-cream-soft p-7">
            <p className="text-sm font-semibold text-secondary">Status institusi</p>
            <p className="mt-3 text-2xl font-bold">Akreditasi A</p>
            <dl className="mt-6 divide-y divide-main-border text-sm">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-main-text-muted">Nomor pokok</dt>
                <dd className="text-right font-semibold">7371011D000001</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-main-text-muted">Tahun berdiri</dt>
                <dd className="font-semibold">1961</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-main-text-muted">Masa berlaku</dt>
                <dd className="font-semibold">2024–2029</dd>
              </div>
            </dl>
          </aside>
        </div>

        <section className="mx-auto mt-24 max-w-6xl border-t border-main-border pt-20 lg:mt-28 lg:pt-24">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
                Struktur organisasi
              </h2>
              <p className="mt-5 max-w-md leading-7 text-main-text-muted">
                Kepala perpustakaan bersama jajaran pustakawan mengelola layanan,
                koleksi, literasi informasi, dan sistem digital perpustakaan.
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
                    Memimpin perencanaan strategis, pengembangan mutu layanan,
                    koordinasi sumber daya, dan kerja sama kelembagaan perpustakaan.
                  </p>
                </div>
              </article>

              <div className="mt-8 divide-y divide-main-border border-y border-main-border">
                {[
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
                ].map((person) => (
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
      </main>
    </div>
  );
}
