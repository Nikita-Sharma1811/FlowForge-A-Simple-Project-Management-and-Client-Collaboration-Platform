import express from 'express';
import { createClient, getClients } from '../controllers/clientController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('Admin', 'Project Manager'), createClient);
router.get('/', protect, getClients);

export default router;
