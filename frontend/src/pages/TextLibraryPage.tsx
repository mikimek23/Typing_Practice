import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit3, FilePlus2, FileText, Keyboard, Trash2 } from 'lucide-react'
import { getApiErrorMessage } from '../api/axios'
import {
  createMyText,
  deleteMyText,
  getMyTexts,
  updateMyText,
  type Difficulty,
  type TextPayload,
  type TypingText,
} from '../api/texts'
import { Button } from '../components/Button'

const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

const emptyForm: TextPayload = {
  title: '',
  content: '',
  difficulty: 'medium',
}

const formatDifficulty = (difficulty: string) =>
  difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()

export const TextLibraryPage = () => {
  const navigate = useNavigate()
  const [texts, setTexts] = useState<TypingText[]>([])
  const [form, setForm] = useState<TextPayload>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTexts = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const payload = await getMyTexts()
      setTexts(payload.texts)
    } catch (loadError) {
      const message = getApiErrorMessage(loadError)
      if (message.toLowerCase().includes('not found')) {
        setTexts([])
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTexts()
  }, [loadTexts])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      if (editingId) {
        await updateMyText(editingId, form)
        setSuccess('Text successfully updated.')
      } else {
        await createMyText(form)
        setSuccess('New passage added to your library.')
      }

      resetForm()
      await loadTexts()
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (text: TypingText) => {
    setEditingId(text.id)
    setForm({
      title: text.title,
      content: text.content,
      difficulty: text.difficulty.toLowerCase() as Difficulty,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    setError('')
    setSuccess('')

    try {
      await deleteMyText(id)
      setSuccess('Passage deleted.')
      await loadTexts()
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, 'Could not delete text.'))
    }
  }

  const handlePractice = (text: TypingText) => {
    navigate('/test', { state: { practiceText: text } })
  }

  return (
    <main className='app-page py-8 sm:py-12'>
      <div className='app-shell space-y-6'>
        <section>
          <div className='mb-3 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] shadow-xs'>
            <FilePlus2 size={15} className='text-cyan-500' />
            <span>Passage Manager</span>
          </div>
          <h1 className='text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-5xl'>
            Custom Passage Library
          </h1>
          <p className='mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]'>
            Create custom practice passages, keep them synced to your account,
            and launch typing sessions directly.
          </p>
        </section>

        <section className='grid gap-6 lg:grid-cols-[400px_1fr]'>
          {/* Create/Edit Form */}
          <form
            onSubmit={handleSubmit}
            className='app-surface rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border)] h-fit space-y-4'
          >
            <div>
              <h2 className='text-xl font-black text-[var(--foreground)]'>
                {editingId ? 'Edit Passage' : 'New Passage'}
              </h2>
              <p className='mt-0.5 text-xs text-[var(--muted)]'>
                Minimum 20 characters for meaningful practice.
              </p>
            </div>

            {error && (
              <div className='rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-800 dark:text-rose-200'>
                {error}
              </div>
            )}

            {success && (
              <div className='rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-200'>
                {success}
              </div>
            )}

            <div>
              <label className='block text-xs font-bold uppercase tracking-wider text-[var(--muted)]'>
                Title
              </label>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                required
                minLength={3}
                maxLength={100}
                className='app-input mt-1.5 h-10 w-full rounded-xl px-3 text-sm font-semibold'
                placeholder='e.g., Coding Interview Warmup'
              />
            </div>

            <div>
              <label className='block text-xs font-bold uppercase tracking-wider text-[var(--muted)]'>
                Difficulty
              </label>
              <select
                value={form.difficulty}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    difficulty: event.target.value as Difficulty,
                  }))
                }
                className='app-input mt-1.5 h-10 w-full rounded-xl px-3 text-sm font-semibold'
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {formatDifficulty(difficulty)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-xs font-bold uppercase tracking-wider text-[var(--muted)]'>
                Content
              </label>
              <textarea
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
                required
                minLength={20}
                maxLength={50000}
                rows={7}
                className='app-input font-typing mt-1.5 w-full resize-y rounded-xl p-3 text-xs leading-relaxed'
                placeholder='Paste or type the text you want to drill...'
              />
            </div>

            <div className='flex flex-wrap gap-2 pt-2'>
              <Button
                type='submit'
                isLoading={isSubmitting}
                icon={<FilePlus2 size={16} />}
              >
                {editingId ? 'Save Changes' : 'Create Passage'}
              </Button>
              {editingId && (
                <Button type='button' variant='secondary' onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>

          {/* Texts List */}
          <section className='app-surface rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden flex flex-col'>
            <div className='border-b border-[var(--border)] p-4 sm:p-5 flex items-center justify-between'>
              <h2 className='text-lg font-black text-[var(--foreground)]'>
                Saved Passages ({texts.length})
              </h2>
            </div>

            {isLoading ? (
              <div className='p-12 text-center text-sm font-semibold text-[var(--muted)]'>
                Loading your library...
              </div>
            ) : texts.length === 0 ? (
              <div className='p-12 text-center space-y-3'>
                <div className='mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface-soft)] text-[var(--muted)]'>
                  <FileText size={24} />
                </div>
                <p className='text-lg font-black text-[var(--foreground)]'>
                  Your library is empty
                </p>
                <p className='text-xs text-[var(--muted)] max-w-sm mx-auto'>
                  Add custom paragraphs, quotes, or code excerpts from the form
                  to practice them anytime.
                </p>
              </div>
            ) : (
              <div className='divide-y divide-[var(--border)]'>
                {texts.map((text) => (
                  <article
                    key={text.id}
                    className='p-5 transition hover:bg-[var(--surface-soft)]'
                  >
                    <div className='flex flex-col justify-between gap-4 md:flex-row md:items-start'>
                      <div className='space-y-1.5'>
                        <div className='flex items-center gap-2'>
                          <h3 className='text-base font-black text-[var(--foreground)]'>
                            {text.title}
                          </h3>
                          <span className='rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-0.5 text-[0.66rem] font-bold uppercase text-[var(--muted)]'>
                            {formatDifficulty(text.difficulty)}
                          </span>
                          <span className='text-xs text-[var(--muted)]'>
                            • {text.wordCount} words
                          </span>
                        </div>
                        <p className='font-typing text-xs leading-relaxed text-[var(--muted)] line-clamp-3'>
                          {text.content}
                        </p>
                      </div>

                      <div className='flex shrink-0 items-center gap-2'>
                        <Button
                          type='button'
                          size='sm'
                          onClick={() => handlePractice(text)}
                          icon={<Keyboard size={15} />}
                        >
                          Practice
                        </Button>
                        <Button
                          type='button'
                          variant='secondary'
                          size='sm'
                          onClick={() => handleEdit(text)}
                          icon={<Edit3 size={15} />}
                        >
                          Edit
                        </Button>
                        <button
                          type='button'
                          onClick={() => void handleDelete(text.id)}
                          className='grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-rose-500/10 hover:text-rose-500'
                          title='Delete passage'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  )
}
