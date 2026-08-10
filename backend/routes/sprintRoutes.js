import express from 'express';
import { createSprint, getSprints, updateSprint, deleteSprint } from '../controllers/sprintController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('Admin', 'Project Manager'), createSprint);
router.get('/', protect, getSprints);
router.patch('/:id', protect, authorize('Admin', 'Project Manager'), updateSprint);
router.delete('/:id', protect, authorize('Admin', 'Project Manager'), deleteSprint);

export default router;
