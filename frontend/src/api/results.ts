import { api, unwrapResponse } from './axios'

export type TypingMode = 'timed' | 'passage'

export type SaveResultPayload = {
  textId?: string
  mode: TypingMode
  durationSeconds: number
  correctCharacters: number
  totalKeyPresses: number
}

export type TypingResult = {
  id: string
  user_id?: string
  text_id?: string | null
  mode: 'TIMED' | 'PASSAGE'
  durationSeconds: number | null
  wpm: number
  accuracy: number
  correctCharacters: number
  incorrectCharacters: number
  totalKeyPress?: number
  completedAt: string
  created_at?: string
}

export type ResultListResponse = {
  data: TypingResult[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
}

export const saveResult = async (payload: SaveResultPayload) => {
  const response = await api.post('/results', payload)
  return unwrapResponse<TypingResult>(response)
}

export const getResults = async (params: {
  page?: number
  limit?: number
  mode?: TypingMode
}) => {
  const response = await api.get('/results', { params })
  return unwrapResponse<ResultListResponse>(response)
}

export const deleteResult = async (id: string) => {
  const response = await api.delete(`/results/${id}`)
  return unwrapResponse<{ message?: string }>(response)
}
