"use client";

import React from "react";

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[60]">
      <div className="bg-cream p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📖</div>
        <h3 className="text-xl font-bold text-main-text mb-2">Konfirmasi Pinjam</h3>
        <p className="text-main-text/60 text-sm mb-8">Pastikan kamu mengembalikan buku tepat waktu sesuai aturan perpustakaan UNSRAT ya.</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-main-text/60 bg-surface hover:bg-surface-hover rounded-xl transition">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-bold text-white bg-secondary hover:bg-secondary-hover rounded-xl shadow-lg transition">
            Ya, Pinjam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
