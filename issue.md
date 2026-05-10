# Frontend Tasks: Implement Workspace Members & Task Creator Info

## Deskripsi Tugas
Sebagai kelanjutan dari pengembangan fitur Workspace, kita perlu menambahkan dua fungsionalitas utama di sisi frontend:
1.  **Fitur Penambahan Anggota (Add Member):** Memungkinkan pengguna untuk menambahkan anggota baru ke dalam *workspace* mereka menggunakan email dan mengatur peran (role) dari anggota tersebut.
2.  **Informasi Pembuat Task:** Menampilkan nama dari pembuat setiap task yang ada di dalam *workspace*.

---

## 1. Fitur Penambahan Anggota Workspace
-   **Lokasi:** Halaman `WorkspaceDetailPage` (`/workspace/:id`).
-   **UI/UX:** Tambahkan sebuah tombol "Add Member" (misal: ikon *UserPlus*) di bagian header atau di dekat judul Workspace. Saat diklik, munculkan dialog, modal, atau form sederhana.
-   **Form Input:**
    -   Input teks untuk **Email** anggota yang ingin ditambahkan.
    -   Dropdown (`<select>`) untuk **Role** dengan dua pilihan *hardcoded*: `editor` dan `watcher`.
    -   Tombol aksi: "Tambah" dan "Batal".
-   **Integrasi API:** Akan memanggil endpoint layanan baru untuk menambah anggota ke workspace.

## 2. Informasi Pembuat Task (Task Creator)
-   **Lokasi:** Komponen `TodoItem` (atau komponen item task serupa yang dirender di daftar tugas).
-   **Perubahan UI:** Pada setiap *item task*, tampilkan nama pembuat task tersebut dengan jelas (misalnya teks abu-abu kecil "Created by: John Doe" di bawah judul task).
-   **Integrasi API:** Mengandalkan struktur data yang dikirim oleh backend yang (seharusnya) menyertakan informasi nama pengguna yang membuat *task* tersebut.

---

## Tahapan Implementasi (Step-by-Step)
Untuk Junior Programmer (atau AI Assistant), ikuti urutan langkah-langkah berikut agar pengerjaan lebih terstruktur, aman, dan mudah di-*debug*:

### Langkah 1: Setup API Services
1.  Buka file `src/services/workspaceService.js`.
2.  Tambahkan fungsi baru `addWorkspaceMember` untuk memanggil endpoint dari backend:
    ```javascript
    export const addWorkspaceMember = async (workspaceId, { email, role }) => {
        // Sesuaikan dengan route Elysia kalian (misal: /api/v1/workspaces/:workspaceId/members)
        const data = await request(`/api/v1/workspaces/${workspaceId}/members`, {
            method: 'POST',
            credentials: 'include',
            body: { email, role },
        });
        return data;
    }
    ```
3.  Buka file `src/services/taskService.js`.
4.  Cari fungsi `normalizeTask`. Fungsi ini bertugas memetakan data kotor dari API ke format rapi untuk aplikasi. Modifikasi pemetaannya agar juga menangkap nama pembuat. Contoh:
    ```javascript
    export const normalizeTask = (task) => {
        if (!task) return null;
        return {
            id: task.id ?? task._id ?? null,
            title: pickTaskTitle(task),
            completed: pickTaskCompleted(task),
            deadline: toDateInputValue(task.deadline),
            priority: normalizePriority(task.priority),
            // Tambahkan ini: (Sesuaikan dengan properti aktual dari response Backend)
            creatorName: task?.user?.name || task?.creatorName || 'Unknown', 
        }
    }
    ```

### Langkah 2: Buat UI Penambahan Member
1.  Buka file `src/pages/WorkspaceDetailPage.jsx`.
2.  Siapkan state lokal untuk interaksi form:
    -   `isAddMemberOpen` (boolean, default `false`)
    -   `memberEmail` (string, default `''`)
    -   `memberRole` (string, default `'watcher'`)
    -   `isSubmitting` (boolean, default `false`)
3.  Tambahkan tombol "Add Member" di dekat bagian header (misalnya bersebelahan dengan jumlah task "open"). 
4.  Render form sederhana (bisa *inline* atau di dalam semacam kotak modal absolute) saat `isAddMemberOpen === true`. Pastikan ada input email dan dropdown peran.
5.  Buat fungsi *handler* `handleAddMember(e)`:
    -   Panggil `e.preventDefault()`.
    -   Set `isSubmitting(true)`.
    -   Panggil service `addWorkspaceMember(workspaceId, { email: memberEmail, role: memberRole })` menggunakan `try/catch`.
    -   Jika berhasil, tutup form dan kosongkan input.
    -   Jika error, tangkap pesan error dan tampilkan (misal: via `setError` atau alert).

### Langkah 3: Update Tampilan Item Task
1.  Buka file `src/features/todo/TodoItem.jsx` (atau komponen mana pun yang dirender oleh `TodoList.jsx`).
2.  Karena fungsi `normalizeTask` pada Langkah 1 sudah kita perbarui, maka properti `task` kini mengandung `task.creatorName`.
3.  Gunakan informasi tersebut untuk dirender di dalam UI item task. Sisipkan elemen `<p>` atau `<span>` dengan ukuran `text-xs` berwarna netral (misalnya `text-zinc-400`).
4.  Pastikan penambahan teks ini tidak merusak estetika dan responsivitas tata letak (flexbox) dari item tugas tersebut.

### Langkah 4: Testing Terintegrasi
1.  Masuk ke halaman `WorkspaceDetailPage`.
2.  Klik tombol "Add Member", isi form menggunakan email yang **valid dan sudah terdaftar di sistem**. 
    *(Catatan: Backend akan mengembalikan error jika email tidak terdaftar atau sudah menjadi member)*.
3.  Periksa respon API di *network tab* browser, pastikan integrasi berhasil.
4.  Lihat daftar task. Jika task yang ditampilkan memuat informasi pembuat dengan benar, berarti Langkah 3 berhasil. Jika masih 'Unknown', sampaikan ke developer backend agar mereka merelasikan tabel task dengan tabel users dan mengembalikan field nama di respon JSON.

---
**Catatan Senior:**
Fokuslah menyelesaikan fungsionalitasnya satu per satu. Pastikan form penambahan anggota dikelola dengan elegan (cegah double click saat *loading*, tampilkan *feedback* error secara visual, dsb). Semangat!
