import express from 'express'
import { errorHandler } from './middlewares/error.middleware.js'
import userRouter from './routes/auth.routes.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import textsRouter from './routes/texts.routes.js'
import resultRouter from './routes/results.routes.js'
import cors from 'cors'
import { getEnv } from './config/env.js'
const enva = getEnv()
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

const allowOrigins = enva.corsOrigins
app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
)

app.get('/api/health', (req, res) => {
  res.json({
    message: 'OK',
    data: { status: 'healthy' },
  })
})
app.use('/api/auth', userRouter)
app.use('/api/texts', textsRouter)
app.use('/api/results', resultRouter)
app.use(errorHandler)
export default app
