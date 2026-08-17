"use client";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
      <h2 className="font-display text-xl font-bold text-main-text">Terjadi kesalahan</h2>
      <p className="max-w-md text-sm text-main-text-muted">
        {error.message || "Gagal memuat halaman ini."}
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-sm bg-secondary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-hover"
      >
        Coba lagi
      </button>
    </div>
  );
}
