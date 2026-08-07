import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-secondary py-20 text-center text-white">
      <div className="container mx-auto px-6">
        <h2 className="mb-4 font-display text-2xl font-bold">Daftar sebagai anggota</h2>
        <p className="mx-auto mb-8 max-w-lg text-[15px] text-on-secondary-muted">
          Masuk untuk mengakses layanan perpustakaan sesuai hak akses civitas akademika.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-sm bg-cream px-8 py-3 text-sm font-semibold text-secondary transition hover:bg-cream-soft"
        >
          Masuk Sekarang
        </Link>
      </div>
    </section>
  );
}
