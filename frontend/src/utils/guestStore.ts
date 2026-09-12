import type { CompletedTestResult } from '../types/testResult'

const GUEST_RESULTS_KEY = 'typingpro_guest_results'

export const getGuestResults = (): CompletedTestResult[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(GUEST_RESULTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveGuestResult = (
  result: CompletedTestResult,
): CompletedTestResult => {
  const current = getGuestResults()
  const withId: CompletedTestResult = {
    ...result,
    id:
      result.id ||
      `guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  }
  const updated = [withId, ...current].slice(0, 50) // keep latest 50 tests
  try {
    window.localStorage.setItem(GUEST_RESULTS_KEY, JSON.stringify(updated))
  } catch {
    // LocalStorage write safety
  }
  return withId
}

export const deleteGuestResult = (id: string): CompletedTestResult[] => {
  const current = getGuestResults()
  const updated = current.filter((item) => item.id !== id)
  try {
    window.localStorage.setItem(GUEST_RESULTS_KEY, JSON.stringify(updated))
  } catch {
    // Ignore
  }
  return updated
}

export const clearGuestResults = () => {
  try {
    window.localStorage.removeItem(GUEST_RESULTS_KEY)
  } catch {
    // Ignore
  }
}

export const getGuestStats = () => {
  const list = getGuestResults()
  if (list.length === 0) {
    return {
      totalTests: 0,
      bestWpm: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      totalTimeSeconds: 0,
    }
  }

  const bestWpm = list.reduce((best, cur) => Math.max(best, cur.wpm), 0)
  const sumWpm = list.reduce((sum, cur) => sum + cur.wpm, 0)
  const sumAcc = list.reduce((sum, cur) => sum + cur.accuracy, 0)
  const sumTime = list.reduce((sum, cur) => sum + cur.durationSeconds, 0)

  return {
    totalTests: list.length,
    bestWpm,
    averageWpm: Math.round(sumWpm / list.length),
    averageAccuracy: Math.round(sumAcc / list.length),
    totalTimeSeconds: sumTime,
  }
}
