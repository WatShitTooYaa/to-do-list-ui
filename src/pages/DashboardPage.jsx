import { CalendarDays } from 'lucide-react'
import { TodoInput } from '../features/todo/TodoInput'
import { TodoList } from '../features/todo/TodoList'
import { TodoStats } from '../features/todo/TodoStats'
import { useTodos } from '../context/useTodos'
import { formatToday } from '../utils/date'

export function DashboardPage() {
  const { tasks, stats, addTask, toggleTask, deleteTask, updateTask } = useTodos()

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-10 sm:py-14">
      <section className="mx-auto max-w-2xl">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-normal text-zinc-500">
              <CalendarDays size={16} />
              <span>Today, {formatToday()}</span>
            </div>
            <h1 className="text-3xl font-medium tracking-normal text-zinc-950 sm:text-4xl">
              Focus list
            </h1>
          </div>

          <div className="w-fit rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-500 shadow-sm">
            {stats.open} open
          </div>
        </header>

        <div className="mt-8">
          <TodoStats stats={stats} />
        </div>

        <div className="mt-8">
          <TodoInput onAdd={addTask} />
        </div>

        <div className="mt-8">
          <TodoList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </div>
      </section>
    </main>
  )
}
