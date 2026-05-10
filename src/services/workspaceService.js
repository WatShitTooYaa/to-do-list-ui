import { request } from './api'

export const getWorkspaces = async () => {
    const data = await request('/api/v1/workspaces', {
        credentials: 'include',
    })

    // Assuming backend returns { data: [...] } or just [...]
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data
    return []
}

export const createWorkspace = async (name) => {
    const data = await request('/api/v1/workspaces', {
        method: 'POST',
        credentials: 'include',
        body: { name },
    })

    return data?.data ?? data
}
