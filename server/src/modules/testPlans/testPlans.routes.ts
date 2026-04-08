import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireProjectPermission } from '../../middleware/requireProjectPermission';
import { asyncHandler } from '../../utils/asyncHandler';
import * as testPlansController from './testPlans.controller';
import { PROJECT_PERMISSIONS } from '../../shared/constants/permissions';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.READ), asyncHandler(testPlansController.listTestPlans as Parameters<typeof asyncHandler>[0]));
router.post('/', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.UPDATE), asyncHandler(testPlansController.createTestPlan as Parameters<typeof asyncHandler>[0]));
router.patch('/:planId', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.UPDATE), asyncHandler(testPlansController.updateTestPlan as Parameters<typeof asyncHandler>[0]));
router.delete('/:planId', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.UPDATE), asyncHandler(testPlansController.deleteTestPlan as Parameters<typeof asyncHandler>[0]));
router.get('/:planId/cycles', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.READ), asyncHandler(testPlansController.listTestCycles as Parameters<typeof asyncHandler>[0]));
router.post('/:planId/cycles', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.UPDATE), asyncHandler(testPlansController.createTestCycle as Parameters<typeof asyncHandler>[0]));
router.patch('/:planId/cycles/:cycleId', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.UPDATE), asyncHandler(testPlansController.updateTestCycle as Parameters<typeof asyncHandler>[0]));
router.delete('/:planId/cycles/:cycleId', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.UPDATE), asyncHandler(testPlansController.deleteTestCycle as Parameters<typeof asyncHandler>[0]));
router.get('/:planId/cycles/:cycleId/runs', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.READ), asyncHandler(testPlansController.getCycleRuns as Parameters<typeof asyncHandler>[0]));
router.patch('/:planId/cycles/:cycleId/runs/:testCaseId', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.UPDATE), asyncHandler(testPlansController.updateRunStatus as Parameters<typeof asyncHandler>[0]));

export const testPlansRoutes = router;
