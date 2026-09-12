import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LogIn, ShieldCheck, UserPlus } from 'lucide-react'
import { getApiErrorMessage } from '../api/axios'
import { userLogin, userRegister } from '../api/auth'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

type AuthPageProps = {
  mode: 'login' | 'register'
}

export const AuthPage = ({ mode }: AuthPageProps) => {
  const navigate = useNavigate()
  const { isAuthenticated, isInitialized } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isRegister = mode === 'register'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (isRegister) {
        await userRegister({ name, email, password })
      }

      await userLogin({ email, password })
      navigate('/')
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isInitialized && isAuthenticated) {
    return <Navigate to='/' replace />
  }

  return (
    <main className='app-page flex min-h-[calc(100vh-73px)] items-center py-10 sm:py-16'>
      <div className='app-shell grid items-center gap-10 lg:grid-cols-[1.1fr_420px]'>
        <section className='motion-rise space-y-6'>
          <div className='inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-bold text-[var(--muted)] shadow-xs'>
            <ShieldCheck size={16} className='text-cyan-500' />
            <span>Encrypted Session & Persistence</span>
          </div>
          <h1 className='text-4xl font-black tracking-tight text-[var(--foreground)] sm:text-5xl sm:leading-[1.15]'>
            Save your typing record across every session.
          </h1>
          <p className='max-w-xl text-base leading-relaxed text-[var(--muted)]'>
            Practice as a guest anytime. Creating an account unlocks saved
            history, average WPM charts, and personal custom text libraries
            stored securely in the backend.
          </p>
          <div className='grid grid-cols-2 gap-3 max-w-md pt-2'>
            <div className='rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-xs'>
              <p className='font-bold text-xs text-[var(--foreground)]'>
                ⚡ Instant Sync
              </p>
              <p className='mt-1 text-[0.72rem] text-[var(--muted)]'>
                Auto-saves completed tests
              </p>
            </div>
            <div className='rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-xs'>
              <p className='font-bold text-xs text-[var(--foreground)]'>
                📚 Custom Library
              </p>
              <p className='mt-1 text-[0.72rem] text-[var(--muted)]'>
                Private passages & snippets
              </p>
            </div>
          </div>
        </section>

        <section className='app-surface rounded-3xl p-6 sm:p-8 shadow-xl border border-[var(--border)]'>
          <div className='mb-6'>
            <h2 className='text-2xl font-black text-[var(--foreground)]'>
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className='mt-1 text-xs text-[var(--muted)]'>
              {isRegister
                ? 'Join to track your WPM growth over time.'
                : 'Sign in to access your saved test history.'}
            </p>
          </div>

          {error && (
            <div className='mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-800 dark:text-rose-200'>
              {error}
            </div>
          )}

          <form className='space-y-4' onSubmit={handleSubmit}>
            {isRegister && (
              <div>
                <label className='block text-xs font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Name
                </label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={3}
                  className='app-input mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm font-semibold'
                  placeholder='e.g., Alex Typist'
                />
              </div>
            )}

            <div>
              <label className='block text-xs font-bold uppercase tracking-wider text-[var(--muted)]'>
                Email
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                type='email'
                className='app-input mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm font-semibold'
                placeholder='you@example.com'
              />
            </div>

            <div>
              <label className='block text-xs font-bold uppercase tracking-wider text-[var(--muted)]'>
                Password
              </label>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                type='password'
                minLength={8}
                className='app-input mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm font-semibold'
                placeholder='At least 8 characters'
              />
              {isRegister && (
                <span className='mt-1.5 block text-[0.7rem] text-[var(--muted)]'>
                  Requires uppercase, lowercase, number, and special character.
                </span>
              )}
            </div>

            <div className='pt-2'>
              <Button
                type='submit'
                isFullWidth
                isLoading={isSubmitting}
                icon={isRegister ? <UserPlus size={16} /> : <LogIn size={16} />}
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </Button>
            </div>
          </form>

          <p className='mt-6 text-center text-xs text-[var(--muted)]'>
            {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
            <Link
              to={isRegister ? '/login' : '/register'}
              className='font-bold text-cyan-600 dark:text-cyan-400 hover:underline'
            >
              {isRegister ? 'Sign in' : 'Create one here'}
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
