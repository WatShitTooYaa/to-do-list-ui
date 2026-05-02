import { CheckCircle2, CircleDot, ListTodo } from 'lucide-react'

const statsConfig = [
  { key: 'total', label: 'Total', icon: ListTodo },
  { key: 'open', label: 'Open', icon: CircleDot },
  { key: 'completed', label: 'Done', icon: CheckCircle2 },
]

export function TodoStats({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {statsConfig.map((item) => {
        const Icon = item.icon

        return (
          <div
            key={item.key}
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-zinc-500">{item.label}</span>
              <Icon size={17} className="text-zinc-400" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-zinc-950">
              {stats[item.key]}
            </p>
          </div>
        )
      })}
    </div>
  )
}
