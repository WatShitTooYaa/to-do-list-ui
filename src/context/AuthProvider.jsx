import { useMemo, useState } from 'react'
import { AuthContext } from './authContextValue'
import {
  login as loginService,
  mockUser,
  register as registerService,
} from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(mockUser)

  const login = async (credentials) => {
    const nextUser = await loginService(credentials)
    setUser(nextUser)
    return nextUser
  }

  const register = async (payload) => {
    const nextUser = await registerService(payload)
    setUser(nextUser)
    return nextUser
  }

  const updateProfile = (profile) => {
    setUser((currentUser) => ({ ...currentUser, ...profile }))
  }

  const value = useMemo(
    () => ({ user, login, register, updateProfile }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
