import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Check, Edit3, Trash2, X, Loader2, User } from 'lucide-react'
import { useState } from 'react'
import { formatDeadline, isOverdue } from '../../utils/date'

const priorityStyles = {
  low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  high: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300',
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const getPriority = (priority) =>
  ['low', 'medium', 'high'].includes(priority) ? priority : 'medium'

export function TodoItem({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const [draftPriority, setDraftPriority] = useState(getPriority(task.priority))
  const [isProcessingToggle, setIsProcessingToggle] = useState(false)
  const [isProcessingDelete, setIsProcessingDelete] = useState(false)
  const deadlineLabel = formatDeadline(task.deadline)
  const overdue = isOverdue(task.deadline, task.completed)
  const priority = getPriority(task.priority)

  const finishEditing = () => {
    const title = draft.trim()

    if (title) {
      onUpdate(task.id, { title, priority: draftPriority })
    } else {
      setDraft(task.title)
      setDraftPriority(priority)
    }

    setIsEditing(false)
  }

  const cancelEditing = () => {
    setDraft(task.title)
    setDraftPriority(priority)
    setIsEditing(false)
  }

  const handleToggle = async () => {
    setIsProcessingToggle(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 350))
      await onToggle(task.id)
    } finally {
      setIsProcessingToggle(false)
    }
  }

  const handleDelete = async () => {
    setIsProcessingDelete(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 350))
      await onDelete(task.id)
    } finally {
      setIsProcessingDelete(false)
    }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="group flex min-h-14 items-center gap-3 rounded-xl px-2 py-3 transition-colors duration-200 hover:bg-white/70 dark:hover:bg-zinc-800/70"
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={isProcessingToggle || isProcessingDelete}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-200 ${
          task.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-zinc-300 bg-white text-transparent hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isProcessingToggle ? (
          <Loader2 size={14} className="animate-spin text-zinc-400 dark:text-zinc-500" strokeWidth={2.5} />
        ) : (
          <Check size={14} strokeWidth={2.5} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-2 sm:grid-cols-[1fr_7rem]"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  finishEditing()
                }
              }}
            >
              <input
                value={draft}
                autoFocus
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    finishEditing()
                  }

                  if (event.key === 'Escape') {
                    cancelEditing()
                  }
                }}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[15px] font-normal text-zinc-900 shadow-sm transition-all duration-200 focus:border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-none dark:focus:border-zinc-600 dark:focus:ring-zinc-700"
              />
              <select
                value={draftPriority}
                onChange={(event) => setDraftPriority(event.target.value)}
                aria-label="Edit task priority"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm outline-none transition-all duration-200 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:shadow-none dark:focus:border-zinc-600 dark:focus:ring-zinc-700"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </motion.div>
          ) : (
            <motion.div
              key="task-content"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-w-0"
            >
              <p
                className={`truncate text-[15px] transition-colors duration-200 ${
                  task.completed
                    ? 'text-zinc-400 line-through decoration-zinc-300 dark:text-zinc-500 dark:decoration-zinc-700'
                    : 'text-zinc-800 dark:text-zinc-100'
                }`}
              >
                {task.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium">
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    task.completed
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                  }`}
                >
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
                {overdue && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white dark:bg-red-500/20 dark:text-red-300">
                    Overdue
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
                    overdue
                      ? 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300'
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  <CalendarDays size={12} />
                  {deadlineLabel}
                </span>
                <span className={`rounded-full px-2 py-0.5 capitalize ${priorityStyles[priority]}`}>
                  {priority}
                </span>
                <span className="inline-flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
                  <User size={12} />
                  <span>{task.creatorName}</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isEditing && (
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus:ring-zinc-700"
          >
            <Edit3 size={15} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isProcessingToggle || isProcessingDelete}
            aria-label="Delete task"
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-200 dark:hover:bg-red-500/15 dark:hover:text-red-300 dark:focus:ring-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessingDelete ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          </button>
        </div>
      )}

      {isEditing && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={cancelEditing}
          aria-label="Cancel edit"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus:ring-zinc-700"
        >
          <X size={15} />
        </button>
      )}
    </motion.li>
  )
}
