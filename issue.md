# Known Bugs / Issues Tracker

Berikut adalah daftar bug yang saat ini teridentifikasi di dalam repositori:

### 1. Unique Key Prop Error pada TodoList
*   **Deskripsi**: Ketika sebuah task muncul lalu menekan tombol centang, muncul error di console: 
    > `TodoList.jsx:12 Each child in a list should have a unique "key" prop. Check the render method of ForwardRef(motion.ul). It was passed a child from TodoList`
*   **Status**: Open
*   **Lokasi**: `src/features/todo/TodoList.jsx` (sekitar baris 12)
*   **Kemungkinan Penyebab**: Saat melakukan *mapping* atau merender daftar `TodoItem` menggunakan Framer Motion (`<motion.ul>`), elemen anak tidak memiliki properti `key` yang unik atau nilainya `undefined`.

### 2. Isi Task Tidak Muncul (Tampil seperti Dummy)
*   **Deskripsi**: Saat menambahkan *task* baru, item list yang muncul di antarmuka terlihat kosong (seperti elemen *dummy*) dan tidak memiliki teks/isi yang sesuai dengan yang di-input.
*   **Status**: Open
*   **Kemungkinan Penyebab**: Struktur objek/data yang dikembalikan oleh API (`taskService.js` atau backend) setelah menambah task baru tidak cocok dengan struktur yang diharapkan oleh frontend, sehingga properti seperti judul (misal: `title` vs `name`) tidak terbaca dan menjadi kosong.

### 3. Fungsi CRUD Tidak Real-time
*   **Deskripsi**: Segala aksi modifikasi data (Create, Update, Delete) tidak langsung memperbarui tampilan secara *real-time*. Perubahan baru terlihat jika halaman dimuat ulang (*refresh*).
*   **Status**: Open
*   **Kemungkinan Penyebab**: *State management* (di dalam `TodoProvider`) gagal melakukan pembaruan state lokal (*optimistic update*) segera sesudah respons sukses dari API, atau fungsi *fetching* data tidak dipanggil ulang dengan benar setelah tindakan mutasi selesai.