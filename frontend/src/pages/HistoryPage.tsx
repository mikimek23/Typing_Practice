import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  Calendar,
  Filter,
  RefreshCw,
  Target,
  Trash2,
  Trophy,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '../api/axios'
import {
  deleteResult,
  getResults,
  type TypingMode,
  type TypingResult,
} from '../api/results'
import { Button } from '../components/Button'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

const displayMode = (mode: string) =>
  mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()

export const HistoryPage = () => {
  const [results, setResults] = useState<TypingResult[]>([])
  const [mode, setMode] = useState<TypingMode | 'all'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadResults = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const payload = await getResults({
        page,
        limit: 10,
        mode: mode === 'all' ? undefined : mode,
      })
      setResults(payload.data)
      setTotalPages(Math.max(payload.pagination.totalPage, 1))
    } catch (loadError) {
      const message = getApiErrorMessage(loadError)
      if (message.toLowerCase().includes('not found')) {
        setResults([])
        setTotalPages(1)
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [mode, page])

  useEffect(() => {
    void loadResults()
  }, [loadResults])

  const summary = useMemo(() => {
    const bestWpm = results.reduce(
      (best, result) => Math.max(best, result.wpm),
      0,
    )
    const averageAccuracy = results.length
      ? Math.round(
          results.reduce((sum, result) => sum + result.accuracy, 0) /
            results.length,
        )
      : 0
    const averageWpm = results.length
      ? Math.round(
          results.reduce((sum, result) => sum + result.wpm, 0) / results.length,
        )
      : 0

    return { bestWpm, averageAccuracy, averageWpm }
  }, [results])

  const handleDelete = async (id: string) => {
    try {
      await deleteResult(id)
      await loadResults()
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, 'Could not delete result.'))
    }
  }

  return (
    <main className='app-page py-8 sm:py-12'>
      <div className='app-shell space-y-6'>
        {/* Header */}
        <section className='flex flex-col justify-between gap-4 lg:flex-row lg:items-end'>
          <div>
            <div className='mb-3 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] shadow-xs'>
              <BarChart3 size={15} className='text-cyan-500' />
              <span>Personal Analytics</span>
            </div>
            <h1 className='text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-5xl'>
              Benchmark History
            </h1>
            <p className='mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]'>
              Review your saved typing runs, compare speeds across modes, and
              observe your improvement.
            </p>
          </div>

          <div className='flex items-center gap-2.5'>
            <div className='flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--muted)]'>
              <Filter size={14} />
              <span>Filter:</span>
            </div>
            <select
              value={mode}
              onChange={(event) => {
                setMode(event.target.value as TypingMode | 'all')
                setPage(1)
              }}
              className='app-input h-10 rounded-xl px-3 text-xs font-bold'
            >
              <option value='all'>All Modes</option>
              <option value='timed'>Timed Mode</option>
              <option value='passage'>Passage Mode</option>
            </select>
          </div>
        </section>

        {/* 3 Summary Metric Cards */}
        <section className='grid gap-4 md:grid-cols-3'>
          <div className='app-surface rounded-2xl p-5 shadow-sm border border-[var(--border)]'>
            <div className='flex items-center gap-3.5'>
              <span className='grid h-11 w-11 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400'>
                <Trophy size={22} />
              </span>
              <div>
                <p className='text-[0.66rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Personal Best WPM
                </p>
                <p className='mt-0.5 text-2xl font-black text-[var(--foreground)]'>
                  {summary.bestWpm}
                </p>
              </div>
            </div>
          </div>

          <div className='app-surface rounded-2xl p-5 shadow-sm border border-[var(--border)]'>
            <div className='flex items-center gap-3.5'>
              <span className='grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                <Target size={22} />
              </span>
              <div>
                <p className='text-[0.66rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Average Accuracy
                </p>
                <p className='mt-0.5 text-2xl font-black text-[var(--foreground)]'>
                  {summary.averageAccuracy}%
                </p>
              </div>
            </div>
          </div>

          <div className='app-surface rounded-2xl p-5 shadow-sm border border-[var(--border)]'>
            <div className='flex items-center gap-3.5'>
              <span className='grid h-11 w-11 place-items-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'>
                <Zap size={22} />
              </span>
              <div>
                <p className='text-[0.66rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                  Average Speed
                </p>
                <p className='mt-0.5 text-2xl font-black text-[var(--foreground)]'>
                  {summary.averageWpm} WPM
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* History Table Container */}
        <section className='app-surface rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden'>
          {error && (
            <div className='border-b border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-800 dark:text-rose-200'>
              {error}
            </div>
          )}

          {isLoading ? (
            <div className='p-12 text-center text-sm font-semibold text-[var(--muted)] flex items-center justify-center gap-2'>
              <RefreshCw size={17} className='animate-spin' />
              <span>Loading saved history from backend...</span>
            </div>
          ) : results.length === 0 ? (
            <div className='p-12 text-center space-y-3'>
              <div className='mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface-soft)] text-[var(--muted)]'>
                <BarChart3 size={24} />
              </div>
              <p className='text-lg font-black text-[var(--foreground)]'>
                No saved test runs found
              </p>
              <p className='text-xs text-[var(--muted)] max-w-sm mx-auto'>
                Complete a typing test while logged in to build your personal
                performance analytics.
              </p>
              <div className='pt-2'>
                <Link to='/test'>
                  <Button size='sm'>Start a Test</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-b border-[var(--border)] bg-[var(--surface-soft)] text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)]'>
                    <th className='py-3.5 px-4'>Date</th>
                    <th className='py-3.5 px-4'>Speed</th>
                    <th className='py-3.5 px-4'>Accuracy</th>
                    <th className='py-3.5 px-4'>Mode</th>
                    <th className='py-3.5 px-4'>Duration</th>
                    <th className='py-3.5 px-4 text-right'>Action</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-[var(--border)]'>
                  {results.map((item) => (
                    <tr
                      key={item.id}
                      className='transition hover:bg-[var(--surface-soft)]'
                    >
                      <td className='py-3.5 px-4 text-xs font-semibold text-[var(--muted-strong)] flex items-center gap-2'>
                        <Calendar size={14} className='text-[var(--muted)]' />
                        {formatDate(item.created_at)}
                      </td>
                      <td className='py-3.5 px-4 font-black text-[var(--foreground)]'>
                        <span className='text-base text-cyan-600 dark:text-cyan-400 font-bold'>
                          {item.wpm}
                        </span>{' '}
                        <span className='text-xs text-[var(--muted)]'>WPM</span>
                      </td>
                      <td className='py-3.5 px-4 font-bold text-[var(--foreground)]'>
                        <span
                          className={
                            item.accuracy >= 94
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600'
                          }
                        >
                          {item.accuracy}%
                        </span>
                      </td>
                      <td className='py-3.5 px-4 text-xs font-bold text-[var(--muted)]'>
                        <span className='rounded-md bg-[var(--surface-soft)] border border-[var(--border)] px-2 py-0.5'>
                          {displayMode(item.mode)}
                        </span>
                      </td>
                      <td className='py-3.5 px-4 text-xs font-semibold text-[var(--muted-strong)]'>
                        {item.durationSeconds}s
                      </td>
                      <td className='py-3.5 px-4 text-right'>
                        <button
                          type='button'
                          onClick={() => handleDelete(item.id)}
                          className='p-1.5 text-[var(--muted)] hover:text-rose-500 rounded-lg transition'
                          title='Delete record'
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className='flex items-center justify-between border-t border-[var(--border)] p-4 text-xs font-bold text-[var(--muted)]'>
              <button
                type='button'
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className='rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 transition disabled:opacity-40 hover:text-[var(--foreground)]'
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type='button'
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className='rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 transition disabled:opacity-40 hover:text-[var(--foreground)]'
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
