import { request } from './api'

const ENDPOINT_URL = '/api/v1/workspaces/'



const pickTaskTitle = (task) =>
    task?.title ?? task?.name ?? task?.taskName ?? task?.text ?? task?.description ?? ''

const pickTaskCompleted = (task) =>
    Boolean(
        task?.completed ??
        task?.isCompleted ??
        task?.is_completed ??
        task?.done ??
        task?.status === 'done',
    )

export const toDateInputValue = (deadline) => {
    if (!deadline) {
        return ''
    }

    if (typeof deadline === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
        return deadline
    }

    if (typeof deadline === 'string') {
        const match = deadline.match(/^(\d{4}-\d{2}-\d{2})/)
        if (match) {
            return match[1]
        }
    }

    const date = new Date(deadline)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    return date.toISOString().slice(0, 10)
}

export const toApiDeadline = (deadline) => {
    if (!deadline) {
        return null
    }

    return `${deadline}T23:59:59.000Z`
}

const unwrapTasks = (data) => {
    if (Array.isArray(data)) {
        return data
    }

    if (Array.isArray(data?.data)) {
        return data.data
    }

    if (Array.isArray(data?.tasks)) {
        return data.tasks
    }

    if (Array.isArray(data?.data?.tasks)) {
        return data.data.tasks
    }

    return []
}

export const unwrapTask = (data) => data?.data?.task ?? data?.task ?? data?.data ?? data

export const normalizeTask = (task) => {
    if (!task) {
        return null
    }

    return {
        id: task.id ?? task._id ?? task.taskId ?? task.uuid ?? null,
        title: pickTaskTitle(task),
        completed: pickTaskCompleted(task),
        deadline: toDateInputValue(task.deadline),
        creatorName: task?.user?.name || task?.creatorName || task?.createdBy || task?.username || 'Unknown',
    }
}

export const getTasks = async (workspaceId) => {
    const url = workspaceId ? `${ENDPOINT_URL}${workspaceId}/tasks` : '/api/v1/tasks'
    const data = await request(url, {
        credentials: 'include',
    })
    return unwrapTasks(data).map(normalizeTask).filter(Boolean)
}

export const createTask = async ({ title, deadline = '', workspaceId }) => {
    const url = workspaceId ? `${ENDPOINT_URL}${workspaceId}/tasks` : '/api/v1/tasks'
    const data = await request(url, {
        method: 'POST',
        credentials: 'include',
        body: {
            title,
            name: title,
            isCompleted: false,
            deadline: toApiDeadline(deadline),
            workspaceId,
        },
    })

    return normalizeTask(unwrapTask(data))
}

export const updateTask = async (workspaceId, taskId, updates) => {
    const body = {}

    if (updates.title !== undefined) {
        body.title = updates.title
        body.name = updates.title
    }

    if (updates.completed !== undefined) {
        body.isCompleted = updates.completed
        body.completed = updates.completed
    }

    if (updates.deadline !== undefined) {
        body.deadline = toApiDeadline(updates.deadline)
    }



    const data = await request(`${ENDPOINT_URL}${workspaceId}/tasks/${taskId}`, {
        method: 'PATCH',
        body,
    })

    return normalizeTask(unwrapTask(data))
}

export const deleteTask = (taskId, workspaceId) =>
    request(`${ENDPOINT_URL}${workspaceId}/tasks/${taskId}`, {
        method: 'DELETE',
    })
