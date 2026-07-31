
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";



export const metadata = {
  title: "Perpustakaan Cakrawala",
  description: "Aplikasi Perpustakaan Universitas Cakrawala Nusantara",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased bg-cream text-main-text min-h-screen">
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
