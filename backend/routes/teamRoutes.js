import express from 'express';
import { createTeam, getTeams } from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('Admin', 'Project Manager'), createTeam);
router.get('/', protect, getTeams);

export default router;
