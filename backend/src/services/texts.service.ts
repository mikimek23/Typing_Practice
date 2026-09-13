import prisma from '../prisma/client.js'
import {
  Difficulty as DifficultyEnum,
  Source as SourceEnum,
} from '../generated/prisma/enums.js'
import { AppError } from '../utils/AppError.js'
import { AddTextInput, UpdateTextInput } from '../schemas/text.schema.js'
import { Prisma } from '../generated/prisma/browser.js'

const difficultyMap = {
  easy: DifficultyEnum.EASY,
  medium: DifficultyEnum.MEDIUM,
  hard: DifficultyEnum.HARD,
} as const

const normalizeDifficulty = (difficulty: unknown) => {
  if (difficulty === undefined || difficulty === null || difficulty === '') {
    return undefined
  }

  if (Array.isArray(difficulty)) {
    throw new AppError('Invalid difficulty', 400)
  }

  if (typeof difficulty !== 'string') {
    throw new AppError('Invalid difficulty', 400)
  }

  const normalized = difficulty.trim().toLowerCase()

  if (!(normalized in difficultyMap)) {
    throw new AppError('Invalid difficulty', 400)
  }

  return difficultyMap[normalized as keyof typeof difficultyMap]
}

export const getDefaultTextsService = async (difficulty: unknown) => {
  const normalizedDifficulty = normalizeDifficulty(difficulty)
  const texts = await prisma.text.findMany({
    where: {
      source_type: SourceEnum.DEFAULT,
      ...(normalizedDifficulty ? { difficulty: normalizedDifficulty } : {}),
    },
    select: {
      id: true,
      title: true,
      content: true,
      difficulty: true,
      source_type: true,
      wordCount: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: {
      created_at: 'asc',
    },
  })
  return { count: texts.length, texts }
}

export const addDefaultTextService = async (data: AddTextInput) => {
  const title = data.title
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
  const text = await prisma.text.findFirst({
    where: {
      title,
    },
  })
  if (text) {
    throw new AppError('title already exist', 409)
  }
  const content = data.content.trim()

  const wordCount = content.split(/\s+/).length
  const difficulty = normalizeDifficulty(data.difficulty)
  if (!difficulty) {
    throw new AppError('Difficulty is required', 400)
  }
  const newText = await prisma.text.create({
    data: {
      title,
      content,
      difficulty,
      source_type: 'DEFAULT',
      wordCount,
      user_id: null,
      is_public: true,
    },
    select: {
      id: true,
      title: true,
      content: true,
      difficulty: true,
      source_type: true,
      wordCount: true,
      user_id: true,
      created_at: true,
      updated_at: true,
    },
  })
  return newText
}

export const addTextService = async (data: AddTextInput, id: string) => {
  const title = data.title.trim()
  const content = data.content.trim()
  const wordCount = content.split(/\s+/).length
  const difficulty = normalizeDifficulty(data.difficulty)
  if (!difficulty) {
    throw new AppError('Difficulty is required', 400)
  }
  const newText = await prisma.text.create({
    data: {
      title,
      content,
      difficulty,
      source_type: 'USER',
      wordCount,
      user_id: id,
      is_public: false,
    },
    select: {
      id: true,
      title: true,
      content: true,
      difficulty: true,
      source_type: true,
      wordCount: true,
      user_id: true,
      created_at: true,
      updated_at: true,
    },
  })
  return newText
}
export const getMyTextsService = async (difficulty: unknown, id: string) => {
  const normalizedDifficulty = normalizeDifficulty(difficulty)

  const texts = await prisma.text.findMany({
    where: {
      user_id: id,
      source_type: SourceEnum.USER,
      ...(normalizedDifficulty ? { difficulty: normalizedDifficulty } : {}),
    },
    select: {
      id: true,
      title: true,
      content: true,
      difficulty: true,
      source_type: true,
      wordCount: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: {
      created_at: 'asc',
    },
  })
  if (texts.length === 0) {
    throw new AppError('Not Found', 404)
  }
  return { count: texts.length, texts }
}
export const updateMyTextService = async (
  data: UpdateTextInput,
  text_id: string,
  user_id: string,
) => {
  const existText = await prisma.text.findFirst({
    where: {
      id: text_id,
      user_id,
    },
  })
  if (!existText) {
    throw new AppError('Not Found', 404)
  }
  type TextUpdateData = Pick<
    Prisma.TextUpdateInput,
    'title' | 'content' | 'difficulty'
  >
  const updateData: Partial<TextUpdateData> = {}

  if (data.title !== undefined) {
    updateData.title = data.title.trim()
  }

  if (data.content !== undefined) {
    updateData.content = data.content.trim()
  }

  if (data.difficulty !== undefined) {
    const diff = normalizeDifficulty(data.difficulty)
    if (!diff) {
      throw new AppError('Invalid difficulty', 400)
    }
    updateData.difficulty = diff
  }
  if (Object.keys(updateData).length === 0) {
    throw new AppError('No fields to update', 400)
  }
  await prisma.text.update({
    where: {
      id: text_id,
    },
    data: updateData,
  })

  return true
}
export const deleteMyTextService = async (text_id: string, user_id: string) => {
  const text = await prisma.text.findFirst({
    where: {
      id: text_id,
      user_id,
    },
  })
  if (!text) {
    throw new AppError('Not Found', 404)
  }
  await prisma.text.delete({
    where: {
      id: text_id,
    },
  })
  return true
}
