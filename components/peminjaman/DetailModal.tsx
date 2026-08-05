"use client";

import Image from "next/image";
import { Download, X } from "lucide-react";
import AccessibleDialog from "@/components/AccessibleDialog";
import type { UiBook } from "@/hooks/useBorrow";

interface DetailModalProps {
  book: UiBook;
  availableCount: number;
  returnEstimates: Record<string, string>;
  onClose: () => void;
  onBorrow: () => void;
  active?: boolean;
}

const statusLabels = {
  AVAILABLE: "Tersedia",
  RESERVED: "Dipesan",
  BORROWED: "Dipinjam",
  LOST: "Hilang",
  DAMAGED: "Rusak",
} as const;

const dateFormat = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default function DetailModal({ book, availableCount, returnEstimates, onClose, onBorrow, active = true }: DetailModalProps) {
  return (
    <AccessibleDialog titleId="book-detail-title" onClose={onClose} active={active} overlayClassName="z-50 bg-black/60" className="flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-sm border border-main-border bg-cream shadow-[var(--shadow-overlay)]">
      <div className="flex items-center justify-between border-b border-main-border px-5 py-4">
        <h2 id="book-detail-title" className="text-xl font-bold text-main-text">Detail Koleksi</h2>
        <button onClick={onClose} className="flex h-11 w-11 items-center justify-center text-main-text-muted hover:text-secondary" aria-label="Tutup">
          <X aria-hidden="true" size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-7">
        <section className="grid gap-8 sm:grid-cols-[180px_1fr]">
          <div>
            <div className="relative aspect-[3/4] overflow-hidden border border-main-border bg-surface">
              <Image
                src={book.imageUrl || "/placeholder_koleksi.svg"}
                alt={book.imageUrl ? `Sampul ${book.title}` : `Placeholder sampul ${book.title}`}
                fill
                sizes="180px"
                className="object-cover"
              />
            </div>
            {book.attachmentUrl ? (
              <a href={book.attachmentUrl} target="_blank" rel="noreferrer" className="mt-3 flex min-h-11 items-center justify-center gap-2 border border-main-border text-sm font-semibold text-secondary hover:bg-cream-soft">
                <Download aria-hidden="true" size={17} /> Buka lampiran
              </a>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-semibold text-secondary">{book.gmd}</p>
            <h3 className="mt-2 text-2xl font-bold leading-tight text-main-text sm:text-3xl">{book.title}</h3>
            {book.subtitle ? <p className="mt-2 text-lg text-main-text-muted">{book.subtitle}</p> : null}
            <p className="mt-4 text-sm text-main-text-muted">Oleh <strong className="text-main-text">{book.contributors}</strong></p>

            <h4 className="mt-8 border-b border-main-border pb-3 text-lg font-bold">Data bibliografi</h4>
            <dl className="mt-5 grid gap-x-8 gap-y-5 text-sm sm:grid-cols-2">
              <DetailRow label="Edisi" value={book.edition} />
              <DetailRow label="GMD / tipe media" value={book.gmd} />
              <DetailRow label="Penerbit & tahun" value={`${book.publisher}, ${book.publicationCity}, ${book.year}`} />
              <DetailRow label="Deskripsi fisik" value={book.physicalDescription} />
              <DetailRow label="ISBN / ISSN" value={book.isbn} />
              <DetailRow label="Bahasa" value={book.language} />
              <DetailRow label="Klasifikasi DDC" value={book.classificationNumber} />
              <DetailRow label="Nomor panggil" value={book.callNumber} />
            </dl>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-main-text-muted">Subjek / topik</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {book.subjects.length ? book.subjects.map((subject) => <span key={subject} className="rounded-full border border-main-border px-3 py-1 text-xs text-main-text-muted">{subject}</span>) : <span className="text-sm">-</span>}
              </div>
            </div>
            <div className="mt-6 border-t border-main-border pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-main-text-muted">Abstrak / catatan</p>
              <p className="mt-2 max-w-[70ch] text-sm leading-7 text-main-text-muted">{book.description || "Tidak ada catatan."}</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4 border-b border-main-border pb-3">
            <h4 className="text-lg font-bold">Data eksemplar</h4>
            <p className="text-sm font-semibold text-secondary">{availableCount} tersedia</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-main-text-muted">
                <tr><th className="py-4 pr-5">Barcode ID</th><th className="py-4 pr-5">Lokasi rak</th><th className="py-4 pr-5">Status</th><th className="py-4">Estimasi kembali</th></tr>
              </thead>
              <tbody className="divide-y divide-main-border border-t border-main-border">
                {book.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 pr-5 font-medium">{item.barcode}<span className="mt-1 block text-xs font-normal text-main-text-muted">{item.inventory_number || "-"}</span></td>
                    <td className="py-4 pr-5">{item.location || "-"}</td>
                    <td className="py-4 pr-5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "AVAILABLE" ? "bg-green-100 text-green-800" : item.status === "BORROWED" ? "bg-amber-100 text-amber-900" : "bg-surface text-main-text-muted"}`}>{statusLabels[item.status]}</span></td>
                    <td className="py-4 text-main-text-muted">{item.status === "BORROWED" ? (returnEstimates[item.barcode] ? dateFormat.format(new Date(returnEstimates[item.barcode])) : "Belum tercatat") : "-"}</td>
                  </tr>
                ))}
                {!book.items.length ? <tr><td colSpan={4} className="py-6 text-center text-main-text-muted">Belum ada data eksemplar.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="flex justify-end gap-3 border-t border-main-border bg-surface p-4">
        <button onClick={onClose} className="rounded-sm px-5 py-2.5 text-sm font-medium text-main-text-muted hover:bg-surface-hover">Tutup</button>
        <button onClick={onBorrow} disabled={availableCount === 0} className="rounded-sm bg-secondary px-5 py-2.5 text-sm font-medium text-white hover:bg-secondary-hover disabled:cursor-not-allowed disabled:bg-main-border">
          {availableCount > 0 ? "Pinjam Sekarang" : "Stok Habis"}
        </button>
      </div>
    </AccessibleDialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-main-text-muted">{label}</dt><dd className="mt-1 font-medium leading-6 text-main-text">{value || "-"}</dd></div>;
}
