import { CalendarDays, Clock3, Search, SlidersHorizontal, ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { TodoInput } from '../features/todo/TodoInput'
import { TodoList } from '../features/todo/TodoList'
import { TodoStats } from '../features/todo/TodoStats'
import { useTodos } from '../context/useTodos'
import { formatToday } from '../utils/date'

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
]

const getDeadlineScore = (task) => {
  if (!task.deadline) {
    return Number.POSITIVE_INFINITY
  }

  const deadlineDate = new Date(`${task.deadline}T00:00:00`)

  if (Number.isNaN(deadlineDate.getTime())) {
    return Number.POSITIVE_INFINITY
  }

  return deadlineDate.getTime()
}

const compareByDeadline = (leftTask, rightTask) => {
  const leftScore = getDeadlineScore(leftTask)
  const rightScore = getDeadlineScore(rightTask)

  if (leftScore !== rightScore) {
    return leftScore - rightScore
  }

  return leftTask.title.localeCompare(rightTask.title)
}

export function WorkspaceDetailPage({ workspaceId }) {
  const {
    tasks,
    stats,
    isLoading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    loadTasks,
  } = useTodos()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortByDeadline, setSortByDeadline] = useState(true)

  useEffect(() => {
    if (workspaceId) {
      loadTasks(workspaceId)
    }
  }, [workspaceId, loadTasks])

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const nextTasks = tasks.filter((task) => {
      const matchesQuery = query ? task.title.toLowerCase().includes(query) : true
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'completed'
            ? task.completed
            : !task.completed

      return matchesQuery && matchesStatus
    })

    if (!sortByDeadline) {
      return nextTasks
    }

    return [...nextTasks].sort(compareByDeadline)
  }, [searchQuery, sortByDeadline, statusFilter, tasks])

  const hasActiveFilters = searchQuery.trim().length > 0 || statusFilter !== 'all'

  const handleAddTask = (taskData) => addTask({ ...taskData, workspaceId })
  const handleToggleTask = (taskId) => toggleTask(taskId, workspaceId)
  const handleDeleteTask = (taskId) => deleteTask(taskId, workspaceId)
  const handleUpdateTask = (taskId, updates) => updateTask(taskId, updates, workspaceId)

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-10 sm:py-14">
      <section className="mx-auto max-w-2xl">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button 
              onClick={() => window.history.back()}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
            <div className="mb-3 flex items-center gap-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
              <CalendarDays size={16} />
              <span>Today, {formatToday()}</span>
            </div>
            <h1 className="text-3xl font-medium tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-4xl">
              Workspace Tasks
            </h1>
          </div>

          <div className="w-fit rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:shadow-none">
            {stats.open} open
          </div>
        </header>

        <div className="mt-8">
          <TodoStats stats={stats} />
        </div>

        <div className="mt-8">
          <TodoInput onAdd={handleAddTask} />
        </div>

        <div className="mt-5 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm shadow-zinc-200/60 transition-colors dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <SlidersHorizontal size={16} />
            <span>Filter tasks</span>
          </div>

          <div className="mt-4 grid gap-3">
            <label className="flex h-12 items-center gap-3 rounded-xl border border-zinc-200/80 bg-white/80 px-4 shadow-sm shadow-zinc-200/60 transition-all duration-200 focus-within:border-zinc-300 focus-within:bg-white focus-within:ring-1 focus-within:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/50 dark:shadow-none dark:focus-within:border-zinc-700 dark:focus-within:bg-zinc-900 dark:focus-within:ring-zinc-700">
              <Search size={18} className="shrink-0 text-zinc-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title"
                className="h-full w-full bg-transparent text-[15px] font-normal text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => {
                const isActive = statusFilter === filter.value

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setStatusFilter(filter.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-sm font-medium text-zinc-600 shadow-sm shadow-zinc-200/60 transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300 dark:shadow-none">
              <input
                type="checkbox"
                checked={sortByDeadline}
                onChange={(event) => setSortByDeadline(event.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-300 dark:border-zinc-700 dark:text-zinc-50 dark:focus:ring-zinc-700"
              />
              <Clock3 size={16} className="shrink-0 text-zinc-400" />
              <span>Soonest deadline first</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-500/15 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8">
          {isLoading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white/90 px-4 py-8 text-center text-sm font-medium text-zinc-500 shadow-md shadow-zinc-200/70 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400 dark:shadow-none">
              Loading tasks
            </div>
          ) : (
            <TodoList
              tasks={filteredTasks}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              emptyTitle={
                tasks.length > 0 && filteredTasks.length === 0
                  ? 'No tasks match filters'
                  : 'All clear. Enjoy your day!'
              }
              emptyDescription={
                tasks.length > 0 && filteredTasks.length === 0
                  ? hasActiveFilters
                    ? 'Try a different keyword, status, or sort option.'
                    : 'Nothing matches current view.'
                  : 'Nothing needs your attention.'
              }
            />
          )}
        </div>
      </section>
    </main>
  )
}
