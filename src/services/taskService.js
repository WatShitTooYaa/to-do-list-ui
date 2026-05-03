import { request } from './api'

const normalizePriority = (priority) =>
  ['low', 'medium', 'high'].includes(priority) ? priority : 'medium'

const toDateInputValue = (deadline) => {
  if (!deadline) {
    return ''
  }

  if (typeof deadline === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    return deadline
  }

  const date = new Date(deadline)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString().slice(0, 10)
}

const toApiDeadline = (deadline) => {
  if (!deadline) {
    return null
  }

  return new Date(`${deadline}T23:59:59`).toISOString()
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

const unwrapTask = (data) => data?.data?.task ?? data?.task ?? data?.data ?? data

export const normalizeTask = (task) => {
  if (!task) {
    return null
  }

  return {
    id: task.id ?? task._id,
    title: task.title ?? '',
    completed: Boolean(task.completed ?? task.isCompleted),
    deadline: toDateInputValue(task.deadline),
    priority: normalizePriority(task.priority),
  }
}

export const getTasks = async () => {
  const data = await request('/api/v1/tasks')
  return unwrapTasks(data).map(normalizeTask).filter(Boolean)
}

export const createTask = async ({ title, deadline = '', priority = 'medium' }) => {
  const data = await request('/api/v1/tasks', {
    method: 'POST',
    body: {
      title,
      isCompleted: false,
      deadline: toApiDeadline(deadline),
      priority,
    },
  })

  return normalizeTask(unwrapTask(data))
}

export const updateTask = async (taskId, updates) => {
  const body = {}

  if (updates.title !== undefined) {
    body.title = updates.title
  }

  if (updates.completed !== undefined) {
    body.isCompleted = updates.completed
  }

  if (updates.deadline !== undefined) {
    body.deadline = toApiDeadline(updates.deadline)
  }

  if (updates.priority !== undefined) {
    body.priority = updates.priority
  }

  const data = await request(`/api/v1/tasks/${taskId}`, {
    method: 'PATCH',
    body,
  })

  return normalizeTask(unwrapTask(data))
}

export const deleteTask = (taskId) =>
  request(`/api/v1/tasks/${taskId}`, {
    method: 'DELETE',
  })
