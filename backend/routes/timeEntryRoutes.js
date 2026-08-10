import express from 'express';
import {
  startTimer,
  stopTimer,
  createManualTimeEntry,
  getTimeEntries,
  getActiveTimer,
} from '../controllers/timeEntryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', protect, startTimer);
router.post('/stop', protect, stopTimer);
router.post('/manual', protect, createManualTimeEntry);
router.get('/', protect, getTimeEntries);
router.get('/active', protect, getActiveTimer);

export default router;
