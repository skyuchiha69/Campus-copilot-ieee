import { Response, NextFunction } from 'express';
import { RequestWithId } from './requestId';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const errorHandler = (err: any, req: RequestWithId, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 403 ? 'FORBIDDEN' : statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR');
  const message = err.message || 'An unexpected server error occurred';
  const requestId = req.id || `req_${Date.now()}`;

  // Log error safely without leaking sensitive information
  console.error(`[Error] [${requestId}] [${code}] ${statusCode}: ${message}`);

  return res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code,
      message,
      ...(err.details ? { details: err.details } : {})
    },
    requestId
  });
};
