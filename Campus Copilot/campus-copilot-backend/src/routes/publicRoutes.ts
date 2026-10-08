import { Router } from 'express';
import * as publicController from '../controllers/publicController';

const router = Router();

// Public routes accessible to all authenticated or guest university visitors
router.get('/notices', publicController.getNotices);
router.get('/events', publicController.getEvents);
router.get('/campus', publicController.getCampusLocations);
router.get('/courses', publicController.getPublicCourses);

export default router;
