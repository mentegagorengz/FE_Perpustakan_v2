import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

export const metadata = {
  title: "Perpustakaan UNSRAT",
  description: "Aplikasi Perpustakaan Universitas Sam Ratulangi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased bg-cream text-main-text min-h-screen">
        <AuthProvider>
          <QueryProvider>
            <AppProvider>{children}</AppProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
