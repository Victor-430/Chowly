import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../utils/errors.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error instanceof AppError ? error.statusCode : 500;
  if (status === 500) console.error('Unexpected API error', error);
  res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
};

export const notFoundHandler: RequestHandler = (req, _res, next) =>
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} was not found`));

