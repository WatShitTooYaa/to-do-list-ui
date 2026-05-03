import { useMemo, useState } from 'react'
import { TodoContext } from './todoContextValue'

const initialTasks = [
  {
    id: 1,
    title: 'Review product roadmap',
    completed: false,
    deadline: '2026-05-07',
  },
  {
    id: 2,
    title: 'Send weekly design notes',
    completed: true,
    deadline: '2026-05-03',
  },
  {
    id: 3,
    title: 'Prepare client handoff',
    completed: false,
    deadline: '',
  },
]

export function TodoProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks)

  const addTask = ({ title, deadline = '' }) => {
    setTasks((currentTasks) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        deadline,
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

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length
    const open = tasks.length - completed

    return {
      total: tasks.length,
      completed,
      open,
    }
  }, [tasks])

  const value = useMemo(
    () => ({ tasks, stats, addTask, toggleTask, deleteTask, updateTask }),
    [tasks, stats],
  )

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}
