import { Response, NextFunction } from 'express';
import { RequestWithId } from './requestId';
import { verifyToken, TokenPayload } from '../services/auth/tokenService';
import { AppError } from './errorHandler';

export const requireAuth = (req: RequestWithId, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Missing or malformed authorization header.', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded: TokenPayload = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Session expired. Please sign in again.', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('Invalid or corrupted authentication token.', 401, 'INVALID_TOKEN'));
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: RequestWithId, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Forbidden: Role '${req.user.role}' is not authorized to access this resource. Allowed roles: [${allowedRoles.join(', ')}].`,
          403,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
};

export const optionalAuth = (req: RequestWithId, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded: TokenPayload = verifyToken(token);
      req.user = decoded;
    } catch {
      // Ignore if optional
    }
  }
  next();
};
