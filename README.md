# Perpustakaan v2

Aplikasi manajemen perpustakaan berbasis web — frontend dummy untuk sistem informasi Perpustakaan Universitas Cakrawala Nusantara.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Motion](https://motion.dev/) (Framer Motion)
- [TanStack React Query](https://tanstack.com/query/latest)

## Fitur

- Halaman publik: beranda, warta artikel, profil perpustakaan
- Login & autentikasi JWT
- Koleksi buku & peminjaman
- Dashboard admin dengan statistik real-time
- Manajemen artikel (CRUD + publish/draft)
- Tracking peminjaman & pengembalian
- Manajemen role pengguna (SUPER_ADMIN, STAFF, USER)
- Pengaturan kebijakan & denda
- Audit log aktivitas sistem
- Berita nasional (integrasi GNews API)

## Struktur Folder

```
app/
├── (admin)/           # Halaman admin (protected)
├── (public)/          # Halaman publik (beranda, artikel, koleksi, profil)
├── login/             # Halaman login
components/            # Komponen reusable
constants/             # Data statis & helper API
context/               # React context (AuthContext)
hooks/                 # Custom hooks (useAuth, useBorrow, useTransactions, dll.)
providers/             # QueryProvider
types/                 # TypeScript interfaces
public/images/         # Asset gambar
```

## Getting Started

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Environment

Buat `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```
