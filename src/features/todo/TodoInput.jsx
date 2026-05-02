import { Check, CirclePlus } from 'lucide-react'
import { useState } from 'react'

export function TodoInput({ onAdd }) {
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
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
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
