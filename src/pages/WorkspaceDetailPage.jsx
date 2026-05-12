import { CalendarDays, Clock3, Search, SlidersHorizontal, ArrowLeft, UserPlus, X, Loader2 } from 'lucide-react'
import { addWorkspaceMember, getWorkspaceMembers } from '../services/workspaceService'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { TodoInput } from '../features/todo/TodoInput'
import { TodoList } from '../features/todo/TodoList'
import { TodoStats } from '../features/todo/TodoStats'
import { useTodos } from '../context/useTodos'
import { useAuth } from '../context/useAuth'
import { formatToday } from '../utils/date'

const TASKS_PER_PAGE = 10

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
    const { user } = useAuth()

    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortByDeadline, setSortByDeadline] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    // Add Member states
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [memberEmail, setMemberEmail] = useState('')
    const [memberRole, setMemberRole] = useState('watcher')
    const [isSubmittingMember, setIsSubmittingMember] = useState(false)
    const [memberError, setMemberError] = useState('')

    const [workspaceMembers, setWorkspaceMembers] = useState([])
    const currentMember = useMemo(
        () =>
            workspaceMembers?.find(
                (member) => String(member.userId) === String(user?.id),
            ),
        [workspaceMembers, user?.id],
    )
    const userRole = currentMember?.role ?? null

    useEffect(() => {
        if (workspaceId) {
            loadTasks(workspaceId)
            getWorkspaceMembers(workspaceId)
                .then(setWorkspaceMembers)
                .catch(() => { })
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

    const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE)
    const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages))
    const startIndex = (validCurrentPage - 1) * TASKS_PER_PAGE
    const pagedTasks = filteredTasks.slice(startIndex, startIndex + TASKS_PER_PAGE)
    const hasActiveFilters = searchQuery.trim().length > 0 || statusFilter !== 'all'

    const handleAddTask = (taskData) => addTask({ ...taskData, workspaceId })
    const handleToggleTask = (taskId) => toggleTask(taskId, workspaceId)
    const handleDeleteTask = (taskId) => deleteTask(taskId, workspaceId)
    const handleUpdateTask = (taskId, updates) => updateTask(taskId, updates, workspaceId)

    const handleAddMember = async (e) => {
        e.preventDefault()
        if (!memberEmail.trim()) return

        setIsSubmittingMember(true)
        setMemberError('')
        try {
            await addWorkspaceMember(workspaceId, { email: memberEmail, role: memberRole })
            setMemberEmail('')
            setIsAddMemberOpen(false)
            // Optional: show success toast/alert
        } catch (err) {
            setMemberError(err.message || 'Failed to add member')
        } finally {
            setIsSubmittingMember(false)
        }
    }

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
                            {workspaceMembers?.name || 'Workspace Tasks'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {userRole === 'owner' && (
                            <button
                                onClick={() => setIsAddMemberOpen(true)}
                                className="flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            >
                                <UserPlus size={15} />
                                <span>Add Member</span>
                            </button>
                        )}
                        <div className="w-fit rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:shadow-none">
                            {stats.open} open
                        </div>
                    </div>
                </header>

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
                                    <div className="grid gap-1.5">
                                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            User Email
                                        </label>
                                        <input
                                            type="email"
                                            value={memberEmail}
                                            onChange={(e) => setMemberEmail(e.target.value)}
                                            placeholder="user@example.com"
                                            required
                                            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-zinc-700"
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            Role
                                        </label>
                                        <select
                                            value={memberRole}
                                            onChange={(e) => setMemberRole(e.target.value)}
                                            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-zinc-700"
                                        >
                                            <option value="editor">Editor</option>
                                            <option value="watcher">Watcher</option>
                                        </select>
                                    </div>
                                    {memberError && (
                                        <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                            {memberError}
                                        </p>
                                    )}
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddMemberOpen(false)}
                                            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingMember}
                                            className="flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                                        >
                                            {isSubmittingMember ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    <span>Adding...</span>
                                                </>
                                            ) : (
                                                <span>Add Member</span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

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
                                onChange={(event) => {
                                    setSearchQuery(event.target.value)
                                    setCurrentPage(1)
                                }}
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
                                        onClick={() => {
                                            setStatusFilter(filter.value)
                                            setCurrentPage(1)
                                        }}
                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
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
                                onChange={(event) => {
                                    setSortByDeadline(event.target.checked)
                                    setCurrentPage(1)
                                }}
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
                            tasks={pagedTasks}
                            startIndex={startIndex}
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

                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={validCurrentPage === 1}
                                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Prev
                            </button>
                            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                Page {validCurrentPage} of {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={validCurrentPage === totalPages}
                                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
