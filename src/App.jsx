import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppShell } from './components/AppShell'
import { AuthProvider } from './context/AuthProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { TodoProvider } from './context/TodoProvider'
import { useAuth } from './context/useAuth'
import { DashboardPage } from './pages/DashboardPage'
import { WorkspaceDetailPage } from './pages/WorkspaceDetailPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'

const pagePaths = {
  landing: '/',
  about: '/about',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  profile: '/profile',
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
  
  return { page: 'landing' }
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
        <TodoProvider>
          <AppContent />
        </TodoProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

function AppContent() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const { user, isAuthReady } = useAuth()
  const { page: currentPage, params: pageParams } = getPageFromPath(currentPath)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

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

  useEffect(() => {
    if (!isAuthReady) return

    const isProtectedRoute = ['dashboard', 'profile', 'workspace'].includes(currentPage)
    const isAuthRoute = ['login', 'register'].includes(currentPage)

    if (isProtectedRoute && !user) {
      Promise.resolve().then(() => handleAuthNavigate('login'))
    } else if (isAuthRoute && user) {
      Promise.resolve().then(() => handleAuthNavigate('dashboard'))
    }
  }, [isAuthReady, user, currentPage, handleAuthNavigate])

  const page = useMemo(() => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={handleAuthNavigate} />
      case 'register':
        return <RegisterPage onNavigate={handleAuthNavigate} />
      case 'dashboard':
        return user ? <DashboardPage onNavigate={handleNavigate} /> : <LoginPage onNavigate={handleAuthNavigate} />
      case 'workspace':
        return user ? (
          <WorkspaceDetailPage workspaceId={pageParams?.id} />
        ) : (
          <LoginPage onNavigate={handleAuthNavigate} />
        )
      case 'profile':
        return user ? <ProfilePage /> : <LoginPage onNavigate={handleAuthNavigate} />
      case 'about':
        return <LandingPage onNavigate={handleNavigate} />
      default:
        return <LandingPage onNavigate={handleNavigate} />
    }
  }, [currentPage, handleAuthNavigate, handleNavigate, user, pageParams])

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <AppShell currentPage={currentPage} onNavigate={handleNavigate}>
      {page}
    </AppShell>
  )
}

export default App
