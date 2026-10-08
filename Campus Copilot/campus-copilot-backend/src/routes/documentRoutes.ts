import { Router } from 'express';
import multer from 'multer';
import * as documentController from '../controllers/documentController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Configure memory storage for in-memory document parsing and vector chunking
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB limit
  }
});

router.use(requireAuth);

router.post('/', upload.single('file'), documentController.uploadDocument);
router.get('/', documentController.listDocuments);
router.get('/:id', documentController.getDocumentById);
router.delete('/:id', documentController.deleteDocument);

export default router;
