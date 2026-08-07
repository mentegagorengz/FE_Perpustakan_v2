"use client";

import { BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface BorrowConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function BorrowConfirmModal({ onConfirm, onCancel, isPending = false }: BorrowConfirmModalProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="w-full max-w-sm bg-cream p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <BookOpen aria-hidden="true" size={26} strokeWidth={1.75} />
        </div>
        <DialogTitle className="text-xl">Konfirmasi Pinjam</DialogTitle>
        <DialogDescription className="mb-7 mt-2">
          Pastikan kamu mengembalikan buku tepat waktu sesuai aturan perpustakaan.
        </DialogDescription>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={onCancel}
            className="rounded-sm bg-surface px-4 py-2.5 text-sm font-medium text-main-text-muted transition hover:bg-surface-hover disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="rounded-sm bg-secondary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-hover disabled:opacity-50"
          >
            {isPending ? "Meminjam..." : "Ya, Pinjam"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
