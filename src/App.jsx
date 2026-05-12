import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppShell } from './components/AppShell'
import { AuthProvider } from './context/AuthProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { WorkspaceProvider } from './context/WorkspaceProvider'
import { TodoProvider } from './context/TodoProvider'
import { useAuth } from './context/useAuth'
import { useWorkspaces } from './context/useWorkspaces'
import { onAuthEvent } from './services/api'
import { DashboardPage } from './pages/DashboardPage'
import { WorkspaceDetailPage } from './pages/WorkspaceDetailPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'
import { NotFoundPage } from './pages/NotFoundPage'

const pagePaths = {
  landing: '/',
  about: '/about',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  profile: '/profile',
  notFound: '/not-found',
}

const getPageFromPath = (path) => {
  if (path === '/') return { page: 'landing' }
  if (path === '/login') return { page: 'login' }
  if (path === '/register') return { page: 'register' }
  if (path === '/dashboard') return { page: 'dashboard' }
  if (path === '/profile') return { page: 'profile' }
  if (path === '/about') return { page: 'about' }

  const workspaceMatch = path.match(/^\/workspace\/([^/]+)$/)
  if (workspaceMatch) {
    return { page: 'workspace', params: { id: workspaceMatch[1] } }
  }

  return { page: 'notFound' }
}

const getPathFromPage = (page, params = {}) => {
  if (page === 'workspace' && params.id) {
    return `/workspace/${params.id}`
  }
  return pagePaths[page] ?? pagePaths.landing
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WorkspaceProvider>
          <TodoProvider>
            <AppContent />
          </TodoProvider>
        </WorkspaceProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

function AppContent() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const { user, isAuthReady, logout } = useAuth()
  const { isLoaded: isWorkspacesLoaded, hasAccess } = useWorkspaces()
  const { page: rawPage, params: rawParams } = getPageFromPath(currentPath)

  const protectedRoutes = ['dashboard', 'profile', 'workspace']
  const authRoutes = ['login', 'register']

  let effectivePage = rawPage
  const effectiveParams = rawParams

  if (isAuthReady) {
    if (protectedRoutes.includes(rawPage) && !user) {
      effectivePage = 'login'
    } else if (authRoutes.includes(rawPage) && user) {
      effectivePage = 'dashboard'
    } else if (
      rawPage === 'workspace' &&
      user &&
      isWorkspacesLoaded &&
      !hasAccess(rawParams?.id)
    ) {
      effectivePage = 'notFound'
    }
  }

  const handleNavigate = useCallback(
    (page, params = {}) => {
      const nextPage = !user && ['dashboard', 'profile', 'workspace'].includes(page)
        ? 'login'
        : page
      const nextPath = getPathFromPage(nextPage, params)

      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath)
      }

      setCurrentPath(nextPath)
    },
    [user],
  )

  const handleAuthNavigate = useCallback((page) => {
    const nextPath = getPathFromPage(page)

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath)
    }

    setCurrentPath(nextPath)
  }, [])

  const replacePath = useCallback((page, params = {}) => {
    const nextPath = getPathFromPage(page, params)

    if (window.location.pathname !== nextPath) {
      window.history.replaceState({}, '', nextPath)
    }

    setCurrentPath(nextPath)
  }, [])

  useEffect(() => {
    return onAuthEvent((type) => {
      if (type === 'unauthorized') {
        logout().then(() => replacePath('login'))
      } else if (type === 'forbidden' || type === 'notFound') {
        replacePath('notFound')
      }
    })
  }, [logout, replacePath])

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const desiredPath = getPathFromPage(effectivePage, effectiveParams)
    if (window.location.pathname !== desiredPath) {
      window.history.replaceState({}, '', desiredPath)
    }
  }, [effectivePage, effectiveParams])

  const page = useMemo(() => {
    switch (effectivePage) {
      case 'login':
        return <LoginPage onNavigate={handleAuthNavigate} />
      case 'register':
        return <RegisterPage onNavigate={handleAuthNavigate} />
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />
      case 'workspace':
        if (!isWorkspacesLoaded) {
          return (
            <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          )
        }
        return <WorkspaceDetailPage workspaceId={effectiveParams?.id} onNavigate={handleNavigate} />
      case 'profile':
        return <ProfilePage />
      case 'about':
        return <LandingPage onNavigate={handleNavigate} />
      case 'notFound':
        return <NotFoundPage onNavigate={handleAuthNavigate} />
      default:
        return <LandingPage onNavigate={handleNavigate} />
    }
  }, [effectivePage, effectiveParams, isWorkspacesLoaded, handleAuthNavigate, handleNavigate])

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <AppShell currentPage={effectivePage} onNavigate={handleNavigate}>
      {page}
    </AppShell>
  )
}

export default App
