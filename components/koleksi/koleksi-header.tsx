import { Info } from "lucide-react";

export default function KoleksiHeader({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl space-y-2.5 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-main-text sm:text-4xl md:text-5xl">
        Katalog Koleksi Digital
      </h1>
      <p className="text-sm leading-relaxed text-main-text-muted sm:text-base">
        Jelajahi literatur, buku teks, dan publikasi ilmiah Universitas Sam Ratulangi.
      </p>

      {!isAuthenticated && (
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-border bg-warning-surface px-3 py-1 text-xs font-semibold text-warning-text">
            <Info size={14} />
            Login untuk meminjam buku secara langsung
          </span>
        </div>
      )}
    </div>
  );
}
