import { Response, NextFunction } from 'express';
import { RequestWithId } from '../middleware/requestId';
import User from '../models/User';
import StudentProfile from '../models/StudentProfile';
import { signToken } from '../services/auth/tokenService';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';

export const register = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const { email, password, role = 'student', name, student_id, department, program } = req.body;

    if (!email || !password || !name) {
      return next(new AppError('Email, password, and name are required.', 400, 'VALIDATION_ERROR'));
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new AppError('A user with this email address already exists.', 409, 'USER_EXISTS'));
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role,
      name,
      student_id: student_id || `CS${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      department: department || 'Computer Science & Engineering',
      program: program || 'B.Tech CSE'
    });

    if (role === 'student') {
      await StudentProfile.create({
        user_id: user._id.toString(),
        student_id: user.student_id,
        name: user.name,
        department_id: 'DEPT_CSE',
        department_name: user.department || 'Computer Science & Engineering',
        semester: 'Semester 6',
        division: 'A',
        program: user.program || 'B.Tech Computer Science & Engineering',
        status: 'active'
      });
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      student_id: user.student_id,
      name: user.name
    });

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
          student_id: user.student_id,
          department: user.department,
          program: user.program
        }
      },
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required.', 400, 'VALIDATION_ERROR'));
    }

    // Allow login by email or student_id
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { student_id: email.trim() }
      ]
    });

    if (!user) {
      return next(new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS'));
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      student_id: user.student_id,
      name: user.name
    });

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
          student_id: user.student_id,
          department: user.department,
          program: user.program
        }
      },
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: RequestWithId, res: Response) => {
  return res.json({
    success: true,
    data: { message: 'Successfully signed out.' },
    error: null,
    requestId: req.id
  });
};

export const getMe = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return next(new AppError('User not found', 404, 'USER_NOT_FOUND'));
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user_id: user._id.toString() });
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
          student_id: user.student_id,
          department: user.department,
          program: user.program
        },
        profile
      },
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};
