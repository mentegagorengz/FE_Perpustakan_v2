# Perpustakaan v2

Aplikasi manajemen perpustakaan berbasis web yang dibangun menggunakan **Next.js**, **Tailwind CSS**, dan **Motion (Framer Motion)**.

> ⚠️ **Status: Work In Progress** — Proyek ini masih dalam tahap pengembangan aktif.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Motion (Framer Motion)](https://motion.dev/)

## Fitur (Rencana)

- 🏠 Halaman publik (beranda, artikel, profil perpustakaan)
- 🔐 Login & autentikasi
- 📚 Manajemen koleksi buku
- 📰 Manajemen berita / artikel
- 📋 Sistem peminjaman buku
- 🛠️ Dashboard admin

## Struktur Folder

```
app/
├── (admin)/          # Halaman admin (protected)
├── (public)/         # Halaman publik (beranda, artikel, profil, dsb.)
├── Login/            # Halaman login
components/           # Komponen reusable (Header, Footer, Peminjaman, dsb.)
config/               # Konfigurasi aplikasi
constants/            # Data statis (articles, books, collections, home)
context/              # React context (AuthContext)
hooks/                # Custom hooks (useAuth, useBorrow, useCollections, dll.)
public/images/        # Asset gambar
```

## Getting Started

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## License

Belum ditentukan.