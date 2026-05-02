import {
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  LogIn,
  UserRound,
} from 'lucide-react'

const navItems = [
  { id: 'landing', label: 'Home', icon: CheckCircle2 },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: UserRound },
]

export function AppShell({ currentPage, onNavigate, children }) {
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

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100"
          >
            <LogIn size={15} />
            Sign in
          </button>
        </div>

        <nav className="mx-auto grid max-w-6xl grid-cols-3 border-t border-zinc-200 bg-white sm:hidden">
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
        </nav>
      </header>

      {children}
    </div>
  )
}
