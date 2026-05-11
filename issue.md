# Issue: Workspace Detail Page UI Refactor & Improvements

Dokumen ini berisi instruksi implementasi untuk melakukan refactor pada halaman Workspace Detail guna meningkatkan pengalaman pengguna (UX) dan kebersihan antarmuka (UI).

---

## Ringkasan Tugas
Terdapat 7 tugas utama yang harus diimplementasikan secara berurutan:
1.  **Task 2**: Penghapusan fitur Priority.
2.  **Task 3**: Penomoran baris pada daftar task.
3.  **Task 6**: Menampilkan nama Workspace asli di Header.
4.  **Task 7**: Pembatasan tombol "Add Member" hanya untuk Owner.
5.  **Task 1**: Transformasi form Add Member menjadi Dialog Overlay (Modal) dengan animasi.
6.  **Task 4 & 5**: Implementasi Paging (10 task per halaman) tanpa refresh (SPA).

---

## Detail Implementasi

### 1. Task 2: Hapus Fitur Priority
Hapus semua elemen terkait Priority (low/medium/high) agar tampilan lebih bersih.
-   **Service**: Hapus `normalizePriority` di `taskService.js` dan hapus field `priority` pada fungsi `createTask` dan `updateTask`.
-   **Context**: Hapus field `priority` dari `TodoProvider.jsx`.
-   **UI**: Hapus dropdown priority di `TodoInput.jsx` dan `TodoItem.jsx`. Hapus juga badge priority yang muncul di setiap item task.

### 2. Task 3: Penomoran Task
Tampilkan nomor urut di sebelah kiri setiap task.
-   **TodoList.jsx**: Tambahkan prop `startIndex` (default 0). Saat merender `TodoItem`, kirimkan prop `index` dengan nilai `startIndex + currentIndex`.
-   **TodoItem.jsx**: Terima prop `index` dan tampilkan `{index + 1}` di sebelah kiri checkbox. Gunakan style `text-zinc-400` agar tidak terlalu mencolok.

### 3. Task 6: Nama Workspace di Header
Ganti teks statis "Workspace Tasks" dengan nama workspace yang diambil dari database.
-   **Service**: Tambahkan fungsi `getWorkspaceById(workspaceId)` di `workspaceService.js`.
-   **UI**: Di `WorkspaceDetailPage.jsx`, gunakan `useEffect` untuk memanggil `getWorkspaceById` saat halaman dimuat. Simpan hasilnya di state dan tampilkan nama workspace di tag `<h1>`.

### 4. Task 7: Proteksi Tombol Add Member
Tombol penambahan anggota hanya boleh terlihat oleh pemilik workspace.
-   **UI**: Gunakan data dari Task 6 (properti `role` atau `userRole`) untuk melakukan kondisional rendering pada tombol "Add Member". Contoh: `{userRole === 'owner' && <button>...</button>}`.

### 5. Task 1: Modal Overlay Add Member + Animasi
Ubah tampilan form penambahan anggota agar mengambang (overlay) dan memiliki animasi transisi.
-   **Library**: Gunakan `framer-motion` (`motion` dan `AnimatePresence`).
-   **UI**: Pindahkan form Add Member ke dalam kontainer `fixed inset-0` dengan backdrop blur.
-   **Animasi**: Berikan efek *fade-in* pada backdrop dan efek *scale/fade-in* pada kotak dialog. Pastikan user bisa menutup modal dengan mengklik area backdrop.

### 6. Task 4 & 5: Paging SPA (10 Task per Halaman)
Batasi tampilan task agar tidak terlalu panjang dan navigasi antar halaman tidak menyebabkan refresh.
-   **Logika**: Di `WorkspaceDetailPage.jsx`, buat state `currentPage`. Gunakan `.slice()` pada data task yang sudah difilter untuk mendapatkan 10 task yang sesuai dengan halaman aktif.
-   **UI**: Tambahkan tombol "Prev" dan "Next" di bawah daftar task. Tombol "Prev" mati di halaman 1, tombol "Next" mati di halaman terakhir.
-   **SPA**: Navigasi hanya mengubah state `currentPage`, tidak mengubah URL atau me-refresh halaman. Pastikan pencarian (search) atau filter status me-reset halaman kembali ke 1.

---

## Verifikasi Akhir
-   [ ] Priority sudah hilang sepenuhnya dari UI dan kode.
-   [ ] Task memiliki nomor urut yang benar (Page 2 dimulai dari nomor 11).
-   [ ] Nama Workspace muncul dengan benar di header.
-   [ ] Tombol "Add Member" hanya muncul untuk owner.
-   [ ] Dialog Add Member muncul dengan animasi smooth dan menutupi layar.
-   [ ] Paging berfungsi lancar tanpa refresh halaman.

---
**Catatan Senior:**
Kerjakan tugas ini satu per satu. Pastikan tidak ada regresi pada fitur yang sudah ada. Jika ada kendala pada integrasi `framer-motion`, periksa kembali penggunaan `AnimatePresence`. Selamat mengerjakan!
