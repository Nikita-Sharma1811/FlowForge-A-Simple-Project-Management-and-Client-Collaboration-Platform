import express from 'express';
import { createRisk, getRisks, updateRisk, deleteRisk } from '../controllers/riskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createRisk);
router.get('/', protect, getRisks);
router.patch('/:id', protect, updateRisk);
router.delete('/:id', protect, deleteRisk);

export default router;
