import Image from "next/image";

export default function ProfileHero() {
  return (
    <>
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
              Pusat sumber belajar dan informasi ilmiah untuk mendukung pendidikan, penelitian, dan pengabdian
              sivitas akademika Universitas Sam Ratulangi.
            </p>
          </div>
        </div>
      </section>

      <aside className="bg-secondary px-6 py-3 text-center text-sm text-on-secondary-muted">
        Konten pada halaman ini menggunakan data demonstrasi dan perlu diganti dengan data resmi perpustakaan.
      </aside>
    </>
  );
}
