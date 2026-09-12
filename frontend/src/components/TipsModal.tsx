import { X, Sparkles, Zap, Shield, BookOpen } from 'lucide-react'

type TipsModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const TipsModal = ({ isOpen, onClose }: TipsModalProps) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn'>
      <div className='relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl transition-all'>
        <div className='flex items-center justify-between border-b border-[var(--border)] pb-4'>
          <div className='flex items-center gap-2.5'>
            <span className='grid h-9 w-9 place-items-center rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'>
              <Sparkles size={20} />
            </span>
            <div>
              <h3 className='text-xl font-black text-[var(--foreground)]'>
                Typing Mastery Guide & Shortcuts
              </h3>
              <p className='text-xs font-semibold text-[var(--muted)]'>
                Pro tips to elevate your speed from 40 to 100+ WPM
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] transition'
            aria-label='Close modal'
          >
            <X size={20} />
          </button>
        </div>

        <div className='mt-5 space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-sm'>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4'>
              <div className='flex items-center gap-2 font-bold text-cyan-600 dark:text-cyan-400'>
                <Zap size={16} />
                <span>Quick Hotkeys</span>
              </div>
              <ul className='mt-2.5 space-y-2 text-xs font-semibold text-[var(--foreground)]'>
                <li className='flex items-center justify-between'>
                  <span className='text-[var(--muted)]'>Restart Test:</span>
                  <kbd className='rounded bg-[var(--surface)] px-2 py-0.5 border border-[var(--border)] shadow-xs'>
                    Tab + Enter
                  </kbd>
                </li>
                <li className='flex items-center justify-between'>
                  <span className='text-[var(--muted)]'>
                    Reset to Beginning:
                  </span>
                  <kbd className='rounded bg-[var(--surface)] px-2 py-0.5 border border-[var(--border)] shadow-xs'>
                    Esc
                  </kbd>
                </li>
                <li className='flex items-center justify-between'>
                  <span className='text-[var(--muted)]'>Toggle Theme:</span>
                  <kbd className='rounded bg-[var(--surface)] px-2 py-0.5 border border-[var(--border)] shadow-xs'>
                    Sun / Moon button
                  </kbd>
                </li>
              </ul>
            </div>

            <div className='rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4'>
              <div className='flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400'>
                <Shield size={16} />
                <span>The Golden Rule</span>
              </div>
              <p className='mt-2.5 text-xs leading-relaxed text-[var(--muted-strong)]'>
                <strong>Accuracy dictates speed.</strong> Never rush to press
                keys faster than your rhythm. Speed naturally follows once your
                error rate stays reliably below 3-4%.
              </p>
            </div>
          </div>

          <div className='rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4'>
            <div className='flex items-center gap-2 font-bold text-[var(--foreground)]'>
              <BookOpen size={16} />
              <span>Touch Typing Fundamentals</span>
            </div>
            <div className='mt-3 grid gap-3 text-xs sm:grid-cols-3'>
              <div>
                <p className='font-bold text-cyan-600 dark:text-cyan-400'>
                  1. Home Row Anchor
                </p>
                <p className='mt-1 text-[var(--muted)] leading-normal'>
                  Keep index fingers on{' '}
                  <code className='font-bold text-[var(--foreground)]'>F</code>{' '}
                  and{' '}
                  <code className='font-bold text-[var(--foreground)]'>J</code>{' '}
                  (feel the tactile bumps). Always return there after
                  keystrokes.
                </p>
              </div>
              <div>
                <p className='font-bold text-cyan-600 dark:text-cyan-400'>
                  2. Eyes On Screen
                </p>
                <p className='mt-1 text-[var(--muted)] leading-normal'>
                  Look ahead of the cursor by 1-2 words. Train your brain to
                  buffer entire syllables rather than looking down at keys.
                </p>
              </div>
              <div>
                <p className='font-bold text-cyan-600 dark:text-cyan-400'>
                  3. Posture & Wrists
                </p>
                <p className='mt-1 text-[var(--muted)] leading-normal'>
                  Keep wrists floating or slightly resting. Straight back,
                  90-degree elbows reduce fatigue during marathon coding
                  sessions.
                </p>
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs'>
            <p className='font-bold text-cyan-700 dark:text-cyan-300'>
              💡 Developer Pro Tip:
            </p>
            <p className='mt-1 text-[var(--muted-strong)] leading-relaxed'>
              Practice with the <strong>Code Snippet mode</strong> to build
              muscle memory for symbols like <code>{'{}'}</code>,{' '}
              <code>{'[]'}</code>, <code>=&gt;</code>, and <code>;</code> which
              are the primary bottlenecks for programmers!
            </p>
          </div>
        </div>

        <div className='mt-6 flex justify-end border-t border-[var(--border)] pt-4'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl bg-cyan-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-cyan-500 dark:bg-cyan-400 dark:text-slate-950'
          >
            Got it, let's type!
          </button>
        </div>
      </div>
    </div>
  )
}
