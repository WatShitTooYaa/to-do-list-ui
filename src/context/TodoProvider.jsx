import { useMemo, useState } from 'react'
import { TodoContext } from './todoContextValue'

const initialTasks = [
  {
    id: 1,
    title: 'Review product roadmap',
    completed: false,
    deadline: '2026-05-07',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Send weekly design notes',
    completed: true,
    deadline: '2026-05-03',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Prepare client handoff',
    completed: false,
    deadline: '',
    priority: 'low',
  },
]

export function TodoProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks)

  const addTask = ({ title, deadline = '', priority = 'medium' }) => {
    setTasks((currentTasks) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        deadline,
        priority,
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

  const updateTask = (taskId, updates) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...(typeof updates === 'string' ? { title: updates } : updates),
            }
          : task,
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
