import { useCallback, useMemo, useState } from 'react'
import { AppShell } from './components/AppShell'
import { AuthProvider } from './context/AuthProvider'
import { TodoProvider } from './context/TodoProvider'
import { useAuth } from './context/useAuth'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  return (
    <AuthProvider>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </AuthProvider>
  )
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('landing')
  const { user } = useAuth()

  const handleNavigate = useCallback(
    (page) => {
      if (!user && ['dashboard', 'profile'].includes(page)) {
        setCurrentPage('login')
        return
      }

      setCurrentPage(page)
    },
    [user],
  )

  const page = useMemo(() => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />
      case 'dashboard':
        return user ? <DashboardPage /> : <LoginPage onNavigate={setCurrentPage} />
      case 'profile':
        return user ? <ProfilePage /> : <LoginPage onNavigate={setCurrentPage} />
      case 'about':
        return <LandingPage onNavigate={handleNavigate} />
      default:
        return <LandingPage onNavigate={handleNavigate} />
    }
  }, [currentPage, handleNavigate, user])

  return (
    <AppShell currentPage={currentPage} onNavigate={handleNavigate}>
      {page}
    </AppShell>
  )
}

export default App
