import express from 'express';
import {
  getChecklist,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
} from '../controllers/checklistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/task/:taskId', protect, getChecklist);
router.post('/task/:taskId/item', protect, addChecklistItem);
router.put('/task/:taskId/toggle', protect, toggleChecklistItem);
router.delete('/task/:taskId/item/:itemId', protect, deleteChecklistItem);

export default router;
