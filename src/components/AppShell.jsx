import {
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  LogIn,
  Moon,
  Sun,
  UserPlus,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useTheme } from '../context/useTheme'

const guestNavItems = [
  { id: 'landing', label: 'Home', icon: CheckCircle2 },
  { id: 'about', label: 'About', icon: ListChecks },
]

const userNavItems = [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]

export function AppShell({ currentPage, onNavigate, children }) {
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navItems = user ? userNavItems : guestNavItems

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur transition-colors dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-left"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
              <ListChecks size={18} />
            </span>
            <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">FocusList</span>
          </button>

          <nav className="hidden items-center gap-1 rounded-full border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:flex">
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
                      ? 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              aria-pressed={isDark}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            {user ? (
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="flex h-9 min-w-0 max-w-40 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <UserRound size={15} className="shrink-0" />
              <span className="truncate">{user.name}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="hidden h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:flex"
              >
                <LogIn size={15} />
                Sign in
              </button>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="flex h-9 items-center gap-2 rounded-full bg-zinc-950 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                <UserPlus size={15} />
                Sign up
              </button>
            </>
          )}
          </div>
        </div>

        <nav
          className={`mx-auto grid max-w-6xl border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 sm:hidden ${
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
                  isActive ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'
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
                  currentPage === 'login' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <LogIn size={15} />
                Sign in
              </button>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className={`flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium ${
                  currentPage === 'register' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'
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
                currentPage === 'profile' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'
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
