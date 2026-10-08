import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = (process.env.JWT_SECRET || 'campus_copilot_jwt_super_secret_key_2026') as Secret;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as any;

export interface TokenPayload {
  id: string;
  email: string;
  role: 'student' | 'instructor' | 'staff' | 'admin';
  student_id?: string;
  name?: string;
}

export const signToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
