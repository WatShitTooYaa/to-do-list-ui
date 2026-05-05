import { extractAccessToken, request, setAccessToken } from './api'

const extractUser = (data, fallback = {}) => {
  const user = data?.user ?? data?.data?.user ?? data?.data ?? null

  if (user && typeof user === 'object' && !extractAccessToken(user)) {
    return {
      name: user.name ?? user.username ?? fallback.name ?? fallback.email,
      username: user.username ?? user.name ?? fallback.name,
      email: user.email ?? fallback.email,
      role: user.role ?? 'Member',
    }
  }

  if (fallback.email || fallback.name) {
    return {
      name: fallback.name ?? fallback.email,
      username: fallback.name,
      email: fallback.email,
      role: 'Member',
    }
  }

  return null
}

export const login = async ({ email, password }) => {
  const data = await request('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  })
  const token = extractAccessToken(data)

  setAccessToken(token)

  return extractUser(data, { email })
}

export const register = async ({ name, email, password }) => {
  await request('/api/auth/register', {
    method: 'POST',
    auth: false,
    body: {
      email,
      username: name,
      password,
    },
  })

  return null
}

export const refreshSession = async () => {
  try {
    const data = await request('/api/auth/refresh', {
      method: 'POST',
      auth: false,
      retry: false,
    })
    const token = extractAccessToken(data)

    setAccessToken(token)

    return extractUser(data)
  } catch {
    return null
  }
}

export const logout = async () => {
  try {
    await request('/api/auth/logout', {
      method: 'DELETE',
      retry: false,
    })
  } finally {
    setAccessToken(null)
  }
}
