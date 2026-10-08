import { Router } from 'express';
import * as syncController from '../controllers/syncController';
import { optionalAuth, requireAuth } from '../middleware/auth';

const router = Router();

router.get('/status', optionalAuth, syncController.getSyncStatus);
router.post('/trigger', requireAuth, syncController.triggerSync);

export default router;
