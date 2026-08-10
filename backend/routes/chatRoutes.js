import express from 'express';
import { getProjectMessages, sendMessage, markMessagesAsRead } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/project/:projectId', protect, getProjectMessages);
router.post('/', protect, sendMessage);
router.patch('/project/:projectId/read', protect, markMessagesAsRead);

export default router;
