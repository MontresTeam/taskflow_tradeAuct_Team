import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/requirePermission';
import { asyncHandler } from '../../utils/asyncHandler';
import * as reportsController from './reports.controller';
import { TASK_FLOW_PERMISSIONS } from '../../shared/constants/permissions';

const router = Router();

router.use(authMiddleware);

router.get('/', requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.REPORT.READ), asyncHandler(reportsController.listReports as Parameters<typeof asyncHandler>[0]));
router.post('/', requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.REPORT.CREATE), asyncHandler(reportsController.createReport as Parameters<typeof asyncHandler>[0]));
router.patch('/:id', requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.REPORT.CREATE), asyncHandler(reportsController.updateReport as Parameters<typeof asyncHandler>[0]));
router.delete('/:id', requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.REPORT.CREATE), asyncHandler(reportsController.deleteReport as Parameters<typeof asyncHandler>[0]));
router.post('/:id/execute', requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.REPORT.READ), asyncHandler(reportsController.executeReport as Parameters<typeof asyncHandler>[0]));

export const reportsRoutes = router;
