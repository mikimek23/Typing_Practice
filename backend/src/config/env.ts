import 'dotenv/config'

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
// const toBoolean = (value: boolean, fallback = false) => {
//   if (value === undefined) return fallback
//   return String(value).toLocaleLowerCase() === 'true'
// }
export const getEnv = () => {
  const nodeEnv = process.env.NODE_ENV || 'development'
  const corsOrigin =
    process.env.CORS_ORIGINS ||
    process.env.CORS_ORIGIN ||
    'http://localhost:5173'
  return {
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv,
    isProduction: nodeEnv === 'production',
    port: toNumber(process.env.PORT, 5001),
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    corsOrigins: corsOrigin
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  }
}
export const validateEnv = () => {
  const env = getEnv()
  const missing = []

  if (!env.databaseUrl) missing.push('DATABASE_URL')
  if (!env.accessTokenSecret) missing.push('ACCESS_TOKEN_SECRET')
  if (!env.refreshTokenSecret) missing.push('REFRESH_TOKEN_SECRET')

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    )
  }
}
