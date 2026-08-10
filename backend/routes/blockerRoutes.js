import express from 'express';
import { createBlocker, getBlockers, updateBlocker, deleteBlocker } from '../controllers/blockerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBlocker);
router.get('/', protect, getBlockers);
router.patch('/:id', protect, updateBlocker);
router.delete('/:id', protect, deleteBlocker);

export default router;
