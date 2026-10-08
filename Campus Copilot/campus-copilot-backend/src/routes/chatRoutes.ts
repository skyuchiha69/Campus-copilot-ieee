import { Router } from 'express';
import * as chatController from '../controllers/chatController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Chat and Conversation APIs require authenticated session
router.use(requireAuth);

router.post('/', chatController.handleChat);
router.post('/completions', chatController.handleChat);
router.get('/conversations', chatController.listConversations);
router.post('/conversations', chatController.createConversation);
router.get('/conversations/:id', chatController.getConversation);
router.delete('/conversations/:id', chatController.deleteConversation);

export default router;
