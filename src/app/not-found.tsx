import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-cream px-6 text-center text-main-text">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
        <BookOpen aria-hidden="true" size={26} strokeWidth={1.75} />
      </div>
      <h1 className="font-display text-3xl font-bold">404 — Halaman tidak ditemukan</h1>
      <p className="max-w-md text-sm text-main-text-muted">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-sm bg-secondary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-hover"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
