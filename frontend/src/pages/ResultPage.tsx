import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Check,
  Clock3,
  Keyboard,
  LogIn,
  RefreshCw,
  Save,
  Share2,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'
import { getApiErrorMessage } from '../api/axios'
import { saveResult } from '../api/results'
import { Button } from '../components/Button'
import { ResultChart } from '../components/ResultChart'
import { useAuth } from '../hooks/useAuth'
import type { CompletedTestResult } from '../types/testResult'

type ResultLocationState = {
  result?: CompletedTestResult
}

const formatMode = (mode: string) =>
  mode.charAt(0).toUpperCase() + mode.slice(1)

const getSkillTier = (wpm: number, accuracy: number) => {
  if (wpm >= 110 && accuracy >= 95) {
    return {
      title: 'Godspeed Maestro',
      icon: '👑',
      color: 'from-amber-400 to-yellow-600',
      description: 'Top 1% elite speed and near-flawless accuracy.',
    }
  }
  if (wpm >= 90) {
    return {
      title: 'Speed Demon',
      icon: '🔥',
      color: 'from-rose-500 to-amber-500',
      description: 'Exceptional velocity that rivals professional typists.',
    }
  }
  if (wpm >= 70) {
    return {
      title: 'Rapid Keyboardist',
      icon: '⚡',
      color: 'from-cyan-500 to-blue-600',
      description: 'Very fast speed with confident rhythm.',
    }
  }
  if (wpm >= 50) {
    return {
      title: 'Swift Typist',
      icon: '🏃',
      color: 'from-emerald-500 to-teal-600',
      description: 'Above-average typing speed for everyday productivity.',
    }
  }
  if (wpm >= 30) {
    return {
      title: 'Steady Typist',
      icon: '🚶',
      color: 'from-slate-500 to-slate-700',
      description:
        'Consistent flow. Focus on finger placement to unlock 50+ WPM.',
    }
  }
  return {
    title: 'Novice Typist',
    icon: '🌱',
    color: 'from-slate-400 to-slate-600',
    description: 'Building the fundamentals. Focus on accuracy before speed.',
  }
}

export const ResultPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const locationState = location.state as ResultLocationState | null
  const initialResult = locationState?.result
  const [result, setResult] = useState(initialResult)
  const [copied, setCopied] = useState(false)
  const saveAttemptKey = useRef('')

  const persistResult = useCallback(async () => {
    if (!result || !isAuthenticated) return

    const saveKey = [
      result.textId ?? 'no-text',
      result.mode,
      result.durationSeconds,
      result.correctCharacters,
      result.totalKeyPresses,
      result.completedAt,
    ].join(':')

    if (saveAttemptKey.current === saveKey) return
    saveAttemptKey.current = saveKey

    setResult((current) =>
      current
        ? { ...current, saveStatus: 'saving', saveError: undefined }
        : current,
    )

    try {
      await saveResult({
        textId: result.textId,
        mode: result.mode,
        durationSeconds: result.durationSeconds,
        correctCharacters: result.correctCharacters,
        totalKeyPresses: result.totalKeyPresses,
      })
      setResult((current) =>
        current
          ? { ...current, saveStatus: 'saved', saveError: undefined }
          : current,
      )
    } catch (error) {
      saveAttemptKey.current = ''
      setResult((current) =>
        current
          ? {
              ...current,
              saveStatus: 'error',
              saveError: getApiErrorMessage(
                error,
                'Result could not be saved to backend.',
              ),
            }
          : current,
      )
    }
  }, [isAuthenticated, result])

  useEffect(() => {
    if (result?.saveStatus === 'saving') {
      void persistResult()
    }
  }, [persistResult, result?.saveStatus])

  if (!result) {
    return <Navigate to='/test' replace />
  }

  const skillTier = getSkillTier(result.wpm, result.accuracy)

  const handleCopyCard = () => {
    const text = [
      `⌨️ TypingPro Benchmark Results`,
      `🚀 Speed: ${result.wpm} WPM (Raw: ${result.rawWpm ?? result.wpm} WPM)`,
      `🎯 Accuracy: ${result.accuracy}%`,
      `⏱️ Duration: ${result.durationSeconds}s (${formatMode(result.mode)})`,
      `🏆 Tier: ${skillTier.icon} ${skillTier.title}`,
      `✨ Practice at TypingPro`,
    ].join('\n')

    void navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }

  const saveMessage = {
    guest: 'Results stay in this session. Sign in to sync across devices.',
    saving: 'Saving result to backend database...',
    saved: 'Successfully saved to your account history!',
    error: result.saveError ?? 'Result could not be saved to backend.',
  }[result.saveStatus]

  return (
    <main className='app-page py-8 sm:py-12'>
      <div className='app-shell max-w-5xl space-y-6'>
        {/* Header and Hero Summary */}
        <section className='flex flex-col justify-between gap-4 md:flex-row md:items-end'>
          <div>
            <div className='mb-3 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] shadow-xs'>
              <Trophy size={15} className='text-amber-500' />
              Session Completed
            </div>
            <h1 className='text-4xl font-black tracking-tight text-[var(--foreground)] sm:text-5xl'>
              {result.wpm}{' '}
              <span className='text-cyan-600 dark:text-cyan-400'>WPM</span> with{' '}
              {result.accuracy}% accuracy
            </h1>
            <p className='mt-2.5 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base'>
              {result.textTitle} completed in {result.durationSeconds} seconds
              in {formatMode(result.mode)} mode.
            </p>
          </div>

          <div className='flex items-center gap-2.5'>
            <button
              type='button'
              onClick={handleCopyCard}
              className='inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-xs font-bold text-[var(--foreground)] shadow-xs transition hover:border-[var(--accent)] hover:bg-[var(--surface-soft)]'
            >
              {copied ? (
                <>
                  <Check size={16} className='text-emerald-500' />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span>Share Result</span>
                </>
              )}
            </button>
            <Button
              type='button'
              onClick={() => navigate('/test')}
              icon={<RefreshCw size={16} />}
            >
              Test Again
            </Button>
          </div>
        </section>

        {/* Skill Badge Banner */}
        <section className='relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div className='grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-2xl shadow-md'>
                {skillTier.icon}
              </div>
              <div>
                <span className='text-[0.68rem] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400'>
                  Achieved Skill Tier
                </span>
                <h2 className='text-2xl font-black text-[var(--foreground)]'>
                  {skillTier.title}
                </h2>
                <p className='text-xs font-semibold text-[var(--muted)]'>
                  {skillTier.description}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-6 border-t border-[var(--border)] pt-3 sm:border-t-0 sm:pt-0'>
              <div className='text-right'>
                <p className='text-xs font-bold uppercase text-[var(--muted)]'>
                  Raw Speed
                </p>
                <p className='text-xl font-black text-[var(--foreground)]'>
                  {result.rawWpm ?? result.wpm} WPM
                </p>
              </div>
              <div className='text-right'>
                <p className='text-xs font-bold uppercase text-[var(--muted)]'>
                  Error Rate
                </p>
                <p className='text-xl font-black text-rose-500'>
                  {100 - result.accuracy}%
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Stat Cards */}
        <section className='grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4'>
          <StatCard
            icon={<Keyboard size={20} />}
            label='Net WPM'
            value={result.wpm}
            tone='cyan'
          />
          <StatCard
            icon={<Target size={20} />}
            label='Accuracy'
            value={`${result.accuracy}%`}
            tone={result.accuracy >= 94 ? 'emerald' : 'amber'}
          />
          <StatCard
            icon={<Clock3 size={20} />}
            label='Duration'
            value={`${result.durationSeconds}s`}
            tone='amber'
          />
          <StatCard
            icon={<BarChart3 size={20} />}
            label='Completion'
            value={`${result.progress}%`}
            tone='emerald'
          />
        </section>

        {/* Interactive SVG Pace Timeline Graph */}
        <section className='space-y-2'>
          <div className='flex items-center gap-2 text-sm font-bold text-[var(--foreground)]'>
            <Zap size={17} className='text-cyan-500' />
            <span>Pace & Consistency Chart</span>
          </div>
          <ResultChart
            timeline={result.timeline}
            durationSeconds={result.durationSeconds}
            wpm={result.wpm}
            rawWpm={result.rawWpm ?? result.wpm}
            accuracy={result.accuracy}
          />
        </section>

        {/* Detailed Character Breakdown & Save Status */}
        <div className='grid gap-5 lg:grid-cols-[1fr_340px]'>
          <section className='app-surface rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border)]'>
            <h3 className='text-lg font-black text-[var(--foreground)]'>
              Keystroke Analysis
            </h3>
            <p className='mt-1 text-xs font-semibold text-[var(--muted)]'>
              Standard formula: 5 correct characters = 1 net word. Uncorrected
              errors reduce overall score.
            </p>

            <div className='mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3'>
              <div className='rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3.5'>
                <p className='text-xs font-bold text-[var(--muted)]'>
                  Correct Characters
                </p>
                <p className='mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400'>
                  {result.correctCharacters}
                </p>
              </div>

              <div className='rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3.5'>
                <p className='text-xs font-bold text-[var(--muted)]'>
                  Incorrect Keystrokes
                </p>
                <p className='mt-1 text-2xl font-black text-rose-600 dark:text-rose-400'>
                  {result.incorrectCharacters}
                </p>
              </div>

              <div className='col-span-2 sm:col-span-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3.5'>
                <p className='text-xs font-bold text-[var(--muted)]'>
                  Total Keystrokes
                </p>
                <p className='mt-1 text-2xl font-black text-[var(--foreground)]'>
                  {result.totalKeyPresses}
                </p>
              </div>
            </div>

            <div className='mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--muted)]'>
              <span>Passage Word Count: {result.wordCount} words</span>
              <span>Completion: {result.progress}%</span>
            </div>
          </section>

          {/* Account Save Status Sidebar */}
          <aside className='app-surface rounded-2xl p-5 shadow-sm border border-[var(--border)] flex flex-col justify-between'>
            <div>
              <h3 className='flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--muted)]'>
                <Save size={15} />
                Backend Sync
              </h3>

              <div
                className={[
                  'mt-3 rounded-xl border p-3.5 text-xs font-semibold leading-relaxed',
                  result.saveStatus === 'saved'
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                    : '',
                  result.saveStatus === 'error'
                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-200'
                    : '',
                  result.saveStatus === 'guest' ||
                  result.saveStatus === 'saving'
                    ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200'
                    : '',
                ].join(' ')}
              >
                {saveMessage}
              </div>
            </div>

            <div className='mt-5 space-y-2'>
              {result.saveStatus === 'guest' && (
                <Button
                  type='button'
                  onClick={() => navigate('/login')}
                  icon={<LogIn size={16} />}
                  isFullWidth
                >
                  Sign In to Save History
                </Button>
              )}

              {result.saveStatus === 'error' && isAuthenticated && (
                <Button
                  type='button'
                  onClick={() => void persistResult()}
                  icon={<Save size={16} />}
                  isFullWidth
                >
                  Retry Saving
                </Button>
              )}

              {isAuthenticated && (
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => navigate('/history')}
                  icon={<BarChart3 size={16} />}
                  isFullWidth
                >
                  View All History
                </Button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

const StatCard = ({
  icon,
  label,
  value,
  tone = 'cyan',
}: {
  icon: ReactNode
  label: string
  value: string | number
  tone?: 'cyan' | 'emerald' | 'amber' | 'rose'
}) => {
  const toneClasses = {
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  }

  return (
    <div className='app-surface rounded-2xl p-4 sm:p-5 shadow-sm border border-[var(--border)]'>
      <div className='flex items-center gap-3'>
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl ${toneClasses[tone]}`}
        >
          {icon}
        </span>
        <div>
          <p className='text-[0.66rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
            {label}
          </p>
          <p className='mt-0.5 text-2xl font-black text-[var(--foreground)]'>
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}
