import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireProjectPermission } from '../../middleware/requireProjectPermission';
import { asyncHandler } from '../../utils/asyncHandler';
import * as traceabilityController from './traceability.controller';
import { PROJECT_PERMISSIONS } from '../../shared/constants/permissions';

const router = Router({ mergeParams: true });

router.use(authMiddleware);
router.get('/', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.READ), asyncHandler(traceabilityController.getTraceability as Parameters<typeof asyncHandler>[0]));

export const traceabilityRoutes = router;
