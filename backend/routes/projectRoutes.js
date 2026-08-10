import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateCustomStatuses,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('Admin', 'Project Manager'), createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.patch('/:id', protect, authorize('Admin', 'Project Manager'), updateProject);
router.delete('/:id', protect, authorize('Admin'), deleteProject);
router.put('/:id/statuses', protect, authorize('Admin', 'Project Manager'), updateCustomStatuses);

export default router;
