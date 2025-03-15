import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction // Must include even if unused
) {
  console.error(err);

  // Critical check to prevent sending multiple responses
  if (res.headersSent) {
    return next(err);
  }

  // Proper error response
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message
  });
}