# Known Bugs & Issues Tracker

Berikut adalah daftar *bug* terbaru yang ditemukan pada sistem routing dan autentikasi:

### 1. Bug: Masalah Routing Autentikasi
*   **Deskripsi**: Terdapat *error* pada sistem *routing*. Ketika pengguna belum login atau belum terautentikasi, perilaku perpindahan halaman (akses ke Dashboard) tidak tertangani dengan benar (mungkin terjadi *blank screen*, *error*, atau tidak diarahkan ke halaman login dengan semestinya).
*   **Status**: Open
*   **Target Perbaikan**: Memeriksa kembali logika *routing* manual di dalam `App.jsx` (khususnya fungsi `handleNavigate` dan pengecekan akses komponen). Memastikan pengguna yang belum terautentikasi langsung di- *redirect* (diarahkan) ke halaman `/login`.

### 2. Bug: Gagal Akses Dashboard saat Access Token Habis
*   **Deskripsi**: Ketika *access token* pengguna kedaluwarsa di tengah-tengah sesi (terutama saat mencoba mengakses atau me-*refresh* halaman Dashboard), pengguna langsung gagal mengakses halaman tersebut seolah-olah sudah *logout*.
*   **Ekspektasi**: Aplikasi seharusnya secara otomatis mendeteksi kedaluwarsanya token, lalu memanggil *refresh token* (yang tersimpan di *cookie*). Jika *refresh token* masih valid, aplikasi harus memperbarui *access token* di latar belakang sehingga pengguna dapat terus mengakses Dashboard tanpa gangguan.
*   **Status**: Open
*   **Target Perbaikan**: Memperbarui *state initialization* di `AuthProvider.jsx` atau hook `useAuth()`. Pastikan saat inisialisasi awal (aplikasi baru dimuat), aplikasi mencoba melakukan *silent refresh* (`refreshSession`) sebelum memutuskan bahwa `user` bernilai null.
