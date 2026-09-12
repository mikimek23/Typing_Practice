import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Code2,
  Gauge,
  Keyboard,
  RefreshCw,
  Sparkles,
  Target,
  Type,
} from 'lucide-react'
import { getApiErrorMessage } from '../api/axios'
import { type TypingMode } from '../api/results'
import { getDefaultTexts, type Difficulty, type TypingText } from '../api/texts'
import { Button } from '../components/Button'
import { KeyboardVisualizer } from '../components/KeyboardVisualizer'
import { useAuth } from '../hooks/useAuth'
import type { CompletedTestResult, TimelinePoint } from '../types/testResult'
import { soundEngine } from '../utils/audio'

type TestStatus = 'idle' | 'running' | 'finished'
type TextSize = 'comfort' | 'large' | 'extra'

type PracticeLocationState = {
  practiceText?: TypingText
}

type MetricProps = {
  label: string
  value: string | number
  icon: ReactNode
  tone?: 'cyan' | 'emerald' | 'amber' | 'rose'
}

const textSizeStorageKey = 'typing_text_size'
const fontTypeStorageKey = 'typing_font_family'
const showKeyboardStorageKey = 'typing_show_keyboard'
const timedDurationStorageKey = 'typing_timed_duration'

const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
const modes: TypingMode[] = ['timed', 'passage']
const timedOptions = [15, 30, 60, 120]

const textSizes: Array<{ value: TextSize; label: string }> = [
  { value: 'comfort', label: 'Comfort' },
  { value: 'large', label: 'Large' },
  { value: 'extra', label: 'Extra' },
]

const FALLBACK_TEXTS: TypingText[] = [
  {
    id: 'local-focus-baseline',
    title: 'Focused Baseline',
    content:
      'Typing speed improves when practice is deliberate, measured, and calm. Keep your eyes ahead of the cursor, let mistakes pass without panic, and finish each session with one clear thing to improve next time.',
    difficulty: 'MEDIUM',
    source_type: 'DEFAULT',
    wordCount: 31,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'local-product-rhythm',
    title: 'Product Rhythm',
    content:
      'A professional tool should feel steady under pressure. The interface must keep important numbers visible, make the next action obvious, and avoid distracting the person doing focused work.',
    difficulty: 'EASY',
    source_type: 'DEFAULT',
    wordCount: 28,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const CODE_TEXTS: TypingText[] = [
  {
    id: 'code-js-async',
    title: 'JavaScript Async / Await',
    content:
      'async function fetchData(url) { try { const res = await fetch(url); const json = await res.json(); return json; } catch (err) { console.error(err); } }',
    difficulty: 'MEDIUM',
    source_type: 'DEFAULT',
    wordCount: 28,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'code-react-hook',
    title: 'React Custom Hook',
    content:
      'const [count, setCount] = useState(0); useEffect(() => { const timer = setInterval(() => setCount((c) => c + 1), 1000); return () => clearInterval(timer); }, []);',
    difficulty: 'HARD',
    source_type: 'DEFAULT',
    wordCount: 26,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const formatDifficulty = (difficulty: string) =>
  difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()

const getCorrectCharacters = (typed: string, content: string) =>
  typed.split('').filter((character, index) => character === content[index])
    .length

const getWordCount = (content: string) =>
  content.trim().split(/\s+/).filter(Boolean).length

const readStoredTextSize = (): TextSize => {
  if (typeof window === 'undefined') return 'large'
  const value = window.localStorage.getItem(textSizeStorageKey)
  return value === 'comfort' || value === 'large' || value === 'extra'
    ? value
    : 'large'
}

const Metric = ({ label, value, icon, tone = 'cyan' }: MetricProps) => {
  const toneClasses = {
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  }

  return (
    <div className='app-surface rounded-xl p-3 sm:p-4 shadow-sm border border-[var(--border)] transition-all'>
      <div className='flex items-center gap-2.5 sm:gap-3.5'>
        <span
          className={`grid h-9 w-9 place-items-center rounded-lg sm:h-11 sm:w-11 ${toneClasses[tone]}`}
        >
          {icon}
        </span>
        <div className='min-w-0'>
          <p className='truncate text-[0.66rem] font-bold uppercase tracking-wider text-[var(--muted)] sm:text-xs'>
            {label}
          </p>
          <p className='mt-0.5 truncate text-xl font-black text-[var(--foreground)] sm:mt-1 sm:text-2xl'>
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

export const TypingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as PracticeLocationState | null
  const practiceText = locationState?.practiceText
  const { isAuthenticated, user } = useAuth()
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const typingContainerRef = useRef<HTMLDivElement | null>(null)
  const hasNavigatedToResult = useRef(false)

  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [mode, setMode] = useState<TypingMode>('timed')
  const [timedDuration, setTimedDuration] = useState<number>(() => {
    if (typeof window === 'undefined') return 60
    const val = parseInt(
      window.localStorage.getItem(timedDurationStorageKey) || '60',
      10,
    )
    return timedOptions.includes(val) ? val : 60
  })
  const [isCodeMode, setIsCodeMode] = useState(false)
  const [textSize, setTextSize] = useState<TextSize>(readStoredTextSize)
  const [isMonospace, setIsMonospace] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return window.localStorage.getItem(fontTypeStorageKey) !== 'sans'
  })
  const [showKeyboard, setShowKeyboard] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(showKeyboardStorageKey) === 'true'
  })

  const [texts, setTexts] = useState<TypingText[]>([])
  const [selectedTextId, setSelectedTextId] = useState('')
  const [isLoadingTexts, setIsLoadingTexts] = useState(true)
  const [textError, setTextError] = useState('')
  const [typed, setTyped] = useState('')
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null)
  const [totalKeyPresses, setTotalKeyPresses] = useState(0)
  const [status, setStatus] = useState<TestStatus>('idle')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [timeline, setTimeline] = useState<TimelinePoint[]>([])

  useEffect(() => {
    window.localStorage.setItem(textSizeStorageKey, textSize)
  }, [textSize])

  useEffect(() => {
    window.localStorage.setItem(
      fontTypeStorageKey,
      isMonospace ? 'mono' : 'sans',
    )
  }, [isMonospace])

  useEffect(() => {
    window.localStorage.setItem(showKeyboardStorageKey, showKeyboard.toString())
  }, [showKeyboard])

  useEffect(() => {
    window.localStorage.setItem(
      timedDurationStorageKey,
      timedDuration.toString(),
    )
  }, [timedDuration])

  useEffect(() => {
    if (!practiceText) return

    setTexts([practiceText])
    setSelectedTextId(practiceText.id)
    setDifficulty(practiceText.difficulty.toLowerCase() as Difficulty)
    setTextError('')
    setIsLoadingTexts(false)
    setStatus('idle')
    setTyped('')
    setElapsedSeconds(0)
    setTotalKeyPresses(0)
    setTimeline([])
    hasNavigatedToResult.current = false
  }, [practiceText])

  useEffect(() => {
    if (practiceText) return

    if (isCodeMode) {
      setTexts(CODE_TEXTS)
      setSelectedTextId(CODE_TEXTS[0].id)
      setIsLoadingTexts(false)
      setTextError('')
      return
    }

    let ignore = false
    setIsLoadingTexts(true)
    setTextError('')

    getDefaultTexts(difficulty)
      .then((payload) => {
        if (ignore) return

        const nextTexts = payload.texts.length ? payload.texts : FALLBACK_TEXTS
        setTexts(nextTexts)
        setSelectedTextId((previous) =>
          nextTexts.some((text) => text.id === previous)
            ? previous
            : (nextTexts[0]?.id ?? ''),
        )
      })
      .catch((error) => {
        if (ignore) return
        setTexts(FALLBACK_TEXTS)
        setSelectedTextId(FALLBACK_TEXTS[0]?.id ?? '')
        setTextError(getApiErrorMessage(error, 'Could not load backend texts.'))
      })
      .finally(() => {
        if (!ignore) setIsLoadingTexts(false)
      })

    return () => {
      ignore = true
    }
  }, [difficulty, practiceText, isCodeMode])

  const activeText = useMemo(
    () => texts.find((text) => text.id === selectedTextId) ?? texts[0],
    [selectedTextId, texts],
  )

  const content = activeText?.content ?? ''
  const correctCharacters = useMemo(
    () => getCorrectCharacters(typed, content),
    [content, typed],
  )
  const incorrectCharacters = Math.max(totalKeyPresses - correctCharacters, 0)
  const effectiveDuration = Math.max(elapsedSeconds, status === 'idle' ? 0 : 1)
  const wpm =
    effectiveDuration > 0
      ? Math.floor(correctCharacters / 5 / (effectiveDuration / 60))
      : 0
  const rawWpm =
    effectiveDuration > 0
      ? Math.floor(totalKeyPresses / 5 / (effectiveDuration / 60))
      : 0
  const accuracy =
    totalKeyPresses > 0
      ? Math.floor((correctCharacters / totalKeyPresses) * 100)
      : 100
  const remainingSeconds = Math.max(timedDuration - elapsedSeconds, 0)
  const progress = content
    ? Math.min(Math.round((typed.length / content.length) * 100), 100)
    : 0
  const activeTextSize =
    textSizes.find((size) => size.value === textSize) ?? textSizes[1]

  const resetTest = useCallback(() => {
    setTyped('')
    setTotalKeyPresses(0)
    setStatus('idle')
    setElapsedSeconds(0)
    setTimeline([])
    setLastKeyPressed(null)
    hasNavigatedToResult.current = false
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  useEffect(() => {
    resetTest()
  }, [mode, selectedTextId, resetTest, isCodeMode, timedDuration])

  // Timer & Timeline data collection
  useEffect(() => {
    if (status !== 'running') return

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((sec) => {
        const nextSec = sec + 1
        const curDuration = Math.max(nextSec, 1)
        const curWpm = Math.floor(correctCharacters / 5 / (curDuration / 60))
        const curRawWpm = Math.floor(totalKeyPresses / 5 / (curDuration / 60))

        setTimeline((prev) => [
          ...prev,
          {
            second: nextSec,
            wpm: curWpm,
            rawWpm: curRawWpm,
            errors: incorrectCharacters,
          },
        ])
        return nextSec
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [status, correctCharacters, totalKeyPresses, incorrectCharacters])

  // Timed limit finish check
  useEffect(() => {
    if (status !== 'running') return
    if (mode === 'timed' && elapsedSeconds >= timedDuration) {
      setStatus('finished')
    }
  }, [elapsedSeconds, mode, status, timedDuration])

  // Passage complete check
  useEffect(() => {
    if (status !== 'running' || !content) return
    if (typed.length >= content.length) {
      setStatus('finished')
    }
  }, [content, status, typed.length])

  // Navigate to result
  useEffect(() => {
    if (status !== 'finished' || !activeText || hasNavigatedToResult.current) {
      return
    }

    hasNavigatedToResult.current = true
    const durationSeconds = Math.max(effectiveDuration, 1)
    const result: CompletedTestResult = {
      textId:
        activeText.id.startsWith('local-') || activeText.id.startsWith('code-')
          ? undefined
          : activeText.id,
      textTitle: activeText.title,
      mode,
      durationSeconds,
      wpm,
      rawWpm,
      accuracy,
      correctCharacters,
      incorrectCharacters,
      totalKeyPresses,
      progress,
      wordCount: activeText.wordCount || getWordCount(content),
      completedAt: new Date().toISOString(),
      saveStatus: isAuthenticated ? 'saving' : 'guest',
      timeline: timeline.length > 0 ? timeline : undefined,
    }

    navigate('/result', { replace: true, state: { result } })
  }, [
    accuracy,
    activeText,
    content,
    correctCharacters,
    effectiveDuration,
    incorrectCharacters,
    isAuthenticated,
    mode,
    navigate,
    progress,
    rawWpm,
    status,
    timeline,
    totalKeyPresses,
    wpm,
  ])

  // Hotkey listener for Tab+Enter or Esc to restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        resetTest()
      } else if (e.key === 'Tab') {
        // Prevent default tab blur on test area
        e.preventDefault()
        resetTest()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resetTest])

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!content || status === 'finished') return

    const nextValue = event.target.value.slice(0, content.length)

    if (status === 'idle') {
      setStatus('running')
    }

    if (nextValue.length > typed.length) {
      const addedChar = nextValue[nextValue.length - 1]
      const expectedChar = content[nextValue.length - 1]
      setLastKeyPressed(addedChar)

      // Audio trigger
      if (addedChar === expectedChar) {
        soundEngine.playKeyClick(addedChar === ' ')
      } else {
        soundEngine.playError()
      }

      setTotalKeyPresses((presses) => presses + nextValue.length - typed.length)
    }

    setTyped(nextValue)
  }

  const focusTypingArea = () => {
    inputRef.current?.focus()
  }

  return (
    <main className='app-page py-6 sm:py-10'>
      <div className='app-shell space-y-6'>
        {/* Top Header & Context */}
        <section className='flex flex-col justify-between gap-4 lg:flex-row lg:items-end'>
          <div>
            <div className='mb-3 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] shadow-xs'>
              <Sparkles size={15} className='text-cyan-500' />
              {isAuthenticated
                ? `${user?.name}'s typing workspace`
                : 'Guest practice session'}
            </div>
            <h1 className='text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-5xl'>
              Benchmark your typing speed.
            </h1>
            <p className='mt-2.5 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base'>
              Type with live feedback, keyboard guide, and tactile sounds. Press{' '}
              <kbd className='rounded bg-[var(--surface-soft)] px-1.5 py-0.5 border border-[var(--border)] font-mono text-xs'>
                Esc
              </kbd>{' '}
              or{' '}
              <kbd className='rounded bg-[var(--surface-soft)] px-1.5 py-0.5 border border-[var(--border)] font-mono text-xs'>
                Tab
              </kbd>{' '}
              anytime to restart.
            </p>
          </div>

          {!isAuthenticated && (
            <div className='rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3.5 text-xs font-semibold text-cyan-800 dark:text-cyan-200'>
              Guest mode active.{' '}
              <Link
                to='/login'
                className='font-black underline underline-offset-2 hover:opacity-80'
              >
                Sign in to save records to your account.
              </Link>
            </div>
          )}
        </section>

        {/* Live Metrics Bar */}
        <section className='grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4'>
          <Metric
            label='Net WPM'
            value={wpm}
            icon={<Gauge size={20} />}
            tone='cyan'
          />
          <Metric
            label='Accuracy'
            value={`${accuracy}%`}
            icon={<Target size={20} />}
            tone={accuracy >= 94 ? 'emerald' : 'amber'}
          />
          <Metric
            label={mode === 'timed' ? 'Time Remaining' : 'Elapsed'}
            value={
              mode === 'timed' ? `${remainingSeconds}s` : `${elapsedSeconds}s`
            }
            icon={<Clock3 size={20} />}
            tone='amber'
          />
          <Metric
            label='Progress'
            value={`${progress}%`}
            icon={<CheckCircle2 size={20} />}
            tone={incorrectCharacters > 0 ? 'rose' : 'emerald'}
          />
        </section>

        {/* Controls Bar */}
        <section className='app-surface rounded-2xl p-4 shadow-sm border border-[var(--border)]'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            {/* Left: Passage dropdown */}
            <div className='min-w-[220px] flex-1 sm:max-w-xs'>
              <label className='block'>
                <span className='text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Passage
                </span>
                <select
                  value={selectedTextId}
                  onChange={(event) => setSelectedTextId(event.target.value)}
                  disabled={status === 'running' || isLoadingTexts}
                  className='app-input mt-1.5 h-10 w-full rounded-xl px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {texts.map((text) => (
                    <option key={text.id} value={text.id}>
                      {text.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Mode: Timed / Passage / Code */}
            <div>
              <p className='text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                Mode
              </p>
              <div className='mt-1.5 flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1'>
                {modes.map((item) => (
                  <button
                    key={item}
                    type='button'
                    disabled={status === 'running'}
                    onClick={() => {
                      setIsCodeMode(false)
                      setMode(item)
                    }}
                    className={[
                      'rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition',
                      !isCodeMode && mode === item
                        ? 'bg-[var(--foreground)] text-[var(--background)] shadow-xs'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]',
                    ].join(' ')}
                  >
                    {item}
                  </button>
                ))}
                <button
                  type='button'
                  disabled={status === 'running'}
                  onClick={() => {
                    setIsCodeMode(true)
                  }}
                  className={[
                    'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition',
                    isCodeMode
                      ? 'bg-cyan-600 text-white dark:bg-cyan-400 dark:text-slate-950 shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)]',
                  ].join(' ')}
                >
                  <Code2 size={14} />
                  <span>Code</span>
                </button>
              </div>
            </div>

            {/* Timed duration selector (if in timed mode) */}
            {mode === 'timed' && (
              <div>
                <p className='text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Duration
                </p>
                <div className='mt-1.5 flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1'>
                  {timedOptions.map((sec) => (
                    <button
                      key={sec}
                      type='button'
                      disabled={status === 'running'}
                      onClick={() => setTimedDuration(sec)}
                      className={[
                        'rounded-lg px-2.5 py-1.5 text-xs font-bold transition',
                        timedDuration === sec
                          ? 'bg-cyan-600 text-white dark:bg-cyan-400 dark:text-slate-950 shadow-xs'
                          : 'text-[var(--muted)] hover:text-[var(--foreground)]',
                      ].join(' ')}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty (when not in code mode) */}
            {!isCodeMode && (
              <div>
                <p className='text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Difficulty
                </p>
                <div className='mt-1.5 flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1'>
                  {difficulties.map((item) => (
                    <button
                      key={item}
                      type='button'
                      disabled={status === 'running' || Boolean(practiceText)}
                      onClick={() => setDifficulty(item)}
                      className={[
                        'rounded-lg px-2.5 py-1.5 text-xs font-bold capitalize transition',
                        difficulty === item
                          ? 'bg-cyan-600 text-white dark:bg-cyan-400 dark:text-slate-950 shadow-xs'
                          : 'text-[var(--muted)] hover:text-[var(--foreground)]',
                      ].join(' ')}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Options: Font & Text Size */}
            <div>
              <p className='text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                Display
              </p>
              <div className='mt-1.5 flex items-center gap-2'>
                {/* Monospace Toggle */}
                <button
                  type='button'
                  onClick={() => setIsMonospace(!isMonospace)}
                  className={[
                    'inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition',
                    isMonospace
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]',
                  ].join(' ')}
                  title='Toggle JetBrains Mono / Proportional font'
                >
                  <Type size={14} />
                  <span>Mono</span>
                </button>

                {/* Text size selector */}
                <div className='flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1'>
                  {textSizes.map((size) => (
                    <button
                      key={size.value}
                      type='button'
                      onClick={() => setTextSize(size.value)}
                      className={[
                        'rounded-lg px-2 py-1 text-xs font-bold transition',
                        textSize === size.value
                          ? 'bg-[var(--foreground)] text-[var(--background)]'
                          : 'text-[var(--muted)] hover:text-[var(--foreground)]',
                      ].join(' ')}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Interactive Typing Area */}
        <section className='app-surface rounded-2xl p-4 sm:p-7 shadow-md border border-[var(--border)]'>
          <div className='mb-4 flex flex-col gap-3 border-b border-[var(--border)] pb-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <h2 className='text-xl font-black tracking-tight text-[var(--foreground)]'>
                {activeText?.title ?? 'Loading passage...'}
              </h2>
              <p className='mt-1 text-xs font-semibold text-[var(--muted)]'>
                {activeText
                  ? `${formatDifficulty(activeText.difficulty)} • ${
                      activeText.wordCount || getWordCount(content)
                    } words • ${progress}% complete`
                  : 'Preparing test...'}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='secondary'
                onClick={resetTest}
                icon={<RefreshCw size={16} />}
              >
                Restart (<kbd className='font-mono text-xs'>Esc</kbd>)
              </Button>
            </div>
          </div>

          {textError && (
            <div className='mb-4 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs font-semibold text-amber-900 dark:text-amber-200'>
              <AlertCircle className='mt-0.5 shrink-0' size={16} />
              <span>
                {textError} Using default practice passage for this session.
              </span>
            </div>
          )}

          {/* Typing Area Box */}
          <div
            ref={typingContainerRef}
            onClick={focusTypingArea}
            data-text-size={activeTextSize.value}
            className={[
              'typing-text min-h-64 sm:min-h-80 w-full cursor-text rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-7 text-left outline-none transition-all leading-relaxed',
              isMonospace ? 'font-typing' : '',
              textSize === 'comfort' ? 'typing-size-comfort' : '',
              textSize === 'large' ? 'typing-size-large' : '',
              textSize === 'extra' ? 'typing-size-extra' : '',
              status === 'running'
                ? 'ring-2 ring-cyan-500/20 border-cyan-500/50'
                : 'hover:border-[var(--accent)]',
            ].join(' ')}
          >
            {isLoadingTexts ? (
              <div className='py-12 text-center text-sm font-semibold text-[var(--muted)]'>
                Loading passages...
              </div>
            ) : (
              content.split('').map((character, index) => {
                const isTyped = index < typed.length
                const isCurrent =
                  index === typed.length && status !== 'finished'
                const isCorrect = typed[index] === character

                return (
                  <span key={index} className='relative inline'>
                    {isCurrent && <span className='typing-caret' />}
                    <span
                      className={[
                        'transition-colors duration-75',
                        isTyped && isCorrect
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : '',
                        isTyped && !isCorrect
                          ? 'bg-rose-500/20 text-rose-600 underline decoration-rose-500 decoration-2 dark:text-rose-400 rounded-xs px-0.5'
                          : '',
                        !isTyped ? 'text-[var(--muted)] opacity-65' : '',
                        isCurrent ? 'font-bold text-[var(--foreground)]' : '',
                      ].join(' ')}
                    >
                      {character}
                    </span>
                  </span>
                )
              })
            )}
          </div>

          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleInputChange}
            className='absolute h-px w-px resize-none opacity-0'
            aria-label='Typing input'
            disabled={!content || status === 'finished'}
          />

          {status === 'idle' && content && (
            <p className='mt-4 text-xs font-semibold text-[var(--muted)] flex items-center gap-1.5'>
              <Keyboard size={15} />
              Click the passage above and begin typing to start the benchmark.
            </p>
          )}
        </section>

        {/* Live Interactive Keyboard Visualizer */}
        <KeyboardVisualizer
          activeKey={lastKeyPressed}
          nextKey={content[typed.length] || null}
          isVisible={showKeyboard}
          onToggle={() => setShowKeyboard(!showKeyboard)}
        />
      </div>
    </main>
  )
}
