export function NotFoundPage({ onNavigate }) {
  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-white px-4 text-center dark:bg-zinc-950">
      <h1 className="text-8xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
        404
      </h1>
      <h2 className="mt-4 text-2xl font-medium text-zinc-600 dark:text-zinc-400">
        Halaman tidak ditemukan
      </h2>
      <button
        type="button"
        onClick={() => onNavigate('landing')}
        className="mt-10 inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Kembali ke beranda
      </button>
    </main>
  )
}
