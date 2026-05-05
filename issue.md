# Known Bugs & Issues Tracker

Berikut adalah daftar *bug* dan fitur yang ditemukan pada aplikasi:

### 1. Bug: Masalah Routing Autentikasi
*   **Deskripsi**: Terdapat *error* pada sistem *routing*. Ketika pengguna belum login atau belum terautentikasi, perilaku perpindahan halaman (akses ke Dashboard) tidak tertangani dengan benar (mungkin terjadi *blank screen*, *error*, atau tidak diarahkan ke halaman login dengan semestinya).
*   **Status**: Closed
*   **Target Perbaikan**: Memeriksa kembali logika *routing* manual di dalam `App.jsx` (khususnya fungsi `handleNavigate` dan pengecekan akses komponen). Memastikan pengguna yang belum terautentikasi langsung di- *redirect* (diarahkan) ke halaman `/login`.

### 2. Bug: Gagal Akses Dashboard saat Access Token Habis
*   **Deskripsi**: Ketika *access token* pengguna kedaluwarsa di tengah-tengah sesi (terutama saat mencoba mengakses atau me-*refresh* halaman Dashboard), pengguna langsung gagal mengakses halaman tersebut seolah-olah sudah *logout*.
*   **Ekspektasi**: Aplikasi seharusnya secara otomatis mendeteksi kedaluwarsanya token, lalu memanggil *refresh token* (yang tersimpan di *cookie*). Jika *refresh token* masih valid, aplikasi harus memperbarui *access token* di latar belakang sehingga pengguna dapat terus mengakses Dashboard tanpa gangguan.
*   **Status**: Closed
*   **Target Perbaikan**: Memerbarui *state initialization* di `AuthProvider.jsx` atau hook `useAuth()`. Pastikan saat inisialisasi awal (aplikasi baru dimuat), aplikasi mencoba melakukan *silent refresh* (`refreshSession`) sebelum memutuskan bahwa `user` bernilai null.

---

### **Tugas Baru (Untuk Junior Developer)**

### 3. Fitur/Bug: Validasi Tanggal (Deadline) Tidak Boleh Masa Lalu
*   **Deskripsi**: Saat ini pengguna bisa bebas memilih tanggal (deadline) yang sudah lewat ketika membuat atau mengedit sebuah *task*.
*   **Ekspektasi**: Tambahkan batasan pada komponen input tanggal (misalnya mengatur atribut `min` pada `<input type="date">` di `TodoInput.jsx`) agar pengguna hanya bisa memilih hari ini atau tanggal di masa depan.
*   **Status**: Open

### 4. Fitur: Status "Overdue" (Terlewat) untuk Task
*   **Deskripsi**: Aplikasi belum secara eksplisit memiliki status yang membedakan *task* biasa dengan *task* yang sudah melewati tenggat waktu (deadline).
*   **Ekspektasi**: Buat status atau indikator visual baru (misalnya: label "Overdue" dengan warna mencolok/merah) untuk *task* yang tanggal deadline-nya sudah lewat dari hari ini **dan** statusnya masih belum "completed". Ini akan sangat membantu pengguna menyadari tugas yang tertunggak.
*   **Status**: Open
