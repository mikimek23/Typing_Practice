import { Request, Response, NextFunction } from 'express'

import { AppError } from '../utils/AppError.js'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
  }
  console.log(err.message)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err,
  })
}
