# Issue: Proteksi Route Client-Side & Error Handling Terpusat

## Konteks

Saat ini aplikasi melakukan request ke server meskipun user seharusnya tidak punya akses ke sebuah route. Contoh:

- User belum login membuka `/workspace/123` — sudah dicegah mount, tapi redirect terjadi lewat `useEffect` sehingga tombol back kembali ke halaman terproteksi.
- User login tapi bukan member workspace `123` membuka `/workspace/123` — `WorkspaceDetailPage` tetap mount, `getWorkspaceMembers` + `loadTasks` tetap dipanggil, server balas 403/404.
- Route asing (mis. `/qwerty`) jatuh ke landing page, bukan ke halaman Not Found.

Tujuan issue ini: hentikan request "nekat" ke server, beri UX yang jelas kalau user salah route, dan pusatkan penanganan error HTTP.

## Scope

Tiga pekerjaan, boleh dikerjakan berurutan atau paralel:

1. Tambah `NotFoundPage` + fallback routing.
2. Simpan daftar workspace user di context supaya bisa pre-check akses sebelum mount `WorkspaceDetailPage`.
3. Pusatkan handling `401` / `403` / `404` di `src/services/api.js` sebagai jaring pengaman.

Aturan umum:

- Jangan ubah gaya kode yang sudah ada (4 spasi indent, tanpa semicolon sesuai file existing).
- Jangan menambah library baru. Pakai yang sudah ada (`react`, `lucide-react`, dll).
- Jangan menulis test baru. Repo ini belum punya test runner.
- Jangan refactor di luar scope. Kalau ketemu bug lain, catat di PR description, jangan fix.

---

## Task 1 — NotFoundPage + Fallback Routing

### File yang disentuh

- `src/pages/NotFoundPage.jsx` (baru)
- `src/App.jsx`

### Langkah

1. Buat `src/pages/NotFoundPage.jsx`. Komponen functional, menerima prop `onNavigate`. Tampilkan:
   - Judul `404`.
   - Subjudul `Halaman tidak ditemukan`.
   - Tombol `Kembali ke beranda` yang memanggil `onNavigate('landing')`.
   - Gunakan class tailwind yang konsisten dengan `LandingPage.jsx` / `LoginPage.jsx` (lihat padding, warna zinc, dark mode). Tidak perlu animasi.
2. Di `src/App.jsx`:
   - Tambah `'notFound': '/not-found'` di object `pagePaths`.
   - Di `getPageFromPath`, ganti baris terakhir `return { page: 'landing' }` menjadi `return { page: 'notFound' }`. Path `/` tetap dipetakan eksplisit ke `landing`.
   - Import `NotFoundPage` dan tambahkan `case 'notFound': return <NotFoundPage onNavigate={handleNavigate} />` di switch `page` useMemo.
   - Pastikan `AppShell` tetap membungkus `NotFoundPage` supaya header/nav konsisten.

### Definition of Done

- Membuka `/qwerty` menampilkan halaman 404, bukan landing.
- Tombol `Kembali ke beranda` mengganti URL ke `/` dan merender landing.
- Tidak ada warning di console.

---

## Task 2 — Workspace List di Context untuk Pre-Check Akses

### Tujuan

Sebelum `WorkspaceDetailPage` mount, kita sudah tahu daftar workspace milik user. Kalau `id` di URL tidak ada di daftar, redirect ke `notFound`. Dengan ini `getWorkspaceMembers` + `loadTasks` tidak pernah dipanggil untuk workspace yang bukan milik user.

### File yang disentuh

- `src/context/workspaceContextValue.js` (baru)
- `src/context/WorkspaceProvider.jsx` (baru)
- `src/context/useWorkspaces.js` (baru)
- `src/App.jsx`
- `src/pages/DashboardPage.jsx` (ganti fetch lokal → pakai context)
- `src/pages/WorkspaceDetailPage.jsx` (tambah guard)

### Langkah

1. Buat context skeleton mengikuti pola `AuthContext`:
   - `workspaceContextValue.js`: `export const WorkspaceContext = createContext(null)`.
   - `useWorkspaces.js`: hook yang throw kalau dipakai di luar provider (lihat `useAuth.js` sebagai referensi).
2. `WorkspaceProvider.jsx`:
   - State: `workspaces` (array), `isLoading` (bool), `error` (string), `isLoaded` (bool, default `false`).
   - Dependensi: `const { user, isAuthReady } = useAuth()`.
   - `useEffect`: saat `isAuthReady && user`, panggil `getWorkspaces()` dari `services/workspaceService.js`, isi `workspaces`, set `isLoaded = true`. Saat `!user`, reset state ke default.
   - Expose `reload()` untuk dipanggil setelah `createWorkspace`.
   - Expose helper `hasAccess(workspaceId)` → `workspaces.some((w) => String(w.id) === String(workspaceId))`.
   - Value di-`useMemo` dengan dependency yang benar.
3. Di `src/App.jsx`, bungkus tree: `AuthProvider > ThemeProvider > WorkspaceProvider > TodoProvider`. `WorkspaceProvider` harus di dalam `AuthProvider` karena butuh `user`.
4. Tambah guard di `App.jsx` sebelum render `WorkspaceDetailPage`:
   - Di `AppContent`, pakai `useWorkspaces()` untuk ambil `isLoaded` dan `hasAccess`.
   - Di case `'workspace'` pada switch `page`:
     - Kalau `!user` → tetap render `LoginPage` (sudah ada).
     - Kalau `user && !isLoaded` → render loader kecil (reuse pola `<Loader2 />` yang sudah ada).
     - Kalau `user && isLoaded && !hasAccess(pageParams?.id)` → render `NotFoundPage` dan panggil `handleAuthNavigate('notFound')` satu kali (pakai `useEffect` dengan dependency `[currentPage, pageParams?.id, isLoaded]`). Penting: URL harus di-replace pakai `history.replaceState`, bukan `pushState`, supaya back tidak balik ke route tidak valid. Tambah helper `handleAuthReplace(page)` kalau perlu.
     - Kalau lolos semua check → render `WorkspaceDetailPage` seperti sekarang.
5. `DashboardPage.jsx`: ganti fetch lokal workspace dengan `useWorkspaces()`. Tombol "create workspace" setelah sukses memanggil `reload()` dari context, bukan fetch ulang manual.
6. `WorkspaceDetailPage.jsx`: sebagai pertahanan terakhir, di awal komponen tambahkan `if (!workspaceId) return null`. Ini mencegah `useEffect` fetch kalau props belum siap.

### Definition of Done

- Membuka `/workspace/<id-tidak-valid>` tidak memicu request `GET /api/v1/workspaces/<id>/members` ataupun `GET /api/v1/workspaces/<id>/tasks`. Cek lewat Network tab.
- User langsung diarahkan ke halaman Not Found dan URL berubah ke `/not-found`.
- Dashboard tetap menampilkan daftar workspace seperti sebelumnya.
- Buat workspace baru → langsung muncul di dashboard tanpa reload halaman.

---

## Task 3 — Error Handling Terpusat di `api.js`

### Tujuan

Jaring pengaman kalau guard client lolos. Server balas 401 → force logout + redirect `/login`. Server balas 403/404 untuk resource yang diminta → redirect `/not-found`. Tidak mengubah perilaku `request` untuk error lain.

### File yang disentuh

- `src/services/api.js`
- `src/App.jsx` (pasang listener redirect)

### Langkah

1. Di `src/services/api.js`, tambahkan event bus sederhana (tanpa library):
   ```js
   const listeners = new Set()
   export const onAuthEvent = (listener) => {
     listeners.add(listener)
     return () => listeners.delete(listener)
   }
   const emitAuthEvent = (type) => {
     listeners.forEach((listener) => listener(type))
   }
   ```
2. Di blok `if (!response.ok)` dalam `request`:
   - Kalau `response.status === 401` dan retry sudah gagal → panggil `emitAuthEvent('unauthorized')` sebelum throw.
   - Kalau `response.status === 403` → `emitAuthEvent('forbidden')`.
   - Kalau `response.status === 404` dan path mengandung `/api/v1/workspaces/` (resource akses) → `emitAuthEvent('notFound')`.
   - Tetap throw `ApiError` seperti sekarang. Jangan menelan error.
3. Di `AppContent` (`src/App.jsx`):
   - `useEffect` sekali pakai, subscribe ke `onAuthEvent`:
     - `'unauthorized'` → panggil `logout()` dari `useAuth` (tambahkan ke destructuring) lalu `handleAuthNavigate('login')` via `history.replaceState`.
     - `'forbidden'` atau `'notFound'` → `handleAuthNavigate('notFound')` via `history.replaceState`.
   - Unsubscribe di cleanup.
4. Perhatian: interceptor ini jangan memicu loop. Refresh token (`/api/auth/refresh`) sudah pakai `retry: false`; jangan emit `'unauthorized'` untuk endpoint refresh. Cara paling simpel: skip emit kalau `path` diawali `/api/auth/`.

### Definition of Done

- Simulasi token expired: hapus `accessToken` di memory, buka halaman terproteksi → otomatis logout + pindah ke `/login` tanpa harus klik apa-apa.
- Simulasi 403 dari backend (mis. matikan akses di DB) → user dipindah ke `/not-found`.
- Tidak ada infinite redirect / request loop (cek Network tab).

---

## Catatan Implementasi (Semua Task)

- Gunakan `history.replaceState` untuk redirect otomatis (bukan `pushState`) supaya tombol Back tidak mengembalikan user ke route yang tidak valid.
- Semua redirect dilakukan di layer `App.jsx`. Page-level component hanya bertugas render + guard defensif, bukan navigasi.
- `useEffect` untuk redirect harus punya dependency yang tepat. Hindari `Promise.resolve().then(...)` kecuali benar-benar perlu — lebih baik langsung panggil fungsinya.
- Saat menambah state di context, bungkus value dengan `useMemo` dan list semua dependency eksplisit. Ikuti pola `AuthProvider.jsx`.
- Jangan ubah kontrak response `workspaceService.js`. Kalau butuh field baru, tambahkan di service, bukan inline di component.

## Urutan Review

1. Task 1 lebih dulu (kecil, tidak bergantung task lain).
2. Task 2 butuh Task 1 (butuh `notFound` route).
3. Task 3 butuh Task 1 & 2 (redirect target harus sudah ada).

Boleh buat 3 PR terpisah, atau 1 PR per task, terserah. Jangan gabung tiga-tiganya dalam satu commit besar.

## Out of Scope

- Ganti ke React Router. Kalau memang mau pindah, buat RFC terpisah.
- Role-based permission di dalam workspace (owner/admin/watcher). Itu issue lain.
- Server-side authorization. Asumsinya backend sudah benar; kita hanya memperbaiki pengalaman client.

