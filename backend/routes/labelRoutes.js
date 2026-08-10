import express from 'express';
import { createLabel, getLabels, deleteLabel } from '../controllers/labelController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createLabel);
router.get('/', protect, getLabels);
router.delete('/:id', protect, deleteLabel);

export default router;
