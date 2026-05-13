# Issue: Gunakan Cookie `has_session` untuk Mencegah Refresh Request Sia-Sia

## Konteks

Backend sudah membuat cookie `has_session` sebagai flag penanda bahwa browser kemungkinan punya refresh session aktif.

Saat ini frontend masih memanggil endpoint refresh session walaupun user guest dan tidak punya refresh token cookie. Akibatnya:

- Request `POST /api/auth/refresh` terjadi setiap app pertama kali dibuka.
- Guest user mendapat response `401` yang sebenarnya normal, tapi mengotori Network tab dan log backend.
- Backend menerima request yang tidak perlu.

Tujuan task ini: **frontend hanya memanggil refresh session jika cookie `has_session` tersedia**.

## Prinsip Penting

- Jangan baca cookie refresh token langsung. Refresh token seharusnya `HttpOnly`, jadi tidak bisa dan tidak boleh dibaca JavaScript.
- Cookie `has_session` hanya flag, bukan sumber kebenaran auth.
- Jika `has_session` ada, frontend boleh mencoba refresh.
- Jika `has_session` tidak ada, frontend harus skip refresh dan anggap user guest.
- Jika refresh gagal, frontend harus bersihkan access token lokal dan lanjut sebagai guest.

---

## Scope

Kerjakan hanya bagian frontend.

File yang kemungkinan disentuh:

- `src/services/api.js`
- `src/services/authService.js`
- `src/context/AuthProvider.jsx`

Jangan ubah:

- Routing.
- UI halaman login/register.
- Payload login/logout.
- Nama cookie dari backend, kecuali backend memang memakai nama berbeda.

---

## Task 1 — Tambah Helper untuk Membaca Cookie `has_session`

### File

`src/services/api.js`

### Instruksi

Tambahkan helper kecil untuk membaca cookie browser.

Nama cookie default: `has_session`.

Contoh implementasi:

```js
const SESSION_COOKIE_NAME = 'has_session'

export const hasSessionCookie = () => {
  if (typeof document === 'undefined') {
    return false
  }

  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie.startsWith(`${SESSION_COOKIE_NAME}=`))
}
```

Catatan:

- Jangan parse value cookie karena value tidak penting.
- Cukup cek cookie ada atau tidak.
- Jangan simpan hasilnya di module variable karena cookie bisa berubah setelah login/logout.
- Jangan gunakan `localStorage` untuk task ini karena backend sudah menyediakan cookie flag.

### Definition of Done

- `hasSessionCookie()` return `true` saat `document.cookie` mengandung `has_session=...`.
- `hasSessionCookie()` return `false` saat cookie tidak ada.
- Tidak error saat `document` tidak tersedia.

---

## Task 2 — Skip `refreshAccessToken` Jika Tidak Ada `has_session`

### File

`src/services/api.js`

### Instruksi

Update fungsi `refreshAccessToken`.

Sebelum membuat request ke `/api/auth/refresh`, cek `hasSessionCookie()`.

Expected behavior:

```js
export const refreshAccessToken = async () => {
  if (!hasSessionCookie()) {
    setAccessToken(null)
    return false
  }

  // existing refreshPromise logic tetap di bawah sini
}
```

Pastikan logic `refreshPromise` yang sudah ada tetap dipakai supaya request refresh tidak dobel saat banyak request terkena `401` bersamaan.

Jangan hapus:

- `refreshPromise`
- `setAccessToken(nextToken)` saat refresh sukses
- `setAccessToken(null)` saat refresh gagal

### Definition of Done

- Jika cookie `has_session` tidak ada, `refreshAccessToken()` langsung return `false` tanpa request network.
- Jika cookie `has_session` ada, flow refresh lama tetap berjalan.
- Multiple request `401` tetap hanya menghasilkan satu refresh request karena `refreshPromise` masih bekerja.

---

## Task 3 — Skip `refreshSession` Saat App Pertama Dibuka oleh Guest

### File

`src/context/AuthProvider.jsx`

### Instruksi

Saat `AuthProvider` mount, app sekarang memanggil `refreshSession()` untuk mengecek apakah user masih login.

Ubah flow supaya:

1. Cek `hasSessionCookie()` lebih dulu.
2. Jika cookie tidak ada:
   - `setUser(null)`
   - `setIsAuthReady(true)`
   - **jangan panggil `refreshSession()`**
3. Jika cookie ada:
   - lanjutkan flow `refreshSession()` seperti sekarang.

Contoh struktur:

```js
useEffect(() => {
  let isMounted = true

  if (!hasSessionCookie()) {
    setUser(null)
    setIsAuthReady(true)
    return () => {
      isMounted = false
    }
  }

  refreshSession()
    .then(...)
    .catch(...)
    .finally(...)

  return () => {
    isMounted = false
  }
}, [])
```

Import `hasSessionCookie` dari `src/services/api.js`.

Catatan penting:

- Tetap jaga guard `isMounted` untuk mencegah setState setelah unmount.
- Jangan ubah behavior saat cookie ada.
- Jangan redirect dari `AuthProvider`. Provider hanya set auth state.

### Definition of Done

- Guest user membuka `/` tanpa cookie `has_session` → tidak ada request `POST /api/auth/refresh`.
- Guest user tetap melihat landing page normal.
- `isAuthReady` tetap berubah jadi `true`, jadi app tidak stuck di loading.

---

## Task 4 — Pastikan Login dan Logout Tetap Sinkron dengan Cookie Backend

### File

`src/services/authService.js`

### Instruksi

Periksa flow berikut:

- `login()` memanggil `/api/auth/login`.
- Backend harus set cookie refresh token dan `has_session` dari response login.
- Frontend tidak perlu set cookie manual.
- `logout()` memanggil `/api/auth/logout`.
- Backend harus clear cookie refresh token dan `has_session`.
- Frontend cukup `setAccessToken(null)` seperti sekarang.

Jangan tambahkan logic manual seperti:

```js
document.cookie = 'has_session=...'
```

Alasannya:

- Cookie session harus dikontrol backend supaya expiry, domain, path, `SameSite`, dan `Secure` konsisten.
- Kalau frontend set cookie sendiri, flag bisa tidak sinkron dengan refresh token.

### Definition of Done

- Setelah login sukses, browser punya cookie `has_session` dari backend.
- Setelah logout sukses, cookie `has_session` hilang/expired.
- Frontend tidak membuat atau menghapus cookie `has_session` manual.

---

## Task 5 — Manual QA

### Skenario 1: Guest Tanpa Cookie

Langkah:

1. Clear cookies untuk domain app.
2. Buka `/`.
3. Buka DevTools → Network.

Expected:

- Tidak ada request `POST /api/auth/refresh`.
- Landing page tampil.
- Tidak stuck loading.

### Skenario 2: Guest Buka Protected Route Tanpa Cookie

Langkah:

1. Clear cookies.
2. Buka `/dashboard` langsung dari address bar.

Expected:

- Tidak ada request `POST /api/auth/refresh`.
- User diarahkan ke `/login`.
- Tidak ada infinite redirect.

### Skenario 3: User Login Normal

Langkah:

1. Login dengan akun valid.
2. Pastikan backend set cookie `has_session`.
3. Refresh browser.

Expected:

- Ada request `POST /api/auth/refresh` saat app boot.
- User tetap login.
- Dashboard bisa dibuka.

### Skenario 4: Cookie Flag Ada tapi Refresh Token Invalid

Langkah:

1. Buat kondisi `has_session` ada, tapi refresh token invalid/expired.
2. Refresh browser.

Expected:

- Frontend mencoba `POST /api/auth/refresh` satu kali.
- Jika gagal, user dianggap guest.
- Access token lokal dibersihkan.
- App tidak loop request refresh.

---

## Acceptance Criteria

- Tidak ada refresh request saat `has_session` tidak ada.
- Refresh request tetap jalan saat `has_session` ada.
- Tidak ada perubahan visual UI.
- Tidak ada token disimpan di `localStorage`.
- Tidak ada cookie yang dibuat manual oleh frontend.
- `npm run lint` lulus.

## Out of Scope

- Mengubah backend cookie settings.
- Mengubah nama endpoint auth.
- Menambah remember-me.
- Mengubah routing guard.
- Menyimpan refresh token di frontend.

