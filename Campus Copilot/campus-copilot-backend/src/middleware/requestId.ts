import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface RequestWithId extends Request {
  id?: string;
  user?: {
    id: string;
    email: string;
    role: 'student' | 'instructor' | 'staff' | 'admin';
    student_id?: string;
    name?: string;
  };
}

export const requestIdMiddleware = (req: RequestWithId, res: Response, next: NextFunction) => {
  const reqId = (req.headers['x-request-id'] as string) || `req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  req.id = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
};
