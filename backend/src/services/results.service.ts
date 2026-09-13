import prisma from '../prisma/client.js'
import { ResultInput, resultQueryInput } from '../schemas/result.schema.js'
import { Mode as modeEnum } from '../generated/prisma/enums.js'
import { AppError } from '../utils/AppError.js'

const modeMap = {
  timed: modeEnum.TIMED,
  passage: modeEnum.PASSAGE,
}
const normalizeMode = (mode: unknown) => {
  if (mode === undefined || mode === null || mode === '') {
    return undefined
  }
  if (Array.isArray(mode)) {
    throw new AppError('Invalid mode', 400)
  }
  if (typeof mode !== 'string') {
    throw new AppError('invalid mode', 400)
  }
  const normalized = mode.trim().toLocaleLowerCase()
  if (!(normalized in modeMap)) {
    throw new AppError('Invalid mode', 400)
  }
  return modeMap[normalized as keyof typeof modeMap]
}
export const saveResultService = async (data: ResultInput, userId: string) => {
  const normalizedMode = normalizeMode(data.mode)
  if (!normalizedMode) {
    throw new AppError('Mode is required', 400)
  }
  const incorrectCharacters = data.totalKeyPresses - data.correctCharacters
  const wpm = Math.floor(
    data.correctCharacters / 5 / (data.durationSeconds / 60),
  )
  const accuracy = Math.floor(
    (data.correctCharacters / data.totalKeyPresses) * 100,
  )
  const newResult = await prisma.typingResults.create({
    data: {
      user_id: userId,
      text_id: data.textId,
      mode: normalizedMode,
      durationSeconds: data.durationSeconds,
      wpm: wpm,
      accuracy: accuracy,
      correctCharacters: data.correctCharacters,
      incorrectCharacters: incorrectCharacters,
      totalKeyPress: data.totalKeyPresses,
    },
  })
  return newResult
}
export const getResultService = async (
  userId: string,
  query: resultQueryInput,
) => {
  const normaizedMode = normalizeMode(query.mode)
  const page = Math.max(parseInt(query.page || '1', 10), 1)
  const limit = Math.min(Math.max(parseInt(query.limit || '10', 10), 1), 50)
  const skip = (page - 1) * limit
  const [result, total] = await Promise.all([
    prisma.typingResults.findMany({
      where: {
        user_id: userId,
        ...(normaizedMode ? { mode: normaizedMode } : {}),
      },
      orderBy: {
        completedAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.typingResults.count({
      where: {
        user_id: userId,
        ...(normaizedMode ? { mode: normaizedMode } : {}),
      },
    }),
  ])
  if (result.length === 0) {
    throw new AppError('Not Found', 404)
  }
  const totalPage = Math.ceil(total / limit)
  return {
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPage,
    },
  }
}
export const getResultByIdService = async (
  resultId: string,
  userId: string,
) => {
  const result = await prisma.typingResults.findFirst({
    where: {
      id: resultId,
      user_id: userId,
    },
    select: {
      id: true,
      wpm: true,
      accuracy: true,
      text: {
        select: {
          id: true,
          title: true,
          content: true,
        },
      },
    },
  })
  if (!result) {
    throw new AppError('Result not found', 404)
  }
  return result
}
export const deleteResultService = async (resultId: string, userId: string) => {
  const result = await prisma.typingResults.findFirst({
    where: {
      id: resultId,
      user_id: userId,
    },
  })
  if (!result) {
    throw new AppError('Result not found', 404)
  }
  await prisma.typingResults.delete({
    where: {
      id: resultId,
    },
  })
  return true
}
