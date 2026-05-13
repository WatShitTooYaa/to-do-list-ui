const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const SESSION_COOKIE_NAME = 'has_session'

export const hasSessionCookie = () => {
  if (typeof document === 'undefined') {
    return false
  }

  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie.startsWith(`${SESSION_COOKIE_NAME}=`))
}

const listeners = new Set()
export const onAuthEvent = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const emitAuthEvent = (type) => {
  listeners.forEach((listener) => listener(type))
}

let accessToken = null
let refreshPromise = null

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export const setAccessToken = (token) => {
  accessToken = token ?? null
}

export const getAccessToken = () => accessToken

const parseResponse = async (response) => {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const getErrorMessage = (data, fallback, status) => {
  // Hide raw technical errors from server (500+)
  if (status >= 500) {
    return 'Terjadi kesalahan pada sistem, silakan coba lagi'
  }

  if (!data) {
    return fallback
  }

  if (typeof data === 'string') {
    return data
  }

  return data.message ?? data.error ?? fallback
}

export const extractAccessToken = (data) =>
  data?.accessToken ??
  data?.access_token ??
  data?.token ??
  data?.data?.accessToken ??
  data?.data?.access_token ??
  data?.data?.token ??
  null

export const request = async (path, options = {}) => {
  const {
    auth = true,
    retry = true,
    headers,
    body,
    ...requestOptions
  } = options

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  if (auth && accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      credentials: 'include',
      ...requestOptions,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    if (response.status === 401 && auth && retry) {
      const refreshed = await refreshAccessToken()

      if (refreshed) {
        return request(path, { ...options, retry: false })
      }
    }

    const data = await parseResponse(response)

    if (!response.ok) {
      const isAuthPath = path.startsWith('/api/auth/')

      if (response.status === 401 && !isAuthPath && auth) {
        emitAuthEvent('unauthorized')
      } else if (response.status === 403 && auth) {
        emitAuthEvent('forbidden')
      } else if (response.status === 404 && auth && path.includes('/api/v1/workspaces/')) {
        emitAuthEvent('notFound')
      }

      throw new ApiError(
        getErrorMessage(data, `Request failed with status ${response.status}`, response.status),
        response.status,
        data,
      )
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      'Tidak dapat terhubung ke server. Silakan periksa koneksi Anda.',
      0,
    )
  }
}

export const refreshAccessToken = async () => {
  if (!hasSessionCookie()) {
    setAccessToken(null)
    return false
  }

  if (!refreshPromise) {
    refreshPromise = request('/api/auth/refresh', {
      method: 'POST',
      auth: false,
      retry: false,
    })
      .then((data) => {
        const nextToken = extractAccessToken(data)
        setAccessToken(nextToken)
        return true
      })
      .catch(() => {
        setAccessToken(null)
        return false
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}
