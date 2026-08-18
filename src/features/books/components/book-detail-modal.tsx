"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Info, Layers, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { UiBook } from "../types/ui";

interface BookDetailModalProps {
  book: UiBook;
  availableCount: number;
  returnEstimates: Record<string, string>;
  onClose: () => void;
  onBorrow: () => void;
}

const statusLabels = {
  AVAILABLE: "Tersedia",
  RESERVED: "Dipesan",
  BORROWED: "Dipinjam",
  LOST: "Hilang",
  DAMAGED: "Rusak",
} as const;

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function BookDetailModal({
  book,
  availableCount,
  returnEstimates,
  onClose,
  onBorrow,
}: BookDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"detail" | "items">("detail");
  const [imgSrc, setImgSrc] = useState(book.imageUrl || "/placeholder_koleksi.svg");
  const isAvailable = availableCount > 0;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-cream-soft">
        <DialogHeader>
          <div className="flex items-center gap-2 text-main-text">
            <BookOpen aria-hidden="true" className="text-secondary" size={18} />
            <DialogTitle>Detail Koleksi</DialogTitle>
          </div>
          <DialogCloseButton />
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
          {/* Top Hero Section */}
          <div className="flex flex-col gap-5 rounded-md border border-main-border bg-surface/80 p-4.5 shadow-xs sm:flex-row">
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="relative aspect-[3/4] w-36 overflow-hidden rounded border border-main-border bg-paper shadow-xs sm:w-40">
                <Image
                  src={imgSrc}
                  alt={`Sampul ${book.title}`}
                  fill
                  unoptimized={imgSrc.endsWith(".svg")}
                  sizes="160px"
                  className="object-cover"
                  onError={() => setImgSrc("/placeholder_koleksi.svg")}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between space-y-3">
              <div>
                {book.gmd && (
                  <Badge variant="primary" className="mb-1.5">
                    {book.gmd}
                  </Badge>
                )}
                <h3 className="text-xl font-bold leading-snug text-main-text sm:text-2xl">
                  {book.title}
                </h3>
                {book.subtitle && <p className="mt-0.5 text-sm text-main-text-muted">{book.subtitle}</p>}
                <p className="mt-2 text-xs sm:text-sm text-main-text-muted">
                  Oleh{" "}
                  <strong className="font-semibold text-main-text">
                    {book.contributors || book.mainAuthor || "Penulis Anonim"}
                  </strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-main-border pt-3">
                <Badge variant={isAvailable ? "success" : "warning"}>
                  <span className={`h-2 w-2 rounded-full ${isAvailable ? "bg-success-solid" : "bg-warning-solid"}`} />
                  {isAvailable ? `Tersedia (${availableCount})` : "Stok Habis"}
                </Badge>

                <button
                  onClick={onBorrow}
                  disabled={!isAvailable}
                  className="rounded bg-secondary px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-secondary-hover disabled:cursor-not-allowed disabled:bg-main-border disabled:text-main-text-muted sm:text-sm"
                >
                  {isAvailable ? "Pinjam Sekarang" : "Stok Habis"}
                </button>

                {book.attachmentUrl && (
                  <a
                    href={book.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border border-main-border bg-paper px-3 py-1.5 text-xs font-semibold text-secondary shadow-xs transition-colors hover:bg-surface sm:text-sm"
                  >
                    <Download aria-hidden="true" size={15} />
                    Buka lampiran
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-main-border text-sm font-semibold">
            <button
              onClick={() => setActiveTab("detail")}
              className={`flex items-center gap-2 border-b-2 pb-2.5 transition-colors ${
                activeTab === "detail" ? "border-secondary text-secondary" : "border-transparent text-main-text-muted hover:text-main-text"
              }`}
            >
              <Info size={16} /> Detail & Catatan
            </button>
            <button
              onClick={() => setActiveTab("items")}
              className={`flex items-center gap-2 border-b-2 pb-2.5 transition-colors ${
                activeTab === "items" ? "border-secondary text-secondary" : "border-transparent text-main-text-muted hover:text-main-text"
              }`}
            >
              <Layers size={16} /> Data Eksemplar ({book.items.length})
            </button>
          </div>

          {activeTab === "detail" && (
            <div className="space-y-5">
              <div>
                <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-main-text-muted">
                  Abstrak / Catatan
                </h4>
                <p className="rounded-md border border-main-border bg-surface/80 p-4 text-sm leading-relaxed text-main-text">
                  {book.description || "Tidak ada catatan abstrak."}
                </p>
              </div>

              <div>
                <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-main-text-muted">
                  Subjek / Topik
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {book.subjects.length ? (
                    book.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full border border-main-border bg-surface px-3 py-1 text-xs font-medium text-main-text-muted"
                      >
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-main-text-muted">-</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-main-text-muted">
                  Data Bibliografi
                </h4>
                <dl className="grid gap-x-6 gap-y-4 rounded-md border border-main-border bg-surface/80 p-4.5 text-xs sm:grid-cols-2 sm:text-sm">
                  <DetailRow label="Edisi" value={book.edition} />
                  <DetailRow label="GMD / Tipe Media" value={book.gmd} />
                  <DetailRow
                    label="Penerbit & Tahun"
                    value={[book.publisher, book.publicationCity, book.year].filter(Boolean).join(", ")}
                  />
                  <DetailRow label="Deskripsi Fisik" value={book.physicalDescription} />
                  <DetailRow label="ISBN / ISSN" value={book.isbn} />
                  <DetailRow label="Bahasa" value={book.language} />
                  <DetailRow label="Klasifikasi DDC" value={book.classificationNumber} />
                  <DetailRow label="Nomor Panggil" value={book.callNumber} />
                </dl>
              </div>
            </div>
          )}

          {activeTab === "items" && (
            <div className="overflow-x-auto rounded-md border border-main-border bg-paper">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-main-border bg-surface text-xs uppercase tracking-wider text-main-text-muted">
                  <tr>
                    <th className="px-4 py-3">Barcode ID</th>
                    <th className="px-4 py-3">Lokasi Rak</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Estimasi Kembali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-main-border">
                  {book.items.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-surface">
                      <td className="px-4 py-3 font-medium text-main-text">
                        {item.barcode}
                        {item.inventory_number && (
                          <span className="block text-[11px] font-normal text-main-text-muted">
                            {item.inventory_number}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-main-text-muted">{item.location || "-"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={item.status === "AVAILABLE" ? "success" : item.status === "BORROWED" ? "warning" : "neutral"}>
                          {statusLabels[item.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-main-text-muted">
                        {item.status === "BORROWED"
                          ? returnEstimates[item.barcode]
                            ? dateFormat.format(new Date(returnEstimates[item.barcode]))
                            : "Belum tercatat"
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  {!book.items.length && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-main-text-muted">
                        Belum ada data eksemplar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="rounded border border-main-border bg-paper px-4 py-2 text-xs font-medium text-main-text-muted shadow-xs transition-colors hover:bg-surface hover:text-main-text sm:text-sm"
          >
            Tutup
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-main-text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold leading-relaxed text-main-text">{value || "-"}</dd>
    </div>
  );
}
