import { AuthForm } from '../components/AuthForm'
import { useAuth } from '../context/useAuth'

export function RegisterPage({ onNavigate }) {
  const { register } = useAuth()

  const handleSubmit = async (values) => {
    await register(values)
    onNavigate('dashboard')
  }

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-12">
      <AuthForm
        mode="register"
        onSubmit={handleSubmit}
        onSwitch={() => onNavigate('login')}
      />
    </main>
  )
}
