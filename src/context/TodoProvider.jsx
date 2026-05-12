import { useCallback, useMemo, useState } from 'react'
import { TodoContext } from './todoContextValue'
import { useAuth } from './useAuth'
import {
    createTask,
    deleteTask as deleteTaskService,
    getTasks,
    updateTask as updateTaskService,
} from '../services/taskService'

export function TodoProvider({ children }) {
    const { user } = useAuth()
    const [tasks, setTasks] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const loadTasks = useCallback(async (workspaceId, showLoadingUI = true) => {
        if (!user) {
            setTasks([])
            return
        }

        if (showLoadingUI) setIsLoading(true)
        setError('')

        try {
            setTasks(await getTasks(workspaceId))
        } catch (currentError) {
            setError(currentError.message)
        } finally {
            if (showLoadingUI) setIsLoading(false)
        }
    }, [user])

    // useEffect(() => {
    //     if (isAuthReady) {
    //         Promise.resolve().then(loadTasks)
    //     }
    // }, [isAuthReady, loadTasks])

    const addTask = useCallback(async ({ title, deadline = '', workspaceId }) => {
        setError('')

        try {
            const createdTask = await createTask({ title, deadline, workspaceId })

            if (createdTask) {
                const optimisticTask = {
                    ...createdTask,
                    title: createdTask.title || title,
                    deadline: createdTask.deadline || deadline,
                    completed: false,
                    workspaceId: createdTask.workspaceId || workspaceId,
                }

                if (optimisticTask.id) {
                    setTasks((currentTasks) => [optimisticTask, ...currentTasks])
                }
            }

            await loadTasks(workspaceId, false)
        } catch (currentError) {
            setError(currentError.message)
            throw currentError
        }
    }, [loadTasks])

    const deleteTask = useCallback(async (taskId, workspaceId) => {
        setError('')

        try {
            await deleteTaskService(taskId, workspaceId)
            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== taskId),
            )
            await loadTasks(workspaceId, false)
        } catch (currentError) {
            setError(currentError.message)
        }
    }, [loadTasks])

    const updateTask = useCallback(async (taskId, updates, workspaceId) => {
        setError('')
        const nextUpdates = typeof updates === 'string' ? { title: updates } : updates

        try {
            const updatedTask = await updateTaskService(workspaceId, taskId, nextUpdates)
            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === taskId
                        ? { ...task, ...nextUpdates, ...(updatedTask ?? {}) }
                        : task,
                ),
            )
            await loadTasks(workspaceId, false)
        } catch (currentError) {
            setError(currentError.message)
        }
    }, [loadTasks])

    const toggleTask = useCallback(
        async (taskId, workspaceId) => {
            const task = tasks.find((currentTask) => currentTask.id === taskId)

            if (!task) {
                return
            }

            await updateTask(taskId, { completed: !task.completed }, workspaceId)
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
