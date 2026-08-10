import express from 'express';
import { createDecision, getDecisions } from '../controllers/decisionLogController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createDecision);
router.get('/', protect, getDecisions);

export default router;
