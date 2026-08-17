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
src/
├── app/                    # Thin routing layer (Next.js App Router)
│   ├── (admin)/            # Halaman admin (protected)
│   ├── (public)/           # Halaman publik (beranda, artikel, koleksi, profil)
│   ├── login/              # Login publik
│   └── admin/login/        # Login panel manajemen
├── features/               # Domain modules (Bulletproof Pattern)
│   ├── books/              # Katalog buku & peminjaman (api/, components/, hooks/, types/)
│   ├── auth/               # Auth & session (api/, context/, hooks/, schemas/, types/)
│   ├── tracking/           # Tracking peminjaman admin (components/, hooks/)
│   ├── articles/           # Warta & artikel (api/, components/, hooks/, schemas/, types/)
│   ├── dashboard/          # Command center admin (api/, hooks/)
│   ├── users/              # Manajemen role (api/, hooks/)
│   ├── policies/           # Kebijakan & denda (api/, hooks/, schemas/)
│   ├── logs/               # Audit log (api/, hooks/)
│   ├── home/               # Landing statis (components/)
│   └── profil/             # Profil statis (components/)
│   └── <domain>/index.ts   # Public barrel export per domain
├── components/             # Shared UI non-domain
│   ├── ui/                 # Button, Dialog, DataTable, Input, dsb. (primitif)
│   └── layout/             # Header, Footer, AdminSidebar, PageHeader
├── lib/                    # Core instances & config
│   ├── api-client.ts       # Fetch wrapper + refresh interceptor
│   ├── query-client.ts     # TanStack QueryClient config
│   ├── types.ts            # Shared type (Paginated, ApiError)
│   └── utils.ts            # Helper umum
└── testing/                # Setup & fixtures test
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
