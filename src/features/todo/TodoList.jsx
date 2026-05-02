import { AnimatePresence, motion } from 'framer-motion'
import { ListChecks } from 'lucide-react'
import { TodoItem } from './TodoItem'

export function TodoList({ tasks, onToggle, onDelete, onUpdate }) {
  return (
    <AnimatePresence mode="popLayout">
      {tasks.length > 0 ? (
        <motion.ul layout className="space-y-1">
          {tasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </motion.ul>
      ) : (
        <EmptyState key="empty" />
      )}
    </AnimatePresence>
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
