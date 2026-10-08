import { Router } from 'express';
import authRoutes from './authRoutes';
import studentRoutes from './studentRoutes';
import chatRoutes from './chatRoutes';
import documentRoutes from './documentRoutes';
import publicRoutes from './publicRoutes';
import adminRoutes from './adminRoutes';
import syncRoutes from './syncRoutes';
import healthRoutes from './healthRoutes';

const router = Router();

// Version 1 Canonical API Routes
const v1Router = Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/student', studentRoutes);
v1Router.use('/chat', chatRoutes);
v1Router.use('/documents', documentRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/sync', syncRoutes);
v1Router.use('/health', healthRoutes);

// Public routes mounted directly under /api/v1 (e.g. /api/v1/notices, /api/v1/events, /api/v1/campus, /api/v1/courses)
v1Router.use('/', publicRoutes);

// Mount under canonical /v1 path
router.use('/v1', v1Router);

// Backward compatibility fallback for unversioned /api/* calls
router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/chat', chatRoutes);
router.use('/documents', documentRoutes);
router.use('/admin', adminRoutes);
router.use('/sync', syncRoutes);
router.use('/health', healthRoutes);
router.use('/', publicRoutes);

export default router;
