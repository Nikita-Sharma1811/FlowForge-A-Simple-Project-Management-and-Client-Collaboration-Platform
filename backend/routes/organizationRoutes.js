import express from 'express';
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  addMemberToOrganization,
  removeMemberFromOrganization,
} from '../controllers/organizationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('Admin', 'Project Manager'), createOrganization);
router.get('/', protect, getOrganizations);
router.get('/:id', protect, getOrganizationById);
router.post('/:id/members', protect, authorize('Admin'), addMemberToOrganization);
router.delete('/:id/members/:userId', protect, authorize('Admin'), removeMemberFromOrganization);

export default router;
