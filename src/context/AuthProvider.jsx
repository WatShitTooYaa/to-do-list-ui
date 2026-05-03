import { useMemo, useState } from 'react'
import { AuthContext } from './authContextValue'
import {
  login as loginService,
  register as registerService,
} from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

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

  const logout = () => {
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, login, register, updateProfile, logout }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
