import express from 'express';
import { upload, uploadFile, getAttachments } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadFile);
router.get('/', protect, getAttachments);

export default router;
