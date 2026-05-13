export const mergeUpdatedTask = (task, nextUpdates, updatedTask) => ({
    ...task,
    ...nextUpdates,
    ...(updatedTask?.id ? updatedTask : {}),
})
