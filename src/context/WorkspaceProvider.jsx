import { useCallback, useEffect, useMemo, useState } from 'react'
import { WorkspaceContext } from './workspaceContextValue'
import { useAuth } from './useAuth'
import { getWorkspaces } from '../services/workspaceService'

export function WorkspaceProvider({ children }) {
  const { user, isAuthReady } = useAuth()
  const [workspaces, setWorkspaces] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  const loadWorkspaces = useCallback(async () => {
    if (!user) {
      setWorkspaces([])
      setIsLoaded(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await getWorkspaces()
      setWorkspaces(data)
      setIsLoaded(true)
    } catch (err) {
      setError(err.message || 'Failed to load workspaces')
      setIsLoaded(true)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!isAuthReady) return

    if (user) {
      Promise.resolve().then(() => loadWorkspaces())
    } else {
      Promise.resolve().then(() => {
        setWorkspaces([])
        setIsLoaded(false)
        setError('')
      })
    }
  }, [isAuthReady, user, loadWorkspaces])

  const reload = useCallback(() => {
    if (user) {
      loadWorkspaces()
    }
  }, [user, loadWorkspaces])

  const hasAccess = useCallback(
    (workspaceId) => {
      if (!workspaceId) return false
      return workspaces.some((w) => String(w.id) === String(workspaceId))
    },
    [workspaces]
  )

  const value = useMemo(
    () => ({
      workspaces,
      isLoading,
      error,
      isLoaded,
      reload,
      hasAccess,
    }),
    [workspaces, isLoading, error, isLoaded, reload, hasAccess]
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
