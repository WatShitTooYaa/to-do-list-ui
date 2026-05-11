# Issue: Improvement Workspace Detail Page

Dokumen ini berisi instruksi implementasi 7 task untuk halaman Workspace Detail.
Dikerjakan secara berurutan dari yang paling sederhana ke yang paling kompleks.

> **Catatan:** Setiap task sudah ditulis langkah-langkahnya secara detail.
> Pastikan setiap task diuji secara visual sebelum lanjut ke task berikutnya.

---

## Urutan Implementasi

1. Task 2 — Hapus Priority (pure deletion, paling aman dikerjakan duluan)
2. Task 3 — Nomor di Kiri Task
3. Task 6 — Judul Workspace di Header
4. Task 7 — Add Member Hanya untuk Owner
5. Task 1 — Dialog Overlay Add Member + Animasi
6. Task 4 & 5 — Paging (dikerjakan bersamaan)

---

## Task 2: Hapus Priority dari TodoInput dan TodoItem

**Tujuan:** Menghilangkan seluruh fitur priority (low/medium/high) dari form tambah task dan tampilan task.

### File yang diubah:

#### 1. `src/features/todo/TodoInput.jsx`

- **Hapus** variabel `priorityOptions` (baris 4-8)
- **Hapus** state `priority` → `const [priority, setPriority] = useState('medium')` (baris 13)
- **Ubah** `onAdd` call di `handleSubmit` (baris 29): dari `await onAdd({ title, deadline, priority })` menjadi `await onAdd({ title, deadline })`
- **Hapus** reset priority di `try` block (baris 32): `setPriority('medium')`
- **Hapus** seluruh elemen `<select>` priority (baris 60-71)

#### 2. `src/features/todo/TodoItem.jsx`

- **Hapus** objek `priorityStyles` (baris 6-10)
- **Hapus** array `priorityOptions` (baris 12-16)
- **Hapus** fungsi `getPriority` (baris 18-19)
- **Hapus** state `draftPriority` (baris 24): `const [draftPriority, setDraftPriority] = useState(...)`
- **Hapus** variabel `priority` (baris 29): `const priority = getPriority(task.priority)`
- **Ubah** `finishEditing` (baris 35): dari `onUpdate(task.id, { title, priority: draftPriority })` menjadi `onUpdate(task.id, { title })`
- **Hapus** reset `draftPriority` di `cancelEditing` (baris 46): `setDraftPriority(priority)`
- **Hapus** seluruh `<select>` priority di edit mode (baris 127-138)
- **Hapus** badge priority di view mode (baris 183-185): `<span className={...}>{priority}</span>`

#### 3. `src/context/TodoProvider.jsx`

- **Ubah** `addTask` (baris 41): hapus parameter `priority` dari destructuring, ganti menjadi `async ({ title, deadline = '', workspaceId })`
- **Ubah** `createTask` call (baris 45): dari `await createTask({ title, deadline, priority, workspaceId })` menjadi `await createTask({ title, deadline, workspaceId })`
- **Hapus** assignment `priority` di `optimisticTask` (baris 52): `priority: createdTask.priority || priority,`

#### 4. `src/services/taskService.js`

- **Hapus** fungsi `normalizePriority` (baris 5-6)
- **Ubah** `normalizeTask` (baris 78): hapus baris `priority: normalizePriority(task.priority ?? task.taskPriority ?? task.level),`
- **Ubah** `createTask` (baris 91): hapus parameter `priority` dari destructuring dan dari `body` (baris 101)
- **Ubah** `updateTask` (baris 126-128): hapus blok `if (updates.priority !== undefined)`

### Verifikasi:
- Form tambah task hanya menampilkan input title + date picker + tombol submit
- Task item tidak menampilkan badge priority
- Edit task tidak menampilkan dropdown priority

---

## Task 3: Beri Nomor di Samping Kiri Task

**Tujuan:** Menampilkan nomor urut di sebelah kiri setiap task.

### File yang diubah:

#### 1. `src/features/todo/TodoList.jsx`

- **Tambah** prop `startIndex` pada komponen `TodoList`:
  ```jsx
  export function TodoList({ tasks, onToggle, onDelete, onUpdate, emptyTitle, emptyDescription, startIndex = 0 })
  ```
- **Pass** prop `index` ke `<TodoItem>` (di dalam `tasks.map`):
  ```jsx
  tasks.map((task, index) => (
    <TodoItem
      key={...}
      task={task}
      index={startIndex + index}
      onToggle={onToggle}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  ))
  ```

#### 2. `src/features/todo/TodoItem.jsx`

- **Tambah** prop `index` di function signature:
  ```jsx
  export function TodoItem({ task, index, onToggle, onDelete, onUpdate })
  ```
- **Render** nomor di dalam `<motion.li>`, sebelum tombol checkbox (sebelum baris 79):
  ```jsx
  <span className="w-6 shrink-0 text-center text-xs font-medium text-zinc-400 dark:text-zinc-500">
    {index + 1}
  </span>
  ```

### Verifikasi:
- Setiap task memiliki nomor urut di sebelah kiri (1, 2, 3, ...)
- Nomor ditampilkan dengan style yang subtle (warna zinc-400)

---

## Task 6: Tampilkan Judul Workspace di Header

**Tujuan:** Mengganti teks "Workspace Tasks" dengan nama workspace yang sebenarnya.

### File yang diubah:

#### 1. `src/services/workspaceService.js`

- **Tambah** fungsi baru `getWorkspaceById`:
  ```jsx
  export const getWorkspaceById = async (workspaceId) => {
    const data = await request(`/api/v1/workspaces/${workspaceId}`, {
      credentials: 'include',
    })
    return data?.data ?? data
  }
  ```

#### 2. `src/pages/WorkspaceDetailPage.jsx`

- **Import** `getWorkspaceById` dari `../services/workspaceService`:
  ```jsx
  import { addWorkspaceMember, getWorkspaceById } from '../services/workspaceService'
  ```
- **Tambah** state `workspace`:
  ```jsx
  const [workspace, setWorkspace] = useState(null)
  ```
- **Tambah** fetch workspace di `useEffect` yang sudah ada (di dalam blok `if (workspaceId)`):
  ```jsx
  useEffect(() => {
    if (workspaceId) {
      loadTasks(workspaceId)
      getWorkspaceById(workspaceId)
        .then(setWorkspace)
        .catch(() => {})
    }
  }, [workspaceId, loadTasks])
  ```
- **Ganti** teks `<h1>` (baris 134-136): dari `Workspace Tasks` menjadi:
  ```jsx
  <h1 className="text-3xl font-medium tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-4xl">
    {workspace?.name || 'Workspace Tasks'}
  </h1>
  ```

### Verifikasi:
- Header menampilkan nama workspace yang sebenarnya (misal: "Project Alpha")
- Saat loading, tampilkan fallback "Workspace Tasks"

---

## Task 7: Button Add Member Hanya untuk Role Owner

**Tujuan:** Tombol "Add Member" hanya ditampilkan jika user yang login adalah owner workspace tersebut.

### Prasyarat:
Task ini bergantung pada Task 6 karena menggunakan data `workspace` yang sudah di-fetch.

### Asumsi:
Response API `GET /api/v1/workspaces/:id` mengembalikan field `role` atau `userRole` yang berisi role user di workspace tersebut (misal: `"owner"`, `"editor"`, `"watcher"`). Jika field berbeda, sesuaikan nama field-nya.

### File yang diubah:

#### 1. `src/pages/WorkspaceDetailPage.jsx`

- **Tentukan** role user dari data workspace:
  ```jsx
  const userRole = workspace?.role || workspace?.userRole || null
  ```
- **Bungkus** button "Add Member" (baris 140-146) dengan kondisi:
  ```jsx
  {userRole === 'owner' && (
    <button
      onClick={() => setIsAddMemberOpen(true)}
      className="..."
    >
      <UserPlus size={15} />
      <span>Add Member</span>
    </button>
  )}
  ```

### Verifikasi:
- Login sebagai owner → button "Add Member" muncul
- Login sebagai editor/watcher → button "Add Member" tidak muncul

---

## Task 1: Dialog Overlay Add Member + Animasi

**Tujuan:** Mengubah tampilan form Add Member dari inline section menjadi dialog overlay (modal) yang mengambang menutupi halaman dengan animasi smooth.

### File yang diubah:

#### 1. `src/pages/WorkspaceDetailPage.jsx`

- **Pastikan** import `motion` dan `AnimatePresence` dari `framer-motion`:
  ```jsx
  import { AnimatePresence, motion } from 'framer-motion'
  ```

- **Pindahkan** seluruh blok `{isAddMemberOpen && (...)}` (baris 153-221) dari posisi inline di dalam `<section>` ke **luar** elemen `<main>`, dan ubah menjadi fixed overlay.

- **Ganti** blok tersebut menjadi struktur berikut:
  ```jsx
  <AnimatePresence>
    {isAddMemberOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsAddMemberOpen(false)}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          {/* Isi form Add Member tetap sama seperti sebelumnya */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              Add Workspace Member
            </h2>
            <button
              onClick={() => setIsAddMemberOpen(false)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleAddMember} className="grid gap-4">
            {/* ... seluruh isi form (email input, role select, error, buttons) tetap sama ... */}
          </form>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
  ```

- **Letakkan** blok `<AnimatePresence>` di atas `<main>` atau di dalam `<main>` tapi di luar `<section>`, agar overlay menutupi seluruh halaman.

- **Hapus** blok inline `{isAddMemberOpen && (...)}` yang lama (baris 153-221).

### Detail penting:
- Backdrop: `fixed inset-0`, warna `bg-black/50`, efek `backdrop-blur-sm`, klik backdrop menutup dialog
- Dialog: `max-w-md`, animasi `scale 0.95→1` + `opacity 0→1` + `y 10→0`
- Animasi exit: kebalikan dari enter
- Z-index: `z-50` agar di atas semua konten
- Isi form (input email, select role, tombol cancel/submit) tetap sama persis, tidak perlu diubah

### Verifikasi:
- Klik "Add Member" → muncul overlay gelap + dialog di tengah layar
- Dialog muncul dengan animasi scale + fade in
- Klik backdrop (area gelap) → dialog tertutup dengan animasi
- Klik tombol X → dialog tertutup
- Klik Cancel → dialog tertutup
- Form berfungsi normal (isi email, pilih role, submit)

---

## Task 4 & 5: Paging 10 Task per Halaman (Tanpa Refresh)

**Tujuan:** Menampilkan task 10 per halaman dengan tombol Next/Prev tanpa me-refresh halaman.

### File yang diubah:

#### 1. `src/pages/WorkspaceDetailPage.jsx`

- **Tambah** konstanta di atas komponen:
  ```jsx
  const TASKS_PER_PAGE = 10
  ```

- **Tambah** state `currentPage`:
  ```jsx
  const [currentPage, setCurrentPage] = useState(1)
  ```

- **Tambah** `useEffect` untuk reset halaman saat filter berubah (tambah setelah `useMemo` filteredTasks):
  ```jsx
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, sortByDeadline])
  ```

- **Hitung** paging setelah `filteredTasks`:
  ```jsx
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE)
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE
  const pagedTasks = filteredTasks.slice(startIndex, startIndex + TASKS_PER_PAGE)
  ```

- **Ganti** prop `tasks` pada `<TodoList>` dari `filteredTasks` menjadi `pagedTasks`:
  ```jsx
  <TodoList
    tasks={pagedTasks}
    startIndex={startIndex}
    onToggle={handleToggleTask}
    onDelete={handleDeleteTask}
    onUpdate={handleUpdateTask}
    emptyTitle={...}
    emptyDescription={...}
  />
  ```

- **Tambah** tombol navigasi paging setelah `<TodoList>`, di dalam `<div className="mt-8">` (setelah closing `</TodoList>`):
  ```jsx
  {totalPages > 1 && (
    <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
      <button
        type="button"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        Prev
      </button>
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        Next
      </button>
    </div>
  )}
  ```

### Catatan penting (Task 5 — SPA):
- **JANGAN** menggunakan `window.location`, `<a href>`, atau navigasi URL apapun untuk Prev/Next
- Tombol Prev/Next hanya mengubah state `currentPage` via `setCurrentPage`
- Halaman tetap di workspace detail, TIDAK refresh
- Saat filter/search berubah, `currentPage` otomatis reset ke 1 via `useEffect`

### Hubungan dengan Task 3 (Nomor):
- Prop `startIndex` sudah di-pass ke `TodoList`, yang kemudian di-forward ke `TodoItem`
- Ini memastikan nomor task tetap benar di semua halaman:
  - Halaman 1: nomor 1-10
  - Halaman 2: nomor 11-20
  - dst.

### Verifikasi:
- Task ditampilkan 10 per halaman
- Tombol Prev disabled di halaman pertama
- Tombol Next disabled di halaman terakhir
- Klik Next → menampilkan 10 task berikutnya tanpa refresh
- Klik Prev → menampilkan 10 task sebelumnya tanpa refresh
- Teks "Page X of Y" update otomatis
- Saat search/filter berubah, kembali ke halaman 1
- Nomor task menyesuaikan halaman (halaman 2 mulai dari 11)
- Jika total task <= 10, tombol paging tidak muncul

---

## Checklist Akhir

Setelah semua task selesai, pastikan:

- [ ] Form tambah task tidak ada dropdown priority
- [ ] Task item tidak menampilkan badge priority
- [ ] Edit task tidak ada dropdown priority
- [ ] Setiap task punya nomor urut di kiri
- [ ] Header menampilkan nama workspace (bukan "Workspace Tasks")
- [ ] Button Add Member hanya muncul untuk role owner
- [ ] Add Member tampil sebagai dialog overlay dengan animasi
- [ ] Dialog bisa ditutup via backdrop click, tombol X, atau Cancel
- [ ] Task ditampilkan 10 per halaman
- [ ] Paging (Prev/Next) berfungsi tanpa refresh halaman
- [ ] Nomor task sesuai halaman (halaman 2 mulai dari 11)
- [ ] Filter/search me-reset halaman ke 1
