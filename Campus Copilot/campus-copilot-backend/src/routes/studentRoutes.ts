import { Router } from 'express';
import * as studentController from '../controllers/studentController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// All student endpoints require authenticated session
router.use(requireAuth);
router.use(requireRole('student', 'instructor', 'staff', 'admin'));

router.get('/profile', studentController.getProfile);
router.get('/courses', studentController.getCourses);
router.get('/timetable', studentController.getTimetable);
router.get('/attendance', studentController.getAttendance);
router.get('/results', studentController.getResults);
router.get('/examinations', studentController.getExaminations);
router.get('/assignments', studentController.getAssignments);

export default router;
