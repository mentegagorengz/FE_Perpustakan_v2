# Task 6: Policy page wiring (`/policy`)

> Diambil dari plan utama: `docs/superpowers/plans/2026-07-22-integrasi-api-be-ke-fe.md`

**Files:**
- Create: `FE_Perpustakan_v2/hooks/usePolicy.ts`
- Modify: `FE_Perpustakan_v2/app/(admin)/policy/page.tsx`

**Interfaces:**
- Consumes: `ApiPolicy` (Task 1); endpoint `GET /policy` + `PATCH /policy` (Task 2); `useAuth()` token.
- Produces: `usePolicy(token)` → `ApiPolicy`. `useUpdatePolicyMutation()` → PATCH `/policy`.

> **Scope:** tombol "pemutihan massal (fine waiver)" DIBUANG — BE tak punya endpoint bulk-waiver. Statistik "total denda terkumpul / peminjaman terlambat" yang dulu dihitung dari `borrowings` mock juga DIBUANG (tak ada sumber langsung; bisa ditambah nanti dari agregasi transaksi). Yang di-wire: baca + update 3 field policy (`fine_per_day`, `loan_duration_days`, `max_books_per_user`). Update = SUPER_ADMIN-only.

- [ ] **Step 1: Buat hook usePolicy**

Create `hooks/usePolicy.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, handleApiResponse } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import type { ApiPolicy } from "@/types/api";

export function usePolicy(token: string | null) {
  return useQuery({
    queryKey: ["policy"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/policy`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await handleApiResponse(response);
      return result.data as ApiPolicy;
    },
    enabled: !!token,
  });
}

export function useUpdatePolicyMutation() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Partial<Pick<ApiPolicy, "fine_per_day" | "loan_duration_days" | "max_books_per_user">>) => {
      const response = await fetch(`${API_BASE_URL}/policy`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(dto),
      });
      const result = await handleApiResponse(response);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["policy"] }),
  });
}
```

- [ ] **Step 2: Rewrite policy page**

Modify `app/(admin)/policy/page.tsx`. Ganti sumber data & form. Bagian atas:

```typescript
"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePolicy, useUpdatePolicyMutation } from "@/hooks/usePolicy";

export default function PolicyPage() {
  const { token } = useAuth();
  const { data: policy } = usePolicy(token);
  const updatePolicy = useUpdatePolicyMutation();

  const [dailyFine, setDailyFine] = useState("");
  const [maxDays, setMaxDays] = useState("");
  const [maxBooks, setMaxBooks] = useState("");
  const [saved, setSaved] = useState(false);

  // Sinkronkan form dgn data server saat pertama tiba.
  useEffect(() => {
    if (policy) {
      setDailyFine(String(policy.fine_per_day));
      setMaxDays(String(policy.loan_duration_days));
      setMaxBooks(String(policy.max_books_per_user));
    }
  }, [policy]);

  const handleSave = async () => {
    await updatePolicy.mutateAsync({
      fine_per_day: parseInt(dailyFine) || 0,
      loan_duration_days: parseInt(maxDays) || 1,
      max_books_per_user: parseInt(maxBooks) || 1,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
```

- [ ] **Step 3: Sesuaikan JSX panel**

Pada JSX:
- Panel "Pengaturan finansial": 3 input tetap (denda/hari, maks hari, maks buku), value & onChange sudah ke state di atas. Tombol "Simpan kebijakan" `onClick={handleSave}`.
- HAPUS tombol "Eksekusi pemutihan massal (fine waiver)" + modal konfirmasi waiver + toast `waiverDone` + semua handler `handleWaiver`/`executeWaiver`.
- Panel "Kebijakan aktif": baca dari `policy?.fine_per_day` (`Rp {policy.fine_per_day.toLocaleString("id-ID")}`), `policy?.loan_duration_days`, `policy?.max_books_per_user`. Guard `policy &&` atau optional chaining karena awalnya `undefined`.
- HAPUS panel "Statistik denda" (total denda/terlambat) yang dulu dari `borrowings` mock.
- Buang seluruh referensi `useApp`, `updatePolicy` lama, `executeWaiver`, `borrowings`, `totalFines`, `overdueCount`.

- [ ] **Step 4: Verifikasi build + lint + smoke**

Run: `npm run build && npm run lint` → PASS.
Smoke: login SUPER_ADMIN → `/policy` → 3 field ter-isi dari API; ubah denda → Simpan → toast sukses, refresh tetap tersimpan; pinjam buku di `/koleksi` lalu cek `due_date` mengikuti `loan_duration_days` baru.

- [ ] **Step 5: Commit**

```bash
cd FE_Perpustakan_v2
git add hooks/usePolicy.ts "app/(admin)/policy/page.tsx"
git commit -m "feat(fe): halaman kebijakan pakai API policy nyata (waiver massal dibuang)"
```
