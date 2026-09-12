import type { TypingMode } from '../api/results'

export type ResultSaveStatus = 'guest' | 'saving' | 'saved' | 'error'

export type TimelinePoint = {
  second: number
  wpm: number
  rawWpm: number
  errors: number
}

export type CompletedTestResult = {
  id?: string
  textId?: string
  textTitle: string
  mode: TypingMode
  durationSeconds: number
  wpm: number
  rawWpm?: number
  accuracy: number
  consistency?: number
  correctCharacters: number
  incorrectCharacters: number
  totalKeyPresses: number
  progress: number
  wordCount: number
  completedAt: string
  saveStatus: ResultSaveStatus
  saveError?: string
  timeline?: TimelinePoint[]
}
