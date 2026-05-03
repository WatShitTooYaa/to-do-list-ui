import { useCallback, useEffect, useMemo, useState } from 'react'
import { TodoContext } from './todoContextValue'
import { useAuth } from './useAuth'
import {
  createTask,
  deleteTask as deleteTaskService,
  getTasks,
  updateTask as updateTaskService,
} from '../services/taskService'

export function TodoProvider({ children }) {
  const { user, isAuthReady } = useAuth()
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([])
      return
    }

    setIsLoading(true)
    setError('')

    try {
      setTasks(await getTasks())
    } catch (currentError) {
      setError(currentError.message)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (isAuthReady) {
      Promise.resolve().then(loadTasks)
    }
  }, [isAuthReady, loadTasks])

  const addTask = useCallback(async ({ title, deadline = '', priority = 'medium' }) => {
    setError('')

    try {
      const createdTask = await createTask({ title, deadline, priority })

      if (createdTask) {
        setTasks((currentTasks) => [createdTask, ...currentTasks])
      } else {
        await loadTasks()
      }
    } catch (currentError) {
      setError(currentError.message)
      throw currentError
    }
  }, [loadTasks])

  const deleteTask = useCallback(async (taskId) => {
    setError('')

    try {
      await deleteTaskService(taskId)
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      )
    } catch (currentError) {
      setError(currentError.message)
    }
  }, [])

  const updateTask = useCallback(async (taskId, updates) => {
    setError('')
    const nextUpdates = typeof updates === 'string' ? { title: updates } : updates

    try {
      const updatedTask = await updateTaskService(taskId, nextUpdates)
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? { ...task, ...nextUpdates, ...(updatedTask ?? {}) }
            : task,
        ),
      )
    } catch (currentError) {
      setError(currentError.message)
    }
  }, [])

  const toggleTask = useCallback(
    async (taskId) => {
      const task = tasks.find((currentTask) => currentTask.id === taskId)

      if (!task) {
        return
      }

      await updateTask(taskId, { completed: !task.completed })
    },
    [tasks, updateTask],
  )

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
    () => ({
      tasks,
      stats,
      isLoading,
      error,
      loadTasks,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
    }),
    [
      addTask,
      deleteTask,
      error,
      isLoading,
      loadTasks,
      tasks,
      stats,
      toggleTask,
      updateTask,
    ],
  )

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}
