export const formatToday = () =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
  }).format(new Date())

export const formatDeadline = (deadline) => {
  if (!deadline) {
    return 'No deadline'
  }

  const date = new Date(`${deadline}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return 'No deadline'
  }

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const isOverdue = (deadline, completed) => {
  if (!deadline || completed) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const deadlineDate = new Date(`${deadline}T00:00:00`)

  if (Number.isNaN(deadlineDate.getTime())) {
    return false
  }

  return deadlineDate < today
}
