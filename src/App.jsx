import { useMemo, useState } from 'react'
import { AppShell } from './components/AppShell'
import { AuthProvider } from './context/AuthProvider'
import { TodoProvider } from './context/TodoProvider'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const page = useMemo(() => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />
      case 'dashboard':
        return <DashboardPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <LandingPage onNavigate={setCurrentPage} />
    }
  }, [currentPage])

  return (
    <AuthProvider>
      <TodoProvider>
        <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
          {page}
        </AppShell>
      </TodoProvider>
    </AuthProvider>
  )
}

export default App
