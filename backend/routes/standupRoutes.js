import express from 'express';
import { createStandup, getStandups } from '../controllers/standupController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createStandup);
router.get('/', protect, getStandups);

export default router;
