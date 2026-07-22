import { Newsreader, Instrument_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

// Serif editorial untuk heading (jurnalistik/book-like, khas perpustakaan).
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

// Sans humanis untuk body — bukan Inter.
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata = {
  title: "Perpustakaan UNSRAT",
  description: "Aplikasi Perpustakaan Universitas Sam Ratulangi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${newsreader.variable} ${instrument.variable}`}>
      <body className="antialiased bg-cream text-main-text min-h-screen">
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
