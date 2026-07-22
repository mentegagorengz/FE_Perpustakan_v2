# Task 5: User & role management (`/roles`) — tanpa ban

> Diambil dari plan utama: `docs/superpowers/plans/2026-07-22-integrasi-api-be-ke-fe.md`

**Files:**
- Create: `FE_Perpustakan_v2/hooks/useUsers.ts`
- Modify: `FE_Perpustakan_v2/app/(admin)/roles/page.tsx`

**Interfaces:**
- Consumes: `ApiUser`, `SystemRole`, `Paginated<T>` (Task 1); `useAuth()` token.
- Produces: `useUsers(params)` → `Paginated<ApiUser>`. `useUpdateRoleMutation()` → PATCH `/users/:id/role`. `useDeleteUserMutation()` → DELETE `/users/:id`.

> **Scope:** fitur Ban/Unban DIBUANG (BE tak punya status/is_banned). Yang di-wire: ubah role (`PATCH /users/:id/role`, body `{ role }`) + hapus user (`DELETE /users/:id`). Keduanya SUPER_ADMIN-only di BE. Role BE = `SUPER_ADMIN`/`STAFF`/`USER` (bukan admin/user). List = JWT + STAFF/SUPER_ADMIN.

- [ ] **Step 1: Buat hook useUsers**

Create `hooks/useUsers.ts`:

```typescript
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { API_BASE_URL, handleApiResponse } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import type { ApiUser, Paginated, SystemRole } from "@/types/api";

export function useUsers(params: { token: string | null; page: number; search?: string }) {
  const { token, page, search } = params;
  return useQuery({
    queryKey: ["users", { page, search }],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: String(page), limit: "10", ...(search ? { search } : {}),
      });
      const response = await fetch(`${API_BASE_URL}/users?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await handleApiResponse(response);
      return result.data as Paginated<ApiUser>;
    },
    enabled: !!token,
    placeholderData: keepPreviousData,
  });
}

export function useUpdateRoleMutation() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: number; role: SystemRole }) => {
      const response = await fetch(`${API_BASE_URL}/users/${vars.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: vars.role }),
      });
      const result = await handleApiResponse(response);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUserMutation() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await handleApiResponse(response);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
```

- [ ] **Step 2: Rewrite roles page — header & data**

Modify `app/(admin)/roles/page.tsx`. Bagian atas:

```typescript
"use client";

import React, { useState } from "react";
import { CheckCircle2, Search, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUsers, useUpdateRoleMutation, useDeleteUserMutation } from "@/hooks/useUsers";
import type { SystemRole } from "@/types/api";

export default function RoleManagementPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | SystemRole>("all");
  const [toast, setToast] = useState<string | null>(null);
  const { data } = useUsers({ token, page, search: searchTerm || undefined });
  const updateRole = useUpdateRoleMutation();
  const deleteUser = useDeleteUserMutation();

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const users = data?.data ?? [];
  const filtered = filterRole === "all" ? users : users.filter((u) => u.role === filterRole);
  const staffCount = users.filter((u) => u.role === "STAFF" || u.role === "SUPER_ADMIN").length;

  const handleRole = async (id: number, role: SystemRole, name: string) => {
    try { await updateRole.mutateAsync({ id, role }); showToast(`${name} → ${role}`); }
    catch (e) { showToast(e instanceof Error ? e.message : "Gagal ubah role."); }
  };
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus user ${name}? Aksi permanen.`)) return;
    try { await deleteUser.mutateAsync(id); showToast(`${name} dihapus`); }
    catch (e) { showToast(e instanceof Error ? e.message : "Gagal hapus."); }
  };
```

- [ ] **Step 3: Sesuaikan tabel & filter ke ApiUser**

Pada JSX:
- Filter dropdown: opsi `all`, `SUPER_ADMIN`, `STAFF`, `USER`.
- Stat cards: Total = `users.length`, Staf/Admin = `staffCount`. HAPUS card "Banned".
- Baris `filtered.map((u) => ...)`, `key={u.id}`: Nama `u.full_name`, Email `u.email`, Role badge `u.role`, Bergabung `new Date(u.created_at).toLocaleDateString("id-ID")`. HAPUS kolom Status (banned/active).
- Aksi: tombol naik/turun role — bila `u.role === "USER"` → tombol "Jadikan STAFF" `onClick={() => handleRole(u.id, "STAFF", u.full_name)}`; bila `STAFF`/`SUPER_ADMIN` → "Turunkan ke USER" `onClick={() => handleRole(u.id, "USER", u.full_name)}`. Tambah tombol Hapus (`Trash2`) `onClick={() => handleDelete(u.id, u.full_name)}`. BUANG tombol Ban/Unban dan import ikon `Ban`, `UserCheck`, `ShieldOff` yang tak dipakai lagi (sisakan yang dipakai).
- Search input tetap; ganti pencarian ke server-side via param (sudah lewat `useUsers` search) ATAU filter klien atas `full_name`/`email` — pilih server-side (kirim `searchTerm`), buang filter klien `nama`.
- Tambah paginasi pakai `data?.meta.totalPages` + `setPage`.

Buang seluruh referensi `useApp`, `updateUserRole`, `banUser`, `unbanUser`, `u.nama`, `u.status`, `u.joinDate`.

- [ ] **Step 4: Verifikasi build + lint + smoke**

Run: `npm run build && npm run lint` → PASS.
Smoke: login SUPER_ADMIN → `/roles` → daftar user dari API; ubah role USER↔STAFF → badge berubah & persist setelah refresh; hapus user → hilang dari daftar. Login STAFF → list tampil tapi PATCH/DELETE ditolak 403 (BE role guard) → toast error muncul.

- [ ] **Step 5: Commit**

```bash
cd FE_Perpustakan_v2
git add hooks/useUsers.ts "app/(admin)/roles/page.tsx"
git commit -m "feat(fe): manajemen user & role pakai API nyata (ubah role + hapus, ban dibuang)"
```
