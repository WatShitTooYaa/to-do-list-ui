import { CalendarDays, Check, CirclePlus, Loader2 } from 'lucide-react'
import { useState } from 'react'

const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
]

export function TodoInput({ onAdd }) {
    const [value, setValue] = useState('')
    const [deadline, setDeadline] = useState('')
    const [priority, setPriority] = useState('medium')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const title = value.trim()

        if (!title || !deadline) {
            return
        }

        setIsSubmitting(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 350))
            await onAdd({ title, deadline, priority })
            setValue('')
            setDeadline('')
            setPriority('medium')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-12 flex-1 items-center gap-3 rounded-xl border border-zinc-200/80 bg-white/80 px-4 shadow-sm shadow-zinc-200/60 transition-all duration-200 focus-within:border-zinc-300 focus-within:bg-white focus-within:ring-1 focus-within:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none dark:focus-within:border-zinc-700 dark:focus-within:bg-zinc-900 dark:focus-within:ring-zinc-700">
                <CirclePlus size={18} className="shrink-0 text-zinc-400" />
                <input
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="Add a task"
                    className="h-full w-full bg-transparent text-[15px] font-normal text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
            </div>
            <label className="flex h-12 items-center gap-3 rounded-xl border border-zinc-200/80 bg-white/80 px-4 text-sm text-zinc-500 shadow-sm shadow-zinc-200/60 transition-all duration-200 focus-within:border-zinc-300 focus-within:bg-white focus-within:ring-1 focus-within:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400 dark:shadow-none dark:focus-within:border-zinc-700 dark:focus-within:bg-zinc-900 dark:focus-within:ring-zinc-700 sm:w-44">
                <CalendarDays size={18} className="shrink-0 text-zinc-400" />
                <input
                    type="date"
                    value={deadline}
                    onChange={(event) => setDeadline(event.target.value)}
                    aria-label="Task deadline"
                    className="h-full w-full bg-transparent text-[14px] font-normal text-zinc-700 focus:outline-none dark:text-zinc-200"
                />
            </label>
            <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                aria-label="Task priority"
                className="h-12 rounded-xl border border-zinc-200/80 bg-white/80 px-3 text-sm font-medium text-zinc-700 shadow-sm shadow-zinc-200/60 outline-none transition-all duration-200 focus:border-zinc-300 focus:bg-white focus:ring-1 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200 dark:shadow-none dark:focus:border-zinc-700 dark:focus:bg-zinc-900 dark:focus:ring-zinc-700 sm:w-32"
            >
                {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <button
                type="submit"
                aria-label="Add task"
                disabled={isSubmitting}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-zinc-950 text-white shadow-sm shadow-zinc-300 transition-all duration-200 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:shadow-none dark:hover:bg-zinc-200 dark:focus:ring-zinc-700 dark:focus:ring-offset-zinc-950"
            >
                {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Check size={18} />
                )}
            </button>
        </form>
    )
}
