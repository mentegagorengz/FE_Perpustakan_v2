# Task 4: Tracking transaksi + pengembalian (`/tracking`)

> Diambil dari plan utama: `docs/superpowers/plans/2026-07-22-integrasi-api-be-ke-fe.md`

**Files:**
- Modify: `FE_Perpustakan_v2/hooks/useTransactions.ts` (tambah list + return)
- Modify: `FE_Perpustakan_v2/app/(admin)/tracking/page.tsx`

**Interfaces:**
- Consumes: `ApiTransaction`, `Paginated<T>` (Task 1); `useAuth()` token; `useBorrowMutation` sudah ada (Task 3).
- Produces: `useTransactionsList(params)` → `useQuery` berisi `Paginated<ApiTransaction>`. `useReturnMutation()` → mutation PATCH `return/:barcode`.

> `GET /transactions` sudah join `user` + `bookItem` + `bookItem.book`. Jadi tiap `ApiTransaction` punya `user.full_name`, `user.email`, `bookItem.barcode`, `bookItem.book.title`. Return by **barcode** (`tx.bookItem.barcode`), bukan id. Endpoint list & return = JWT + STAFF/SUPER_ADMIN.

- [ ] **Step 1: Tambah list + return ke useTransactions**

Append ke `hooks/useTransactions.ts`:

```typescript
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ApiTransaction, Paginated } from "@/types/api";

export function useTransactionsList(params: { token: string | null; page: number; search?: string }) {
  const { token, page, search } = params;
  return useQuery({
    queryKey: ["transactions", { page, search }],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: String(page), limit: "10", ...(search ? { search } : {}),
      });
      const response = await fetch(`${API_BASE_URL}/transactions?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await handleApiResponse(response);
      return result.data as Paginated<ApiTransaction>;
    },
    enabled: !!token,
    placeholderData: keepPreviousData,
  });
}

export function useReturnMutation() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (barcode: string) => {
      const response = await fetch(`${API_BASE_URL}/transactions/return/${barcode}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await handleApiResponse(response);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
```

> Jaga agar hanya ADA SATU baris `import ... from "@tanstack/react-query"` — gabungkan `useQuery, keepPreviousData` dengan `useMutation, useQueryClient` yang sudah ada di baris import atas file (jangan duplikat import).

- [ ] **Step 2: Rewrite tracking page pakai API**

Modify `app/(admin)/tracking/page.tsx`. Ganti sumber data. Bagian atas komponen:

```typescript
"use client";

import React, { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTransactionsList, useReturnMutation } from "@/hooks/useTransactions";

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");
const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleDateString("id-ID") : "-");

export default function SecurityTrackingPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTransactionsList({ token, page });
  const returnMutation = useReturnMutation();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const txs = data?.data ?? [];
  const activeCount = txs.filter((t) => t.status === "BORROWED").length;
  const overdueCount = txs.filter((t) => t.status === "OVERDUE").length;
  const returnedCount = txs.filter((t) => t.status === "RETURNED").length;

  const handleReturn = async (barcode: string, title: string) => {
    try {
      await returnMutation.mutateAsync(barcode);
      showToast(`"${title}" berhasil dikembalikan!`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal mengembalikan.");
    }
  };
```

- [ ] **Step 3: Sesuaikan tabel ke field ApiTransaction**

Pada JSX tabel, ganti pemetaan baris `filtered.map((b) => ...)` menjadi iterasi `txs.map((t) => ...)` dengan field nyata:
- Peminjam: `t.user?.full_name` / `t.user?.email`
- Buku: `t.bookItem?.book?.title`
- Tgl pinjam: `fmtDate(t.borrowed_at)`
- Jatuh tempo: `fmtDate(t.due_date)`
- Denda: `t.fine_amount > 0 ? rupiah(t.fine_amount) : "-"`
- Status: map `BORROWED→Aktif`, `RETURNED→Dikembalikan`, `OVERDUE→Terlambat`
- Aksi Kembalikan: tampil bila `t.status !== "RETURNED"`, `onClick={() => handleReturn(t.bookItem!.barcode, t.bookItem?.book?.title ?? "")}`
- `key={t.id}`

Ganti stat cards ke `activeCount`/`overdueCount`/`returnedCount`/`txs.length`. Hapus blok "Kebijakan aktif" di bawah yang membaca `policy` dari `useApp` (atau ganti pakai `usePolicy` bila Task 6 sudah ada — untuk sekarang HAPUS agar tak ada dependensi `useApp`). Tambah kontrol paginasi sederhana pakai `data?.meta.totalPages` + `setPage`. Buang seluruh referensi `useApp`, `policy`, `enrichedBorrowings`, `filterStatus` lama.

- [ ] **Step 4: Verifikasi build + lint + smoke**

Run: `npm run build && npm run lint` → PASS.
Smoke: login STAFF/SUPER_ADMIN → `/tracking` → daftar transaksi dari API, kolom peminjam/buku/tanggal/denda benar; klik Kembalikan pada transaksi aktif → status jadi Dikembalikan, denda terhitung bila telat.

- [ ] **Step 5: Commit**

```bash
cd FE_Perpustakan_v2
git add hooks/useTransactions.ts "app/(admin)/tracking/page.tsx"
git commit -m "feat(fe): tracking transaksi & pengembalian by barcode pakai API nyata"
```
