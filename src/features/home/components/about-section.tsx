import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="container mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col items-center gap-12 lg:flex-row">
        <div className="flex-1">
          <h2 className="mb-4 font-display text-2xl font-bold text-main-text">Tentang Perpustakaan</h2>
          <p className="mb-6 text-[15px] leading-relaxed text-main-text-muted">
            Perpustakaan menyediakan akses ke koleksi dan informasi ilmiah untuk mendukung kegiatan akademik
            sivitas akademika.
          </p>
          <Link
            href="/koleksi"
            className="inline-block rounded-sm bg-secondary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-hover"
          >
            Lihat Koleksi
          </Link>
        </div>
        <div className="w-full flex-1">
          <div className="overflow-hidden rounded-sm">
            <Image
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop"
              alt="Interior perpustakaan"
              width={1000}
              height={300}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-[300px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
