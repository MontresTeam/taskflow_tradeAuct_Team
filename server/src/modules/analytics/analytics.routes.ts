import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/requirePermission';
import { asyncHandler } from '../../utils/asyncHandler';
import * as analyticsController from './analytics.controller';
import { TASK_FLOW_PERMISSIONS } from '../../shared/constants/permissions';

const router = Router();

router.use(authMiddleware);
router.use(requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.ANALYTICS.VIEW));
router.get('/usage', asyncHandler(analyticsController.getUsage as Parameters<typeof asyncHandler>[0]));

export const analyticsRoutes = router;
