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

export const addWorkspaceMember = async (workspaceId, { email, role }) => {
    const data = await request(`/api/v1/workspaces/${workspaceId}/members`, {
        method: 'POST',
        credentials: 'include',
        body: { email, role },
    })
    return data
}

export const getWorkspaceById = async (workspaceId) => {
    const data = await request(`/api/v1/workspaces/${workspaceId}`, {
        credentials: 'include',
    })
    return data?.data ?? data
}
