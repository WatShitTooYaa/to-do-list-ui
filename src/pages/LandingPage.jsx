import { ArrowRight, CheckCircle2, Clock3, Sparkles } from 'lucide-react'
import heroImage from '../assets/hero.png'

const features = [
  {
    title: 'Fast capture',
    description: 'Add tasks quickly without leaving the page flow.',
    icon: Sparkles,
  },
  {
    title: 'Daily clarity',
    description: 'Track open and completed work from a focused dashboard.',
    icon: CheckCircle2,
  },
  {
    title: 'Ready to extend',
    description: 'Frontend structure is prepared for future API integration.',
    icon: Clock3,
  },
]

export function LandingPage({ onNavigate }) {
  return (
    <main>
      <section
        className="relative min-h-[calc(100vh-120px)] overflow-hidden bg-zinc-950 px-4 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(9, 9, 11, 0.72), rgba(9, 9, 11, 0.86)), url(${heroImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-6xl flex-col justify-center py-20">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium text-emerald-300">
              Personal task workspace
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white sm:text-6xl">
              FocusList
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-200 sm:text-lg">
              A clean React to-do application for capturing tasks, tracking
              progress, and preparing a frontend foundation for authentication
              and profile flows.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-100"
              >
                Get Started
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white px-4 py-14 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-zinc-950 shadow-sm dark:bg-zinc-950 dark:text-zinc-50 dark:shadow-none">
                  <Icon size={18} />
                </div>
                <h2 className="mt-4 text-base font-semibold text-zinc-950 dark:text-zinc-50">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      <footer className="bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row">
          <span>FocusList frontend</span>
          <span>React, Tailwind CSS, Framer Motion</span>
        </div>
      </footer>
    </main>
  )
}
