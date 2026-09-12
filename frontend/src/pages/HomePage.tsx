import { useState, type ChangeEvent } from 'react'
import {
  BarChart3,
  Code2,
  Gauge,
  Keyboard,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Volume2,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { soundEngine } from '../utils/audio'

const DEMO_SENTENCE =
  'Typing speed improves with steady rhythm, proper posture, and daily practice.'

const features = [
  {
    icon: <Volume2 size={20} />,
    title: 'Tactile Switch Audio',
    body: 'Synthesized mechanical key clicks (Blue, Thock, Typewriter) built natively with the Web Audio API for satisfying acoustic feedback.',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Pace & Error Timeline',
    body: 'SVG performance charts plot second-by-second WPM, raw typing speed, and mistake markers to highlight rhythm inconsistencies.',
  },
  {
    icon: <Keyboard size={20} />,
    title: 'Live Keypress Visualizer',
    body: 'Real-time on-screen keyboard illuminates keys as you type, reinforcing home-row finger placement and muscle memory.',
  },
  {
    icon: <Code2 size={20} />,
    title: 'Developer Code Practice',
    body: 'Dedicated code typing mode featuring JavaScript, React hooks, and Python syntax to drill muscle memory for programming symbols.',
  },
]

export const HomePage = () => {
  const [demoTyped, setDemoTyped] = useState('')
  const [demoStartTime, setDemoStartTime] = useState<number | null>(null)
  const [demoElapsedSec, setDemoElapsedSec] = useState(1)

  const handleDemoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, DEMO_SENTENCE.length)
    const now = Date.now()
    let start = demoStartTime

    if (!start && val.length > 0) {
      start = now
      setDemoStartTime(now)
    }

    if (start) {
      setDemoElapsedSec(Math.max((now - start) / 1000, 1))
    }

    if (val.length > demoTyped.length) {
      const char = val[val.length - 1]
      const expected = DEMO_SENTENCE[val.length - 1]
      if (char === expected) {
        soundEngine.playKeyClick(char === ' ')
      } else {
        soundEngine.playError()
      }
    }
    setDemoTyped(val)
  }

  const resetDemo = () => {
    setDemoTyped('')
    setDemoStartTime(null)
    setDemoElapsedSec(1)
  }

  const demoCorrectChars = demoTyped
    .split('')
    .filter((c, i) => c === DEMO_SENTENCE[i]).length
  const demoWpm = demoStartTime
    ? Math.floor(demoCorrectChars / 5 / (demoElapsedSec / 60))
    : 0
  const demoAcc =
    demoTyped.length > 0
      ? Math.floor((demoCorrectChars / demoTyped.length) * 100)
      : 100

  return (
    <main className='app-page py-10 sm:py-16'>
      <div className='app-shell space-y-16'>
        {/* Hero Section with Interactive Mini-Playground */}
        <section className='grid items-center gap-10 lg:grid-cols-[1.1fr_480px]'>
          <div className='motion-rise space-y-6'>
            <div className='inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-bold text-[var(--muted)] shadow-xs'>
              <Sparkles size={16} className='text-cyan-500' />
              <span>Next-Generation Typing Benchmark</span>
            </div>

            <h1 className='text-4xl font-black tracking-tight text-[var(--foreground)] sm:text-6xl sm:leading-[1.12]'>
              Master your typing speed with{' '}
              <span className='bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-indigo-400'>
                precision feedback.
              </span>
            </h1>

            <p className='max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg'>
              TypingPro is an engineered typing benchmark featuring realistic
              mechanical switch audio, live keyboard tracking, and SVG timeline
              analytics.
            </p>

            <div className='flex flex-wrap items-center gap-3 pt-2'>
              <Link to='/test'>
                <Button size='lg' icon={<Keyboard size={19} />}>
                  Start Full Test
                </Button>
              </Link>
              <Link to='/about'>
                <Button
                  size='lg'
                  variant='secondary'
                  icon={<Gauge size={19} />}
                >
                  Explore Features
                </Button>
              </Link>
            </div>

            <div className='grid grid-cols-3 gap-3 pt-4 max-w-lg'>
              <div className='rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xs'>
                <p className='text-2xl font-black text-[var(--foreground)]'>
                  60s
                </p>
                <p className='text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Timed Mode
                </p>
              </div>
              <div className='rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xs'>
                <p className='text-2xl font-black text-cyan-600 dark:text-cyan-400'>
                  WebAudio
                </p>
                <p className='text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Tactile Clicks
                </p>
              </div>
              <div className='rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xs'>
                <p className='text-2xl font-black text-emerald-600 dark:text-emerald-400'>
                  100%
                </p>
                <p className='text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Live Analytics
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Live Mini-Playground Card */}
          <div className='relative rounded-3xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-6 shadow-xl backdrop-blur-xl motion-float'>
            <div className='mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3.5'>
              <div>
                <p className='text-[0.68rem] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400'>
                  Live Demo Playground
                </p>
                <h3 className='text-lg font-black text-[var(--foreground)]'>
                  Test Your Fingers Now
                </h3>
              </div>
              <div className='flex items-center gap-2'>
                <span className='rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs font-black text-cyan-700 dark:text-cyan-300'>
                  {demoWpm} WPM
                </span>
                <button
                  type='button'
                  onClick={resetDemo}
                  className='p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] transition'
                  title='Reset demo'
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            {/* Passage to type */}
            <div className='rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 font-typing text-base sm:text-lg leading-relaxed select-none'>
              {DEMO_SENTENCE.split('').map((char, idx) => {
                const isTyped = idx < demoTyped.length
                const isCorrect = demoTyped[idx] === char
                const isCurrent = idx === demoTyped.length

                return (
                  <span
                    key={idx}
                    className={[
                      isTyped && isCorrect
                        ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                        : '',
                      isTyped && !isCorrect
                        ? 'bg-rose-500/20 text-rose-600 underline'
                        : '',
                      !isTyped ? 'text-[var(--muted)] opacity-60' : '',
                      isCurrent
                        ? 'border-b-2 border-cyan-500 bg-cyan-500/10'
                        : '',
                    ].join(' ')}
                  >
                    {char}
                  </span>
                )
              })}
            </div>

            {/* Input field */}
            <div className='mt-4'>
              <input
                value={demoTyped}
                onChange={handleDemoChange}
                placeholder='Type the sentence above to try out sound & rhythm...'
                className='h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--foreground)] outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
              />
            </div>

            <div className='mt-4 grid grid-cols-3 gap-2 text-center text-xs'>
              <div className='rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-2'>
                <p className='font-bold text-[var(--muted)]'>Accuracy</p>
                <p className='mt-0.5 text-sm font-black text-[var(--foreground)]'>
                  {demoAcc}%
                </p>
              </div>
              <div className='rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-2'>
                <p className='font-bold text-[var(--muted)]'>Progress</p>
                <p className='mt-0.5 text-sm font-black text-[var(--foreground)]'>
                  {Math.round((demoTyped.length / DEMO_SENTENCE.length) * 100)}%
                </p>
              </div>
              <div className='rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-2'>
                <p className='font-bold text-[var(--muted)]'>Audio FX</p>
                <p className='mt-0.5 text-sm font-black text-cyan-600 dark:text-cyan-400'>
                  Active
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className='space-y-8'>
          <div className='text-center max-w-2xl mx-auto'>
            <h2 className='text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl'>
              Engineered for Focused Practice
            </h2>
            <p className='mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base'>
              Every feature is built to give immediate, actionable feedback
              without cluttering the screen.
            </p>
          </div>

          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {features.map((item) => (
              <div
                key={item.title}
                className='app-surface rounded-2xl p-6 shadow-sm border border-[var(--border)] transition hover:-translate-y-1 hover:shadow-md'
              >
                <span className='grid h-12 w-12 place-items-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'>
                  {item.icon}
                </span>
                <h3 className='mt-5 text-lg font-black text-[var(--foreground)]'>
                  {item.title}
                </h3>
                <p className='mt-2.5 text-xs leading-relaxed text-[var(--muted)]'>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className='relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-tr from-cyan-950/40 via-[var(--surface)] to-[var(--surface)] p-8 sm:p-12 shadow-lg'>
          <div className='max-w-2xl space-y-4'>
            <span className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400'>
              <Zap size={16} />
              Ready for a Speed Run?
            </span>
            <h2 className='text-3xl font-black text-[var(--foreground)] sm:text-4xl'>
              Benchmark your typing speed today.
            </h2>
            <p className='text-sm leading-relaxed text-[var(--muted)]'>
              Guest mode starts instantly. Or sign in to save test history,
              track your average WPM over time, and build a private passage
              library.
            </p>
            <div className='pt-2 flex flex-wrap items-center gap-3'>
              <Link to='/test'>
                <Button size='lg' icon={<Keyboard size={18} />}>
                  Start Free Test
                </Button>
              </Link>
              <Link to='/register'>
                <Button
                  size='lg'
                  variant='secondary'
                  icon={<ShieldCheck size={18} />}
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
