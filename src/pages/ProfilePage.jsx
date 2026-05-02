import { Save, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/useAuth'

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  })
  const [saved, setSaved] = useState(false)

  const updateField = (field, value) => {
    setSaved(false)
    setProfile((currentProfile) => ({ ...currentProfile, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    updateProfile(profile)
    setSaved(true)
  }

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-12">
      <section className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-zinc-950 text-white">
            <UserRound size={20} />
          </div>
          <h1 className="text-3xl font-semibold text-zinc-950">Profile</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Local profile data prepared for future backend integration.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Name</span>
              <input
                value={profile.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Role</span>
              <input
                value={profile.role}
                onChange={(event) => updateField('role', event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-zinc-500">
              {saved ? 'Profile saved locally.' : 'Changes stay in memory for now.'}
            </p>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              <Save size={16} />
              Save profile
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
