import { CalendarDays, Plus, Layout, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getWorkspaces, createWorkspace } from '../services/workspaceService'
import { formatToday } from '../utils/date'

export function DashboardPage({ onNavigate }) {
  const [workspaces, setWorkspaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const loadWorkspaces = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getWorkspaces()
      setWorkspaces(data)
    } catch (err) {
      setError(err.message || 'Failed to load workspaces')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWorkspaces()
  }, [])

  const handleCreateWorkspace = async (e) => {
    e.preventDefault()
    if (!newWorkspaceName.trim()) return

    setIsCreating(true)
    setError('')
    try {
      await createWorkspace(newWorkspaceName.trim())
      setNewWorkspaceName('')
      await loadWorkspaces()
    } catch (err) {
      setError(err.message || 'Failed to create workspace')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-10 sm:py-14">
      <section className="mx-auto max-w-2xl">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
              <CalendarDays size={16} />
              <span>Today, {formatToday()}</span>
            </div>
            <h1 className="text-3xl font-medium tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-4xl">
              My Workspaces
            </h1>
          </div>
        </header>

        <form onSubmit={handleCreateWorkspace} className="mt-8 flex gap-3">
          <input
            type="text"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            placeholder="New workspace name"
            disabled={isCreating}
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-normal text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700 dark:focus:ring-zinc-700"
          />
          <button
            type="submit"
            disabled={isCreating || !newWorkspaceName.trim()}
            className="flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            <Plus size={18} />
            <span>Create</span>
          </button>
        </form>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-500/15 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8">
          {isLoading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white/90 px-4 py-8 text-center text-sm font-medium text-zinc-500 shadow-md shadow-zinc-200/70 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400 dark:shadow-none">
              Loading workspaces...
            </div>
          ) : workspaces.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white/90 px-4 py-12 text-center shadow-md shadow-zinc-200/70 dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Layout size={24} className="text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No workspaces yet</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Create your first workspace to start managing tasks.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => onNavigate('workspace', { id: workspace.id })}
                  className="group flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-950">
                      <Layout size={20} className="text-zinc-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{workspace.name}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Click to view tasks</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-zinc-300 transition-transform group-hover:translate-x-1 dark:text-zinc-700" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
