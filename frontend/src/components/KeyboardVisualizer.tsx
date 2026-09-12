import { memo } from 'react'

type KeyboardVisualizerProps = {
  activeKey?: string | null
  nextKey?: string | null
  isVisible: boolean
  onToggle: () => void
}

const KEYBOARD_ROWS = [
  [
    '`',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    '-',
    '=',
    'Backspace',
  ],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space'],
]

export const KeyboardVisualizer = memo(
  ({ activeKey, nextKey, isVisible, onToggle }: KeyboardVisualizerProps) => {
    if (!isVisible) {
      return (
        <div className='flex justify-center'>
          <button
            type='button'
            onClick={onToggle}
            className='inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-bold text-[var(--muted)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--foreground)]'
          >
            <span>⌨️ Show Keyboard Guide</span>
          </button>
        </div>
      )
    }

    const normalize = (key?: string | null) => {
      if (!key) return ''
      if (key === ' ') return 'Space'
      return key.toLowerCase()
    }

    const normActive = normalize(activeKey)
    const normNext = normalize(nextKey)

    return (
      <div className='w-full rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-3 shadow-md backdrop-blur-md transition-all sm:p-4'>
        <div className='mb-2.5 flex items-center justify-between text-xs'>
          <span className='font-bold uppercase tracking-wider text-[var(--muted)]'>
            Live Keyboard Visualizer
          </span>
          <div className='flex items-center gap-3'>
            {nextKey && (
              <span className='inline-flex items-center gap-1.5 font-bold text-[var(--foreground)]'>
                Next Key:
                <kbd className='rounded bg-[var(--surface-soft)] px-2 py-0.5 font-mono text-cyan-600 shadow-sm dark:text-cyan-400'>
                  {nextKey === ' ' ? 'Space' : nextKey}
                </kbd>
              </span>
            )}
            <button
              type='button'
              onClick={onToggle}
              className='rounded px-2 py-0.5 font-semibold text-[var(--muted)] hover:text-[var(--foreground)]'
            >
              Hide
            </button>
          </div>
        </div>

        <div className='mx-auto flex max-w-2xl flex-col gap-1 sm:gap-1.5'>
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className='flex justify-center gap-1 sm:gap-1.5'
            >
              {row.map((key, keyIndex) => {
                const lowerKey = key.toLowerCase()
                const isPressed =
                  (key === 'Space' && normActive === 'space') ||
                  normActive === lowerKey
                const isTargetNext =
                  (key === 'Space' && normNext === 'space') ||
                  normNext === lowerKey

                let widthClass = 'w-7 sm:w-10'
                if (key === 'Backspace' || key === 'Tab' || key === 'Enter') {
                  widthClass = 'w-14 sm:w-20'
                } else if (key === 'Caps') {
                  widthClass = 'w-12 sm:w-16'
                } else if (key === 'Shift') {
                  widthClass = 'w-14 sm:w-20'
                } else if (key === 'Space') {
                  widthClass = 'w-48 sm:w-80'
                }

                const isF = key === 'f'
                const isJ = key === 'j'

                return (
                  <div
                    key={`${rowIndex}-${keyIndex}`}
                    className={[
                      'keyboard-key relative flex h-7 sm:h-9 items-center justify-center rounded-md border text-[0.65rem] sm:text-xs font-bold transition-all select-none',
                      widthClass,
                      isPressed
                        ? 'is-pressed bg-[var(--accent)] text-white border-[var(--accent-strong)] shadow-[0_0_12px_var(--accent)]'
                        : isTargetNext
                          ? 'border-cyan-500 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 ring-2 ring-cyan-500/40'
                          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]',
                    ].join(' ')}
                  >
                    <span>{key}</span>
                    {(isF || isJ) && (
                      <span className='absolute bottom-1 h-0.5 w-2 rounded-full bg-[var(--muted)] opacity-60' />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  },
)

KeyboardVisualizer.displayName = 'KeyboardVisualizer'
