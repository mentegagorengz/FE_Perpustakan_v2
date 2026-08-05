"use client";

import { BookOpen } from "lucide-react";
import AccessibleDialog from "@/components/AccessibleDialog";

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

function ConfirmModal({ onConfirm, onCancel, isPending = false }: ConfirmModalProps) {
  return (
    <AccessibleDialog titleId="borrow-confirm-title" descriptionId="borrow-confirm-description" onClose={onCancel} overlayClassName="z-[60] bg-black/50" className="w-full max-w-sm rounded-sm bg-cream p-8 text-center shadow-[var(--shadow-overlay)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <BookOpen aria-hidden="true" size={26} strokeWidth={1.75} />
        </div>
        <h3 id="borrow-confirm-title" className="font-display text-xl text-main-text">Konfirmasi Pinjam</h3>
        <p id="borrow-confirm-description" className="mb-7 mt-2 text-sm text-main-text/60">
          Pastikan kamu mengembalikan buku tepat waktu sesuai aturan perpustakaan.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" disabled={isPending} onClick={onCancel} className="rounded-sm bg-surface px-4 py-2.5 text-sm font-medium text-main-text/70 transition hover:bg-surface-hover disabled:opacity-50">
            Batal
          </button>
          <button type="button" disabled={isPending} onClick={onConfirm} className="rounded-sm bg-secondary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-hover disabled:opacity-50">
            {isPending ? "Meminjam..." : "Ya, Pinjam"}
          </button>
        </div>
    </AccessibleDialog>
  );
}

export default ConfirmModal;
