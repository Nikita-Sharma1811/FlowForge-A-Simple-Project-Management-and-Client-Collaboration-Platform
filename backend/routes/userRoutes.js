import express from 'express';
import { getUsers, updateUserProfile, updateUserRole, getUserWorkload } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUsers);
router.put('/profile', protect, updateUserProfile);
router.put('/role', protect, authorize('Admin'), updateUserRole);
router.get('/workload', protect, getUserWorkload);

export default router;
