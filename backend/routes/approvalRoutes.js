import express from 'express';
import { createApproval, getApprovals, respondToApproval } from '../controllers/approvalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createApproval);
router.get('/', protect, getApprovals);
router.put('/:id/respond', protect, respondToApproval);

export default router;
