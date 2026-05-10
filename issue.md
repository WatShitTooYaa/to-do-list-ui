# Frontend Tasks: Implementasi UI Workspace

## Deskripsi Tugas
Sebagai kelanjutan dari fitur Workspace di backend, kita perlu mengimplementasikan antarmuka pengguna (UI) di frontend untuk mendukung fitur tersebut. 
Terdapat dua pekerjaan utama:
1. Mengubah halaman Dashboard untuk menampilkan daftar workspace dan tombol untuk membuat workspace baru.
2. Membuat halaman detail Workspace (`/workspace/{id}`) yang berisi daftar tugas (tasks) spesifik untuk workspace tersebut.

---

## 1. Perubahan Halaman Dashboard (`/dashboard`)
Halaman dashboard saat ini menampilkan daftar *tasks*. Kita harus mengubah fungsinya menjadi daftar *workspaces*.
- **Tampilan Utama:** Menampilkan daftar (*list* atau *grid*) dari *workspaces* yang dimiliki atau diikuti oleh user.
- **Aksi Create Workspace:** Tambahkan tombol "Buat Workspace". Saat diklik, munculkan dialog/modal atau form kecil yang hanya meminta input **Nama Workspace**. Setelah di-submit, panggil endpoint API pembuatan workspace.
- **Navigasi:** Jika user mengklik salah satu *workspace* dari daftar, arahkan (navigate) user ke route `/workspace/{id}`.

## 2. Pembuatan Halaman Detail Workspace (`/workspace/{id}`)
- **Route Baru:** Daftarkan route baru di pengaturan *router* (misal `App.jsx`), yaitu `/workspace/:id`.
- **Proteksi Halaman:** Pastikan route ini bersifat *protected*, yang berarti hanya user yang terautentikasi (sudah login) yang dapat mengaksesnya.
- **Isi Halaman:** Pindahkan komponen-komponen pengelolaan *task* (seperti input todo, list todo, fitur *overdue*, dsb) yang sebelumnya ada di Dashboard ke halaman ini.
- **Integrasi API:** 
  - Pastikan setiap request terkait *tasks* (misalnya mengambil list tugas, membuat tugas baru) selalu dikaitkan dengan `workspaceId` (didapat dari URL parameter `:id`).
  - Perbarui pemanggilan API untuk task agar mengirim/menerima data berdasarkan workspace spesifik tersebut.

---

## Tahapan Implementasi (Step-by-Step)
Untuk Junior Programmer (atau AI Assistant), ikuti urutan langkah-langkah berikut agar pengerjaan lebih terstruktur, aman, dan mudah di-*debug*:

### Langkah 1: Setup API Services
1. Buka file `src/services/api.js`.
2. Tambahkan fungsi baru untuk berinteraksi dengan API Workspace backend:
   - `getWorkspaces()`: Memanggil endpoint untuk mengambil daftar workspace milik pengguna.
   - `createWorkspace(name)`: Memanggil endpoint `POST` (misal `/api/workspaces`) dengan *payload* `{ name: "..." }`.
   - Update fungsi manipulasi *tasks* yang sudah ada agar menerima dan mengirimkan `workspaceId`.

### Langkah 2: Buat Halaman Detail Workspace
1. Buat file/komponen baru, misalnya `src/pages/WorkspaceDetail.jsx`.
2. Gunakan *hooks* dari *router* (seperti `useParams` dari `react-router-dom`) untuk menangkap nilai `:id` dari URL.
3. **Pindahkan Logika:** Pindahkan logika menampilkan *todo list*, *loading state*, dan *add task* yang tadinya bersemayam di Dashboard lama ke komponen baru ini.
4. Saat komponen pertama kali dirender (`useEffect`), ambil data task spesifik untuk *workspace* tersebut menggunakan `workspaceId` dari URL.

### Langkah 3: Rombak Halaman Dashboard
1. Buka file `src/pages/Dashboard.jsx` (atau di mana kamu menempatkan Dashboard sebelumnya).
2. Hapus atau bersihkan elemen-elemen *task management* (karena sudah dipindah ke `WorkspaceDetail`).
3. Buat state lokal (misal `[workspaces, setWorkspaces] = useState([])`).
4. Saat komponen *mount*, panggil `getWorkspaces()` dan simpan datanya ke *state*.
5. Render list *workspaces* tersebut dengan tampilan *UI* yang interaktif (misal dibungkus tag Link atau onClick *handler* yang mengarah ke `/workspace/{id}`).
6. Tambahkan UI Form sederhana (bisa modal atau form statis di atas/bawah) dengan satu input teks (Nama Workspace) dan tombol *Submit* untuk memanggil fungsi `createWorkspace()`.

### Langkah 4: Update Routing Sistem
1. Buka file utama routing aplikasi (seperti `src/App.jsx`).
2. Definisikan route baru:
   ```jsx
   <Route element={<ProtectedRoute />}>
     {/* ... route protected lainnya ... */}
     <Route path="/workspace/:id" element={<WorkspaceDetail />} />
   </Route>
   ```
3. Pastikan tidak ada konflik dengan route yang sudah ada.

### Langkah 5: Testing
1. Login ke dalam aplikasi.
2. Masuk ke halaman Dashboard, cek apakah ada daftar workspace kosong (jika pengguna baru) dan tes membuat workspace baru bernama "Project A".
3. Pastikan *loading state* berjalan dengan baik dan setelah berhasil, "Project A" muncul di layar.
4. Klik "Project A", pastikan URL berpindah menjadi `/workspace/{id-workspace}` dan tidak terjadi *error 404* atau *blank screen*.
5. Di dalam `/workspace/...` tersebut, tes membuat satu atau dua task dan pastikan task tidak bocor ke workspace lainnya.

---
**Catatan Senior:**
1. Hati-hati saat merombak *Dashboard*. Pastikan semua *import* yang tidak lagi dipakai dihapus untuk menghindari *lint error*.
2. Selalu gunakan penanganan *error* (try-catch) setiap kali memanggil layanan API untuk memberikan notifikasi visual (misal *toast* atau pesan merah) jika pembuatan workspace gagal.
3. Selalu pertahankan desain estetika aplikasi (jangan biarkan komponen baru tampil berantakan atau *un-styled*).
