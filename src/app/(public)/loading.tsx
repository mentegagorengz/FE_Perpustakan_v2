export default function Loading() {
  return (
    <div role="status" className="flex min-h-[60vh] items-center justify-center gap-3 bg-cream text-secondary">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-secondary border-t-transparent" aria-hidden="true" />
      <span className="text-sm">Memuat halaman...</span>
    </div>
  );
}
