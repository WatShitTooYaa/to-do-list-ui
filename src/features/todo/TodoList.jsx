import { AnimatePresence, motion } from 'framer-motion'
import { ListChecks } from 'lucide-react'
import { TodoItem } from './TodoItem'

export function TodoList({ tasks, onToggle, onDelete, onUpdate }) {
    return (
        <section className="rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-md shadow-zinc-200/70 transition-colors dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none sm:p-4">
            <AnimatePresence mode="popLayout">
                {tasks.length > 0 ? (
                    <motion.ul layout className="space-y-1">
                        {tasks.map((task, index) => (
                            <TodoItem
                                key={task.id ?? task._id ?? `${task.title}-${task.deadline}-${task.priority}-${index}`}
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
        </section>
    )
}

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-200 bg-white/40 px-6 py-12 text-center dark:border-zinc-800 dark:bg-zinc-950/40"
        >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                <ListChecks size={22} />
            </div>
            <p className="mt-5 text-[15px] font-medium text-zinc-800 dark:text-zinc-100">
                All clear. Enjoy your day!
            </p>
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">Nothing needs your attention.</p>
        </motion.div>
    )
}
