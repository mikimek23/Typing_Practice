import { useState, type ReactNode } from 'react'
import {
  BarChart3,
  CheckCircle2,
  HelpCircle,
  Keyboard,
  Layers,
  Target,
  Volume2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { TipsModal } from '../components/TipsModal'

const techStack = [
  {
    name: 'React 19 & TypeScript',
    desc: 'Strict typing and modern concurrent component lifecycle.',
  },
  {
    name: 'Tailwind CSS v4',
    desc: 'Next-generation CSS engine with custom variant dark mode and tokens.',
  },
  {
    name: 'Web Audio API',
    desc: 'Zero-asset synthesized mechanical switch click acoustics.',
  },
  {
    name: 'SVG Data Visualization',
    desc: 'Dynamic timeline chart plotting pace, raw speed, and error points.',
  },
  {
    name: 'Express & Prisma',
    desc: 'PostgreSQL backend with secure JWT authentication and test history.',
  },
]

export const AboutPage = () => {
  const [isTipsOpen, setIsTipsOpen] = useState(false)

  return (
    <>
      <main className='app-page py-10 sm:py-16'>
        <div className='app-shell space-y-12'>
          {/* Header */}
          <section className='grid gap-8 lg:grid-cols-[1.1fr_420px] lg:items-center'>
            <div className='motion-rise space-y-5'>
              <div className='inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-bold text-[var(--muted)] shadow-xs'>
                <CheckCircle2 size={16} className='text-emerald-500' />
                <span>About TypingPro Benchmark</span>
              </div>
              <h1 className='text-4xl font-black tracking-tight text-[var(--foreground)] sm:text-5xl leading-tight'>
                Engineered for feedback, consistency, and speed.
              </h1>
              <p className='text-base leading-relaxed text-[var(--muted)] sm:text-lg'>
                TypingPro was designed to eliminate the distractions of
                conventional typing tests. It delivers high-contrast typography,
                zero-asset mechanical audio acoustics, real-time keyboard
                visualizers, and second-by-second pace analytics.
              </p>
              <div className='flex flex-wrap items-center gap-3 pt-2'>
                <Link to='/test'>
                  <Button size='lg' icon={<Keyboard size={18} />}>
                    Start Typing Test
                  </Button>
                </Link>
                <Button
                  size='lg'
                  variant='secondary'
                  onClick={() => setIsTipsOpen(true)}
                  icon={<HelpCircle size={18} />}
                >
                  Shortcuts & Tips
                </Button>
              </div>
            </div>

            {/* Architecture Card */}
            <aside className='app-surface rounded-3xl p-6 sm:p-7 shadow-lg border border-[var(--border)] motion-float space-y-4'>
              <div className='flex items-center gap-2.5 text-cyan-600 dark:text-cyan-400 font-black text-sm uppercase tracking-wider'>
                <Layers size={18} />
                <span>Architecture & Stack</span>
              </div>
              <div className='space-y-3 pt-1'>
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className='rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3'
                  >
                    <p className='font-bold text-xs text-[var(--foreground)]'>
                      {tech.name}
                    </p>
                    <p className='mt-0.5 text-[0.72rem] text-[var(--muted)] leading-normal'>
                      {tech.desc}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </section>

          {/* Typing Math & Formula Explanation */}
          <section className='app-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-[var(--border)] space-y-5'>
            <div className='flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider'>
              <Target size={17} />
              <span>Standardized Scoring Math</span>
            </div>
            <h2 className='text-2xl font-black text-[var(--foreground)] sm:text-3xl'>
              How Words Per Minute (WPM) Is Calculated
            </h2>
            <p className='max-w-3xl text-sm leading-relaxed text-[var(--muted)]'>
              Unlike naive word counters that treat the word "a" the same as
              "extraordinary", TypingPro adheres to the international typing
              speed standard:
            </p>

            <div className='grid gap-4 sm:grid-cols-3 pt-2'>
              <div className='rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 space-y-1.5'>
                <p className='text-xs font-bold uppercase tracking-wider text-[var(--muted)]'>
                  1 Standard Word
                </p>
                <p className='text-2xl font-black text-[var(--foreground)]'>
                  5 Keystrokes
                </p>
                <p className='text-xs text-[var(--muted)]'>
                  Spaces and punctuation count as characters.
                </p>
              </div>

              <div className='rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 space-y-1.5'>
                <p className='text-xs font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Net WPM Formula
                </p>
                <p className='text-xl font-black text-cyan-600 dark:text-cyan-400'>
                  (Correct Chars / 5) / Min
                </p>
                <p className='text-xs text-[var(--muted)]'>
                  Measures clean, readable output.
                </p>
              </div>

              <div className='rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 space-y-1.5'>
                <p className='text-xs font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Accuracy Ratio
                </p>
                <p className='text-xl font-black text-emerald-600 dark:text-emerald-400'>
                  Correct / Total Keys
                </p>
                <p className='text-xs text-[var(--muted)]'>
                  Penalizes stray and uncorrected strokes.
                </p>
              </div>
            </div>
          </section>

          {/* Key Product Pillars */}
          <section className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            <PillarCard
              icon={<Volume2 size={20} />}
              title='Acoustic Synthesis'
              description='Tactile mechanical switch audio synthesized in real time via Web Audio API without bulky audio files or network latency.'
            />
            <PillarCard
              icon={<Keyboard size={20} />}
              title='Tactile Visualizer'
              description='Interactive on-screen keyboard guides typists back to the home row anchor keys (F & J) with zero looking down.'
            />
            <PillarCard
              icon={<BarChart3 size={20} />}
              title='Pace Timeline'
              description='Interactive SVG analytics expose whether speed was steady or punctuated by panic pauses and error clusters.'
            />
          </section>
        </div>
      </main>

      <TipsModal isOpen={isTipsOpen} onClose={() => setIsTipsOpen(false)} />
    </>
  )
}

const PillarCard = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) => (
  <div className='app-surface rounded-2xl p-6 shadow-sm border border-[var(--border)] transition hover:-translate-y-1'>
    <span className='grid h-11 w-11 place-items-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'>
      {icon}
    </span>
    <h3 className='mt-4 text-lg font-black text-[var(--foreground)]'>
      {title}
    </h3>
    <p className='mt-2 text-xs leading-relaxed text-[var(--muted)]'>
      {description}
    </p>
  </div>
)
