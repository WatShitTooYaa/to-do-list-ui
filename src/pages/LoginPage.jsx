import { AuthForm } from '../components/AuthForm'
import { useAuth } from '../context/useAuth'

export function LoginPage({ onNavigate }) {
  const { login } = useAuth()

  const handleSubmit = async (values) => {
    await login(values)
    onNavigate('dashboard')
  }

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-12">
      <AuthForm
        mode="login"
        onSubmit={handleSubmit}
        onSwitch={() => onNavigate('register')}
      />
    </main>
  )
}
