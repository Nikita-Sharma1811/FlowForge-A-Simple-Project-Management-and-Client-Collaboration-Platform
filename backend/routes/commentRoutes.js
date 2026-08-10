import express from 'express';
import { createComment, getTaskComments, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createComment);
router.get('/task/:taskId', protect, getTaskComments);
router.delete('/:id', protect, deleteComment);

export default router;
