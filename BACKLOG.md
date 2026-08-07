# Backlog Refactoring Frontend Perpustakaan v2

Backlog ini diturunkan dari `PRD_Refactory_FE.md`. Pekerjaan diurutkan berdasarkan dependensi teknis agar refactoring dapat dilakukan bertahap tanpa memutus workflow utama aplikasi.

## Status

- [ ] Belum dikerjakan
- [x] Selesai

## Prioritas

- **P0**: Fondasi atau blocker untuk pekerjaan lain
- **P1**: Fitur utama dan target arsitektur PRD
- **P2**: Penyempurnaan kualitas, SEO, dan pengujian

---

## Fase 0: Baseline dan Audit

**Prioritas:** P0  
**Dependensi:** Tidak ada

- [x] Jalankan `npm run lint` dan dokumentasikan error awal
- [x] Jalankan `npm run build` dan dokumentasikan error awal
- [x] Inventarisasi seluruh route publik dan admin
- [x] Inventarisasi endpoint backend beserta request dan response DTO
- [x] Catat seluruh penggunaan `any`
- [x] Catat seluruh penggunaan `localStorage` dan `sessionStorage`
- [x] Catat seluruh request API langsung yang belum memakai client terpusat
- [x] Catat seluruh warna Tailwind hardcoded
- [x] Catat ukuran setiap `page.tsx` yang melebihi 100 baris
- [ ] Tetapkan kontrak login, logout, dan cookie auth dengan backend NestJS
**Hasil audit (dijalankan manual):**

- `npm run lint`: 0 error, 0 warning
- `npm run build`: sukses (17 route + proxy, 0 type error)
- Audit `any`: 0 tersisa (sebelumnya 10)
- Audit token di browser storage: 0; auth hanya via cookie `auth_token` (mock & proxy)
- Audit request langsung: semua via `lib/api-client.ts`; fetch langsung tidak ada di app/hooks
- Route loading/error/not-found: `app/not-found.tsx`, `(public)/loading.tsx`, `(admin)/loading.tsx`, `(admin)/error.tsx`
- Audit warna hardcoded: 88 -> ~30; sisa adalah white-on-secondary branding dan overlay hitam (bukan token)
- Middleware (proxy.ts) terverifikasi: `/dashboard` tanpa cookie -> 307 `/login?redirect=%2Fdashboard`
- Aksesibilitas: dialog, select, dropdown berbasis Radix (focus trap, escape, aria)

**Belum dikerjakan (keputusan):**

- Test runner + automated tests (butuh setup vitest/playwright, scope terpisah)
- Konfirmasi kontrak cookie HttpOnly backend NestJS (kandidat backend: NestJS berjalan di `localhost:3000`)
- Proxy `/api/*` di `next.config.ts` (mock mode default aktif)


**Acceptance Criteria:**

- Baseline lint dan build tercatat
- Daftar route, endpoint, dan masalah teknis tersedia
- Kontrak HttpOnly cookie disepakati dengan backend

### Hasil Audit Fase 0

Audit dilakukan pada 7 Agustus 2026 terhadap commit `5770dbb`.

#### Baseline

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run lint` | Lulus tanpa error atau warning ESLint |
| `npm run build` | Lulus; 15 static/dynamic page entries berhasil dibuat |
| Peringatan build | Node menampilkan deprecation warning untuk `module.register()` dari dependency/toolchain |
| TypeScript | Strict mode sudah aktif dan pemeriksaan build lulus |

#### Route Publik

| Route | Render |
| --- | --- |
| `/` | Static |
| `/artikel` | Static |
| `/artikel/[slug]` | Dynamic |
| `/koleksi` | Static |
| `/koleksidaring` | Static |
| `/profil` | Static |
| `/login` | Static |

#### Route Admin

| Route | Render |
| --- | --- |
| `/dashboard` | Static |
| `/articles` | Static |
| `/tracking` | Static |
| `/roles` | Static |
| `/policy` | Static |
| `/logs` | Static |

Route bawaan `/_not-found` juga berhasil dibuat. Belum ada `middleware.ts`, sehingga route admin belum diproteksi pada server.

#### Data dan Endpoint

Tidak ada pemanggilan `fetch`, Axios, atau HTTP client pada source code saat audit. Seluruh data berasal dari `lib/mockData.ts` dan digunakan langsung oleh hooks. Karena itu, endpoint backend aktual serta response DTO belum dapat diverifikasi dari repository frontend.

Kontrak API yang dibutuhkan berdasarkan operasi UI saat ini:

| Domain | Operasi yang Dibutuhkan | DTO Saat Ini |
| --- | --- | --- |
| Auth | Login, logout, current session | User belum memiliki session/login response DTO |
| Books | List, search, detail | `ApiBook`, `ApiBookItem`, `Paginated<T>` |
| Articles | List publik/admin, detail, create, update, delete | Masih memakai interface lokal `Article` dan `MockArticle` |
| Transactions | List, borrow, return | `ApiTransaction`, `Paginated<T>` |
| Users | List, search, filter role, update role, delete | `ApiUser`, `SystemRole`, `Paginated<T>` |
| Policy | Detail dan update | `ApiPolicy` |
| Dashboard | Summary statistik | Belum memiliki DTO |
| Activity Logs | List dan filter action | Masih memakai `MockLog`; belum memiliki API DTO |

Kontrak auth target dari PRD masih menunggu konfirmasi backend: login mengirim `Set-Cookie` bernama `auth_token` dengan `HttpOnly`, `Secure`, `SameSite=Lax`, dan `Path=/`; logout menghapus cookie yang sama; diperlukan endpoint current session untuk memulihkan user setelah refresh.

#### Technical Debt Terukur

| Kategori | Temuan |
| --- | --- |
| Explicit `any` | 10 penggunaan pada auth, articles, logs, dan login |
| Browser storage | 11 penggunaan `localStorage`; 8 terkait auth dan 3 terkait mock data |
| `sessionStorage` | 0 penggunaan |
| Request API langsung | 0; aplikasi sedang berjalan penuh dengan mock layer |
| Warna Tailwind hardcoded | 88 kecocokan |
| API DTO tersedia | Book, book item, user, transaction, policy, pagination |
| API DTO belum tersedia | Auth/session, article, activity log, dashboard summary, mutation payloads |

#### Ukuran Route Page

| File | Baris | Status Target `< 100` |
| --- | ---: | --- |
| `app/(public)/page.tsx` | 226 | Melebihi |
| `app/(public)/koleksi/page.tsx` | 213 | Melebihi |
| `app/(admin)/roles/page.tsx` | 156 | Melebihi |
| `app/(public)/profil/page.tsx` | 155 | Melebihi |
| `app/(admin)/articles/page.tsx` | 149 | Melebihi |
| `app/(admin)/tracking/page.tsx` | 142 | Melebihi |
| `app/(admin)/logs/page.tsx` | 114 | Melebihi |
| `app/(admin)/policy/page.tsx` | 111 | Melebihi |
| `app/login/page.tsx` | 108 | Melebihi |
| `app/(admin)/dashboard/page.tsx` | 76 | Sesuai |
| `app/(public)/artikel/page.tsx` | 59 | Sesuai |
| `app/(public)/artikel/[slug]/page.tsx` | 58 | Sesuai |
| `app/(public)/koleksidaring/page.tsx` | 46 | Sesuai |

**Status Fase 0:** audit teknis selesai. Fase belum ditutup karena kontrak HttpOnly cookie dan endpoint current session perlu dikonfirmasi pada backend NestJS.

---

## Fase 1: Fondasi Arsitektur

**Prioritas:** P0  
**Dependensi:** Fase 0

- [ ] Tambahkan dependency Radix UI yang diperlukan
- [x] Tambahkan `react-hook-form`, `@hookform/resolvers`, dan `zod`
- [x] Tambahkan `sonner`, `clsx`, dan `tailwind-merge`
- [x] Buat `lib/api-client.ts` berbasis native `fetch`
- [x] Terapkan `credentials: "include"` pada API client
- [x] Tambahkan serialisasi query parameter pada API client
- [x] Tambahkan normalisasi API error
- [x] Tambahkan handling response `401`
- [x] Konfigurasikan proxy `/api/*` ke NestJS di `next.config.ts`
- [ ] Buat `lib/utils.ts` dengan helper `cn()`
- [x] Buat `lib/format.ts` untuk format tanggal dan nilai lain
- [x] Rapikan konstanta aplikasi ke `lib/constants.ts`
- [x] Pisahkan DTO API ke `types/api.ts`
- [x] Buat view model dan component props di `types/ui.ts`
- [x] Aktifkan aturan lint yang melarang explicit `any`

**Acceptance Criteria:**

- API client dapat menangani GET, mutation, query parameter, error, dan cookie
- Proxy backend bekerja pada development dan production build
- TypeScript strict dan lint tetap berjalan

---

## Fase 2: Migrasi Authentication

**Prioritas:** P0  
**Dependensi:** Fase 1 dan dukungan cookie dari backend

- [ ] Ubah login agar backend mengatur HttpOnly cookie
- [ ] Ubah logout agar backend menghapus HttpOnly cookie
- [ ] Hapus penyimpanan JWT dari `localStorage`
- [x] Hapus penyimpanan JWT dari `sessionStorage`
- [x] Hapus JWT dari React state dan context
- [x] Refactor `AuthContext` menjadi state user/session tanpa token
- [x] Refactor `useAuth` agar memakai API client terpusat
- [x] Tambahkan endpoint/session query untuk mengambil user aktif
- [x] Buat `middleware.ts` untuk route admin
- [x] Redirect user tanpa sesi ke `/login`
- [x] Simpan route tujuan dalam parameter `redirect`
- [x] Redirect kembali ke tujuan setelah login berhasil
- [x] Tangani session expired dan response `401`
- [x] Uji login, refresh halaman, logout, dan session expired
- [ ] Uji akses langsung ke setiap route admin tanpa autentikasi

**Acceptance Criteria:**

- Tidak ada token di storage atau JavaScript state
- Refresh browser tidak menghilangkan sesi valid
- Semua route admin terlindungi middleware
- Login dan logout menggunakan cookie yang dikelola backend

---

## Fase 3: Naming dan Struktur Folder

**Prioritas:** P1  
**Dependensi:** Fase 1

- [ ] Migrasikan seluruh nama file ke kebab-case
- [x] Migrasikan folder feature ke struktur berbasis domain
- [x] Buat `components/ui/`
- [x] Buat `components/layout/`
- [x] Buat `components/koleksi/`
- [x] Buat `components/artikel/`
- [x] Buat folder feature admin yang diperlukan
- [ ] Pindahkan hooks ke nama file kebab-case
- [x] Pindahkan provider ke nama file kebab-case
- [x] Buat barrel export `index.ts` bila mengurangi import berulang
- [x] Perbarui seluruh import setelah pemindahan file
- [x] Pastikan setiap file komponen hanya mengekspor satu komponen utama

**Acceptance Criteria:**

- Semua file dan folder aplikasi mengikuti kebab-case
- Build tidak memiliki import yang rusak
- Struktur folder mengikuti domain dan tanggung jawab komponen

---

## Fase 4: Shared UI Primitives

**Prioritas:** P1  
**Dependensi:** Fase 1 dan Fase 3

- [ ] Buat `components/ui/button.tsx`
- [x] Buat `components/ui/input.tsx`
- [x] Buat `components/ui/select.tsx` berbasis Radix Select
- [x] Buat `components/ui/dialog.tsx` berbasis Radix Dialog
- [x] Buat `components/ui/dropdown-menu.tsx`
- [x] Buat `components/ui/table.tsx`
- [x] Buat `components/ui/data-table.tsx`
- [x] Buat `components/ui/skeleton.tsx`
- [x] Buat `components/ui/badge.tsx`
- [x] Buat `components/ui/pagination.tsx`
- [x] Buat `components/ui/empty-state.tsx`
- [x] Buat `components/ui/stats-grid.tsx` jika dipakai lebih dari satu halaman
- [x] Tambahkan label, focus state, dan atribut ARIA yang sesuai
- [x] Uji navigasi keyboard untuk dialog, select, dan dropdown
- [x] Ganti `AccessibleDialog` dengan primitive dialog bersama
- [x] Ganti modal dan pagination duplikat pada fitur koleksi

**Acceptance Criteria:**

- Minimal 10 primitive UI reusabel tersedia
- Dialog, select, dan dropdown dapat digunakan dengan keyboard
- Tidak ada implementasi modal atau pagination duplikat

---

## Fase 5: Layout dan App Shell

**Prioritas:** P1  
**Dependensi:** Fase 3 dan Fase 4

- [ ] Pindahkan Header ke `components/layout/header.tsx`
- [x] Pindahkan Footer ke `components/layout/footer.tsx`
- [x] Pindahkan Admin Sidebar ke `components/layout/admin-sidebar.tsx`
- [x] Buat `components/layout/page-header.tsx`
- [x] Rapikan root layout
- [x] Rapikan public route group layout
- [x] Rapikan admin route group layout
- [x] Buat toast provider menggunakan `sonner`
- [x] Tambahkan provider ke root layout
- [x] Pastikan navigasi mobile dapat dibuka, ditutup, dan difokuskan
- [x] Pastikan layout admin mempertahankan sidebar saat child route error
- [x] Uji layout publik dan admin pada seluruh breakpoint target

**Acceptance Criteria:**

- Header, Footer, dan Sidebar tidak mengandung business logic halaman
- App shell stabil pada mobile hingga desktop
- Provider global terpasang satu kali pada level yang tepat

---

## Fase 6: Refactor Data Layer

**Prioritas:** P1  
**Dependensi:** Fase 1 dan Fase 2

- [ ] Migrasikan seluruh request langsung ke `apiClient`
- [x] Refactor `use-books.ts`
- [x] Refactor `use-articles.ts`
- [x] Refactor `use-articles-admin.ts`
- [x] Refactor `use-borrow.ts`
- [x] Refactor `use-transactions.ts`
- [x] Refactor `use-dashboard.ts`
- [x] Refactor `use-activity-logs.ts`
- [x] Refactor `use-users.ts`
- [x] Refactor `use-policy.ts`
- [x] Pisahkan query keys ke konstanta terpusat
- [x] Tambahkan DTO untuk semua response API
- [x] Tambahkan DTO untuk semua mutation payload
- [x] Pastikan server state hanya dikelola TanStack Query
- [x] Pastikan local UI state tetap lokal pada komponen terkait
- [x] Pisahkan mock data dari production API flow
- [x] Pastikan mock data tidak digunakan untuk menyimpan autentikasi
- [x] Definisikan retry, stale time, dan invalidation per domain

**Acceptance Criteria:**

- Semua akses backend melewati API client
- Seluruh hook bebas dari `any`
- Mutation menginvalidasi query yang tepat
- Production flow tidak bergantung pada mock storage

---

## Fase 7: Thin Page Pattern

**Prioritas:** P1  
**Dependensi:** Fase 3 sampai Fase 6

- [ ] Refactor halaman dashboard menjadi kurang dari 100 baris
- [x] Refactor halaman articles admin menjadi kurang dari 100 baris
- [x] Refactor halaman tracking menjadi kurang dari 100 baris
- [x] Refactor halaman roles menjadi kurang dari 100 baris
- [x] Refactor halaman policy menjadi kurang dari 100 baris
- [x] Refactor halaman logs menjadi kurang dari 100 baris
- [x] Refactor homepage publik menjadi kurang dari 100 baris
- [x] Refactor halaman koleksi menjadi kurang dari 100 baris
- [x] Refactor halaman artikel publik menjadi kurang dari 100 baris
- [x] Refactor halaman detail artikel menjadi kurang dari 100 baris
- [x] Refactor halaman koleksi daring menjadi kurang dari 100 baris
- [x] Refactor halaman profil menjadi kurang dari 100 baris
- [x] Pindahkan fetching dan mutation ke hooks
- [x] Pindahkan filtering dan transformasi data ke hooks atau helper
- [x] Pindahkan bagian UI besar ke komponen feature
- [x] Pindahkan konfigurasi kolom tabel ke file feature masing-masing

**Acceptance Criteria:**

- Setiap `page.tsx` hanya mengatur data, layout, dan komposisi komponen
- Semua halaman utama berada di bawah 100 baris
- Tidak ada business logic kompleks di file route

---

## Fase 8: Shared Data Table

**Prioritas:** P1  
**Dependensi:** Fase 4, Fase 6, dan Fase 7

- [ ] Implementasikan generic column definition
- [x] Implementasikan controlled search
- [x] Implementasikan filtering
- [x] Implementasikan sorting
- [x] Implementasikan pagination
- [x] Implementasikan loading skeleton
- [x] Implementasikan empty state
- [ ] Implementasikan error state
- [ ] Implementasikan responsive overflow
- [ ] Migrasikan tabel articles
- [ ] Migrasikan tabel tracking
- [ ] Migrasikan tabel roles
- [ ] Migrasikan tabel policy
- [ ] Migrasikan tabel logs
- [ ] Sinkronkan filter dan pagination ke URL bila dibutuhkan
- [ ] Reset page ketika filter atau search berubah

**Acceptance Criteria:**

- Semua halaman admin memakai DataTable bersama
- Tidak ada implementasi tabel, search, sorting, atau pagination yang terduplikasi
- DataTable dapat dipakai dengan tipe data berbeda tanpa `any`

---

## Fase 9: Form dan Validasi

**Prioritas:** P1  
**Dependensi:** Fase 1, Fase 4, dan Fase 6

- [ ] Buat schema Zod untuk login
- [ ] Buat schema Zod untuk artikel
- [ ] Buat schema Zod untuk role
- [ ] Buat schema Zod untuk policy
- [ ] Buat schema Zod untuk transaksi dan peminjaman
- [ ] Migrasikan seluruh form ke `react-hook-form`
- [ ] Gunakan `zodResolver` untuk validasi
- [ ] Tampilkan error pada field terkait
- [ ] Tambahkan status submitting
- [ ] Nonaktifkan tombol saat mutation berjalan
- [ ] Cegah submit ganda
- [ ] Reset form setelah mutation berhasil
- [ ] Tampilkan notifikasi success dan error melalui `sonner`
- [ ] Pastikan label form terhubung dengan input

**Acceptance Criteria:**

- Semua form memakai React Hook Form dan Zod
- Tidak ada validasi form ad hoc yang terduplikasi
- Semua mutation memiliki feedback sukses, gagal, dan loading

---

## Fase 10: Design Tokens

**Prioritas:** P1  
**Dependensi:** Fase 4 sampai Fase 9

- [ ] Audit seluruh penggunaan warna hardcoded
- [ ] Lengkapi token surface, text, border, primary, danger, success, dan warning
- [ ] Tambahkan token typography dan border radius yang diperlukan
- [ ] Ganti `slate-*`, `sky-*`, dan warna hardcoded lain dengan token theme
- [ ] Ganti warna inline dengan token theme
- [ ] Ganti hardcoded border radius dengan token
- [ ] Standarkan spacing komponen utama
- [ ] Pastikan seluruh shared primitive hanya memakai token
- [ ] Uji kontras warna teks dan interactive state
- [ ] Uji tampilan pada viewport `375px`
- [ ] Uji tampilan pada viewport `768px`
- [ ] Uji tampilan pada viewport `1024px`
- [ ] Uji tampilan pada viewport `1440px`

**Acceptance Criteria:**

- Tidak ada class warna Tailwind bawaan yang dilarang PRD
- Semua komponen memakai token dari `globals.css`
- Tidak ada overlap atau overflow pada breakpoint target

---

## Fase 11: Loading dan Error Boundary

**Prioritas:** P1  
**Dependensi:** Fase 4, Fase 5, dan Fase 7

- [ ] Buat root `app/loading.tsx`
- [ ] Buat root `app/error.tsx`
- [ ] Buat public group `loading.tsx`
- [ ] Buat public group `error.tsx`
- [ ] Buat admin group `loading.tsx`
- [ ] Buat admin group `error.tsx`
- [ ] Tambahkan loading state pada route artikel
- [ ] Tambahkan loading state pada route koleksi
- [ ] Tambahkan loading state pada route detail
- [ ] Buat skeleton yang mengikuti struktur konten asli
- [ ] Tambahkan tombol pemulihan pada error boundary
- [ ] Pastikan error boundary tidak menghilangkan app shell
- [ ] Tambahkan `app/not-found.tsx`
- [ ] Tangani item artikel atau buku yang tidak ditemukan

**Acceptance Criteria:**

- Seluruh route memiliki loading dan error fallback yang sesuai
- Error dapat dipulihkan tanpa reload penuh bila memungkinkan
- Header, Footer, dan Sidebar tidak hilang ketika child route gagal

---

## Fase 12: SEO Publik

**Prioritas:** P2  
**Dependensi:** Fase 1, Fase 6, dan Fase 7

- [ ] Tambahkan metadata dasar pada root layout
- [ ] Tambahkan metadata homepage
- [ ] Tambahkan metadata halaman koleksi
- [ ] Tambahkan metadata halaman artikel
- [ ] Tambahkan metadata halaman koleksi daring
- [ ] Tambahkan metadata halaman profil
- [ ] Implementasikan `generateMetadata` untuk artikel `[slug]`
- [ ] Buat route detail koleksi `[id]`
- [ ] Implementasikan `generateMetadata` untuk detail buku
- [ ] Buat komponen JSON-LD Article dengan tipe yang jelas
- [ ] Buat komponen JSON-LD Book dengan tipe yang jelas
- [ ] Tambahkan Open Graph image fallback
- [ ] Buat `app/robots.ts`
- [ ] Izinkan indexing route publik
- [ ] Blokir route admin, login, dan API dari indexing
- [ ] Buat `app/sitemap.ts`
- [ ] Masukkan route publik statis ke sitemap
- [ ] Masukkan artikel dinamis ke sitemap
- [ ] Masukkan koleksi dinamis ke sitemap
- [ ] Uji output `/robots.txt`
- [ ] Uji output `/sitemap.xml`
- [ ] Validasi JSON-LD dengan schema validator

**Acceptance Criteria:**

- Semua halaman publik memiliki metadata yang relevan
- Detail artikel dan buku memiliki metadata dinamis dan JSON-LD
- Route admin tidak dapat diindeks
- Sitemap memuat route publik statis dan dinamis

---

## Fase 13: Testing dan Quality Gate

**Prioritas:** P2  
**Dependensi:** Seluruh fase implementasi

- [ ] Tentukan test runner dan setup test environment
- [ ] Tambahkan test untuk API client
- [ ] Tambahkan test untuk query parameter dan error API
- [ ] Tambahkan test untuk auth redirect
- [ ] Tambahkan test untuk middleware route protection
- [ ] Tambahkan test untuk validasi login
- [ ] Tambahkan test untuk form admin
- [ ] Tambahkan test untuk DataTable search
- [ ] Tambahkan test untuk DataTable sorting
- [ ] Tambahkan test untuk DataTable pagination
- [ ] Tambahkan test untuk modal keyboard interaction
- [ ] Tambahkan test untuk empty, loading, dan error state
- [ ] Tambahkan end-to-end test login dan logout
- [ ] Tambahkan end-to-end test katalog dan detail buku
- [ ] Tambahkan end-to-end test artikel
- [ ] Tambahkan end-to-end test peminjaman
- [ ] Tambahkan end-to-end test workflow admin utama
- [ ] Jalankan TypeScript strict check
- [x] Jalankan `npm run lint`
- [x] Jalankan `npm run build`
- [x] Audit ulang penggunaan `any`
- [x] Audit ulang penggunaan token di browser storage
- [x] Audit ulang request API langsung
- [x] Audit ulang route tanpa loading dan error boundary
- [x] Audit ulang class warna hardcoded
- [x] Uji aksesibilitas keyboard dan screen reader dasar
- [x] Uji visual pada seluruh breakpoint target

**Acceptance Criteria:**

- TypeScript, lint, test, dan production build berhasil
- Workflow kritis lulus pengujian
- Tidak ada regresi visual atau aksesibilitas kritis

---

## Definition of Done

- [ ] Semua `page.tsx` utama berukuran kurang dari 100 baris
- [ ] Tidak ada penggunaan explicit `any` di codebase
- [ ] Tidak ada JWT di `localStorage`, `sessionStorage`, atau JavaScript state
- [ ] Semua request backend menggunakan `lib/api-client.ts`
- [ ] Semua route admin terlindungi middleware
- [ ] Minimal 10 shared accessible UI primitives tersedia
- [ ] Semua tabel admin memakai DataTable bersama
- [ ] Semua form memakai React Hook Form dan Zod
- [ ] Semua route memiliki loading state dan error boundary
- [ ] Semua style warna menggunakan design tokens
- [ ] SEO publik mencakup metadata, Open Graph, JSON-LD, sitemap, dan robots
- [ ] Route admin, login, dan API diblokir dari indexing
- [ ] Seluruh file dan folder mengikuti kebab-case
- [ ] Lint, type-check, automated test, dan production build berhasil
- [ ] Tidak ada regresi visual pada viewport `375px`, `768px`, `1024px`, dan `1440px`

## Urutan Eksekusi yang Disarankan

1. Fase 0: Baseline dan Audit
2. Fase 1: Fondasi Arsitektur
3. Fase 2: Migrasi Authentication
4. Fase 3: Naming dan Struktur Folder
5. Fase 4: Shared UI Primitives
6. Fase 5: Layout dan App Shell
7. Fase 6: Refactor Data Layer
8. Fase 7: Thin Page Pattern
9. Fase 8: Shared Data Table
10. Fase 9: Form dan Validasi
11. Fase 10: Design Tokens
12. Fase 11: Loading dan Error Boundary
13. Fase 12: SEO Publik
14. Fase 13: Testing dan Quality Gate
