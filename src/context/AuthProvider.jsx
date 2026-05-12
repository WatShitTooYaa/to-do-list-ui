import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContextValue'
import {
  login as loginService,
  logout as logoutService,
  refreshSession,
  register as registerService,
} from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let isMounted = true

    refreshSession()
      .then((sessionUser) => {
        if (isMounted) {
          setUser(sessionUser)
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthReady(true)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback(async (credentials) => {
    setAuthError('')
    const nextUser = await loginService(credentials)
    setUser(nextUser)
    return nextUser
  }, [])

  const register = useCallback(async (payload) => {
    setAuthError('')
    const nextUser = await registerService(payload)
    setUser(nextUser)
    return nextUser
  }, [])

  const updateProfile = useCallback((profile) => {
    setUser((currentUser) => ({ ...currentUser, ...profile }))
  }, [])

  const logout = useCallback(async () => {
    setAuthError('')

    try {
      await logoutService()
    } catch {
      // Local logout still wins if backend session is already gone.
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthReady,
      authError,
      setAuthError,
      login,
      register,
      updateProfile,
      logout,
    }),
    [authError, isAuthReady, user, login, register, updateProfile, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
