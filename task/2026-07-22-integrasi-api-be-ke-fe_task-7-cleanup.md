# Task 7: Cleanup AppContext + hapus mock orphan

> Diambil dari plan utama: `docs/superpowers/plans/2026-07-22-integrasi-api-be-ke-fe.md`

**Files:**
- Modify: `FE_Perpustakan_v2/context/AppContext.tsx`
- Modify: `FE_Perpustakan_v2/app/layout.tsx` (bila `AppProvider` sudah tak dipakai)
- Delete (bila tak ada konsumen): `FE_Perpustakan_v2/constants/books.ts`, `constants/articles.ts`
- Modify: `FE_Perpustakan_v2/constants/defaultData.ts`

**Interfaces:**
- Consumes: hasil Task 3–6 (semua halaman sudah lepas dari `useApp`).
- Produces: tak ada API baru — hanya penghapusan kode mati.

> Jalankan task ini SETELAH Task 3–6 selesai, agar tak ada halaman yang masih `useApp()`. Prinsip: hapus hanya yang benar-benar tak ada konsumen (buktikan dengan grep dulu).

- [ ] **Step 1: Buktikan tak ada konsumen tersisa**

Run (dari `FE_Perpustakan_v2/`):

```bash
grep -rn "useApp\|AppContext\|AppProvider" app components hooks
grep -rn "from \"@/constants/books\"\|from \"@/constants/articles\"" app components hooks
grep -rn "DEFAULT_BOOKS\|DEFAULT_BORROWINGS\|DEFAULT_USERS\|DEFAULT_POLICY\|DEFAULT_LOGS" .
```

Expected: baris `useApp` hanya muncul di `context/AppContext.tsx` sendiri (definisi), TIDAK di page/hook mana pun. Bila masih ada page yang pakai → task 3–6 belum tuntas, selesaikan dulu.

- [ ] **Step 2: Lepas AppProvider dari layout (bila kosong konsumen)**

Bila grep Step 1 mengonfirmasi tak ada `useApp` di luar definisi: buka `app/layout.tsx`, hapus `<AppProvider>` wrapper dan importnya. Pertahankan `AuthProvider` + `QueryProvider`.

- [ ] **Step 3: Hapus AppContext + mock orphan**

Bila benar-benar tak terpakai:

```bash
rm context/AppContext.tsx hooks/useLocalSotrage.ts
rm constants/books.ts constants/articles.ts
```

Edit `constants/defaultData.ts`: hapus `DEFAULT_BOOKS`, `DEFAULT_BORROWINGS`, `DEFAULT_USERS`, `DEFAULT_POLICY`, `DEFAULT_LOGS` (semua mock yang kini dari API). Sisakan HANYA yang masih dipakai (mis. `DEFAULT_ARTICLES` bila ada konsumen — cek dulu; artikel sudah dari API jadi kemungkinan bisa dihapus juga). Hapus `useLocalSotrage` hanya bila tak ada importer lain (grep dulu).

> `ponytail:` jangan hapus membabi buta — tiap file di-grep dulu. Kalau `defaultData.ts` jadi kosong total, hapus filenya sekalian.

- [ ] **Step 4: Verifikasi build + lint**

Run: `npm run build && npm run lint`
Expected: PASS, tanpa error "cannot find module" (artinya semua referensi mock benar-benar sudah putus).

- [ ] **Step 5: Commit**

```bash
cd FE_Perpustakan_v2
git add -A
git commit -m "refactor(fe): buang AppContext & data mock (semua halaman kini pakai API)"
```

- [ ] **Step 6: Update memori proyek**

Perbarui `current-task.md` (memori): catat integrasi FE→BE selesai per halaman, modul policy BE baru, ban & waiver massal di-drop (belum ada endpoint), FE dev port pindah ke 3001.
