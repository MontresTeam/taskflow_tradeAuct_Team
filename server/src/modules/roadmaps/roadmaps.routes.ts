import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireProjectPermission } from '../../middleware/requireProjectPermission';
import * as roadmapsController from './roadmaps.controller';
import { PROJECT_PERMISSIONS } from '../../shared/constants/permissions';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', requireProjectPermission(PROJECT_PERMISSIONS.ROADMAP.ROADMAP.READ), roadmapsController.listRoadmaps);
router.post('/', requireProjectPermission(PROJECT_PERMISSIONS.ROADMAP.ROADMAP.UPDATE), roadmapsController.createRoadmap);
router.get('/:roadmapId/milestones', requireProjectPermission(PROJECT_PERMISSIONS.ROADMAP.ROADMAP.READ), roadmapsController.getRoadmapMilestones);
router.patch('/:roadmapId', requireProjectPermission(PROJECT_PERMISSIONS.ROADMAP.ROADMAP.UPDATE), roadmapsController.updateRoadmap);
router.delete('/:roadmapId', requireProjectPermission(PROJECT_PERMISSIONS.ROADMAP.ROADMAP.UPDATE), roadmapsController.deleteRoadmap);

export const roadmapsRoutes = router;
