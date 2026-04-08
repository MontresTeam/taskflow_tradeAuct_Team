import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireProjectPermission } from '../../middleware/requireProjectPermission';
import { asyncHandler } from '../../utils/asyncHandler';
import { listMilestones, createMilestone, updateMilestone, deleteMilestone } from './milestones.controller';
import { PROJECT_PERMISSIONS } from '../../shared/constants/permissions';

const router = Router({ mergeParams: true });

router.use(authMiddleware);
router.get('/', asyncHandler(listMilestones));
router.post('/', requireProjectPermission(PROJECT_PERMISSIONS.SETTING.PROJECT_SETTING.UPDATE), asyncHandler(createMilestone));
router.patch('/:milestoneId', requireProjectPermission(PROJECT_PERMISSIONS.SETTING.PROJECT_SETTING.UPDATE), asyncHandler(updateMilestone));
router.delete('/:milestoneId', requireProjectPermission(PROJECT_PERMISSIONS.SETTING.PROJECT_SETTING.UPDATE), asyncHandler(deleteMilestone));

export const milestonesRoutes = router;
