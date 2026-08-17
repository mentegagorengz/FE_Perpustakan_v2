import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

const books = [
  { title: "Pengantar Ilmu Komputer", author: "Rinaldi Munir", status: "Tersedia", color: "bg-success-surface text-success-text" },
  { title: "Algoritma dan Pemrograman", author: "Budi Santoso", status: "Dipinjam", color: "bg-warning-surface text-warning-text" },
  { title: "Basis Data Relasional", author: "Fathansyah", status: "Tersedia", color: "bg-success-surface text-success-text" },
  { title: "Jaringan Komputer", author: "Forouzan", status: "Tersedia", color: "bg-success-surface text-success-text" },
];

export default function LatestCollections() {
  return (
    <section className="bg-cream-soft py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="mb-8 font-display text-2xl font-bold text-main-text">Koleksi Terbaru</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <div
              key={book.title}
              className="flex flex-col rounded-sm border border-main-border bg-cream p-4 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div className="mb-4 flex h-36 items-center justify-center rounded-sm bg-surface text-main-text-muted">
                <BookOpen aria-hidden="true" size={40} strokeWidth={1} />
              </div>
              <h3 className="mb-1 text-sm font-bold leading-tight text-main-text">{book.title}</h3>
              <p className="mb-4 text-xs text-main-text-muted">{book.author}</p>
              <div className="mt-auto">
                <span className={`inline-block rounded-sm px-2.5 py-1 text-[11px] font-semibold ${book.color}`}>
                  {book.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/koleksi" className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline">
            Lihat semua koleksi <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
