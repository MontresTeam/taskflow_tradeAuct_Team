import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireProjectPermission } from '../../middleware/requireProjectPermission';
import * as testCasesController from './testCases.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { PROJECT_PERMISSIONS } from '../../shared/constants/permissions';

const router = Router({ mergeParams: true });

router.use(authMiddleware);
router.get('/', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.READ), asyncHandler(testCasesController.listTestCases as Parameters<typeof asyncHandler>[0]));
router.post('/', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.UPDATE), asyncHandler(testCasesController.createTestCase as Parameters<typeof asyncHandler>[0]));
router.patch('/:testCaseId', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.UPDATE), asyncHandler(testCasesController.updateTestCase as Parameters<typeof asyncHandler>[0]));
router.delete('/:testCaseId', requireProjectPermission(PROJECT_PERMISSIONS.TEST_MANAGEMENT.SUITE.UPDATE), asyncHandler(testCasesController.deleteTestCase as Parameters<typeof asyncHandler>[0]));

export const testCasesRoutes = router;
