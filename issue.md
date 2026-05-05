# Known Bugs & Features Tracker

Berikut adalah daftar bug dan fitur yang perlu ditambahkan:

### 1. Bug: Tidak Auto Refresh Token
*   **Deskripsi**: Aplikasi tidak melakukan *auto refresh* token secara otomatis ketika token akses (*access token*) sudah kedaluwarsa. Akibatnya pengguna mungkin tiba-tiba kehilangan sesi (logout) atau mendapatkan error otorisasi saat mengakses API.
*   **Status**: Open
*   **Target Perbaikan**: Mengimplementasikan *interceptor* pada fungsi pemanggilan API (`taskService.js` / `authService.js`) atau memanfaatkan `useEffect` untuk mendeteksi *response* `401 Unauthorized` dan secara otomatis memanggil `refreshSession` sebelum mengulang (retry) *request* yang gagal.

### 2. Fitur Baru: Filter Tasks
*   **Deskripsi**: Buatkan fitur filter untuk daftar tugas agar memudahkan pengguna mencari tugas spesifik. Filter harus mencakup:
    *   **Pencarian berdasarkan Nama (Judul)**: Text input untuk mencari tugas dengan kata kunci tertentu.
    *   **Urutkan berdasarkan Deadline Terdekat**: Menyortir daftar agar tugas dengan deadline yang sudah dekat atau lewat berada di atas.
    *   **Filter berdasarkan Status**: Dropdown atau tab untuk melihat tugas yang "Semua", "Belum Selesai (Pending)", dan "Selesai (Completed)".
*   **Status**: Open
*   **Target Modifikasi**: Komponen `TodoList.jsx`, penambahan *state* filter di `DashboardPage.jsx` atau `TodoProvider.jsx`.
