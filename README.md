# FocusList

Aplikasi task management berbasis workspace yang dibangun dengan React. Pengguna dapat membuat workspace, mengelola task di dalamnya, mengundang anggota, dan memantau progres harian.

---

## Tujuan

FocusList dirancang sebagai frontend foundation yang:

- Menyediakan antarmuka task management yang bersih dan responsif.
- Terhubung ke REST API backend untuk autentikasi, workspace, dan task.
- Memisahkan concern dengan jelas: routing, auth state, workspace state, dan task state masing-masing punya layer sendiri.
- Siap dikembangkan lebih lanjut (role-based permission, notifikasi, kolaborasi real-time).

---

## Tech Stack

| Kategori | Library / Tool |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Animasi | Framer Motion 12 |
| Icons | Lucide React |
| HTTP Client | Native `fetch` (custom wrapper) |
| Auth | JWT (access token in memory, refresh token via httpOnly cookie) |
| Test Runner | Vitest 4 |
| Linter | ESLint 10 + eslint-plugin-react-hooks |

---

## Struktur Proyek

```
src/
├── assets/              # Gambar statis
├── components/          # Komponen layout global
│   ├── AppShell.jsx     # Header, navigasi, dark mode toggle
│   └── AuthForm.jsx     # Form login dan register
├── context/             # React context + provider
│   ├── AuthProvider.jsx # Auth state (user, login, logout, register)
│   ├── ThemeProvider.jsx# Dark/light mode
│   ├── TodoProvider.jsx # Task state (CRUD, optimistic update)
│   ├── WorkspaceProvider.jsx # Daftar workspace user
│   └── todoUtils.js     # Helper murni untuk merge task update
├── features/
│   └── todo/            # Komponen task (input, list, item, stats)
├── pages/               # Halaman utama
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── WorkspaceDetailPage.jsx
│   ├── ProfilePage.jsx
│   └── NotFoundPage.jsx
├── services/            # Layer komunikasi API
│   ├── api.js           # Fetch wrapper, token management, auth event bus
│   ├── authService.js   # Login, logout, register, refresh session
│   ├── taskService.js   # CRUD task + normalisasi response
│   └── workspaceService.js # CRUD workspace + member
├── styles/              # CSS global
├── utils/
│   └── date.js          # Format tanggal, cek overdue
└── App.jsx              # Routing + guard
```

---

## Fitur

**Autentikasi**
- Register akun baru.
- Login dengan email dan password.
- Session dipertahankan lewat refresh token (httpOnly cookie).
- Auto-logout saat token expired.
- Deteksi cookie `has_session` untuk skip refresh request saat user belum pernah login.

**Workspace**
- Buat workspace baru.
- Lihat daftar workspace milik user.
- Buka detail workspace.
- Undang anggota ke workspace via email (khusus role `owner`).
- Pre-check akses workspace di client sebelum request ke server.

**Task**
- Tambah task dengan judul dan deadline.
- Tandai task selesai / belum selesai.
- Edit judul task inline.
- Hapus task.
- Filter task berdasarkan status (all / pending / completed).
- Cari task berdasarkan judul.
- Urutkan task berdasarkan deadline terdekat.
- Pagination (10 task per halaman).
- Statistik task (total, open, completed).

**UI / UX**
- Dark mode dengan preferensi tersimpan di localStorage.
- Animasi transisi halaman dan list item via Framer Motion.
- Responsive untuk mobile dan desktop.
- Halaman 404 untuk route tidak dikenal.
- Loading state saat fetch data.
- Error message inline saat request gagal.

**Profil**
- Lihat dan edit nama, email, role (tersimpan di memory, siap untuk integrasi backend).

---

## Routing

Routing dikelola manual tanpa React Router menggunakan `window.history` dan `useState`.

| Path | Halaman | Guard |
|---|---|---|
| `/` | Landing | - |
| `/about` | Landing (about) | - |
| `/login` | Login | Redirect ke dashboard jika sudah login |
| `/register` | Register | Redirect ke dashboard jika sudah login |
| `/dashboard` | Dashboard | Harus login |
| `/workspace/:id` | Detail Workspace | Harus login + harus member workspace |
| `/profile` | Profil | Harus login |
| `*` | Not Found | - |

---

## Auth Flow

```
App boot
  └── cek cookie has_session
        ├── tidak ada → isAuthReady = true, user = null (skip refresh)
        └── ada → POST /api/auth/refresh
                    ├── sukses → set access token, user = session user
                    └── gagal  → user = null

Login
  └── POST /api/auth/login
        └── sukses → set access token in memory, backend set cookie

Request API
  └── kirim Authorization: Bearer <accessToken>
        └── 401 → cek has_session cookie
                    ├── tidak ada → skip refresh, emit unauthorized
                    └── ada → POST /api/auth/refresh → retry request

Logout
  └── DELETE /api/auth/logout → backend clear cookie → clear access token
```

---

## Menjalankan Proyek

**Prasyarat**
- Node.js 18+
- Backend API berjalan (default: `http://localhost:3000`)

**Instalasi**

```bash
npm install
```

**Development**

```bash
npm run dev
```

**Build**

```bash
npm run build
```

**Environment Variable**

Buat file `.env` di root proyek:

```env
VITE_API_URL=http://localhost:3000
```

Jika tidak diset, default ke `http://localhost:3000`.

---

## Testing

Test runner menggunakan **Vitest**.

**Menjalankan test**

```bash
npm test
```

**Coverage saat ini: 13 test, 3 file**

| File | Test | Deskripsi |
|---|---|---|
| `src/services/api.test.js` | 4 | `hasSessionCookie()` dan skip refresh saat cookie tidak ada |
| `src/services/taskService.test.js` | 6 | Deadline parsing, `unwrapTask()`, `normalizeTask()` |
| `src/context/TodoProvider.test.js` | 3 | `mergeUpdatedTask()` — cegah response PATCH kosong menimpa task |

**Kasus kritis yang dicover**
- Guest tanpa cookie tidak memicu request refresh.
- Deadline tidak bergeser karena timezone saat parsing/formatting.
- Backend response PATCH yang tidak mengembalikan task lengkap tidak mengosongkan data task di UI.

---

## Linting

```bash
npm run lint
```

Menggunakan ESLint 10 dengan plugin:
- `eslint-plugin-react-hooks` — validasi rules of hooks dan set-state-in-effect.
- `eslint-plugin-react-refresh` — validasi fast refresh compatibility.

---

## Catatan Pengembangan

- Access token disimpan di **module-level variable** (bukan localStorage) untuk menghindari XSS.
- Refresh token disimpan di **httpOnly cookie**, tidak bisa dibaca JavaScript.
- Cookie `has_session` adalah flag non-httpOnly yang waktunya sinkron dengan refresh token. Frontend membacanya untuk memutuskan apakah perlu memanggil refresh.
- Semua redirect auth menggunakan `history.replaceState` (bukan `pushState`) supaya tombol Back tidak kembali ke halaman terproteksi.
- Guard route dihitung di fase render (`effectivePage`), bukan di `useEffect`, untuk menghindari flash render komponen terproteksi.
- Optimistic update dipakai untuk toggle dan delete task. Add task fallback ke full reload jika backend tidak mengembalikan `id`.

---

## Known Limitations

- Routing manual (tanpa React Router). Migrasi ke React Router direncanakan sebagai RFC terpisah.
- Profile edit hanya tersimpan di memory, belum terhubung ke endpoint backend.
- Tidak ada real-time update (WebSocket/SSE) untuk kolaborasi workspace.
- Role-based permission di dalam workspace (owner/admin/watcher/editor) baru diimplementasi di sisi UI, belum ada enforcement di layer routing.
