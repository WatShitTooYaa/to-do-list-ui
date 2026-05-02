import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays,
  Check,
  CirclePlus,
  Edit3,
  ListChecks,
  Trash2,
  X,
} from 'lucide-react'
import './App.css'

const initialTasks = [
  {
    id: 1,
    title: 'Review product roadmap',
    completed: false,
  },
  {
    id: 2,
    title: 'Send weekly design notes',
    completed: true,
  },
  {
    id: 3,
    title: 'Prepare client handoff',
    completed: false,
  },
]

const formatToday = () =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
  }).format(new Date())

function TaskInput({ onAdd }) {
  const [value, setValue] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const title = value.trim()

    if (!title) {
      return
    }

    onAdd(title)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex items-center gap-3">
      <div className="flex h-12 flex-1 items-center gap-3 rounded-xl border border-zinc-200/80 bg-white/80 px-4 shadow-sm shadow-zinc-200/60 transition-all duration-200 focus-within:border-zinc-300 focus-within:bg-white focus-within:ring-1 focus-within:ring-zinc-300">
        <CirclePlus size={18} className="shrink-0 text-zinc-400" />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Add a task"
          className="h-full w-full bg-transparent text-[15px] font-normal text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        aria-label="Add task"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-zinc-950 text-white shadow-sm shadow-zinc-300 transition-all duration-200 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2"
      >
        <Check size={18} />
      </button>
    </form>
  )
}

function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)

  const finishEditing = () => {
    const title = draft.trim()

    if (title) {
      onUpdate(task.id, title)
    } else {
      setDraft(task.title)
    }

    setIsEditing(false)
  }

  const cancelEditing = () => {
    setDraft(task.title)
    setIsEditing(false)
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="group flex min-h-14 items-center gap-3 rounded-xl px-2 py-3 transition-colors duration-200 hover:bg-white/70"
    >
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-200 ${
          task.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-zinc-300 bg-white text-transparent hover:border-zinc-400'
        }`}
      >
        <Check size={14} strokeWidth={2.5} />
      </button>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            value={draft}
            autoFocus
            onChange={(event) => setDraft(event.target.value)}
            onBlur={finishEditing}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                finishEditing()
              }

              if (event.key === 'Escape') {
                cancelEditing()
              }
            }}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[15px] font-normal text-zinc-900 shadow-sm transition-all duration-200 focus:border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-300"
          />
        ) : (
          <motion.p
            layout
            className={`truncate text-[15px] transition-colors duration-200 ${
              task.completed
                ? 'text-zinc-400 line-through decoration-zinc-300'
                : 'text-zinc-800'
            }`}
          >
            {task.title}
          </motion.p>
        )}
      </div>

      {!isEditing && (
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-300"
          >
            <Edit3 size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-200"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}

      {isEditing && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={cancelEditing}
          aria-label="Cancel edit"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-300"
        >
          <X size={15} />
        </button>
      )}
    </motion.li>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-zinc-200 bg-white/40 px-6 py-12 text-center"
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
        <ListChecks size={22} />
      </div>
      <p className="mt-5 text-[15px] font-medium text-zinc-800">
        All clear. Enjoy your day!
      </p>
      <p className="mt-1 text-sm text-zinc-400">Nothing needs your attention.</p>
    </motion.div>
  )
}

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const remainingTasks = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks],
  )

  const addTask = (title) => {
    setTasks((currentTasks) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
      },
      ...currentTasks,
    ])
  }

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const deleteTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
  }

  const updateTask = (taskId, title) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, title } : task,
      ),
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-14 text-zinc-900 sm:py-20">
      <section className="mx-auto max-w-2xl">
        <header className="flex items-start justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-normal text-zinc-500">
              <CalendarDays size={16} />
              <span>Today, {formatToday()}</span>
            </div>
            <h1 className="text-3xl font-medium tracking-normal text-zinc-950 sm:text-4xl">
              Focus list
            </h1>
          </div>

          <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-500 shadow-sm">
            {remainingTasks} open
          </div>
        </header>

        <TaskInput onAdd={addTask} />

        <div className="mt-8">
          <AnimatePresence mode="popLayout">
            {tasks.length > 0 ? (
              <motion.ul layout className="space-y-1">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onUpdate={updateTask}
                  />
                ))}
              </motion.ul>
            ) : (
              <EmptyState key="empty" />
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}

export default App
