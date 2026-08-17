export default function ProfileAbout() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.25fr_.75fr] lg:gap-20">
      <div>
        <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Tentang kami</h2>
        <p className="mt-6 max-w-[68ch] text-base leading-8 text-main-text-muted">
          Sejak 1961, UPT Perpustakaan Universitas Sam Ratulangi berkembang sebagai pusat sumber belajar,
          pelestarian pengetahuan, dan dukungan riset. Perpustakaan menghubungkan koleksi tercetak, sumber
          elektronik, pustakawan, dan ruang belajar untuk membantu sivitas akademika menemukan serta
          menggunakan informasi secara tepat.
        </p>

        <div className="mt-10 grid gap-8 border-t border-main-border pt-8 sm:grid-cols-2">
          <section>
            <h3 className="text-lg font-bold text-secondary">Visi</h3>
            <p className="mt-3 leading-7 text-main-text-muted">
              Menjadi pusat informasi ilmiah yang unggul, inklusif, dan adaptif terhadap perkembangan pengetahuan.
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
  );
}
