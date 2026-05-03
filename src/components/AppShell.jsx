import {
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  LogIn,
  UserPlus,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'

const guestNavItems = [
  { id: 'landing', label: 'Home', icon: CheckCircle2 },
  { id: 'about', label: 'About', icon: ListChecks },
]

const userNavItems = [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]

export function AppShell({ currentPage, onNavigate, children }) {
  const { user } = useAuth()
  const navItems = user ? userNavItems : guestNavItems

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-left"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-950 text-white">
              <ListChecks size={18} />
            </span>
            <span className="text-sm font-semibold text-zinc-950">FocusList</span>
          </button>

          <nav className="hidden items-center gap-1 rounded-full border border-zinc-200 bg-white p-1 shadow-sm sm:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-950 text-white'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {user ? (
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="flex h-9 min-w-0 max-w-40 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100"
            >
              <UserRound size={15} className="shrink-0" />
              <span className="truncate">{user.name}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="hidden h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 sm:flex"
              >
                <LogIn size={15} />
                Sign in
              </button>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="flex h-9 items-center gap-2 rounded-full bg-zinc-950 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800"
              >
                <UserPlus size={15} />
                Sign up
              </button>
            </div>
          )}
        </div>

        <nav
          className={`mx-auto grid max-w-6xl border-t border-zinc-200 bg-white sm:hidden ${
            user ? 'grid-cols-2' : 'grid-cols-4'
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium ${
                  isActive ? 'text-zinc-950' : 'text-zinc-500'
                }`}
              >
                <Icon size={15} />
                {item.label}
              </button>
            )
          })}
          {!user && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className={`flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium ${
                  currentPage === 'login' ? 'text-zinc-950' : 'text-zinc-500'
                }`}
              >
                <LogIn size={15} />
                Sign in
              </button>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className={`flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium ${
                  currentPage === 'register' ? 'text-zinc-950' : 'text-zinc-500'
                }`}
              >
                <UserPlus size={15} />
                Sign up
              </button>
            </>
          )}
          {user && (
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className={`flex min-w-0 items-center justify-center gap-2 px-3 py-3 text-sm font-medium ${
                currentPage === 'profile' ? 'text-zinc-950' : 'text-zinc-500'
              }`}
            >
              <UserRound size={15} className="shrink-0" />
              <span className="truncate">{user.name}</span>
            </button>
          )}
        </nav>
      </header>

      {children}
    </div>
  )
}
