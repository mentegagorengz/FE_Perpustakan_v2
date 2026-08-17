
import { AuthProvider } from "@/features/auth";
import QueryProvider from "@/lib/query-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://perpustakaan.example.com"),
  title: {
    default: "Perpustakaan",
    template: "%s | Perpustakaan",
  },
  description:
    "Layanan Perpustakaan Universitas Sam Ratulangi: katalog koleksi, peminjaman, warta, dan informasi layanan.",
  keywords: ["perpustakaan", "katalog", "OPAC", "e-journal", "e-book", "Unsrat"],
  openGraph: {
    title: "Perpustakaan",
    description: "Pusat informasi ilmiah dan koleksi literatur Universitas Sam Ratulangi.",
    type: "website",
    locale: "id_ID",
    siteName: "Perpustakaan",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased bg-cream text-main-text min-h-screen">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
