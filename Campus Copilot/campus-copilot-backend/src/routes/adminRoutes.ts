import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Administrative routes are strictly restricted to role: 'admin'
router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/analytics', adminController.getAnalytics);
router.get('/knowledge-gaps', adminController.getKnowledgeGaps);
router.post('/knowledge-gaps/:id/resolve', adminController.resolveKnowledgeGap);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/sync', adminController.triggerSync);
router.post('/sync', adminController.triggerSync);

export default router;
