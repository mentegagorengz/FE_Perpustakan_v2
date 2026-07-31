"use client";

import React from "react";
import { BookOpen } from "lucide-react";

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-lg bg-cream p-8 text-center shadow-[var(--shadow-overlay)]" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <BookOpen size={26} strokeWidth={1.75} />
        </div>
        <h3 className="font-display text-xl text-main-text">Konfirmasi Pinjam</h3>
        <p className="mb-7 mt-2 text-sm text-main-text/60">
          Pastikan kamu mengembalikan buku tepat waktu sesuai aturan perpustakaan.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onCancel} className="rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-main-text/70 transition hover:bg-surface-hover">
            Batal
          </button>
          <button onClick={onConfirm} className="rounded-md bg-secondary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-hover">
            Ya, Pinjam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
