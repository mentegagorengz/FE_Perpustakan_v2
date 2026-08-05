"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, X, Info, Layers, BookOpen } from "lucide-react";
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

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function DetailModal({
  book,
  availableCount,
  returnEstimates,
  onClose,
  onBorrow,
  active = true,
}: DetailModalProps) {
  const [activeTab, setActiveTab] = useState<"detail" | "items">("detail");
  const isAvailable = availableCount > 0;

  return (
    <AccessibleDialog
      titleId="book-detail-title"
      onClose={onClose}
      active={active}
      overlayClassName="z-50 bg-black/60 backdrop-blur-xs"
      className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-2xl"
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50">
        <div className="flex items-center gap-2 text-main-text">
          <BookOpen size={18} className="text-secondary" />
          <h2 id="book-detail-title" className="text-lg font-bold">
            Detail Koleksi
          </h2>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          aria-label="Tutup"
        >
          <X aria-hidden="true" size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50">
        {/* Top Hero Section */}
        <div className="flex flex-col sm:flex-row gap-5 p-4.5 rounded-md border border-slate-200 bg-slate-100/90 shadow-xs">
          {/* Book Cover */}
          <div className="shrink-0 mx-auto sm:mx-0">
            <div className="relative aspect-[3/4] w-36 sm:w-40 overflow-hidden rounded border border-slate-300 bg-white shadow-xs">
              <Image
                src={book.imageUrl || "/placeholder_koleksi.svg"}
                alt={`Sampul ${book.title}`}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Book Meta & Quick Action */}
          <div className="flex-1 flex flex-col justify-between space-y-3">
            <div>
              {book.gmd && (
                <span className="inline-block rounded-full bg-sky-100 text-sky-800 border border-sky-200/80 px-2.5 py-0.5 text-xs font-semibold mb-1.5">
                  {book.gmd}
                </span>
              )}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {book.title}
              </h3>
              {book.subtitle && (
                <p className="text-sm text-slate-600 mt-0.5">{book.subtitle}</p>
              )}
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Oleh <strong className="text-slate-900 font-semibold">{book.contributors || book.mainAuthor || "Penulis Anonim"}</strong>
              </p>
            </div>

            {/* Quick Action Bar */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-amber-50 text-amber-700 border-amber-300"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAvailable ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {isAvailable ? `Tersedia (${availableCount})` : "Stok Habis"}
              </span>

              <button
                onClick={onBorrow}
                disabled={!isAvailable}
                className="rounded bg-secondary px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors hover:bg-secondary-hover disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                {isAvailable ? "Pinjam Sekarang" : "Stok Habis"}
              </button>

              {book.attachmentUrl && (
                <a
                  href={book.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-secondary hover:bg-slate-50 transition-colors shadow-xs"
                >
                  <Download aria-hidden="true" size={15} />
                  Buka lampiran
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex gap-4 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("detail")}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "detail"
                ? "border-secondary text-secondary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Info size={16} /> Detail & Catatan
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "items"
                ? "border-secondary text-secondary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers size={16} /> Data Eksemplar ({book.items.length})
          </button>
        </div>

        {/* Tab 1: Detail & Catatan */}
        {activeTab === "detail" && (
          <div className="space-y-5">
            {/* Abstrak / Catatan */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Abstrak / Catatan
              </h4>
              <p className="text-sm leading-relaxed text-slate-800 bg-slate-100/90 p-4 rounded-md border border-slate-200">
                {book.description || "Tidak ada catatan abstrak."}
              </p>
            </div>

            {/* Subjek / Topik */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Subjek / Topik
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {book.subjects.length ? (
                  book.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">-</span>
                )}
              </div>
            </div>

            {/* Grid Bibliografi */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Data Bibliografi
              </h4>
              <dl className="grid gap-x-6 gap-y-4 text-xs sm:text-sm sm:grid-cols-2 bg-slate-100/90 p-4.5 rounded-md border border-slate-200">
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

        {/* Tab 2: Data Eksemplar */}
        {activeTab === "items" && (
          <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="py-3 px-4">Barcode ID</th>
                  <th className="py-3 px-4">Lokasi Rak</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Estimasi Kembali</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {book.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {item.barcode}
                      {item.inventory_number && (
                        <span className="block text-[11px] font-normal text-slate-500">
                          {item.inventory_number}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.location || "-"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                          item.status === "AVAILABLE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : item.status === "BORROWED"
                            ? "bg-amber-50 text-amber-700 border-amber-300"
                            : "bg-slate-100 text-slate-600 border-slate-300"
                        }`}
                      >
                        {statusLabels[item.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
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
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      Belum ada data eksemplar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-3">
        <button
          onClick={onClose}
          className="rounded border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
        >
          Tutup
        </button>
      </div>
    </AccessibleDialog>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold leading-relaxed text-slate-900">
        {value || "-"}
      </dd>
    </div>
  );
}
