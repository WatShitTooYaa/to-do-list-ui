Role & Objective
Bertindaklah sebagai Expert UI/UX Frontend Developer. Tugas Anda adalah membuat halaman utama (Dashboard) untuk aplikasi To-Do List menggunakan React, Tailwind CSS, dan Framer Motion (untuk animasi). Desain harus terasa sleek, premium, minimalis, dan setara dengan produk kelas dunia seperti Linear, Notion, atau Apple Reminders.

Design System & Tech Stack Requirements

Framework: React (Functional Components).

Styling: Tailwind CSS. Gunakan palet warna netral yang elegan (disarankan zinc atau slate untuk background dan teks, dengan satu warna aksen subtle seperti indigo-500 atau emerald-500).

Typography: Gunakan font sans-serif modern (seperti Inter, Geist, atau SF Pro). Teks harus tajam dengan hierarki weight yang jelas (misal: font-medium untuk judul, font-normal untuk teks biasa, text-zinc-500 untuk placeholder).

Icons: Gunakan Lucide React untuk ikon yang konsisten dan minimalis.

Animations: Gunakan Framer Motion (motion dan AnimatePresence) untuk transisi masuk/keluarnya task.

Layout & Architecture Guidelines

Container: Jangan gunakan full-width untuk list. Gunakan container di tengah layar (misal: max-w-2xl mx-auto mt-20 px-4) agar mata fokus pada konten.

Background: Gunakan warna latar yang sangat lembut (misal bg-zinc-50 untuk light mode atau bg-zinc-950 untuk dark mode).

Header: Buat header minimalis yang menampilkan sapaan singkat atau tanggal hari ini ("Today, 1 May") dengan tipografi yang elegan.

Input Area (Add Task): >     * Jangan gunakan border kotak yang tebal. Gunakan input field transparan dengan bayangan sangat lembut (shadow-sm), atau border 1px yang hanya menebal/berubah warna saat di-focus (focus:ring-1 focus:ring-zinc-300 focus:outline-none).

Tambahkan animasi transisi warna border yang mulus (transition-all duration-200).

Task List (The Items):

Setiap task item harus memiliki padding yang nyaman (misal py-3 px-2).

Gunakan teknik Group Hover di Tailwind (group). Ikon "Edit" dan "Delete" harus tersembunyi secara default, dan hanya muncul dengan animasi fade-in transparan saat mouse diarahkan ke task item tersebut. Ini kunci dari desain minimalis.

Checkbox: Buat desain checkbox custom (bulat atau kotak rounded) yang mulus saat diklik, coret teks (strikethrough) dengan animasi saat tugas selesai, dan ubah warna teks menjadi text-zinc-400.

Empty State: Jika tidak ada tugas, tampilkan ilustrasi atau teks yang sangat bersih dan menenangkan (misal: "All clear. Enjoy your day!").

Deliverable
Berikan saya kode React yang bersih, dipisah per komponen jika perlu (misal TaskItem, TaskInput), dan cantumkan class Tailwind secara eksplisit tanpa memerlukan konfigurasi custom di tailwind.config.js selain font.