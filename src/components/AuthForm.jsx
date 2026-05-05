import { AlertCircle, ArrowRight, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AuthForm({ mode, onSubmit, onSwitch }) {
  const isRegister = mode === 'register'
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const nextErrors = {}

    if (isRegister && values.name.trim().length < 2) {
      nextErrors.name = 'Username must contain at least 2 characters.'
    }

    if (!emailPattern.test(values.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (values.password.length < 6) {
      nextErrors.password = 'Password must contain at least 6 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setFormError('')
    setIsSubmitting(true)

    try {
      await onSubmit(values)
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateValue = (field, value) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
    >
      <div className="mb-6">
        <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
          {isRegister ? <UserRound size={18} /> : <Mail size={18} />}
        </div>
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          {isRegister ? 'Create account' : 'Welcome back'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {isRegister
            ? 'Set up a workspace profile for future API integration.'
            : 'Sign in with your workspace credentials.'}
        </p>
      </div>

      <div className="space-y-4">
        {isRegister && (
          <label className="block">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Username</span>
            <input
              value={values.name}
              onChange={(event) => updateValue('name', event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
              placeholder="tester123"
            />
            {errors.name && <FieldError message={errors.name} />}
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</span>
          <input
            type="email"
            value={values.email}
            onChange={(event) => updateValue('email', event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
            placeholder="you@example.com"
          />
          {errors.email && <FieldError message={errors.email} />}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</span>
          <input
            type="password"
            value={values.password}
            onChange={(event) => updateValue('password', event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
            placeholder="Minimum 6 characters"
          />
          {errors.password && <FieldError message={errors.password} />}
        </label>
      </div>

      {formError && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-500/15 dark:text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-zinc-700"
      >
        {isSubmitting
          ? 'Please wait'
          : isRegister
            ? 'Create account'
            : 'Sign in'}
        <ArrowRight size={16} />
      </button>

      <button
        type="button"
        onClick={onSwitch}
        className="mt-4 w-full text-center text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
      </button>
    </form>
  )
}

function FieldError({ message }) {
  return (
    <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-500 dark:text-red-300">
      <AlertCircle size={13} />
      {message}
    </span>
  )
}
