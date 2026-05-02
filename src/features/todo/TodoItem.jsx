import { AnimatePresence, motion } from 'framer-motion'
import { Check, Edit3, Trash2, X } from 'lucide-react'
import { useState } from 'react'

export function TodoItem({ task, onToggle, onDelete, onUpdate }) {
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
        <AnimatePresence mode="wait" initial={false}>
          {isEditing ? (
            <motion.input
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              key="title"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`truncate text-[15px] transition-colors duration-200 ${
                task.completed
                  ? 'text-zinc-400 line-through decoration-zinc-300'
                  : 'text-zinc-800'
              }`}
            >
              {task.title}
            </motion.p>
          )}
        </AnimatePresence>
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
